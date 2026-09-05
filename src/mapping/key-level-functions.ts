import {Hand, KeyboardRows, type KeyPosition, KeymapTypeId, type LayoutModel} from "../base-model.ts";
import {isCharacterKey} from "./mapping-functions.ts";

/*
    The mechanics every key level table needs, whatever board it describes: how a level map is
    shaped, how a Shift pairing turns into base and Shift characters, and how a table addressed by
    hand, row and finger finds the key it means on a concrete board.

    The tables themselves live next to the boards they belong to: mapping/key-levels.ts for the
    numbered boards, mapping/numberless-key-levels.ts for the numberless ones.
    docs/key-levels.md is the canonical description of what those tables contain and why.
 */

// Level arrays are parallel to the merged char map (and thus to the model's keyWidths).
export type LevelMap = (string | null)[][];

export interface KeyLevels {
    base: LevelMap;
    shift: LevelMap;
    altGr: LevelMap;
}

export const hasNumberRow = (model: LayoutModel): boolean =>
    model.mainFingerAssignment[KeyboardRows.Number].some((finger) => finger !== null);

export const is32KeyType = (keymapType: KeymapTypeId): boolean =>
    keymapType === KeymapTypeId.Ansi32 || keymapType === KeymapTypeId.Thumb32;

export const draws = (charMap: string[][], char: string): boolean =>
    charMap.some((row) => row.includes(char));

// The `ä` of a German flex map is what the German exceptions key on; the other alphabets,
// English included, share the generic tables.
export const isGermanAlphabet = (charMap: string[][]): boolean => draws(charMap, "ä");

/*
    A pairing table maps the label a key map draws onto the two characters to show on that key:
    base character first, shifted character second. Where the two differ, the base level
    overrides the drawn label, so a key drawn `+` shows the `=` it actually inserts.
 */
export type ShiftPairs = Record<string, string>;

// A key map may draw the base character, the shifted one, or the combined label.
export const byAnyMember = (pairs: string[]): ShiftPairs =>
    Object.fromEntries(pairs.flatMap((pair) => [[pair, pair], [pair[0], pair], [pair[1], pair]]));

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

export const emptyLevelMap = (model: LayoutModel): LevelMap =>
    model.keyWidths.map((row) => row.map(() => null));

/*
    A block is one row per keyboard row, each listing the character for the hand's five columns
    from the board centre outward:

        [centre, index, middle, ring, pinky]

    "centre" is the index finger's second column (`g` on the left hand, `h` on the right one).
    Mirroring keeps the finger and exchanges the two members of each pair, which is short enough
    to spell out per hand rather than compute.
 */
export type BlockRow = (string | null)[];
// Indexed by KeyboardRows; the bottom row carries no block.
export type Block = BlockRow[];

// Used on the boards where the lower row's pinky column is the Shift key: the row keeps all
// four of its characters and moves one key towards the centre, whose column is free there.
export const movedTowardsCentre = (row: BlockRow): BlockRow => [...row.slice(1), null];

// A block column may sit a quarter unit off its home key (rounding in the row indents),
// but not half a unit – that would be the neighbouring column.
const slotTolerance = 0.26;

/**
 * The key that carries the block entry for one (row, slot), or undefined when the layout has
 * no usable key there. Slots count outward from the board centre: 0 is the centre column, 1 the
 * index finger's home column, and 4 the pinky. Slot -1 is the one column each hand reaches
 * further inward, which the rows above and below the home row split between the two hands.
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
    // An AltGr level only makes sense on a key that already inserts a character.
    return isCharacterKey(best.label) ? best : undefined;
}

export function placeBlock(
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
