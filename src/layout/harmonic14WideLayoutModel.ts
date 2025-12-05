import {
    FlexMapping,
    harmonicStaggerOffsets,
    KeyboardRows,
    KeymapTypeId,
    LayoutMapping,
    RowBasedLayoutModel
} from "../base-model.ts";
import {mirror, MonotonicKeyWidth} from "./keyWidth.ts";

const keyWidths = new MonotonicKeyWidth(14, [0, 0, 0, 0, 0.5], "H14W");

export const harmonic14WideLayoutModel: RowBasedLayoutModel = {
    name: "Harmonic 14 Macro",
    description: "Our biggest Harmonic variant, which has a lot of extra keys to use for navigation and other things. " +
        "The Harmonic keyboard layout has a fully symmetric keyboard with only two key sizes to allow for flexible changes to the key mapping. " +
        "Its regular row stagger allows for many keys to be comfortably typed by two fingers, " +
        "which let's you intuitively avoid the awkward same-finger bigrams that make new key mappings feel so awkward. " +
        "Using mostly square keys makes the board slightly narrower than an ANSI-based 60% keyboard, " +
        "yet the hand home position is one key further apart, allowing for arms to relax and shoulders to open. " +
        "This also puts a bit of typing load on the index fingers and less on the pinkies. ",

    rowIndent: keyWidths.rowIndent,

    keyWidths: [
        keyWidths.row(0, 1),
        keyWidths.row(1, 1.5),
        keyWidths.row(2, 1),
        keyWidths.row(3, 1.5),
        mirror(1.5, 1, 1, 1, 2),
    ],
    // You'll notice that it's the same as in ANSI, making it easy to use both.
    splitColumns: [7, 6, 7, 7, 5],

    leftHomeIndex: 4,
    rightHomeIndex: 9,

    staggerOffsets: harmonicStaggerOffsets,
    symmetricStagger: true,

    supportedKeymapTypes: [
        {
            typeId: KeymapTypeId.Ansi30,
            frameMapping: [
                ["Esc", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "`"], // 14 keys
                ["↹", 1, 2, 3, 4, "[", "]", 5, 6, 7, 8, 9, "⌫"], // 13 keys
                [[-1, 0], 0, 1, 2, 3, 4, "⇤", "⇥", 5, 6, 7, 8, 9, "'"], // 14 keys
                // The move of key 9 to the middle is a change required to keep the key-to-finger assignments
                // the same as on the ANSI layout. This is caused by moving the right home row to the right.
                ["⇧", 0, 1, 2, 3, 4, "\\", 9, 5, 6, 7, 8, "⇧"], // 13 keys
                ["Ctrl", "Cmd", "Alt", "⌦", "⍽", "⏎", "AltGr", "Menu", "Fn", "Ctrl"], // 10 keys
            ]
        },
        {
            typeId: KeymapTypeId.Thumb30,
            frameMapping: [
                ["Esc", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "=", "`", ""], // 14 keys
                ["↹", 1, 2, 3, 4, "[", "]", 5, 6, 7, 8, 9, "⌫"], // 13 keys
                [[-1, 0], 0, 1, 2, 3, 4, "⇤", "⇥", 5, 6, 7, 8, 9, "'"], // 14 keys
                ["⇧", 0, 1, 2, 3, 4, "\\", "/", 5, 6, 7, 8, "⇧"], // 13 keys
                ["Ctrl", "Cmd", "Alt", "⌦", "⍽", "⏎", 0, "AltGr", "Fn", "Ctrl"], // 10 keys
            ]
        },
    ],

    mainFingerAssignment: [
        [1, 1, 1, 2, 2, 3, 3, 6, 6, 7, 7, 8, 8, 8],
        [1, 0, 1, 2, 3, 3, 6, 6, 6, 7, 8, 8, 9],
        [0, 0, 1, 2, 3, 3, 3, 6, 6, 6, 7, 8, 9, 9],
        [0, 1, 2, 3, 3, 3, 3, 6, 6, 6, 7, 8, 9],
        [0, 1, 2, 4, 4, 5, 5, 7, 8, 9],
    ],

    // TODO: fix
    hasAltFinger: (row: number, col: number) =>
        (row === KeyboardRows.Upper || row === KeyboardRows.Lower) &&
        ([1, 2, 3, 9, 10, 11].includes(col)),

    singleKeyEffort: [
        [NaN, 3.0, 2.0, 2.0, 2.0, 3.0, 3.0, 3.0, 3.0, 2.0, 2.0, 2.0, 3.0, 3.0],
        [1.5, 1.5, 1.0, 1.0, 1.5, 2.0, 3.0, 2.0, 1.5, 1.0, 1.0, 1.5, 1.5],
        [1.0, 0.2, 0.2, 0.2, 0.2, 2.0, 3.0, 3.0, 2.0, 0.2, 0.2, 0.2, 0.2, 1.0],
        [1.0, 1.5, 1.5, 1.0, 1.5, 3.0, 3.0, 3.0, 1.5, 1.0, 1.5, 1.5, 1.0],
        [NaN, NaN, 1.5, 1.0, 0.2, 0.2, 1.0, 1.5, NaN, NaN],
    ],
}
