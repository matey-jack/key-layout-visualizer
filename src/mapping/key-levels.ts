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

export const is32KeyMap = (keymapType?: KeymapTypeId): boolean =>
    keymapType === KeymapTypeId.Ansi32 || keymapType === KeymapTypeId.Thumb32;

// A board without a number row gets its own Shift pairings and no AltGr characters at all.
export const hasNumberRow = (model: LayoutModel): boolean =>
    model.mainFingerAssignment[KeyboardRows.Number].some((finger) => finger !== null);

/*
    A pairing table maps the label a key map draws onto the two characters to show on that key:
    base character first, shifted character second. Where the two differ, the base level
    overrides the drawn label – which is how the numberless tables below relabel a key entirely.
 */
export type ShiftPairs = Record<string, string>;

// A key map may draw the base character, the shifted one, or the combined label.
const byAnyMember = (pairs: string[]): ShiftPairs =>
    Object.fromEntries(pairs.flatMap((pair) => [[pair, pair], [pair[0], pair], [pair[1], pair]]));

export const ansiShiftPairs: ShiftPairs = byAnyMember([
    "1!", "2@", "3#", "4$", "5%", "6^", "7&", "8*", "9(", "0)",
    "`~", "-_", "=+", "[{", "]}", "\\|", ";:", "'\"", ",<", ".>", "/?",
]);

// Without a number row the ANSI pairings make no sense, so these seven replace them.
export const numberlessShiftPairs: ShiftPairs = {
    ",": ",;", ".": ".:", "/": "/?",
    ";": "'\"", "'": "-!", "-": "$%", "+": "&+",
};

// The 32-key flex maps place only four of those characters, and `/?` lands on whichever of
// `+` and `/` the key map happens to draw.
export const numberless32ShiftPairs: ShiftPairs = {
    ",": ",;", ".": ".:", "-": "-!", "+": "/?", "/": "/?",
};

/*
    The compressed 30-key pairings, keyed by the label the compressed frame mapping draws. The
    rearrangement below has already moved the five kept punctuation characters onto their keys,
    so here every label simply pairs with its own Shift character.
 */
export const compressedShiftPairs: ShiftPairs = {
    "1": "1!", "2": "2@", "3": "3#", "4": "4$", "5": "5%",
    "6": "6^", "7": "7&", "8": "8*", "9": "9/", "0": "0?",
    ",": ",;", ".": ".:", "'": "'\"", "=": "=+", "-": "-_",
    // The two redundant keys the compression frees, and the ones the AltGr level covers anyway.
    "(": "(<", ")": ")>",
    "`": "`~", "`~": "`~", "[": "[{", "]": "]}", "\\": "\\|",
};

/*
    The 32-key flex maps with a number row follow the German keymap, whose Shift pairings we do
    not have yet (see the "Next parts" list in docs/key-levels.md). Until then they show no Shift
    level at all rather than the ANSI one, which would be wrong on most of their keys.
 */
const noShiftPairs: ShiftPairs = {};

// The compressed Shift level is defined for the 30-key flex maps only.
export const hasCompressedLevel = (keymapType: KeymapTypeId | undefined, hasNumberRow: boolean): boolean =>
    hasNumberRow && (keymapType === KeymapTypeId.Ansi30 || keymapType === KeymapTypeId.Thumb30);

export const shiftPairsFor = (
    keymapType: KeymapTypeId | undefined, hasNumberRow: boolean, compressed = false
): ShiftPairs =>
    compressed && hasCompressedLevel(keymapType, hasNumberRow) ? compressedShiftPairs
        : !hasNumberRow ? (is32KeyMap(keymapType) ? numberless32ShiftPairs : numberlessShiftPairs)
            : is32KeyMap(keymapType) ? noShiftPairs : ansiShiftPairs;

/*
    Some layout models label the `=+` key with its shifted character (see the Prerequisites
    section of docs/key-levels.md), and the cycles below name `=`. Normalise that away first, so
    that every board takes the same path through them.
 */
