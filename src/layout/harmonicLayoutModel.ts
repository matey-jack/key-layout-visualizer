import {KeyboardRows} from "../model.ts";
import {LayoutMapping, LH, RH, RowBasedLayoutModel} from "./layout-model.ts";

/*
    It's my arbitrary decision to not include numbers, wide keys, and modifiers in the flexible mapping.
    I want to focus this app on mapping characters, especially letters and those punctuation characters that are
    just as frequent as the most frequent letters.
    I wouldn't even bother with changing punctuation at all if the Harmonic layout didn't penalize the ancient
    Qwerty postions of TYB so much. The Harmonic layout simply needs to make use of all the keys that are
    neighboring the eight home keys, so we need at least 12 keys in the home row to be in the flex mapping.
    We simply add some other keys to show sensible solutions for assigning punctuation keys whose typewriter position
    doesn't even exist on the Harmonic.
 */
const fullMapping: LayoutMapping = [
        ["Esc", "1", "2", "3", "4", "5", "6", 0, "7", "8", "9", "0", 1],
        ["↹", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "⌫"],
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        ["⇧", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "⇧"],
        ["Ctrl", "Cmd", "Alt", 0, "⍽", "⏎", 1, "AltGr", "Fn", "Ctrl"],
    ];

// This omits four rarely used punctuation keys and moves `=` and `-` to the home row.
// (`-` here is neighbor of a home-row key. Very fitting for the third most popular punctuation character!)
// Remember that the four punctuation keys `,.;/` are part of the flexMapping set.
const thirtyKeyMappingWithNavKeys: LayoutMapping = [
        ["Esc", "1", "2", "3", "4", "5", "6", "⇤", "7", "8", "9", "0", "⇥"],
        ["↹", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "⌫"],
        ["-", 0, 1, 2, 3, 4, "=", 5, 6, 7, 8, 9, "'"],
        ["⇧", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "⇧"],
        ["Ctrl", "Cmd", "Alt", "PgUp", "⍽", "⏎", "PgDn", "AltGr", "Fn", "Ctrl"],
    ];

const thirtyKeyMapping: LayoutMapping = [
        ["Esc", "1", "2", "3", "4", "5", "6", "-", "7", "8", "9", "0", "="],
        ["↹", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "⌫"],
        ["`", 0, 1, 2, 3, 4, "\\", 5, 6, 7, 8, 9, "'"],
        // The move of key 9 to the middle is a change required to keep the key-to-finger assignments the same as on the ANSI layout.
        // This is caused by moving the right home row to the right where the Enter key is removed.
        // But below, Shift is still there.
        ["⇧", 0, 1, 2, 3, 4, 9, 5, 6, 7, 8, "⇧"],
        ["Ctrl", "Cmd", "Alt", "[", "⍽", "⏎", "]", "AltGr", "Fn", "Ctrl"],
    ];

export interface HarmonicLayoutOptionsModel {
    navKeys: boolean;
}

export const defaultHarmonicLayoutOptions: HarmonicLayoutOptionsModel = {
    navKeys: false,
}

export const harmonicLayoutModel: RowBasedLayoutModel = {
    mapping30keys: thirtyKeyMapping,
    fullMapping,

    // move the whole keyboard one key to the right to align with the ANSI center.
    rowStart: (row: number) =>
        (row == KeyboardRows.Bottom) ? 0.5 : 0,

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
    splitColumns: [7, 6, 6, 6, 5],

    leftHomeIndex: 4,
    rightHomeIndex: 8,

    mainFingerAssignment: [
        [1, 1, 2, 2, 3, 3, 6, 6, 6, 7, 7, 8, 8],
        [0, 1, 2, 3, 3, 3, 6, 6, 6, 7, 8, 9],
        [0, 0, 1, 2, 3, 3, 6, 6, 6, 7, 8, 9, 9],
        [0, 1, 2, 3, 3, 3, 6, 6, 6, 7, 8, 9],
        [0, 1, 2, 4, 4, 5, 5, 7, 8, 9],
    ]
}

export const harmonicLayoutModelWithNavKeys = {
    ...harmonicLayoutModel,
    mapping30keys: thirtyKeyMappingWithNavKeys,
}