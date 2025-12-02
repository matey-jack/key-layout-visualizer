import {
    FlexMapping,
    harmonicStaggerOffsets,
    KeyboardRows,
    KeymapTypeId,
    LayoutMapping,
    RowBasedLayoutModel
} from "../base-model.ts";
import {mirror, MonotonicKeyWidth, zeroIndent} from "./keyWidth.ts";

const fullMapping: LayoutMapping = [
    ["Esc", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", 0], // 12 keys
    ["↹", 0, 1, 2, 3, 4, 5, 6, 7, 8, "⌫"], // 11 keys
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], // 12 keys
    ["⇧", 0, 1, 2, 3, 4, 5, 6, 7, 8, "⇧"], // 11 keys
    ["Ctrl", "Cmd", "Alt", 0, "⍽", "⏎", 1, "AltGr", "Fn", "Ctrl"], // 10 keys
];

const h12KeyWidth = new MonotonicKeyWidth(12, zeroIndent, "H12");

export const harmonic12LayoutModel: RowBasedLayoutModel = {
    name: "Harmonic 12 Mini",
    description: "The smallest variant of the Harmonic keyboard family is especially useful for use with tablets, mobile phones, " +
        "or for people who mainly write plain English. But all ANSI punctuation is available on the AltGr layer. " +
        "Like all Harmonic keyboard variants it has a fully symmetric shape with only two key sizes " +
        "to allow for flexible changes to the key mapping. " +
        "Its regular row stagger allows for many keys to be comfortably typed by two fingers, " +
        "which let's you intuitively avoid the awkward same-finger bigrams that make new key mappings feel so awkward. " +
        "The H12 is three full key units narrower than an ANSI-based 60% keyboard, " +
        "yet has the same key dimensions and only 5 keys less. ",

    rowIndent: h12KeyWidth.rowIndent,

    keyWidths: [
        h12KeyWidth.row(KeyboardRows.Number, 1),
        h12KeyWidth.row(KeyboardRows.Upper, 1.5),
        h12KeyWidth.row(KeyboardRows.Home, 1),
        h12KeyWidth.row(KeyboardRows.Lower, 1.5),
        mirror(1.5, 1, 1, 1, 1.5),
    ],
    splitColumns: [6, 6, 6, 5, 5],

    leftHomeIndex: 4,
    rightHomeIndex: 7,

    staggerOffsets: harmonicStaggerOffsets,
    symmetricStagger: true,

    supportedKeymapTypes: [
        {typeId: KeymapTypeId.Harmonic12, frameMapping: fullMapping},
        {
            typeId: KeymapTypeId.Ansi30,
            frameMapping: [
                ["Esc", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "="], // 12
                ["↹", 1, 2, 3, 4, 5, 6, 7, 8, 9, "⌫"], // 11
                [[-1, 0], 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "'"], // 12
                ["⇧", 0, 1, 2, 3, 4, 5, 6, 7, 8, "⇧"], // 11
                ["Ctrl", "Cmd", "Alt", "-", "⍽", "⏎", [-1, 9], "AltGr", "Fn", "Ctrl"], // 10, with small control
            ]
        },
        {
            typeId: KeymapTypeId.Thumb30,
            frameMapping: [
                ["Esc", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "="], // 12
                ["↹", 1, 2, 3, 4, 5, 6, 7, 8, 9, "⌫"], // 11
                [[-1, 0], 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "'"], // 12
                ["⇧", 0, 1, 2, 3, 4, 5, 6, 7, 8, "⇧"], // 11
                ["Ctrl", "Cmd", "Alt", "/", "⍽", "⏎", 0, "AltGr", "Fn", "Ctrl"], // 10, with small control
            ]
        },
    ],

    mainFingerAssignment: [
        [1, 1, 2, 2, 3, 3, 6, 6, 7, 7, 8, 8],
        [0, 0, 1, 2, 3, 3, 6, 7, 8, 9, 9],
        [0, 0, 1, 2, 3, 3, 6, 6, 7, 8, 9, 9],
        [0, 1, 2, 3, 3, 6, 6, 6, 7, 8, 9],
        [0, 1, 2, 4, 4, 5, 5, 7, 8, 9],
    ],

    // TODO: fix for the layout and also add central column keys (they are all letters in this layout!)
    hasAltFinger: (row: number, col: number) =>
        (row == KeyboardRows.Upper || row == KeyboardRows.Lower) &&
        ([1, 2, 3, 8, 9, 10].includes(col)),

    singleKeyEffort: [
        [NaN, 3, 2, 2, 2, 3, 3, 2, 2, 2, 3, 3],
        [NaN, 1.5, 1, 1, 1.5, 2, 1.5, 1, 1, 1.5, NaN],
        [1.5, 0.2, 0.2, 0.2, 0.2, 2, 2, 0.2, 0.2, 0.2, 0.2, 1.5],
        [NaN, 1.5, 1.5, 1, 1.5, 3, 1.5, 1, 1.5, 1.5, NaN],
        [NaN, NaN, NaN, 1.0, 0.2, 0.2, 1.0, NaN, NaN, NaN],
    ],
}
