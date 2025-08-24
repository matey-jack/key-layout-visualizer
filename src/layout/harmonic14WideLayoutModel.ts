import {FlexMapping, harmonicStaggerOffsets, KeyboardRows, LayoutMapping, RowBasedLayoutModel} from "../base-model.ts";

const fullMapping: LayoutMapping = [
    ["Esc", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", 0, 1, 2], // 14 keys
    ["↹", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, "⌫"], // 13 keys
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], // 14 keys
    ["⇧", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, "⇧"], // 13 keys
    // 2×(2u space/enter, 3×1u, 1.5u at the + 0.5u chamfer), makes 2×5=10 keys.
    ["Ctrl", "Cmd", "Alt", 0, "⍽", "⏎", 1, 2, "Fn", "Ctrl"],
]; // total of 63 keys, compared to 62 in the Harmonic 13. (Another bottom bar config could yield one or two more ;-). )

export const harmonic14WideLayoutModel: RowBasedLayoutModel = {
    name: "Harmonic 14 Macro",
    description: "Our biggest Harmonic variant, which has a lot of extra keys to use for navigation and other things. " +
        "The Harmonic keyboard layout has a fully symmetric keyboard with only two key sizes to allow for flexible changes to the key mapping. " +
        "Its regular row stagger allows for many keys to be comfortably typed by two fingers, " +
        "which let's you intuitively avoid the awkward same-finger bigrams that make new key mappings feel so awkward. " +
        "Using mostly square keys makes the board slightly narrower than an ANSI-based 60% keyboard, " +
        "yet the hand home position is one key further apart, allowing for arms to relax and shoulders to open. " +
        "This also puts a bit of typing load on the index fingers and less on the pinkies. ",

    thirtyKeyMapping: [
        ["Esc", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "`"], // 14 keys
        ["↹", 1, 2, 3, 4, "[", "]", 5, 6, 7, 8, 9, "⌫"], // 13 keys
        [[-1, 0], 0, 1, 2, 3, 4, "⇤", "⇥", 5, 6, 7, 8, 9, "'"], // 14 keys
        // The move of key 9 to the middle is a change required to keep the key-to-finger assignments
        // the same as on the ANSI layout. This is caused by moving the right home row to the right.
        ["⇧", 0, 1, 2, 3, 4, "\\", 9, 5, 6, 7, 8, "⇧"], // 13 keys
        ["Ctrl", "Cmd", "Alt", "⌦", "⍽", "⏎", "AltGr", "Menu", "Fn", "Ctrl"], // 10 keys
    ],
    // TODO
    thumb30KeyMapping: [
        ["Esc", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "=", "`", ""], // 14 keys
        ["↹", 1, 2, 3, 4, "[", "]", 5, 6, 7, 8, 9, "⌫"], // 13 keys
        [[-1, 0], 0, 1, 2, 3, 4, "⇤", "⇥", 5, 6, 7, 8, 9, "'"], // 14 keys
        ["⇧", 0, 1, 2, 3, 4, "\\", "/", 5, 6, 7, 8, "⇧"], // 13 keys
        ["Ctrl", "Cmd", "Alt", "⌦", "⍽", "⏎", 0, "AltGr", "Fn", "Ctrl"], // 10 keys
    ],
    fullMapping,

    rowStart: (row: number) => row == KeyboardRows.Bottom ? 0.5 : 0,

    keyWidth: (row: number, col: number) => {
        // outer edge keys
        if ((row == KeyboardRows.Upper || row == KeyboardRows.Lower || row == KeyboardRows.Bottom) &&
            (col == 0 || col == fullMapping[row].length - 1)) return 1.5;
        // space and enter
        if (row == KeyboardRows.Bottom && (col == 4 || col == 5)) return 2;
        // all others
        return 1;
    },

    // You'll notice that it's the same as in ANSI, making it easy to use both.
    splitColumns: [7, 6, 7, 7, 5],

    leftHomeIndex: 4,
    rightHomeIndex: 9,

    staggerOffsets: harmonicStaggerOffsets,

    mainFingerAssignment: [
        [1, 1, 1, 2, 2, 3, 3, 6, 6, 7, 7, 8, 8, 8],
        [1, 0, 1, 2, 3, 3, 6, 6, 6, 7, 8, 8, 9],
        [0, 0, 1, 2, 3, 3, 3, 6, 6, 6, 7, 8, 9, 9],
        [0, 1, 2, 3, 3, 3, 3, 6, 6, 6, 7, 8, 9],
        [0, 1, 2, 4, 4, 5, 5, 7, 8, 9],
    ],

    // TODO: fix
    hasAltFinger: (row: number, col: number) =>
        (row == KeyboardRows.Upper || row == KeyboardRows.Lower) &&
        ([1, 2, 3, 9, 10, 11].includes(col)),

    singleKeyEffort: [
        [NaN, 3.0, 2.0, 2.0, 2.0, 3.0, 3.0, 3.0, 3.0, 2.0, 2.0, 2.0, 3.0, 3.0],
        [1.5, 1.5, 1.0, 1.0, 1.5, 2.0, 3.0, 2.0, 1.5, 1.0, 1.0, 1.5, 1.5],
        [1.0, 0.2, 0.2, 0.2, 0.2, 2.0, 3.0, 3.0, 2.0, 0.2, 0.2, 0.2, 0.2, 1.0],
        [1.0, 1.5, 1.5, 1.0, 1.5, 3.0, 3.0, 3.0, 1.5, 1.0, 1.5, 1.5, 1.0],
        [NaN, NaN, 1.5, 1.0, 0.2, 0.2, 1.0, 1.5, NaN, NaN],
    ],

    getSpecificMapping: (_f: FlexMapping) => undefined,
}
