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
    ["Esc", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "⌫"], // 12 keys
    ["↹", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], // 13 keys
    ["⇧", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "⇧"], // 12 keys
    ["⇤", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, "⇥"], // 13 keys
    // Let's put 3×1.5u keys per side; two in the middle to keep the staggering.
    // The outside 1.5u keys come free from the stagger.
    // Thus, we have 10 keys left.
    ["Ctrl", "Cmd", "Alt", 0, "⍽", "⏎", 1, "AltGr", "Fn", "Ctrl"],
];

const h13msKeyWidth = new MonotonicKeyWidth(13, zeroIndent, "H13MS");

export const harmonic13MidshiftLayoutModel: RowBasedLayoutModel = {
    name: "Harmonic 13 MidShift",
    description: "The Harmonic MidShift variant will be interesting for all fans of the \"angle mod\" – " +
        "moving the left-bottom row one step to the left to type it with the same staggering angle as the right bottom. " +
        "The Harmonic MidShift solves the angle-mod dilemma of the far-away shift key by moving said key to the home row. " +
        "It is also an excellent choice for people who have set up their split ortho keyboards with home-row shift keys. " +
        "Generally, the Harmonic keyboard layout is fully symmetric with only two key sizes to allow for flexible changes to the key mapping. " +
        "Its regular row stagger allows for many keys to be comfortably typed by two fingers, " +
        "which let's you intuitively avoid the awkward same-finger bigrams that make new key mappings feel so awkward. " +
        "Using mostly square keys makes the board slightly narrower than an ANSI-based 60% keyboard, " +
        "yet the hand home position is one key further apart, allowing for arms to relax and shoulders to open. " +
        "This also puts a bit of typing load on the index fingers and less on the pinkies. ",

    rowIndent: h13msKeyWidth.rowIndent,

    keyWidths: [
        h13msKeyWidth.row(KeyboardRows.Number, 1.5),
        h13msKeyWidth.row(KeyboardRows.Upper, 1),
        h13msKeyWidth.row(KeyboardRows.Home, 1.5),
        h13msKeyWidth.row(KeyboardRows.Lower, 1),
        mirror(1.5, 1, 1, 1.5, 1.5),
    ],
    splitColumns: [6, 6, 6, 7, 5],

    leftHomeIndex: 4,
    rightHomeIndex: 7,

    staggerOffsets: harmonicStaggerOffsets,
    symmetricStagger: true,

    supportedKeymapTypes: [
        {typeId: KeymapTypeId.Harmonic13MS, frameMapping: fullMapping},
        {
            typeId: KeymapTypeId.Ansi30,
            frameMapping: [
                ["Esc", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "⌫"],
                ["↹", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "'", "="],
                ["⇧", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "⇧"],
                ["⇤", 0, 1, 2, 3, 4, "-", 5, 6, 7, 8, 9, "⇥"],
                ["Ctrl", "Cmd", "Alt", "[", "⍽", "⏎", "]", "AltGr", "Fn", "Ctrl"],
            ]
        },
        {
            typeId: KeymapTypeId.Thumb30,
            frameMapping: [
                ["Esc", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "⌫"],
                ["↹", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "'", "="],
                ["⇧", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "⇧"],
                ["⇤", 0, 1, 2, 3, 4, "\\", 5, 6, 7, 8, "/", "⇥"],
                ["Ctrl", "Cmd", "Alt", "`", "⍽", "⏎", 0, "AltGr", "Fn", "Ctrl"],
            ]
        },
    ],

    mainFingerAssignment: [
        [1, 1, 2, 2, 3, 3, 6, 6, 7, 7, 8, 8],
        [1, 0, 0, 1, 2, 3, 6, 6, 7, 8, 9, 9, 8],
        [0, 0, 1, 2, 3, 3, 6, 6, 7, 8, 9, 9],
        [0, 0, 1, 2, 3, 3, 3, 6, 6, 7, 8, 9, 9],
        [0, 1, 2, 4, 4, 5, 5, 7, 8, 9],
    ],

    // TODO: fix for the layout and also add central column keys (they are all letters in this layout!)
    hasAltFinger: (row: number, col: number) =>
        (row == KeyboardRows.Upper || row == KeyboardRows.Lower) &&
        ([1, 2, 3, 8, 9, 10].includes(col)),

    singleKeyEffort: [
        [NaN, 3.0, 2.0, 2.0, 2.0, 3.0, 3.0, 2.0, 2.0, 2.0, 3.0, NaN],
        [NaN, 1.5, 1.5, 1.0, 1.0, 1.5, 2.0, 1.5, 1.0, 1.0, 1.5, 1.5, 3],
        [NaN, 0.2, 0.2, 0.2, 0.2, 2.0, 2.0, 0.2, 0.2, 0.2, 0.2, NaN],
        [3.0, 1.5, 1.5, 1.5, 1.0, 1.5, 3.0, 1.5, 1.0, 1.5, 1.5, 1.5, 3.0],
        [NaN, NaN, NaN, 1.5, 0.2, 0.2, 1.5, NaN, NaN, NaN],
    ],

    // rely on Thumb30 only
    getSpecificMapping: (_: FlexMapping) => undefined,
}
