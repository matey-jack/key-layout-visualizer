import {FlexMapping, harmonicStaggerOffsets, KeyboardRows, LayoutMapping, RowBasedLayoutModel} from "../base-model.ts";

/*
    Harmonic 14 has a total width of 14u and two rows of that width with 3 rows losing one key due to staggering.
    (Plus keys lost for creating larger Shift, Space, and Ctrl. See below.)

    Decision: H14 and H13c use a different format of FlexMapping, so that different gaps in the letter/punctuation
    pattern can be used for pair-wise positioned nav-keys. Both can do that in different places.

    TODO: can we devise a data model for describing the bottom row which allows specifying different form-factors
     as options such that finger assignment and key effort will automatically be filled?
 */
const fullMapping: LayoutMapping = [
    ["Esc", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", 0, "⌫"], // 13 keys
    ["↹", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], // 14 keys
    ["¤", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, "⏎"], // 13 keys
    ["⇧", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "⇧"], // 12 keys, due to 2u Shift keys.
    // 1×3u space, 2×4×1u, 2×1.5u at the end (take up stagger), makes 1+10 keys.
    ["Ctrl", "Cmd", "Alt", 0, "⌦", "⍽", 1, 2, 3, "Fn", "Ctrl"],
]; // total of 63 keys, compared to 62 in the Harmonic 13. (Another bottom bar config could yield one or two more ;-). )

export const harmonic14LayoutModel: RowBasedLayoutModel = {
    name: "Harmonic 14/Traditional",
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
        ["Ctrl", "Cmd", "Alt", "[", "⌦", "⍽", "AltGr", "]", "Menu", "Fn", "Ctrl"], // 10 keys
    ],
    thumb30KeyMapping: [
        ["Esc", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "`", "⌫"], // 13 keys
        ["↹", 0, 1, 2, 3, 4, "=", 5, 6, 7, 8, 9, "'", "\\"], // 14 keys
        ["¤", 0, 1, 2, 3, 4, "[", 5, 6, 7, 8, 9, "⏎"], // 13 keys
        ["⇧", 0, 1, 2, 3, 4, "]", 5, 6, 7, 8, "⇧"], // 12 keys
        ["Ctrl", "Cmd", "Alt", "/", "⌦", "⍽", 0, "AltGr", "Menu", "Fn", "Ctrl"], // 10 keys
    ],
    fullMapping,

    rowStart: (_: number) => 0,

    keyWidth: (row: number, col: number) => {
        // outer edge keys
        if ((row == KeyboardRows.Number || row == KeyboardRows.Home) &&
            (col == 0 || col == fullMapping[row].length - 1)) return 1.5;
        // Shift
        if (row == KeyboardRows.Lower && (col == 0 || col == fullMapping[row].length - 1)) return 2;
        // space and the other space
        if (row == KeyboardRows.Bottom) return [1.5, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1.5][col];
        return 1;
    },

    // You'll notice that it's the same as in ANSI, making it easy to use both.
    splitColumns: [7, 7, 6, 6, 5],

    leftHomeIndex: 4,
    rightHomeIndex: 8,

    staggerOffsets: harmonicStaggerOffsets,

    mainFingerAssignment: [
        [1, 1, 2, 2, 3, 3, 3, 6, 6, 7, 7, 8, 8],
        [1, 0, 1, 1, 2, 3, 3, 6, 6, 7, 8, 8, 9, 8],
        [0, 0, 1, 2, 3, 3, 6, 6, 6, 7, 8, 9, 9],
        [0, 1, 2, 3, 3, 3, 6, 6, 6, 7, 8, 9],
        [0, 1, 2, 2, 4, 5, 5, 7, 7, 8, 9],
    ],

    hasAltFinger: (row: number, col: number) =>
        (row == KeyboardRows.Upper || row == KeyboardRows.Lower) &&
        ([1, 2, 3, 9, 10, 11].includes(col)),

    singleKeyEffort: [
        [NaN, 3.0, 2.0, 2.0, 2.0, 3.0, 3.0, 3.0, 2.0, 2.0, 2.0, 3.0, NaN],
        [3.0, 1.5, 1.5, 1.0, 1.0, 1.5, 2.0, 2.0, 1.5, 1.0, 1.0, 1.5, 1.5, 3.0],
        [1.0, 0.2, 0.2, 0.2, 0.2, 2.0, 3.0, 2.0, 0.2, 0.2, 0.2, 0.2, 1.0],
        [1.0, 1.5, 1.5, 1.0, 1.5, 3.0, 3.0, 1.5, 1.0, 1.5, 1.5, 1.0],
        [NaN, NaN, 1.5, 1.0, 0.2, 1.0, 0.2, 1.0, 1.5, NaN, NaN],
    ],

    getSpecificMapping: (f: FlexMapping) => f.mappingHarmonic14t,
}
