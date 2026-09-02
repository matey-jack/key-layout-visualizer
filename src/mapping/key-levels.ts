import {
    Hand,
    KeyboardRows,
    type KeyPosition,
    KeymapTypeId,
    type LayoutModel,
} from "../base-model.ts";
import {permute} from "../layout/permutation-functions.ts";
import {isKeyboardSymbol, isKeyName} from "./mapping-functions.ts";

/*
    The three character levels of a key: base, Shift (second level), and AltGr (third level).
    docs/key-levels.md is the canonical description of what the tables below contain and why.
 */

// Level arrays are parallel to the merged char map (and thus to the model's keyWidths).
export type LevelMap = (string | null)[][];

/*
    The colloquial level is defined for the ANSI character set, and the `;:` key is what marks one:
    most European keyboards do not have `;` as a base label. The colloquial rearrangement dissolves
    that very key, so its own `(` stands in for it there – no other key map draws one on the base
    level.
 */
export const isAnsiCharMap = (charMap: string[][]): boolean =>
    charMap.some((row) => row.includes(";") || row.includes("("));

export const hasNumberRow = (model: LayoutModel): boolean =>
    model.mainFingerAssignment[KeyboardRows.Number].some((finger) => finger !== null);

/*
    A pairing table maps the label a key map draws onto the two characters to show on that key:
    base character first, shifted character second. Where the two differ, the base level
    overrides the drawn label, so a key drawn `+` shows the `=` it actually inserts.
 */
export type ShiftPairs = Record<string, string>;

// A key map may draw the base character, the shifted one, or the combined label.
const byAnyMember = (pairs: string[]): ShiftPairs =>
    Object.fromEntries(pairs.flatMap((pair) => [[pair, pair], [pair[0], pair], [pair[1], pair]]));

export const ansiShiftPairs: ShiftPairs = byAnyMember([
    "1!", "2@", "3#", "4$", "5%", "6^", "7&", "8*", "9(", "0)",
    "`~", "-_", "=+", "[{", "]}", "\\|", ";:", "'\"", ",<", ".>", "/?",
]);

/*
    The standard German pairings, for the keys an ANSI-shaped board has – the ISO `<>|` key is on
    none of our boards. Two of these keys are drawn by another character than their base one:
    `'` for the `#` key and the frame mapping's `` `~ `` for the `^°` key (see "Showing the Shift
    and AltGr level characters" in the doc), so those labels pair to the same key.
 */
export const germanShiftPairs: ShiftPairs = {
    "1": "1!", "2": "2\"", "3": "3§", "4": "4$", "5": "5%",
    "6": "6&", "7": "7/", "8": "8(", "9": "9)", "0": "0=",
    "°": "^°", "`~": "^°", "`": "^°", "~": "^°",
    "ß": "ß?", "´": "´`", "+": "+*", "#": "#'", "'": "#'",
    ",": ",;", ".": ".:", "-": "-_",
};

/*
    The colloquial 30-key pairings, keyed by the label the colloquial frame mapping draws. The
    rearrangement below has already moved the five kept punctuation characters onto their keys,
    so here every label simply pairs with its own Shift character.
 */
export const colloquialShiftPairs: ShiftPairs = {
    "1": "1!", "2": "2@", "3": "3#", "4": "4$", "5": "5%",
    "6": "6^", "7": "7&", "8": "8*", "9": "9/", "0": "0?",
    ",": ",;", ".": ".:", "'": "'\"", "=": "=+", "-": "-_",
    // The two redundant keys the colloquialisation frees, and the ones the AltGr level
    // covers anyway.
    "(": "(<", ")": ")>",
    "`": "`~", "`~": "`~", "[": "[{", "]": "]}", "\\": "\\|",
};

/*
    The generic international pairings, which every 32-key flex map takes whatever alphabet it
    maps. They are the colloquial ones plus the punctuation keys a 32-key frame mapping may draw:
    `+` is the alternative label of the `=+` key, and `/?` is redundant with the number row's `9/`
    and `0?` – the roomier frame mappings carry it anyway. (`#` is not among them: it stands in
    for a key only on the standard German pairings, where it is the `#'` key.)
 */
