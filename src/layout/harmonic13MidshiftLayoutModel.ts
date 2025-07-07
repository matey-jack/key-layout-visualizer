import {FlexMapping, KeyboardRows, LayoutMapping, RowBasedLayoutModel} from "../base-model.ts";

const fullMapping: LayoutMapping = [
    ["Esc", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "⌫"], // 12 keys
    ["↹", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], // 13 keys
    ["⇧", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "⇧"], // 12 keys
    ["⇤", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, "⇥"], // 13 keys
    // Let's put 3×1.5u keys per side; two in the middle to keep the staggering.
    // The outside 1.5u keys come free from the stagger.
    // Thus, we have 10 keys left.
    ["Ctrl", "Cmd", "Alt", 0, "⍽", "⏎", 1, "AltGr", "Fn", "Ctrl"],
];

export const harmonic13MidShiftLayoutModel: RowBasedLayoutModel = {
    name: "Harmonic 13 MidShift",
    description: "The Harmonic keyboard layout has a fully symmetric keyboard with only two key sizes to allow for flexible changes to the key mapping. " +
        "Its regular row stagger allows for many keys to be comfortably typed by two fingers, " +
        "which let's you intuitively avoid the awkward same-finger bigrams that make new key mappings feel so awkward. " +
        "Using mostly square keys makes the board slightly narrower than an ANSI-based 60% keyboard, " +
        "yet the hand home position is one key further apart, allowing for arms to relax and shoulders to open. " +
        "This also puts a bit of typing load on the index fingers and less on the pinkies. ",

    thirtyKeyMapping: [
        ["Esc", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "⌫"],
        ["↹", 0, 1, 2, 3, 4, "-", 5, 6, 7, 8, 9, "'"],
        ["⇧", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "⇧"],
        // The move of key 9 to the middle is a change required to keep the key-to-finger assignments the same as on the ANSI layout.
        // This is caused by moving the right home row to the right where the Enter key is removed.
        // But below, Shift is still there.
        ["⇤", 0, 1, 2, 3, 4, "=", 5, 6, 7, 8, 9, "⇥"],
        ["Ctrl", "Cmd", "Alt", "[", "⍽", "⏎", "]", "AltGr", "Fn", "Ctrl"],
    ],
    fullMapping,

    // move the whole keyboard one key to the right to align with the ANSI center.
    rowStart: (_row: number) => 0,

    keyWidth: (row: number, col: number) => {
        // outer edge keys
        if ((row == KeyboardRows.Number || row == KeyboardRows.Home || row == KeyboardRows.Bottom) &&
            (col == 0 || col == fullMapping[row].length - 1)) return 1.5;
        // space and enter and neigboring keys
        if (row == KeyboardRows.Bottom && ([3, 4, 5, 6].includes(col))) return 1.5;
        // all others
        return 1;
    },

    splitColumns: [7, 6, 6, 6, 5],

    leftHomeIndex: 4,
    rightHomeIndex: 8,

    mainFingerAssignment: [
        [1, 1, 2, 2, 3, 3, 6, 6, 7, 7, 8, 8],
        [1, 0, 1, 2, 3, 3, 6, 6, 6, 7, 8, 9, 8],
        [0, 0, 1, 2, 3, 3, 6, 6, 7, 8, 9, 9],
        [0, 0, 1, 2, 3, 3, 6, 6, 6, 7, 8, 9, 9],
        [0, 1, 2, 4, 4, 5, 5, 7, 8, 9],
    ],

    hasAltFinger: (row: number, col: number) =>
        (row == KeyboardRows.Upper || row == KeyboardRows.Lower) &&
        ([1, 2, 3, 8, 9, 10].includes(col)),

    singleKeyEffort: [
        [3, 3, 2, 2, 2, 3, 3, 2, 2, 2, 3, 3],
        [NaN, 1.5, 1.5, 1, 1, 1.5, 3, 1.5, 1, 1, 1.5, 1.5, 3],
        [1.5, 0.2, 0.2, 0.2, 0.2, 2, 2, 0.2, 0.2, 0.2, 0.2, 1.5],
        [3, 1.5, 1.5, 1.5, 1, 1.5, 3, 1.5, 1, 1.5, 1.5, 1.5, 3],
        [NaN, NaN, NaN, 1.0, 0.2, 0.2, 1.0, NaN, NaN, NaN],
    ],

    getSpecificMapping: (flexMapping: FlexMapping) => flexMapping.mappingHarmonic13MS,
}
