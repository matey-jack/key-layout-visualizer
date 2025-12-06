import {FlexMapping, KeymapTypeId, type RowBasedLayoutModel} from "../base-model.ts";

// I arbitrarily decide that the top (number) row shall not be changed by the flex mapping.
// But there has to be an empty list in the mapping to keep the format consistent with the algorithms.
const fullMapping = [
    ["Esc", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "⌫"],
    ["↹", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    ["CAPS", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    ["⇧", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "⇧"],
    ["Ctrl", "Cmd", 0, "Alt", 1, "⍽", "⏎", 2, "AltGr", 3, "Fn", "Ctrl"],
];

export const splitOrthoLayoutModel: RowBasedLayoutModel = {
    name: "Split Ergonomic",
    description: "The Ortholinear key layout is especially popular with two-piece keyboards. " +
        "This allows to position and rotate the two keyboard halves to make columns line up exactly with your finger's natural extension movement. " +
        "Most split models include at least two thumb keys on each side that users can map to any function they want. " +
        "The layout shown here is not too different to the Iris CE, a 56-key split keyboard which is incidentally the one that I used for coding this app. ",
    // more splitties here: https://jhelvy.shinyapps.io/splitkbcompare/
    // if it's down, you can run it locally: https://github.com/jhelvy/splitKbCompare

    hasAltFinger: (_r, _c) => false,

    rowIndent: [0, 0, 0, 0, 1],
    keyWidths: fullMapping!.map((row) => row.map((_) => 1)),
    splitColumns: [6, 6, 6, 6, 6],

    leftHomeIndex: 4,
    rightHomeIndex: 7,

    staggerOffsets: [0, 0, 0, 0],
    symmetricStagger: true,

    mainFingerAssignment: [
        [1, 1, 2, 2, 3, 3, 6, 6, 7, 7, 8, 8],
        [0, 0, 1, 2, 3, 3, 6, 6, 7, 8, 9, 9],
        [0, 0, 1, 2, 3, 3, 6, 6, 7, 8, 9, 9],
        [0, 0, 1, 2, 3, 3, 6, 6, 7, 8, 9, 9],
        [0, 1, 2, 4, 4, 4, 5, 5, 5, 7, 8, 9],
    ],

    singleKeyEffort: [
        [NaN, 3.0, 2.0, 2.0, 3.0, 3.0, 3.0, 3.0, 2.0, 2.0, 3.0, NaN],
        [NaN, 1.5, 1.0, 1.0, 1.5, 1.5, 1.5, 1.5, 1.0, 1.0, 1.5, 2.0],
        [NaN, 0.2, 0.2, 0.2, 0.2, 1.0, 1.0, 0.2, 0.2, 0.2, 0.2, 1.5],
        [NaN, 1.0, 1.5, 1.5, 1.0, 2.0, 2.0, 1.0, 1.5, 1.5, 1.0, NaN],
        [NaN, 2.0, 2.0, 1.5, 0.2, 0.2, 0.2, 0.2, 1.5, 2.0, 2.0, NaN],
    ],

    supportedKeymapTypes: [
        {typeId: KeymapTypeId.SplitOrtho, frameMapping: fullMapping},
        {
            typeId: KeymapTypeId.Ansi30, frameMapping: [
                // Mapping Enter as a thumb key allows `'` to stay in its Qwerty position.
                // We use the freed space to improve `-` position, since this is the third most frequently used punctuation character.
                ["Esc", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "⌫"],
                ["↹", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "-"],
                ["CAPS", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "'"],
                ["⇧", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "⇧"],
                ["Ctrl", "Cmd", "=", "\\", "Alt", "⍽", "⏎", "AltGr", "Menu", "`", "Fn", "Ctrl"],
            ]
        },
        {
            typeId: KeymapTypeId.Thumb30, frameMapping: [
                // Shift in Home Row is the more ergonomic choice... just haven't done it in the other mapping to showcase more options.
                ["Esc", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "⌫"],
                ["↹", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "'"],
                ["⇧", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "⇧"],
                ["Ctrl", 0, 1, 2, 3, 4, 5, 6, 7, 8, "/", "Ctrl"],
                ["Cmd", "", "`", "=", "Alt", "⍽", "⏎", 0, "AltGr", "Menu", "\\", "Fn"],
            ]
        },
    ],
}
