import {
    Hand,
    KeyboardRows,
    type KeyPosition,
    type LayoutModel,
} from "../base-model.ts";
import {isKeyboardSymbol, isKeyName} from "./mapping-functions.ts";

/*
    The three character levels of a key: base, Shift (second level), and AltGr (third level).
    See docs/key-levels.md for the concept behind the two tables in this file.

    The Shift level is defined by a list of pairings and matched against whatever the merged
    key map puts on a key, so it also works for the flex mappings which place punctuation
    themselves. The third level is defined by finger position and mapped onto the physical
    layout independent of what the key shows on the other two levels.
 */

// Level arrays are parallel to the merged char map (and thus to the model's keyWidths).
export type LevelMap = (string | null)[][];

// The US ANSI Shift pairings, one entry per key: base character first, shifted character second.
export const ansiShiftPairs = [
    "1!", "2@", "3#", "4$", "5%", "6^", "7&", "8*", "9(", "0)",
    "`~", "-_", "=+", "[{", "]}", "\\|", ";:", "'\"", ",<", ".>", "/?",
];

/**
 * The pairing a key label belongs to, or undefined for letters and non-character keys.
 * A label matches its base character, its shifted character, or the whole pair – the frame
 * mappings write the leftmost key of the number row as the single label "`~".
 */
export const shiftPairFor = (label: string): string | undefined =>
    ansiShiftPairs.find((pair) => label === pair || label === pair[0] || label === pair[1]);

export const getShiftLevel = (charMap: string[][]): LevelMap =>
    charMap.map((row) => row.map((label) => shiftPairFor(label)?.[1] ?? null));

/**
 * The base level, but only where it differs from the label the key map draws.
 * A key labelled `+` is the ANSI `=+` key, so the levels view shows `=` below and `+` above;
 * the same splits the combined "`~" label into its two levels.
 */
export const getBaseLevel = (charMap: string[][]): LevelMap =>
    charMap.map((row) => row.map((label) => {
        const pair = shiftPairFor(label);
        return pair && label !== pair[0] ? pair[0] : null;
    }));

/*
    A third-level block is one row per keyboard row, each listing the character for the hand's
    five columns from the board centre outward:

        [centre, index, middle, ring, pinky]

    "centre" is the index finger's second column (`g` on the left hand, `h` on the right one).
    Switching hands keeps the finger and exchanges the two members of each mirror pair
    ([] {} () <> ←→ ↞↠ ⇤⇥ ⇞⇟ ↟↡), which is why both variants are spelled out here.
 */
type BlockRow = (string | null)[];
// Indexed by KeyboardRows; the bottom row carries no block.
type Block = BlockRow[];

const _ = null;

// Stack of brackets on middle and ring finger, the remaining characters on the index finger.
// `^` (number row, centre column) is not part of the general block – only the Ergoslat's
// 32-key keymaps need it.
export const altGrRight: Block = [
    [_, "|", "[", "]", _],
    [_, "\\", "{", "}", _],
    ["~", "`", "(", ")", _],
    [_, "=", "<", ">", _],
    [_, _, _, _, _],
];

export const altGrLeft: Block = [
    [_, "|", "]", "[", _],
    [_, "\\", "}", "{", _],
    ["~", "`", ")", "(", _],
    [_, "=", ">", "<", _],
    [_, _, _, _, _],
];

// "Hands down" navigation: the cursor keys keep their inverted-T shape on the home row,
// with ↑↓ on the middle finger. ↟ ↡ are mouse scrolls.
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

// On most of our boards the lower row's pinky column is the Shift key. Then the mouse scrolls
// give way and PageUp/PageDown move inward onto the middle and ring finger.
const navLowerFallbackLeft: BlockRow = [_, _, "⇟", "⇞", _];
const navLowerFallbackRight: BlockRow = [_, _, "⇞", "⇟", _];

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

/**
 * The AltGr level: navigation on `navSide` and the AltGr characters on the other hand.
 * A layout without a number row gets no AltGr characters – with the number row's Shift
 * characters missing, a third level on the remaining rows only looks broken.
 */
export function getThirdLevel(model: LayoutModel, positions: KeyPosition[], navSide: Hand): LevelMap {
    const result = emptyLevelMap(model);
    const charSide = navSide === Hand.Left ? Hand.Right : Hand.Left;

    const navBlock = navSide === Hand.Left ? navLeft : navRight;
    const hasLowerPinky = !!resolveSlot(model, positions, navSide, KeyboardRows.Lower, 4);
    const nav = hasLowerPinky ? navBlock : [
        ...navBlock.slice(0, KeyboardRows.Lower),
        navSide === Hand.Left ? navLowerFallbackLeft : navLowerFallbackRight,
        navBlock[KeyboardRows.Bottom],
    ];
    placeBlock(result, model, positions, navSide, nav);

    if (positions.some((p) => p.row === KeyboardRows.Number)) {
        placeBlock(result, model, positions, charSide, charSide === Hand.Right ? altGrRight : altGrLeft);
    }
    return result;
}

export interface KeyLevels {
    base: LevelMap;
    shift: LevelMap;
    third: LevelMap;
}

export const getKeyLevels = (
    model: LayoutModel, positions: KeyPosition[], charMap: string[][], navSide: Hand
): KeyLevels => ({
    base: getBaseLevel(charMap),
    shift: getShiftLevel(charMap),
    third: getThirdLevel(model, positions, navSide),
});
