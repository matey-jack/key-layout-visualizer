import {Hand, KeyboardRows, type KeyPosition, type LayoutModel} from "../base-model.ts";
import {permuteAvailable} from "../layout/permutation-functions.ts";
import {
    draws,
    emptyLevelMap,
    getBaseLevel,
    getShiftLevel,
    hasNumberRow,
    isGermanAlphabet,
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

// With only three punctuation keys available, we reduce it to the normal colloquial pairing again.
// This is the only case, where ? and ! are not on the Shift level, but the Shaft layer.
export const numberlessInternationalShiftPairs: ShiftPairs = {
    ",": ",;", ".": ".:", "-": "-_",
};

/*
    Which of the two the board takes, read off its character set the way key-levels.ts reads the
    numbered ones: a 30-key map always draws `/`, and the 32-key character set never had one. It
    does not matter that the `/` comes from the flex map on one frame and from the frame itself on
    the thumb one - either way it marks the same 30-key character set.

    The keymap type would answer this outright, since the numberless board takes only those two
    families, but it is not at hand: every function here is given the merged char map alone, and
    threading the type in from the app would touch getKeyLevels and shiftPairingFor as well. Nor
    would it get us rid of the char map, because the German exception below keys on the `ä` in it.
 */
export const isNumberlessInternational = (charMap: string[][]): boolean => !draws(charMap, "/");

export const numberlessShiftPairsFor = (charMap: string[][]): ShiftPairs =>
    isNumberlessInternational(charMap) ? numberlessInternationalShiftPairs : numberlessShiftPairs;

/*
    `;` becomes the Shift character of `,`, so the key that drew it is free. Every 30-key flex map
    spends its four non-letter spots on `; , . /`, so this one chain serves them all: `=` enters
    the map where `;` was and `;` leaves it. A 32-key map has no `;` to give up, and the cycle
    leaves it alone.
 */
const spareKeyCycle = "=;";

/**
 * The board as a numberless one shows it. Returns the char map unchanged on any board that has a
 * number row, so the caller can apply it to whatever it is about to draw.
 */
export const numberlessCharMap = (charMap: string[][], model: LayoutModel): string[][] =>
    hasNumberRow(model) ? charMap : permuteAvailable(charMap, spareKeyCycle) as string[][];

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

// The 30-key board keeps `-!` and `/?` on its base and Shift levels, so `_` and the parentheses
// take the two spots their characters leave here.
const digitShiftsLeft: ShaftRow = ["%", "$", "#", "@", "_", _];
const digitShiftsRight: ShaftRow = ["^", "&", "*", "(", ")", _];

/*
    The international board has neither, so `!` and `/?` come back to the digits they belong to,
    and the parentheses go. The German variant then moves `&` and `/` onto the digits a German
    keyboard has them on and fits `ß` in, as germanInternationalShiftPairs does on a numbered
    board; the `^` is what pays for it, and it is not the only technical character a numberless
    board goes without.
 */
const internationalDigitShiftsLeft: ShaftRow = ["%", "$", "#", "@", "!", _];
const internationalDigitShiftsRight: ShaftRow = ["^", "&", "*", "/", "?", _];
const germanDigitShiftsRight: ShaftRow = ["&", "/", "*", "ß", "?", _];

const digitShiftRow = (charMap: string[][], hand: Hand): ShaftRow => {
    if (!isNumberlessInternational(charMap)) {
        return hand === Hand.Left ? digitShiftsLeft : digitShiftsRight;
    }
    if (hand === Hand.Left) return internationalDigitShiftsLeft;
    return isGermanAlphabet(charMap) ? germanDigitShiftsRight : internationalDigitShiftsRight;
};

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
    model: LayoutModel, positions: KeyPosition[], charMap: string[][], navSide: Hand
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
        place(hand, KeyboardRows.Lower, digitShiftRow(charMap, hand));
    }

    return result;
}

export const getNumberlessKeyLevels = (
    model: LayoutModel, positions: KeyPosition[], charMap: string[][], navSide: Hand
): KeyLevels => {
    const pairs = numberlessShiftPairsFor(charMap);
    return {
        base: getBaseLevel(charMap, pairs),
        shift: getShiftLevel(charMap, pairs),
        altGr: getNumberlessAltGrLevel(model, positions, charMap, navSide),
    };
};
