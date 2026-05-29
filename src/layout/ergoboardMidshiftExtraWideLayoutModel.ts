import {KeyboardRows, KeymapTypeId, type LayoutModel} from "../base-model.ts";
import {SymmetricKeyWidth, zeroIndent} from "./keyWidth.ts";
import {keyColorHighlightsClass} from "./layout-functions.ts";

// zeroIndent works, because the actually indented columns aren't symmetric and indented manually with gaps.
const keyWidths = new SymmetricKeyWidth(16, zeroIndent, 7.75);

export const ergoboardMidshiftExtraWideLayoutModel: LayoutModel = {
    name: "Ergoboard 65 MidShift Max Wide",
    description: ``,

    mainFingerAssignment: [
        [null, 1, 1, 2, 3, 3, 3, 6, 6, 6, 7, 8, 8, 8, null, null],
        [0, 0, 1, 2, 3, 3, 3, null, 6, 6, 6, 7, 8, 9, 9],
        [0, 0, 1, 2, 3, 3, 3, null, 6, 6, 6, 7, 8, 9, 9],
        [0, 0, 1, 2, 3, 3, 3, null, null, 6, 6, 6, 7, 8, null, null, null],
        [null, 0, 1, 2, 4, 4, null, 5, 5, null, 7, null, null, null, null],
    ],

    // Only fixed values can be used. See base-model.ts SKE_*
    // 'null' means the hand has to taken off the home-row. Those keys can't be used with letter or prose punctuation.
    singleKeyEffort: [
        [null, 3.0, 2.0, 2.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 2.0, 2.0, 3.0, null, null],
        [2.0, 2.0, 1.0, 1.0, 1.5, 2.0, 3.0, null, 3.0, 2.0, 1.5, 1.0, 1.0, 2.0, 2.0],
        [1.5, 0.2, 0.2, 0.2, 0.2, 2.0, 3.0, null, 3.0, 2.0, 0.2, 0.2, 0.2, 0.2, 1.5],
        [3.0, 1.0, 1.5, 1.5, 1.0, 2.0, 3.0, null, null, 3.0, 2.0, 1.0, 1.5, 1.5, null, null, null],
        [null, 2.0, 2.0, null, 1.0, 0.2, 0.2, 1.0, null, null, 2.0, null, null, null, null],
    ],

    rowIndent: keyWidths.rowIndent,

    keyWidths: [
        keyWidths.row(KeyboardRows.Number, 1.5, 1),
        keyWidths.row(KeyboardRows.Upper, 1.25, 1.75),
        keyWidths.row(KeyboardRows.Home, 1, 1.5),
        [0.75, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0.25, 1, 1],
        [0.5, 1.25, 1.25, 1.25, 1.25, 1.75, 1, 1.75, 1.25, 0.25, 1.25, 0.25, 1, 1, 1],
    ],
    leftHomeIndex: 4,
    rightHomeIndex: 10,

    staggerOffsets: [0.5, 0.25, 0, -0.25],
    symmetricStagger: true,

    frameMappings: {
        [KeymapTypeId.Ansi30]: [
            ["Esc", "1", "2", "3", "4", "5", "[", null, "]", "6", "7", "8", "9", "0", "⇞", "⇟"],
            ["↹", 0, 1, 2, 3, 4, "`~", "", "\\", 5, 6, 7, 8, 9, "⌫"],
            ["⇧", 0, 1, 2, 3, 4, "-", "⌦", "'", 5, 6, 7, 8, 9, "⇧"],
            [null, 0, 1, 2, 3, 4, "+", "⇤", "⇥", 9, 5, 6, 7, 8, null, "↑", null],
            [null, "Ctrl", "Cmd", "Fn", "Alt", "⏎", "Ins", "⍽", "AltGr", null, "Ctrl", null, "←", "↓", "→"]
        ],
        [KeymapTypeId.Thumb30]: [
            ["Esc", "1", "2", "3", "4", "5", "[", null, "]", "6", "7", "8", "9", "0", "⇞", "⇟"],
            ["↹", 0, 1, 2, 3, 4, "`~", "Fn", "", 5, 6, 7, 8, 9, "⌫"],
            ["⇧", 0, 1, 2, 3, 4, "+", "⌦", "'", 5, 6, 7, 8, 9, "⇧"],
            [null, 0, 1, 2, 3, 4, "\\", "⇤", "⇥", "/", 5, 6, 7, 8, null, "↑", null],
            [null, "Ctrl", "Cmd", "Alt", 0, "⏎", "Ins", "⍽", "AltGr", null, "Ctrl", null, "←", "↓", "→"]
        ],
    },

    keyColorClass: keyColorHighlightsClass,
}
