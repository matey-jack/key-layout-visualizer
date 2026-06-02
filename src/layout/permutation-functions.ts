import type {LayoutMapping, LayoutMappingEntry} from "../base-model.ts";
import {copyKeymap} from "./layout-functions.ts";

// --- Cyclic permutation of frame mappings ---
//
// A variant frame mapping is usually just a handful of keys moved around.
// Instead of copying the whole literal and editing cells by index, express the change as
// cyclic permutations of keys – the way one naturally thinks about "this key moves there".
//
// A cycle is a string of tokens. A token is either:
//   - a single-character key label, e.g.   a  /  -  '  +  ⏎  ⌦  ⇧
//   - a placeholder reference in [flexRow:col] form, e.g. [1:10] or [4:0], naming the FlexMapping
//     cell a letter is pulled from. The first index is the absolute FlexMapping row, exactly like
//     the [row,col] tuples in a frame mapping. A run of cells on the same row may be written
//     [flexRow:col1,col2,...] as shorthand for [flexRow:col1][flexRow:col2]..., listed in cycle order.
//   - a duplicated label prefixed with '<' or '>', e.g. <⇧ or >⇧, picking the copy with the smallest
//     ('<', left) or largest ('>', right) column index. Any copies in between are not addressable, and
//     a tie for that extreme throws. Use it to point at a key a plain label can't pick out alone.
//
// A single-character label token may stand in for a two-character label by its first character:
// if the base has no exact single-char match but exactly one cell holds a 2-char label starting with
// that character (e.g. '`' -> '`~'), the token resolves to the full label. An exact single-char match
// always wins, and a tie between two such 2-char labels is left unresolved (so findToken throws).
//
// Semantics of "abc": a takes the place of b, b takes the place of c, c takes the place of a.
// A key entering the mapping (new) may appear only as the FIRST token; a key leaving only as the
// LAST. With both present the cycle is an open chain: the first key is placed, the last is dropped,
// and there is no wrap-around (so the column count stays the same).

type Coord = [number, number]; // [flexRow, col]
type CycleToken = { label: string } | { coord: Coord } | { edge: "<" | ">"; key: string };

// Splits a cycle spec such as "a[1:10]<⇧-" into its ordered tokens.
// '[r:c]' is a FlexMapping letter reference ('[r:c1,c2,...]' expands to one reference per column),
// '<X'/'>X' picks the left-/right-most copy of a duplicated label X, any other character is a literal key label.
function parseCycle(spec: string): CycleToken[] {
    const tokens: CycleToken[] = [];
    for (let i = 0; i < spec.length;) {
        const ch = spec[i];
        if (ch === "[") {
            const end = spec.indexOf("]", i);
            if (end < 0) throw new Error(`Unclosed '[' in cycle "${spec}".`);
            const inner = spec.slice(i + 1, end);
            const [rowPart, colPart, ...rest] = inner.split(":");
            if (colPart === undefined || rest.length > 0) {
                throw new Error(`Bad coordinate token "[${inner}]" in cycle "${spec}"; expected [row:col] or [row:col,col,...].`);
            }
            const row = Number(rowPart.trim());
            const cols = colPart.split(",").map((s) => s.trim());
            if (Number.isNaN(row) || cols.some((s) => s === "" || Number.isNaN(Number(s)))) {
                throw new Error(`Bad coordinate token "[${inner}]" in cycle "${spec}".`);
            }
            for (const c of cols) tokens.push({coord: [row, Number(c)]});
            i = end + 1;
        } else if (ch === "<" || ch === ">") {
            const key = spec[i + 1];
            if (key === undefined) throw new Error(`Dangling '${ch}' at end of cycle "${spec}".`);
            tokens.push({edge: ch, key});
            i += 2;
        } else {
            tokens.push({label: ch});
            i += 1;
        }
    }
    return tokens;
}

// Printable form of a token, used in error messages.
const tokenLabel = (t: CycleToken) =>
    "label" in t ? `'${t.label}'`
        : "coord" in t ? `[${t.coord[0]}:${t.coord[1]}]`
            : `${t.edge}'${t.key}'`;

// The FlexMapping cell a grid cell pulls its letter from, or null for a literal label / gap.
function cellFlexCoord(value: LayoutMappingEntry, gridRow: number): Coord | null {
    if (typeof value === "number") return [gridRow, value];
    if (Array.isArray(value)) return [value[0], value[1]];
    return null;
}

// Encodes a FlexMapping coordinate as the value stored on grid row destRow: a bare column number
// when it lands on its own row, otherwise an absolute [flexRow, col] tuple.
const encodeFlex = ([fr, col]: Coord, destRow: number): LayoutMappingEntry =>
    fr === destRow ? col : [fr, col];

// Every [row, col] whose cell value satisfies the predicate, scanned in row-major order.
function cellsMatching(
    mapping: LayoutMapping,
    pred: (value: LayoutMappingEntry, r: number, c: number) => boolean
): Coord[] {
    const matches: Coord[] = [];
    mapping.forEach((row, r) =>
        row.forEach((value, c) => {
            if (pred(value, r, c)) matches.push([r, c]);
        })
    );
    return matches;
}

