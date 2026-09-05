import {Hand, type KeyPosition, type LayoutModel} from "../base-model.ts";
import {permuteAvailable} from "../layout/permutation-functions.ts";
import {
    type Block,
    type BlockRow,
    draws,
    emptyLevelMap,
    hasNumberRow,
    isGermanAlphabet,
    type LevelMap,
    placeBlock,
    type ShiftPairs,
} from "./key-level-functions.ts";

/*
    The three levels of a numberless board, which has to fit on them what a numbered one spreads
    over four rows. Its section of the doc is "Numberless keyboards".
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
 */
export const isNumberlessInternational = (charMap: string[][]): boolean => !draws(charMap, "/");

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
    The rows are `BlockRow`s, and this board is the one that uses their inner column: on the home
    row that is the single key between the hands, on the rows above and below it the row stagger
    gives each hand one of the two keys that straddle the centre. Only the digits leave it empty,
    for want of a tenth key on the far side.
 */
const digitsLeft: BlockRow = [_, "5", "4", "3", "2", "1"];
const digitsRight: BlockRow = [_, "6", "7", "8", "9", "0"];

// The 30-key board keeps `-!` and `/?` on its base and Shift levels, so `_` and the parentheses
// take the two spots their characters leave here.
const digitShiftsLeft: BlockRow = ["%", "$", "#", "@", "_", _];
const digitShiftsRight: BlockRow = ["^", "&", "*", "(", ")", _];

/*
    The international board has neither, so `!` and `/?` come back to the digits they belong to,
    and the parentheses go. The German variant then moves `&` and `/` onto the digits a German
    keyboard has them on and fits `ß` in, as germanInternationalShiftPairs does on a numbered
    board; the `^` is what pays for it, and it is not the only technical character a numberless
    board goes without.
 */
const internationalDigitShiftsLeft: BlockRow = ["%", "$", "#", "@", "!", _];
const internationalDigitShiftsRight: BlockRow = ["^", "&", "*", "/", "?", _];
const germanDigitShiftsRight: BlockRow = ["&", "/", "*", "ß", "?", _];

const digitShiftRow = (charMap: string[][], hand: Hand): BlockRow => {
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

const homeRow = (hand: Hand, navSide: Hand): BlockRow => [
    _, _,
    ...outwardFromCentre(hand, hand === navSide ? arrows : paging),
];

// Indexed by KeyboardRows, so the number row this board does not have still takes its place.
const shaftBlock = (charMap: string[][], hand: Hand, navSide: Hand): Block => [
    [],
    hand === Hand.Left ? digitsLeft : digitsRight,
    homeRow(hand, navSide),
    digitShiftRow(charMap, hand),
];

/**
 * The AltGr level of a numberless board, which the boards that show one call the Shaft level:
 * digits and their Shift characters on the two outer rows, navigation on the home row.
 */
export function getNumberlessAltGrLevel(
    model: LayoutModel, positions: KeyPosition[], charMap: string[][], navSide: Hand
): LevelMap {
    const result = emptyLevelMap(model);
    for (const hand of [Hand.Left, Hand.Right]) {
        placeBlock(result, model, positions, hand, shaftBlock(charMap, hand, navSide));
    }
    return result;
}
