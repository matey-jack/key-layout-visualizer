import {FlexMapping, KeyboardRows, RowBasedLayoutModel} from "../base-model.ts";
import {keyColorHighlightsClass} from "./layout-functions.ts";
import {SymmetricKeyWidth, zeroIndent} from "./keyWidth.ts";

const keyWidths = new SymmetricKeyWidth(16, zeroIndent);

export const eb65LowShiftWideLayoutModel: RowBasedLayoutModel = {
    name: "Ergoboard 65 LowShift Wide",
    description: `Widest possible hand position with the arrow cluster and lower row Shift keys.`,

    // row lengths: 16, 15, 15 (with 0.5u gap), 16, 14
    thirtyKeyMapping: [
        ["Esc", "1", "2", "3", "4", "5", "`~", null, "6", "7", "8", "9", "0", "=", "⇞", "⇟"],
        ["↹", 0, 1, 2, 3, 4, "[", "]", 5, 6, 7, 8, 9, "-", "⏎"],
        ["⌦", 0, 1, 2, 3, 4, "⇤", null, "⇥", 5, 6, 7, 8, 9, "'", "⌫"],
        [null, "⇧", 1, 2, 3, 4, 0, "\\", 9, 5, 6, 7, 8, "⇧", "↑", null],
        [null, "Ctrl", "Cmd", "CAPS", "Alt", "⍽", "⍽", "AltGr", "Fn", "Ctrl", null, "←", "↓", "→"],
    ],

    thumb30KeyMapping: [
        ["Esc", "1", "2", "3", "4", "5", "`~", null, "6", "7", "8", "9", "0", "", "⇞", "⇟"],
        ["↹", 0, 1, 2, 3, 4, "[", "]", 5, 6, 7, 8, 9, "=", "⏎"],
        ["⌦", 0, 1, 2, 3, 4, "⇤", null, "⇥", 5, 6, 7, 8, 9, "'", "⌫"],
        // this modified angle fix works with Quip Thumby and Cozy keymaps. In Colemak Thumby, -B should swap.
        [null, "⇧", 1, 2, 3, 0, 4, "\\", "/", 5, 6, 7, 8, "⇧", "↑", null],
        [null, "Ctrl", "Cmd", "CAPS", "Alt", 0, "⍽", "AltGr", "Fn", "Ctrl", null, "←", "↓", "→"],
    ],

    // todo
    fullMapping: [],

    mainFingerAssignment: [
        [1, 1, 1, 1, 2, 3, 3, 3, 6, 6, 7, 8, 8, 8, null, null],
        [0, 0, 1, 2, 3, 3, 3, 6, 6, 6, 7, 8, 9, 9, 9],
        [0, 0, 1, 2, 3, 3, 3, null, 6, 6, 6, 7, 8, 9, 9, 9],
        [0, 0, 1, 2, 3, 3, 3, 3, 6, 6, 6, 7, 8, 9, null, null],
        [null, 0, 1, 2, 4, 4, 5, 5, null, 7, null, null, null, null],
    ],

    hasAltFinger: (row: number, col: number) =>
        (row == KeyboardRows.Lower) && ([1, 2, 3, 7, 8, 9].includes(col)),

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

    getSpecificMapping: (_: FlexMapping) => undefined,
    keyColorClass: keyColorHighlightsClass,
}
