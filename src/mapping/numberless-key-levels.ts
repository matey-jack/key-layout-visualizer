import {Hand, KeyboardRows, type KeyPosition, type LayoutModel} from "../base-model.ts";
import {permute} from "../layout/permutation-functions.ts";
import {
    emptyLevelMap,
    getBaseLevel,
    getShiftLevel,
    hasNumberRow,
    type KeyLevels,
    type LevelMap,
    resolveSlot,
    type ShiftPairs,
} from "./key-level-functions.ts";

/*
    The three levels of a numberless board, which has to fit on them what a numbered one spreads
    over four rows. docs/key-levels.md ("Numberless keyboards") is the canonical description of
    what the tables below contain and why.
 */

/*
    The board keeps `,` `.` `/` `'` `-` on the base level and pairs each with the character
    everyday prose needs next: the colloquial `,;` and `.:`, the ANSI `/?` and `'"`, and `-!`,
    which is what keeps `!` a shifted character once the digits leave the base level.
    `=+` fills the key the vanishing `;` leaves behind (see numberlessCharMap).
 */
export const numberlessShiftPairs: ShiftPairs = {
    ",": ",;", ".": ".:", "/": "/?", "'": "'\"", "-": "-!", "=": "=+",
};

/*
    `;` becomes the Shift character of `,`, so the key that drew it is free. Every 30-key flex map
    spends its four non-letter spots on `; , . /`, so this one chain serves them all: `=` enters
    the map where `;` was and `;` leaves it.
 */
const spareKeyCycle = "=;";

/**
 * The board as a numberless one shows it. Returns the char map unchanged on any board that has a
 * number row, so the caller can apply it to whatever it is about to draw.
 */
export const numberlessCharMap = (charMap: string[][], model: LayoutModel): string[][] =>
    hasNumberRow(model) ? charMap : permute(charMap, spareKeyCycle) as string[][];

const _ = null;

/*
    One keyboard row of one hand, from the inner column outward:

        [inner, centre, index, middle, ring, pinky]

    Entry i is resolveSlot's slot i - 1, so the leading one is the column each hand reaches past
    its centre one. On the home row that is the single key between the hands; on the rows above
    and below it, the row stagger gives each hand one of the two keys that straddle the centre.
 */
type ShaftRow = (string | null)[];

const INNER = -1;

// due to the counting from the center, each side needs an empty spot to cover the central gap.
const digitsLeft: ShaftRow = [_, "5", "4", "3", "2", "1"];
const digitsRight: ShaftRow = [_, "6", "7", "8", "9", "0"];

const digitShiftsLeft: ShaftRow = ["%", "$", "#", "@", "_", _];
const digitShiftsRight: ShaftRow = ["^", "&", "*", "(", ")", _];

// inline navigation keys in reading order (left -> right, top -> bottom)
const arrows = ["←", "↑", "↓", "→"];
const paging = ["⇤", "⇞", "⇟", "⇥"];

// Slots count outward from the board centre, which is the left-to-right order on the right hand
// and its reverse on the left one.
const outwardFromCentre = (hand: Hand, leftToRight: string[]): string[] =>
    hand === Hand.Left ? leftToRight.toReversed() : leftToRight;

const homeRow = (hand: Hand, navSide: Hand): ShaftRow => [
    _, _,
    ...outwardFromCentre(hand, hand === navSide ? arrows : paging),
];

/**
 * The AltGr level of a numberless board, which the boards that show one call the Shaft level:
 * digits and their Shift characters on the two outer rows, navigation on the home row.
 */
export function getNumberlessAltGrLevel(
    model: LayoutModel, positions: KeyPosition[], navSide: Hand
): LevelMap {
    const result = emptyLevelMap(model);
    const place = (hand: Hand, row: KeyboardRows, chars: ShaftRow) =>
        chars.forEach((char, i) => {
            if (!char) return;
            const key = resolveSlot(model, positions, hand, row, i + INNER);
            if (key) result[key.row][key.col] = char;
        });

    for (const hand of [Hand.Left, Hand.Right]) {
        place(hand, KeyboardRows.Upper, hand === Hand.Left ? digitsLeft : digitsRight);
        place(hand, KeyboardRows.Home, homeRow(hand, navSide));
        place(hand, KeyboardRows.Lower, hand === Hand.Left ? digitShiftsLeft : digitShiftsRight);
    }

    // The space between the two nav groups is Delete. Both hands reach that one key, so it is
    // placed here rather than in either hand's home row.
    // const between = resolveSlot(model, positions, Hand.Left, KeyboardRows.Home, INNER);
    // if (between) result[between.row][between.col] = "⌦";

    return result;
}

export const getNumberlessKeyLevels = (
    model: LayoutModel, positions: KeyPosition[], charMap: string[][], navSide: Hand
): KeyLevels => ({
    base: getBaseLevel(charMap, numberlessShiftPairs),
    shift: getShiftLevel(charMap, numberlessShiftPairs),
    altGr: getNumberlessAltGrLevel(model, positions, navSide),
});
