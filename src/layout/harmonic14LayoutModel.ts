import {FlexMapping, KeyboardRows, LayoutMapping, RowBasedLayoutModel} from "../base-model.ts";

/*
    Harmonic 14 has a total width of 14u and two rows of that width with 3 rows losing one key due to staggering.
    (Plus keys lost for creating larger Shift, Space, and Ctrl. See below.)

    Decision: H14 and H13c use a different format of FlexMapping, so that different gaps in the letter/punctuation
    pattern can be used for pair-wise positioned nav-keys. Both can do that in different places.
 */
const fullMapping: LayoutMapping = [
    ["Esc", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", 0, "⌫"], // 13 keys
    ["↹", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], // 14 keys
    ["¤", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, "⏎"], // 13 keys
    ["⇧", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "⇧"], // 12 keys, due to 2u Shift keys.
    // 10 keys due to 6×1.5u for 2×Space, Cmd/Fn, and 2×Ctrl, plus 0.5 chamfer at the edge.
    ["Ctrl", "Cmd", "Alt", 0, "⍽", 1, 2, "AltGr", "Fn", "Ctrl"],
];

export const harmonic14LayoutModel: RowBasedLayoutModel = {
    name: "Harmonic Rows",
    description: "The Harmonic keyboard layout has a fully symmetric keyboard with only two key sizes to allow for flexible changes to the key mapping. " +
        "Its regular row stagger allows for many keys to be comfortably typed by two fingers, " +
        "which let's you intuitively avoid the awkward same-finger bigrams that make new key mappings feel so awkward. " +
        "Using mostly square keys makes the board slightly narrower than an ANSI-based 60% keyboard, " +
        "yet the hand home position is one key further apart, allowing for arms to relax and shoulders to open. " +
        "This also puts a bit of typing load on the index fingers and less on the pinkies. ",

    thirtyKeyMapping: [
        ["Esc", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "=", "⌫"], // 13 keys
        ["↹", 0, 1, 2, 3, 4, "`", 5, 6, 7, 8, 9, "'", "\\"], // 14 keys
        ["¤", 0, 1, 2, 3, 4, "-", 5, 6, 7, 8, 9, "⏎"], // 13 keys
        // The move of key 9 to the middle is a change required to keep the key-to-finger assignments
        // the same as on the ANSI layout. This is caused by moving the right home row to the right.
        ["⇧", 0, 1, 2, 3, 4, 9, 5, 6, 7, 8, "⇧"], // 12 keys
        ["Ctrl", "Cmd", "Alt", "[", "⌦", "⍽", "]", "AltGr", "Fn", "Ctrl"], // 10 keys
    ],
    fullMapping,

    // move the whole keyboard one key to the right to align with the ANSI center.
    rowStart: (row: number) => (row == KeyboardRows.Bottom) ? 0.5 : 0,

    keyWidth: (row: number, col: number) => {
        // outer edge keys
        if ((row == KeyboardRows.Number || row == KeyboardRows.Home || row == KeyboardRows.Bottom) &&
            (col == 0 || col == fullMapping[row].length - 1)) return 1.5;
        // Shift
        if (row == KeyboardRows.Lower && (col == 0 || col == fullMapping[row].length - 1)) return 2;
        // space and the other space
        if (row == KeyboardRows.Bottom && (col == 4 || col == 5)) return 1.5;
        // Cmd/Fn
        if (row == KeyboardRows.Bottom && (col == 1 || col == fullMapping[row].length - 2)) return 1.5;
        // all others
        return 1;
    },

    // You'll notice that it's the same as in ANSI, making it easy to use both.
    splitColumns: [7, 7, 6, 6, 5],

    leftHomeIndex: 4,
    rightHomeIndex: 8,

    mainFingerAssignment: [
        [1, 1, 2, 2, 3, 3, 3, 6, 6, 7, 7, 8, 8],
        [1, 0, 1, 1, 2, 3, 3, 6, 6, 7, 8, 8, 9, 8],
        [0, 0, 1, 2, 3, 3, 6, 6, 6, 7, 8, 9, 9],
        [0, 1, 2, 3, 3, 3, 6, 6, 6, 7, 8, 9],
        [0, 1, 2, 4, 4, 5, 5, 7, 8, 9],
    ],

    hasAltFinger: (row: number, col: number) =>
        (row == KeyboardRows.Upper || row == KeyboardRows.Lower) &&
        ([1, 2, 3, 9, 10, 11].includes(col)),

    singleKeyEffort: [
        [NaN, 3, 2, 2, 2, 3, 3, 3, 2, 2, 2, 3, NaN],
        [NaN, 1.5, 1.5, 1, 1, 1.5, 3, 3, 1.5, 1, 1, 1.5, 1.5, 3],
        [NaN, 0.2, 0.2, 0.2, 0.2, 2, 3, 2, 0.2, 0.2, 0.2, 0.2, NaN],
        [NaN, 1.5, 1.5, 1.5, 1.5, 3, 3, 1.5, 1.5, 1.5, 1.5, NaN],
        [NaN, NaN, NaN, 1.0, 0.2, 1.0, 0.2, NaN, NaN, NaN],
    ],

    getSpecificMapping: (flexMapping: FlexMapping) => flexMapping.mappingHarmonic,
}
