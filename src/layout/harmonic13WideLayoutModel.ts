import {
    harmonicStaggerOffsets,
    KeyboardRows,
    KeymapTypeId,
    type LayoutMapping,
    type RowBasedLayoutModel,
} from "../base-model.ts";
import {mirror, MonotonicKeyWidth} from "./keyWidth.ts";

const fullMapping: LayoutMapping = [
    ["Esc", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", 0, 1], // 13 keys
    ["↹", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "⌫"], // 12 keys
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], // 13 keys
    ["⇧", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "⇧"], // 12 keys
    ["Ctrl", "Cmd", "Alt", 0, "⍽", "⏎", 1, "AltGr", "Fn", "Ctrl"], // 10 keys
];

const h13wKeyWidth = new MonotonicKeyWidth(13, [0, 0, 0, 0, 0.5], "H13T");

export const harmonic13WideLayoutModel: RowBasedLayoutModel = {
    name: "Harmonic 13 Balance",
    description: "The Harmonic keyboard layout has a fully symmetric keyboard with only two key sizes to allow for flexible changes to the key mapping. " +
        "Its regular row stagger allows for many keys to be comfortably typed by two fingers, " +
        "which let's you intuitively avoid the awkward same-finger bigrams that make new key mappings feel so awkward. " +
        "Using mostly square keys makes the board slightly narrower than an ANSI-based 60% keyboard, " +
        "yet the hand home position is one key further apart, allowing for arms to relax and shoulders to open. " +
        "This also puts a bit of typing load on the index fingers and less on the pinkies. ",

    rowIndent: h13wKeyWidth.rowIndent,

    keyWidths: [
        h13wKeyWidth.row(0, 1),
        h13wKeyWidth.row(1, 1.5),
        h13wKeyWidth.row(2, 1),
        h13wKeyWidth.row(3, 1.5),
        mirror(1.5, 1, 1, 1, 1.5),
    ],
    // You'll notice that it's the same as in ANSI, making it easy to use both.
    splitColumns: [7, 6, 6, 6, 5],

    leftHomeIndex: 4,
    rightHomeIndex: 8,

    staggerOffsets: harmonicStaggerOffsets,
    symmetricStagger: true,

    supportedKeymapTypes: [
        { typeId: KeymapTypeId.Harmonic13Wide, frameMapping: fullMapping },
        {
            typeId: KeymapTypeId.Ansi30,
            frameMapping: [
                ["Esc", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "="],
                // By moving the left-most letter from the upper row to the left-most key of the center row,
                // we keep the relative-to-home position of the other keys as on ANSI.
                // (And the moved letter has a very similar movement (left instead of up-left) on the same finger.)
                ["↹", 1, 2, 3, 4, "`", 5, 6, 7, 8, 9, "⌫"],
                [[-1, 0], 0, 1, 2, 3, 4, "\\", 5, 6, 7, 8, 9, "'"],
                ["⇧", 0, 1, 2, 3, 4, 9, 5, 6, 7, 8, "⇧"],
                ["Ctrl", "Cmd", "Alt", "[", "⍽", "⏎", "]", "AltGr", "Fn", "Ctrl"],
            ]
        },
        { typeId: KeymapTypeId.Thumb30, frameMapping: [
            ["Esc", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "[", "]"],
            ["↹", 1, 2, 3, 4, "=", 5, 6, 7, 8, 9, "⌫"],
            [[-1, 0], 0, 1, 2, 3, 4, "`", 5, 6, 7, 8, 9, "'"],
            ["⇧", 0, 1, 2, 3, 4, "/", 5, 6, 7, 8, "⇧"],
            ["Ctrl", "Cmd", "Alt", "\\", "⍽", "⏎", 0, "AltGr", "Fn", "Ctrl"],
        ]},
    ],

    mainFingerAssignment: [
        [1, 1, 2, 2, 3, 3, 3, 6, 6, 7, 7, 8, 8],
        [0, 1, 1, 2, 3, 3, 6, 6, 7, 8, 8, 9],
        [0, 0, 1, 2, 3, 3, 6, 6, 6, 7, 8, 9, 9],
        [0, 1, 2, 3, 3, 3, 6, 6, 6, 7, 8, 9],
        [0, 1, 2, 4, 4, 5, 5, 7, 8, 9],
    ],

    hasAltFinger: (row: number, col: number) =>
        (row === KeyboardRows.Upper || row === KeyboardRows.Lower) &&
        ([1, 2, 3, 8, 9, 10].includes(col)),

    singleKeyEffort: [
        [3, 3, 2, 2, 2, 3, 3, 3, 2, 2, 2, 3, 3],
        [NaN, 1.5, 1, 1, 1.5, 2, 2, 1.5, 1, 1, 1.5, NaN],
        [1.5, 0.2, 0.2, 0.2, 0.2, 2, 3, 2, 0.2, 0.2, 0.2, 0.2, 1.5],
        [NaN, 1.5, 1.5, 1.5, 1.5, 3, 3, 1.5, 1.5, 1.5, 1.5, NaN],
        [NaN, NaN, NaN, 1.0, 0.2, 1.0, 0.2, NaN, NaN, NaN],
    ],
}

// NOT USED IN APP YET
// This omits four rarely used punctuation keys and moves `=` and `-` to the home row.
// (`-` here is neighbor of a home-row key. Very fitting for the third most popular punctuation character!)
// Remember that the four punctuation keys `,.;/` are part of the flexMapping set.
export const harmonicLayoutModelWithNavKeys = {
    ...harmonic13WideLayoutModel,
    mapping30keys: [
        ["Esc", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "⇤", "⇥"],
        ["↹", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "⌫"],
        ["-", 0, 1, 2, 3, 4, "=", 5, 6, 7, 8, 9, "'"],
        ["⇧", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "⇧"],
        ["Ctrl", "Cmd", "Alt", "PgUp", "⍽", "⏎", "PgDn", "AltGr", "Fn", "Ctrl"],
    ],
}