const normaliseEqualsKey = (charMap: string[][]): string[][] =>
    charMap.map((row) => row.map((label) => (label === "+" ? "=" : label)));

// The compressed Shift level introduces `(` and `)`, removes `;` and `/`,
// and moves three other keys to better positions. (Rationale in the doc.)
const compressionCycles = [")=';", "(-/"];

/**
 * The board as the compressed Shift level shows it: the generic rearrangement above, followed by
 * the layout model's own cycles where it defines any. Returns the char map unchanged when the
 * model has no compressed level at all.
 */
export function compressCharMap(
    charMap: string[][], model: LayoutModel, keymapType?: KeymapTypeId
): string[][] {
    if (!keymapType || !hasCompressedLevel(keymapType, hasNumberRow(model))) return charMap;
    const generic = permute(normaliseEqualsKey(charMap), ...compressionCycles) as string[][];
    const cycles = model.compressedCycles?.[keymapType] ?? [];
    // A separate pass: permute resolves every cycle against the map it is given, so the layout
    // model's own cycles can only name `(` and `)` once the generic ones have placed them.
    return permute(generic, ...cycles) as string[][];
}

// The pairing a key label belongs to, or undefined for letters and non-character keys.
export const shiftPairFor = (label: string, pairs: ShiftPairs = ansiShiftPairs): string | undefined =>
    pairs[label];

export const getShiftLevel = (charMap: string[][], pairs: ShiftPairs = ansiShiftPairs): LevelMap =>
    charMap.map((row) => row.map((label) => pairs[label]?.[1] ?? null));

// The base level, but only where it differs from the label the key map draws
// (see the Prerequisites section of docs/key-levels.md).
export const getBaseLevel = (charMap: string[][], pairs: ShiftPairs = ansiShiftPairs): LevelMap =>
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
    [_, "\\", "{", "}", _],
    ["~", "`", "(", ")", _],
    [_, "=", "<", ">", _],
    [_, _, _, _, _],
];

export const altGrLeft: Block = [
    [_, _, _, _, _],
    [_, "\\", "}", "{", _],
    ["~", "`", ")", "(", _],
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

// The AltGr level: navigation on `navSide` and the AltGr characters on the other hand,
// which a layout without a number row does not get at all.
export function getThirdLevel(
    model: LayoutModel, positions: KeyPosition[], navSide: Hand, keymapType?: KeymapTypeId
): LevelMap {
    const result = emptyLevelMap(model);
    const charSide = navSide === Hand.Left ? Hand.Right : Hand.Left;

    const navBlock = navSide === Hand.Left ? navLeft : navRight;
    const hasLowerPinky = !!resolveSlot(model, positions, navSide, KeyboardRows.Lower, 4);
    const nav = hasLowerPinky ? navBlock
        : navBlock.map((row, i) => i === KeyboardRows.Lower ? movedTowardsCentre(row) : row);
    placeBlock(result, model, positions, navSide, nav);

    if (hasNumberRow(model)) {
        placeBlock(result, model, positions, charSide, charSide === Hand.Right ? altGrRight : altGrLeft);
        placeDigits(result, positions);
        if (is32KeyMap(keymapType)) {
            // The AltGr assignment of the flex map position [Upper, 0] – `q` in qwertz.
            const key = resolveSlot(model, positions, Hand.Left, KeyboardRows.Upper, 4);
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
    model: LayoutModel, positions: KeyPosition[], charMap: string[][], navSide: Hand,
    keymapType?: KeymapTypeId, compressed = false
): KeyLevels => {
    const pairs = shiftPairsFor(keymapType, hasNumberRow(model), compressed);
    return {
        base: getBaseLevel(charMap, pairs),
        shift: getShiftLevel(charMap, pairs),
        third: getThirdLevel(model, positions, navSide, keymapType),
    };
};
