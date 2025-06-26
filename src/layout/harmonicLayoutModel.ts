import {KeyboardRows} from "../model.ts";
import {LayoutMapping, RowBasedLayoutModel} from "./layout-model.ts";

/*
    It's my arbitrary decision to not include numbers, wide keys, and modifiers in the flexible mapping.
    I want to focus this app on mapping characters, especially letters and those punctuaction characters that are
    just as frequent as the most frequent letters.
    I wouldn't even bother with changing punctuation at all if the Harmonic layout didn't penalize the ancient
    Qwerty postions of TYB so much. The Harmonic layout simply needs to make use of the all keys that are at
    neighboring the eight home keys, so we need at least 12 keys in the home row to be in the flex mapping.
    We simply add some other keys to show sensible solutions for assigning punctuation keys whose typewriter position
    doesn't even exist on the Harmonic.
 */
const fullMapping: LayoutMapping = [
        ["Esc", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", 0, 1],
        ["↹", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "⌫"],
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        ["⇧", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "⇧"],
        ["Ctrl", "Cmd", "Alt", 0, "⍽", "⏎", 1, "AltGr", "Fn", "Ctrl"],
    ];

// Just a thought experiment: position nav keys in top and bottom rows Instead of mapping programmer punctuation.
// It's up to the flex layout to decide which seven punctuation keys make the cut, but surely `,.;/-'` should be included,
// and frankly =+ seems the most sensible seventh.
// (Things get more interesting when we allow modifying the shift-pairings, but that's for another long comment...)
const thirtyThreeKeyMapping: LayoutMapping = [
        ["Esc", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "PgUp", "PgDn"],
        ["↹", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "⌫"],
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        ["⇧", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "⇧"],
        ["Ctrl", "Cmd", "Alt", "⇤", "⍽", "⏎", "⇥", "AltGr", "Fn", "Ctrl"],
    ];

const thirtyKeyMapping: LayoutMapping = [
        ["Esc", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "="],
        ["↹", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "⌫"],
        ["`~", 0, 1, 2, 3, 4, "\\", 5, 6, 7, 8, 9, "'"],
        // The move of key 9 to the middle is a change required to keep the finger assignments of keys 25..28 the same as on the ANSI layout.
        // This is caused by moving the right home row to the right where the Enter key is removed.
        // But below, Shift is still there.
        ["⇧", 0, 1, 2, 3, 4, 9, 5, 6, 7, 8, "⇧"],
        ["Ctrl", "Cmd", "Alt", "[", "⍽", "⏎", "]", "AltGr", "Fn", "Ctrl"],
    ];

export const harmonicLayoutModel: RowBasedLayoutModel = {
    mapping30keys: thirtyKeyMapping,

    // move the whole keyboard one key to the right to align with the ANSI center.
    rowStart: (row: number) =>
        (row == KeyboardRows.Bottom) ? 1.5 : 1,

    keyWidth: (row: KeyboardRows, col: number) => {
        // outer edge keys
        if ((row == KeyboardRows.Upper || row == KeyboardRows.Lower || row == KeyboardRows.Bottom) &&
            (col == 0 || col == fullMapping[row].length - 1)) return 1.5;
        // space and enter
        if (row == KeyboardRows.Bottom && (col == 4 || col == 5)) return 1.5;
        // all others
        return 1;
    },

    // You'll notice that it's the same as in ANSI, making it easy to use both.
    splitColumns: [7, 6, 6, 6],

    leftHomeIndex: 4,
    rightHomeIndex: 8,
}