// Picks the left-most ('<') or right-most ('>') cell holding key, comparing column index only.
// Throws if the key is absent, or if two copies tie for that extreme column (which shouldn't happen).
function findEdge(mapping: LayoutMapping, edge: "<" | ">", key: string): Coord {
    const matches = cellsMatching(mapping, (value) => value === key);
    if (matches.length === 0) throw new Error(`Cycle token ${edge}'${key}' matches no cell.`);
    const targetCol = edge === "<"
        ? Math.min(...matches.map((m) => m[1]))
        : Math.max(...matches.map((m) => m[1]));
    const selected = matches.filter((m) => m[1] === targetCol);
    if (selected.length > 1) throw new Error(`Cycle token ${edge}'${key}' is ambiguous: ${selected.length} copies share column ${targetCol}.`);
    return selected[0];
}

// Finds the grid cell a token currently occupies, or null when its key isn't present (= entering).
// Throws if a label/letter token is ambiguous, or an edge token's extreme column is tied.
function findToken(mapping: LayoutMapping, token: CycleToken): Coord | null {
    if ("edge" in token) return findEdge(mapping, token.edge, token.key);
    const matches = "label" in token
        ? cellsMatching(mapping, (value) => value === token.label)
        : cellsMatching(mapping, (value, r) => {
            const fc = cellFlexCoord(value, r);
            return fc !== null && fc[0] === token.coord[0] && fc[1] === token.coord[1];
        });
    if (matches.length > 1) throw new Error(`Cycle token ${tokenLabel(token)} matches ${matches.length} cells (must be unique).`);
    return matches[0] ?? null;
}

const cycleAbbreviations: Record<string, string | string[]> = {
    "^": "Ctrl",
    "A": ["Alt", "AltGr"],
    "C": "Cmd",
    "S": ["Shift", "⇧"],
    "F": "Fn",
    "P": "CAPS",
    "M": "Menu",
};

function expandShortcut(shortcut: string): string[] {
    const val = cycleAbbreviations[shortcut];
    if (val === undefined) return [shortcut];
    return Array.isArray(val) ? val : [val];
}

// Resolves a shortcut for a label token against the base mapping.
function resolveAbbreviation(base: LayoutMapping, shortcut: string): string {
    const candidates = expandShortcut(shortcut);
    if (candidates.length === 1) return candidates[0];

    const matches = cellsMatching(base, (value) => typeof value === "string" && candidates.includes(value));
    if (matches.length === 0) return candidates[0];

    const presentCandidates = new Set(matches.map(([r, c]) => base[r][c] as string));
    if (presentCandidates.size === 1) {
        return [...presentCandidates][0];
    }
    return shortcut;
}

// Resolves a shortcut for an edge token against the base mapping.
function resolveAbbreviationForEdge(base: LayoutMapping, edge: "<" | ">", shortcut: string): string {
    const candidates = expandShortcut(shortcut);
    if (candidates.length === 1) return candidates[0];

    const matches = cellsMatching(base, (value) => typeof value === "string" && candidates.includes(value));
    if (matches.length === 0) return candidates[0];

    const targetCol = edge === "<"
        ? Math.min(...matches.map((m) => m[1]))
        : Math.max(...matches.map((m) => m[1]));
    const selected = matches.filter((m) => m[1] === targetCol);
    if (selected.length === 0) return candidates[0];

    const [r, c] = selected[0];
    return base[r][c] as string;
}

// Lets a single-character label stand in for a two-character one by its first character: with no exact
// single-char match in the base but exactly one 2-char label starting with that character, the token is
// rewritten to that full label. An exact match wins; an ambiguous first character is left as-is.
function resolveLabel(base: LayoutMapping, label: string): string {
    if (cellsMatching(base, (value) => value === label).length > 0) return label;
    const wider = cellsMatching(base, (value) => typeof value === "string" && value.length === 2 && value[0] === label);
    if (wider.length !== 1) return label;
    const [r, c] = wider[0];
    return base[r][c] as string;
}

// Resolves single-char label tokens (and edge keys) against the base mapping (see resolveLabel).
function resolveToken(base: LayoutMapping, token: CycleToken): CycleToken {
    if ("label" in token) {
        const expanded = resolveAbbreviation(base, token.label);
        return {label: resolveLabel(base, expanded)};
    }
    if ("edge" in token) {
        const expanded = resolveAbbreviationForEdge(base, token.edge, token.key);
        return {edge: token.edge, key: resolveLabel(base, expanded)};
    }
    return token;
}

// The value a token contributes when it lands on grid row destRow (a placeholder becomes a bare
// column number on its own row, or keeps its absolute [flexRow, col] otherwise).
function tokenValue(token: CycleToken, destRow: number): LayoutMappingEntry {
    if ("label" in token) return token.label;
    if ("edge" in token) return token.key;
    return encodeFlex(token.coord, destRow);
}