export const internationalShiftPairs: ShiftPairs = {
    ...colloquialShiftPairs,
    "+": "=+", "/": "/?",
};

/*
    The German exception among the 32-key maps: `ß` claims a Shift spot in the number row, and `&`
    and `/` move to the digits that carry them on a German keyboard. (`8*` already agrees.) `2@`
    stays, so these maps have `@` on the Shift level and need none on AltGr.
 */
export const germanInternationalShiftPairs: ShiftPairs = {
    ...internationalShiftPairs,
    "6": "6&", "7": "7/", "9": "9ß",
};

/*
    The 32-key flex maps encapsulate their punctuation in the frame mapping, so one pairing serves
    every combination of such a map with a layout model.
 */
export const is32KeyType = (keymapType: KeymapTypeId): boolean =>
    keymapType === KeymapTypeId.Ansi32 || keymapType === KeymapTypeId.Thumb32;

const draws = (charMap: string[][], char: string): boolean =>
    charMap.some((row) => row.includes(char));

// The colloquial Shift level is defined for the English character set only.
export const hasColloquialLevel = (charMap: string[][], hasNumberRow: boolean): boolean =>
    hasNumberRow && isAnsiCharMap(charMap);

// The pairing tables, and thus the rules that pick one, are described in the doc's
// "[App] Shift level" and "A generic international Shift pairing for punctuation" sections.
export enum ShiftPairing {
    None = "none",
    Ansi = "ansi",
    German = "german",
    Colloquial = "colloquial",
    International = "international",
    GermanInternational = "germanInternational",
}

export function shiftPairingFor(
    charMap: string[][], hasNumberRow: boolean, keymapType: KeymapTypeId, colloquial: boolean
): ShiftPairing {
    if (!hasNumberRow) return ShiftPairing.None;
    // The `ä` of a German 32-key map is what the international exception keys on; the other
    // alphabets, English included, share the generic table.
    if (is32KeyType(keymapType)) {
        return draws(charMap, "ä") ? ShiftPairing.GermanInternational : ShiftPairing.International;
    }
    if (colloquial && hasColloquialLevel(charMap, hasNumberRow)) return ShiftPairing.Colloquial;
    // Of the two standard pairings, only the German one has a `ß?` key, so its letter decides.
    // There is room for it on layout-model-specific flex maps only.
    return draws(charMap, "ß") ? ShiftPairing.German : ShiftPairing.Ansi;
}

const shiftPairsByPairing: Record<ShiftPairing, ShiftPairs> = {
    [ShiftPairing.None]: {},
    [ShiftPairing.Ansi]: ansiShiftPairs,
    [ShiftPairing.German]: germanShiftPairs,
    [ShiftPairing.Colloquial]: colloquialShiftPairs,
    [ShiftPairing.International]: internationalShiftPairs,
    [ShiftPairing.GermanInternational]: germanInternationalShiftPairs,
};

export const shiftPairsFor = (
    charMap: string[][], hasNumberRow: boolean, keymapType: KeymapTypeId, colloquial: boolean
): ShiftPairs =>
    shiftPairsByPairing[shiftPairingFor(charMap, hasNumberRow, keymapType, colloquial)];

/*
    Some layout models label the `=+` key with its shifted character (see "Showing the Shift and
    AltGr level characters" in the doc), and the cycles below name `=`. Normalise that away first,
    so that every board takes the same path through them.
 */
const normaliseEqualsKey = (charMap: string[][]): string[][] =>
    charMap.map((row) => row.map((label) => (label === "+" ? "=" : label)));

// The colloquial Shift level introduces `(` and `)`, removes `;` and `/`,
// and moves three other keys to better positions. (Rationale in the doc.)
const genericColloquialCycles = [")=';", "(-/"];

/**
 * The board as the colloquial Shift level shows it: the generic rearrangement above, followed by
 * the layout model's own cycles where it defines any. Returns the char map unchanged when the
 * model has no colloquial level at all.
 */
