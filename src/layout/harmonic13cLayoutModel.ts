import {FlexMapping, KeyboardRows, LayoutMapping, RowBasedLayoutModel} from "../base-model.ts";

const fullMapping: LayoutMapping = [
    ["Esc", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", 0, 1], // 13 keys
    ["↹", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "⌫"], // 12 keys
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], // 13 keys
    ["⇧", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "⇧"], // 12 keys
    ["Ctrl", "Cmd", "Alt", 0, "⍽", "⏎", 1, "AltGr", "Fn", "Ctrl"], // 10 keys
];

export const harmonic13cLayoutModel: RowBasedLayoutModel = {
    name: "Harmonic 13/3",
    description: "The Harmonic keyboard layout has a fully symmetric keyboard with only two key sizes to allow for flexible changes to the key mapping. " +
        "Its regular row stagger allows for many keys to be comfortably typed by two fingers, " +
        "which let's you intuitively avoid the awkward same-finger bigrams that make new key mappings feel so awkward. " +
        "Using mostly square keys makes the board slightly narrower than an ANSI-based 60% keyboard, " +
        "yet the hand home position is one key further apart, allowing for arms to relax and shoulders to open. " +
        "This also puts a bit of typing load on the index fingers and less on the pinkies. ",

    thirtyKeyMapping: [
        ["Esc", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "="],
        // By moving the left-most letter from the upper row to the left-most key of the center row,
        // we keep the relative-to-home position of the other keys as on ANSI.
        // (And the moved letter has a very similar movement (left instead of up-left) on the same finger.)
        ["↹", 1, 2, 3, 4, "`", 5, 6, 7, 8, 9, "⌫"],
        [[-1, 0], 0, 1, 2, 3, 4, "\\", 5, 6, 7, 8, 9, "'"],
        // The move of key 9 to the middle is a change required to keep the key-to-finger assignments the same as on the ANSI layout.
        // This is caused by moving the right home row to the right where the Enter key is removed.
        // But below, Shift is still there.
        ["⇧", 0, 1, 2, 3, 4, 9, 5, 6, 7, 8, "⇧"],
        ["Ctrl", "Cmd", "Alt", "[", "⍽", "⏎", "]", "AltGr", "Fn", "Ctrl"],
    ],
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
        [1, 1, 2, 2, 3, 3, 3, 6, 6, 7, 7, 8, 8],
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

    getSpecificMapping: (flexMapping: FlexMapping) => flexMapping.mappingHarmonic13c,
}

// NOT USED IN APP YET
// This omits four rarely used punctuation keys and moves `=` and `-` to the home row.
// (`-` here is neighbor of a home-row key. Very fitting for the third most popular punctuation character!)
// Remember that the four punctuation keys `,.;/` are part of the flexMapping set.
export const harmonicLayoutModelWithNavKeys = {
    ...harmonic13cLayoutModel,
    mapping30keys: [
        ["Esc", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "⇤", "⇥"],
        ["↹", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "⌫"],
        ["-", 0, 1, 2, 3, 4, "=", 5, 6, 7, 8, 9, "'"],
        ["⇧", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "⇧"],
        ["Ctrl", "Cmd", "Alt", "PgUp", "⍽", "⏎", "PgDn", "AltGr", "Fn", "Ctrl"],
    ],
}