// Returns a copy of a frame mapping with the given cyclic permutations applied (see the note above
// for the cycle syntax). The base mapping is not modified.
export function permute(base: LayoutMapping, ...cycles: string[]): LayoutMapping {
    const result = copyKeymap(base);
    for (const spec of cycles) {
        const tokens = parseCycle(spec).map((t) => resolveToken(base, t));
        const positions = tokens.map((t) => findToken(base, t));
        positions.forEach((pos, i) => {
            if (pos === null && i !== 0) {
                throw new Error(`In cycle "${spec}", entering key ${tokenLabel(tokens[i])} must be the first token.`);
            }
        });
        const n = tokens.length;
        for (let i = 0; i < n; i++) {
            // each token moves into the place of the next; the last wraps into the first...
            const dest = positions[(i + 1) % n];
            // ...unless the first token is entering (no place of its own): then the last token leaves.
            if (dest === null) continue;
            result[dest[0]][dest[1]] = tokenValue(tokens[i], dest[0]);
        }
    }
    return result;
}

// Canonical key used to tell which keys/letters entered or left a mapping.
function cellKey(value: LayoutMappingEntry, gridRow: number): string | null {
    if (value === null || value === "") return null;
    if (typeof value === "string") return `L:${value}`;
    const [fr, c] = cellFlexCoord(value, gridRow)!;
    return `F:${fr},${c}`;
}

// Compares two mappings and reports which keys/letters appear only in the result (entered)
// and which appear only in the base (exited).
function frameDiff(base: LayoutMapping, result: LayoutMapping): { entered: Set<string>; exited: Set<string> } {
    const count = (mapping: LayoutMapping) => {
        const m = new Map<string, number>();
        mapping.forEach((row, r) =>
            row.forEach((v) => {
                const key = cellKey(v, r);
                if (key) m.set(key, (m.get(key) ?? 0) + 1);
            })
        );
        return m;
    };
    const b = count(base);
    const a = count(result);
    const entered = new Set<string>();
    const exited = new Set<string>();
    for (const [k, c] of a) if (c > (b.get(k) ?? 0)) entered.add(k);
    for (const [k, c] of b) if (c > (a.get(k) ?? 0)) exited.add(k);
    return {entered, exited};
}

// Readers for a frameDiff set: the frame-key labels, the letter placeholders, set equality, and a printable summary.
const labelsIn = (s: Set<string>) => [...s].filter((k) => k.startsWith("L:")).sort();
const lettersIn = (s: Set<string>) => [...s].filter((k) => k.startsWith("F:"));
const sameSet = (a: string[], b: string[]) => a.length === b.length && a.every((v, i) => v === b[i]);
const enterExit = (entered: Set<string>, exited: Set<string>) =>
    `entered=[${[...entered].join(", ")}], exited=[${[...exited].join(", ")}]`;

// The hallmark of a thumb keymap: one letter lands on the thumb (FlexMapping row 4),
// and one grid letter leaves to make room. The thirty-key thumb frame additionally adds the
// explicit '/' key and drops '-'. These wrappers apply the given cycles and then assert that
// invariant, so a mistyped cycle throws (the layout-loading tests catch it).

// Derives a Thumb30 frame from an Ansi30 frame via the given cycles, asserting that exactly
// '/' + the thumb letter entered and '-' + one letter exited.
export function patchThumb30(base: LayoutMapping, ...cycles: string[]): LayoutMapping {
    const result = permute(base, ...cycles);
    const {entered, exited} = frameDiff(base, result);
    const ok =
        entered.has("F:4,0") &&
        exited.has("F:3,9") &&
        sameSet(labelsIn(entered), ["L:/"]) &&
        sameSet(labelsIn(exited), ["L:-"]) &&
        lettersIn(entered).length === 1 &&
        lettersIn(exited).length === 1;
    if (!ok) throw new Error(`patchThumb30: expected '/' + thumb letter to enter and '-' + one letter to exit; ${enterExit(entered, exited)}.`);
    return result;
}

// Derives a Thumb32 frame from an Ansi32 frame via the given cycles, asserting that exactly the
// thumb letter entered and one letter exited, with no frame-key labels added or removed.
export function patchThumb32(base: LayoutMapping, ...cycles: string[]): LayoutMapping {
    const result = permute(base, ...cycles);
    const {entered, exited} = frameDiff(base, result);
    const ok =
        entered.has("F:4,0") &&
        exited.has("F:2,10") &&
        labelsIn(entered).length === 0 &&
        labelsIn(exited).length === 0 &&
        lettersIn(entered).length === 1 &&
        lettersIn(exited).length === 1;
    if (!ok) throw new Error(`patchThumb32: expected the thumb letter to enter and one letter to exit with no frame-key changes; ${enterExit(entered, exited)}.`);
    return result;
}