export function colloquialiseCharMap(
    charMap: string[][], model: LayoutModel, keymapType: KeymapTypeId
): string[][] {
    if (!hasColloquialLevel(charMap, hasNumberRow(model))) return charMap;
    const generic = permute(normaliseEqualsKey(charMap), ...genericColloquialCycles) as string[][];
    const cycles = model.colloquialCycles?.[keymapType] ?? [];
    // A separate pass: permute resolves every cycle against the map it is given, so the layout
    // model's own cycles can only name `(` and `)` once the generic ones have placed them.
    return permute(generic, ...cycles) as string[][];
}

// The pairing a key label belongs to, or undefined for letters and non-character keys.
export const shiftPairFor = (label: string, pairs: ShiftPairs): string | undefined =>
    pairs[label];

export const getShiftLevel = (charMap: string[][], pairs: ShiftPairs): LevelMap =>
    charMap.map((row) => row.map((label) => pairs[label]?.[1] ?? null));

// The base level, but only where it differs from the label the key map draws
// (see "Showing the Shift and AltGr level characters" in the doc).
export const getBaseLevel = (charMap: string[][], pairs: ShiftPairs): LevelMap =>
    charMap.map((row) => row.map((label) => {
        const pair = pairs[label];
        return pair && label !== pair[0] ? pair[0] : null;
    }));

/*
    A third-level block is one row per keyboard row, each listing the character for the hand's
    five columns from the board centre outward:

        [centre, index, middle, ring, pinky]

    "centre" is the index finger's second column (`g` on the left hand, `h` on the right one).
    Mirroring keeps the finger and exchanges the two members of each pair, which is short enough
    to spell out per hand rather than compute.
 */
type BlockRow = (string | null)[];
// Indexed by KeyboardRows; the bottom row carries no block.
type Block = BlockRow[];

const _ = null;

// The number row is not part of the blocks: it pairs with the digits instead, see below.
export const altGrRight: Block = [
    [_, _, _, _, _],
    [_, "\\", "{", "}", "~"],
    [_, "+", "(", ")", "`"],
    [_, "=", "<", ">", _],
    [_, _, _, _, _],
];

export const altGrLeft: Block = [
    [_, _, _, _, _],
    [_, "\\", "}", "{", "~"],
    [_, "+", ")", "(", "`"],
    [_, "=", ">", "<", _],
    [_, _, _, _, _],
];

/*
    The AltGr number row, keyed by the digit the key carries rather than by finger, so that the
    mnemonic pairings survive on the boards that shift their number row around. It is the same
    row on both hands, and thus the one part of the AltGr level that the "Nav keys" switch
    leaves alone.
 */
export const altGrDigits: Record<string, string> =
    {"1": "¡", "2": "¢", "3": "£", "4": "€", "5": "‰", "6": "^", "7": "|", "8": "[", "9": "]", "0": "¿"};

export const navLeft: Block = [
    [_, _, _, _, _],
    [_, "↠", "↑", "↞", _],
    ["⇥", "→", "↓", "←", "⇤"],
    [_, "⇟", "↡", "↟", "⇞"],
    [_, _, _, _, _],
];

export const navRight: Block = [
    [_, _, _, _, _],
    [_, "↞", "↑", "↠", _],
    ["⇤", "←", "↓", "→", "⇥"],
    [_, "⇞", "↟", "↡", "⇟"],
    [_, _, _, _, _],
];

// Used on the boards where the lower row's pinky column is the Shift key: the row keeps all
// four of its characters and moves one key towards the centre, whose column is free there.
const movedTowardsCentre = (row: BlockRow): BlockRow => [...row.slice(1), _];

// A block column may sit a quarter unit off its home key (rounding in the row indents),
// but not half a unit – that would be the neighbouring column.
const slotTolerance = 0.26;

/**
 * The key that carries the block entry for one (row, slot), or undefined when the layout has
 * no usable key there. Slots are indices into a BlockRow: 0 is the centre column, 1 the index
 * finger's home column, and 4 the pinky.
 */
