import {FlexMapping, KeyboardRows, LayoutMapping, RowBasedLayoutModel} from "../base-model.ts";

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
    ["Esc", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", 0, 1],
    ["↹", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "⌫"],
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    ["⇧", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "⇧"],
    ["Ctrl", "Cmd", "Alt", 0, "⍽", "⏎", 1, "AltGr", "Fn", "Ctrl"],
];

// This omits four rarely used punctuation keys and moves `=` and `-` to the home row.
// (`-` here is neighbor of a home-row key. Very fitting for the third most popular punctuation character!)
// Remember that the four punctuation keys `,.;/` are part of the flexMapping set.
const thirtyKeyMappingWithNavKeys: LayoutMapping = [
    ["Esc", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "⇤", "⇥"],
    ["↹", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "⌫"],
    ["-", 0, 1, 2, 3, 4, "=", 5, 6, 7, 8, 9, "'"],
    ["⇧", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "⇧"],
    ["Ctrl", "Cmd", "Alt", "PgUp", "⍽", "⏎", "PgDn", "AltGr", "Fn", "Ctrl"],
];

const thirtyKeyMapping: LayoutMapping = [
    ["Esc", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "="],
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

export const harmonicLayoutModel: RowBasedLayoutModel = {
    name: "Harmonic Rows",
    description: "The Harmonic keyboard layout has a fully symmetric keyboard with only two key sizes to allow for flexible changes to the key mapping. " +
        "Its regular row stagger allows for many keys to be comfortably typed by two fingers, " +
        "which let's you intuitively avoid the awkward same-finger bigrams that make new key mappings feel so awkward. " +
        "Using mostly square keys makes the board slightly narrower than an ANSI-based 60% keyboard, " +
        "yet the hand home position is one key further apart, allowing for arms to relax and shoulders to open. " +
        "This also puts a bit of typing load on the index fingers and less on the pinkies. ",

    thirtyKeyMapping,
    fullMapping,

    // move the whole keyboard one key to the right to align with the ANSI center.
    rowStart: (row: number) => (row == KeyboardRows.Bottom) ? 0.5 : 0,

    keyWidth: (row: number, col: number) => {
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
        [0, 1, 1, 2, 3, 3, 6, 6, 7, 8, 8, 9],
        [0, 0, 1, 2, 3, 3, 6, 6, 6, 7, 8, 9, 9],
        [0, 1, 2, 3, 3, 3, 6, 6, 6, 7, 8, 9],
        [0, 1, 2, 4, 4, 5, 5, 7, 8, 9],
    ],

    hasAltFinger: (row: number, col: number) =>
        (row == KeyboardRows.Upper || row == KeyboardRows.Lower) &&
        ([1, 2, 3, 8, 9, 10].includes(col)),

    singleKeyEffort: [
        [3, 3, 2, 2, 2, 3, 3, 3, 2, 2, 2, 3, 3],
        [NaN, 1.5, 1, 1, 1.5, 3, 3, 1.5, 1, 1, 1.5, NaN],
        [1.5, 0.2, 0.2, 0.2, 0.2, 2, 3, 2, 0.2, 0.2, 0.2, 0.2, 1.5],
        [NaN, 1.5, 1.5, 1.5, 1.5, 3, 3, 1.5, 1.5, 1.5, 1.5, NaN],
        [NaN, NaN, NaN, 1.0, 0.2, 1.0, 0.2, NaN, NaN, NaN],
    ],

    getSpecificMapping: (flexMapping: FlexMapping) => flexMapping.mappingHarmonic,
}

export const harmonicLayoutModelWithNavKeys = {
    ...harmonicLayoutModel,
    mapping30keys: thirtyKeyMappingWithNavKeys,
}