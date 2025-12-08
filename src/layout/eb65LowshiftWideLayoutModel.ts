import {KeyboardRows, KeymapTypeId, type LayoutMapping, type LayoutModel} from "../base-model.ts";
import {SymmetricKeyWidth, zeroIndent} from "./keyWidth.ts";
import {copyAndModifyKeymap, keyColorHighlightsClass} from "./layout-functions.ts";

const keyWidths = new SymmetricKeyWidth(16, zeroIndent);

const thirtyKeyMapping: LayoutMapping = [
    ["Esc", "1", "2", "3", "4", "5", "`~", null, "6", "7", "8", "9", "0", "=", "⇞", "⇟"],
    ["↹", 0, 1, 2, 3, 4, "[", "]", 5, 6, 7, 8, 9, "-", "⌫"],
    ["⌦", 0, 1, 2, 3, 4, "⇤", null, "⇥", 5, 6, 7, 8, 9, "'", "⏎"],
    [null, "⇧", 0, 1, 2, 3, 4, "\\", 9, 5, 6, 7, 8, "⇧", "↑", null],
    [null, "Ctrl", "Cmd", "CAPS", "Alt", "⍽", "⍽", "AltGr", "Fn", "Ctrl", null, "←", "↓", "→"],
];

const thumb30KeyMapping: LayoutMapping = [
    ["Esc", "1", "2", "3", "4", "5", "`~", null, "6", "7", "8", "9", "0", "", "⇞", "⇟"],
    ["↹", 0, 1, 2, 3, 4, "[", "]", 5, 6, 7, 8, 9, "=", "⌫"],
    ["⌦", 0, 1, 2, 3, 4, "⇤", null, "⇥", 5, 6, 7, 8, 9, "'", "⏎"],
    [null, "⇧", 0, 1, 2, 3, 4, "\\", "/", 5, 6, 7, 8, "⇧", "↑", null],
    [null, "Ctrl", "Cmd", "CAPS", "Alt", 0, "⍽", "AltGr", "Fn", "Ctrl", null, "←", "↓", "→"],
];

export const eb65LowshiftWideLayoutModel: LayoutModel = {
    name: "Ergoboard 65 LowShift Wide",
    description: `Widest possible hand position with the arrow cluster and lower row Shift keys.`,

    // row lengths: 16, 15, 15 (with 0.5u gap), 16, 14
    mainFingerAssignment: [
        [1, 1, 1, 1, 2, 3, 3, 3, 6, 6, 7, 8, 8, 8, null, null],
        [0, 0, 1, 2, 3, 3, 3, 6, 6, 6, 7, 8, 9, 9, 9],
        [0, 0, 1, 2, 3, 3, 3, null, 6, 6, 6, 7, 8, 9, 9, 9],
        [0, 0, 1, 2, 3, 3, 3, 3, 6, 6, 6, 7, 8, 9, null, null],
        [null, 0, 1, 2, 4, 4, 5, 5, null, 7, null, null, null, null],
    ],

    hasAltFinger: (row: number, col: number) =>
        (row === KeyboardRows.Lower) && ([1, 2, 3, 7, 8, 9].includes(col)),

    // Only fixed values can be used. See base-model.ts SKE_*
    // 'null' means the hand has to taken off the home-row. Those keys can't be used with letter or prose punctuation.
    singleKeyEffort: [
        [null, 3.0, 2.0, 2.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 2.0, 2.0, 3.0, 3.0, null, null],
        [2.0, 2.0, 1.0, 1.0, 1.5, 2.0, 3.0, 3.0, 2.0, 1.5, 1.0, 1.0, 2.0, 2.0, 3.0],
        [1.5, 0.2, 0.2, 0.2, 0.2, 2.0, 3.0, null, 3.0, 2.0, 0.2, 0.2, 0.2, 0.2, 1.5, 2.0],
        [3.0, 1.0, 1.5, 1.5, 1.0, 2.0, 3.0, 3.0, 3.0, 2.0, 1.0, 1.5, 1.5, 1.0, null, null],
        [null, 1.5, 2.0, 2.0, 1.0, 0.2, 0.2, 1.0, null, 2.0, null, null, null, null],
    ],

    rowIndent: keyWidths.rowIndent,

    keyWidths: [
        keyWidths.row(KeyboardRows.Number, 1.5, 1),
        keyWidths.row(KeyboardRows.Upper, 1.25, 1.75),
        keyWidths.row(KeyboardRows.Home, 1, 1.5, 7.25),
        [0.5, 1.25, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.25, 1, 1],
        [0.5, 1.25, 1.25, 1.25, 1.25, 1.75, 1.75, 1.25, 1, 1.25, 0.5, 1, 1, 1],
    ],
    leftHomeIndex: 4,
    rightHomeIndex: 10,

    staggerOffsets: [0.5, 0.25, 0, -0.5],
    symmetricStagger: true,

    frameMappings: {
        [KeymapTypeId.Ansi30]: thirtyKeyMapping,
        [KeymapTypeId.Thumb30]: thumb30KeyMapping,
    },

    keyColorClass: keyColorHighlightsClass,
}

function angleModKeymap(keymap: LayoutMapping): LayoutMapping {
    keymap[KeyboardRows.Home][0] = [1, 0];  // qwerty Z
    const lowerRow = keymap[KeyboardRows.Lower];
    lowerRow.splice(2, 1); // remove Z
    lowerRow.splice(7, 0, "⌦");
    return keymap;
}

export const eb65LowshiftWideAngleModLayoutModel: LayoutModel = {
    ...eb65LowshiftWideLayoutModel,
    name: `${eb65LowshiftWideLayoutModel.name} angle mod`,
    frameMappings: Object.fromEntries(
        Object.entries(eb65LowshiftWideLayoutModel.frameMappings).map(([typeId, mapping]) => [
            typeId,
            copyAndModifyKeymap(mapping, angleModKeymap),
        ])
    ) as typeof eb65LowshiftWideLayoutModel.frameMappings,
};