export function resolveSlot(
    model: LayoutModel, positions: KeyPosition[], hand: Hand, row: KeyboardRows, slot: number
): KeyPosition | undefined {
    const outward = slot - 1;
    const anchorCol = hand === Hand.Right
        ? model.rightHomeIndex + outward
        : model.leftHomeIndex - outward;
    const anchor = positions.find((p) => p.row === KeyboardRows.Home && p.col === anchorCol);
    if (!anchor) return undefined;
    const stagger = (model.symmetricStagger && hand === Hand.Right)
        ? -model.staggerOffsets[row]
        : model.staggerOffsets[row];
    const target = anchor.colPos + stagger;
    let best: KeyPosition | undefined;
    for (const p of positions) {
        if (p.row !== row) continue;
        if (!best || Math.abs(p.colPos - target) < Math.abs(best.colPos - target)) best = p;
    }
    if (!best || Math.abs(best.colPos - target) > slotTolerance) return undefined;
    // Gaps and every non-character key are unusable: a third level only makes sense on a key
    // that already inserts a character. (Return and Space are character keys to isCommandKey,
    // but they are no place for a bracket either.)
    if (!best.label || isKeyboardSymbol(best.label) || isKeyName(best.label)) return undefined;
    return best;
}

const emptyLevelMap = (model: LayoutModel): LevelMap =>
    model.keyWidths.map((row) => row.map(() => null));

function placeBlock(
    result: LevelMap, model: LayoutModel, positions: KeyPosition[], hand: Hand, block: Block
) {
    block.forEach((blockRow, row) => {
        blockRow.forEach((char, slot) => {
            if (!char) return;
            const key = resolveSlot(model, positions, hand, row, slot);
            if (key) result[key.row][key.col] = char;
        });
    });
}

// The number row, placed by digit.
function placeDigits(result: LevelMap, positions: KeyPosition[]) {
    positions.forEach((p) => {
        if (p.row !== KeyboardRows.Number) return;
        const char = altGrDigits[p.label];
        if (char) result[p.row][p.col] = char;
    });
}

// The AltGr level: navigation on `navSide` and the AltGr characters on the other hand.
export function getThirdLevel(
    model: LayoutModel, positions: KeyPosition[], charMap: string[][],
    keymapType: KeymapTypeId, navSide: Hand
): LevelMap {
    const result = emptyLevelMap(model);
    const charSide = navSide === Hand.Left ? Hand.Right : Hand.Left;

    const navBlock = navSide === Hand.Left ? navLeft : navRight;
    const hasLowerPinky = !!resolveSlot(model, positions, navSide, KeyboardRows.Lower, 4);
    const nav = hasLowerPinky ? navBlock
        : navBlock.map((row, i) => i === KeyboardRows.Lower ? movedTowardsCentre(row) : row);
    placeBlock(result, model, positions, navSide, nav);

    // The single numberless layout model would need a much more elaborate keymap with more than three levels.
    // We don't have that, so we show no levels except for the nav layer.
    if (hasNumberRow(model)) {
        placeBlock(result, model, positions, charSide, charSide === Hand.Right ? altGrRight : altGrLeft);
        placeDigits(result, positions);
        // The standard German pairings are the only ones without a `2@` key, so they are the only
        // ones that need the character here. The colloquial switch cannot change that: it applies
        // to English maps, which have `2@` either way.
        if (shiftPairingFor(charMap, true, keymapType, false) === ShiftPairing.German) {
            // `@` on the key the German standard has it, the key map position [Upper, 0] – `q` in
            // qwertz. That is where the character block puts `~`, so when the block is on that
            // hand, `@` takes the mnemonic AltGr+2 instead, off the `¢` the digits placed there.
            const key = charSide === Hand.Left
                ? positions.find((p) => p.row === KeyboardRows.Number && p.label === "2")
                : resolveSlot(model, positions, Hand.Left, KeyboardRows.Upper, 4);
            if (key) result[key.row][key.col] = "@";
        }
    }
    return result;
}

export interface KeyLevels {
    base: LevelMap;
    shift: LevelMap;
    third: LevelMap;
}

export const getKeyLevels = (
    model: LayoutModel, positions: KeyPosition[], charMap: string[][],
    keymapType: KeymapTypeId, navSide: Hand, colloquial: boolean
): KeyLevels => {
    const pairs = shiftPairsFor(charMap, hasNumberRow(model), keymapType, colloquial);
    return {
        base: getBaseLevel(charMap, pairs),
        shift: getShiftLevel(charMap, pairs),
        third: getThirdLevel(model, positions, charMap, keymapType, navSide),
    };
};
