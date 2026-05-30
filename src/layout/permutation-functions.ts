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
//   - a placeholder reference in [flexRow,col] form, e.g. [1,10] or [4,0], naming the
//     FlexMapping cell a letter is pulled from. The first index is ALWAYS the FlexMapping row,
//     so a bare `10` on grid row 1 is [1,10], and a `[-1,10]` on grid row 3 is [2,10].
//
// Semantics of "abc": a takes the place of b, b takes the place of c, c takes the place of a.
// A key entering the mapping (new) may appear only as the FIRST token; a key leaving only as the
// LAST. With both present the cycle is an open chain: the first key is placed, the last is dropped,
// and there is no wrap-around (so the column count stays the same).

type Coord = [number, number]; // [flexRow, col]
type CycleToken = { label: string } | { coord: Coord };

// Splits a cycle spec such as "a[1,10]-" into its ordered tokens (key labels and [flexRow,col] refs).
function parseCycle(spec: string): CycleToken[] {
    const tokens: CycleToken[] = [];
    for (let i = 0; i < spec.length;) {
        if (spec[i] === "[") {
            const end = spec.indexOf("]", i);
            if (end < 0) throw new Error(`Unclosed '[' in cycle "${spec}".`);
            const parts = spec.slice(i + 1, end).split(",").map((s) => Number(s.trim()));
            if (parts.length !== 2 || parts.some(Number.isNaN)) {
                throw new Error(`Bad coordinate token in cycle "${spec}".`);
            }
            tokens.push({coord: [parts[0], parts[1]]});
            i = end + 1;
        } else {
            tokens.push({label: spec[i]});
            i += 1;
        }
    }
    return tokens;
}

// Printable form of a token, used in error messages.
const tokenLabel = (t: CycleToken) => ("label" in t ? `'${t.label}'` : `[${t.coord[0]},${t.coord[1]}]`);

// The FlexMapping cell a grid cell pulls its letter from, or null for a literal label / gap.
function cellFlexCoord(value: LayoutMappingEntry, gridRow: number): Coord | null {
    if (typeof value === "number") return [gridRow, value];
    if (Array.isArray(value)) return [gridRow + value[0], value[1]];
    return null;
}

// Finds the single grid cell currently holding a token's key, or null when it isn't present
// (which marks an entering key). Throws if the token is ambiguous (matches more than one cell).
function findToken(mapping: LayoutMapping, token: CycleToken): [number, number] | null {
    const matches: [number, number][] = [];
    mapping.forEach((row, r) =>
        row.forEach((value, c) => {
            if ("label" in token) {
                if (value === token.label) matches.push([r, c]);
            } else {
                const fc = cellFlexCoord(value, r);
                if (fc && fc[0] === token.coord[0] && fc[1] === token.coord[1]) matches.push([r, c]);
            }
        })
    );
    if (matches.length > 1) throw new Error(`Cycle token ${tokenLabel(token)} matches ${matches.length} cells (must be unique).`);
    return matches[0] ?? null;
}

// The value to store when a token lands on grid row destRow (placeholders become row-relative).
function tokenValue(token: CycleToken, destRow: number): LayoutMappingEntry {
    if ("label" in token) return token.label;
    const [fr, col] = token.coord;
    return fr === destRow ? col : [fr - destRow, col];
}

// Returns a copy of a frame mapping with the given cyclic permutations applied (see the note above
// for the cycle syntax). The base mapping is not modified.
export function permute(base: LayoutMapping, ...cycles: string[]): LayoutMapping {
    const result = copyKeymap(base);
    for (const spec of cycles) {
        const tokens = parseCycle(spec);
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
        labelsIn(entered).length === 0 &&
        labelsIn(exited).length === 0 &&
        lettersIn(entered).length === 1 &&
        lettersIn(exited).length === 1;
    if (!ok) throw new Error(`patchThumb32: expected the thumb letter to enter and one letter to exit with no frame-key changes; ${enterExit(entered, exited)}.`);
    return result;
}
