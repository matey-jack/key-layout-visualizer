import {Finger, KeyboardRows, KeymapTypeId, type LayoutMapping, type LayoutModel, SKE_AWAY,} from "../base-model.ts";
import {mapValues} from "../library/records.ts";
import {SymmetricKeyWidth, zeroIndent} from "./keyWidth.ts";
import {copyAndModifyKeymap, keyColorHighlightsClass} from "./layout-functions.ts";

const keyWidths = new SymmetricKeyWidth(16, zeroIndent);

export const ergoboardMidshiftRightRetLayoutModel: LayoutModel = {
    name: "Ergoboard 65 MidShift Narrow, Right Return",
    description: ``,

    // row lengths: 16, 15, 15 (with 0.5u gap), 16, 14
    mainFingerAssignment: [
        [null, 1, 1, 1, 2, 3, 3, 3, 6, 6, 7, 8, 8, 8, null, null],
        [0, 0, 1, 2, 3, 3, 3, 6, 6, 7, 8, 9, 9, null],
        [0, 0, 1, 2, 3, 3, 3, 6, 6, 6, 7, 8, 9, 9, 9],
        [0, 0, 1, 2, 3, 3, 3, 3, 6, 6, 6, 7, 8, 9, null, null, null],
        [null, 0, null, null, 4, 4, 5, 5, null, 7, null, null, null],
    ],

    singleKeyEffort: [
        [null, 3.0, 3.0, 2.0, 2.0, 3.0, 3.0, 3.0, 3.0, 3.0, 2.0, 2.0, 3.0, 3.0, null, null],
        [2.0, 2.0, 1.0, 1.0, 1.5, 2.0, 3.0, 2.0, 1.5, 1.0, 1.0, 2.0, 2.0, 3.0],
        [1.5, 0.2, 0.2, 0.2, 0.2, 2.0, 3.0, 3.0, 2.0, 0.2, 0.2, 0.2, 0.2, 1.5, 3.0],
        [3.0, 1.0, 1.5, 1.5, 1.0, 2.0, 3.0, 3.0, 3.0, 2.0, 1.0, 1.5, 1.5, 1.0, null, null, null],
        [null, 2.0, 1.5, null, 1.0, 0.2, 0.2, 1.0, null, null, null, null, null],
    ],

    rowIndent: zeroIndent,

    keyWidths: [
        keyWidths.row(KeyboardRows.Number, 1),
        keyWidths.row(KeyboardRows.Upper, 1.75, 1.75, 7.5),
        // Shift keys have asymmetric sizes (1.5 vs 1.0) and we could equalize them be moving all letters and the hands
        // 0.25 to the left. But that would give us an 1.75 Escape key vs only an 1.25 backspace. 
        keyWidths.row(KeyboardRows.Home, 1.5),
        [1.25, 1, 1, 1, 1, 1, 1, 0.5, 1, 1, 1, 1, 1, 1, 0.25, 1, 1],
        // keyboard center is at 7.5 | 8.5, all of which usable on the left, but only 5.5 usable on the right.
        // using two 1.5u thumb keys on each side, leaves 4.5u left, 2.5u right.
        [0.5, 1.5, 1.25, 1.25, 1.5, 1.5, /* center */ 1.5, 1.5, 1.25, 1.25, 1, 1, 1]
    ],

    leftHomeIndex: 4,
    rightHomeIndex: 9,

    staggerOffsets: [0.5, 0.25, 0, -0.25],
    symmetricStagger: true,

    frameMappings: {
        [KeymapTypeId.Ansi30]: [
            ["Esc", "1", "2", "3", "4", "5", "[", "`~", "]", "6", "7", "8", "9", "0", "⇞", "⇟"],
            ["↹", 0, 1, 2, 3, 4, "⌦", 5, 6, 7, 8, 9, "'", "⌫"],
            ["⇧", 0, 1, 2, 3, 4, "+", "-", 5, 6, 7, 8, 9, "⇧", "⏎"],
            ["Ctrl", 0, 1, 2, 3, 4, "⇤", null, "⇥", 5, 6, 7, 8, 9, null, "↑", null],
            [null, "Cmd", "Fn", "\\", "Alt", "⍽", "⍽", "AltGr", "Menu", "Ctrl", "←", "↓", "→"]
        ],
        // note: thanks to the thumb-letter, we have one less letter above the bottom row and could use a "big" key in the top center.
        // but layouts can't transform themselves when the keymap changes.
        // Anyway, my favorite layouts don't have this problem, so I won't solve it.
        [KeymapTypeId.Thumb30]: [
            ["Esc", "1", "2", "3", "4", "5", "[", "`~", "]", "6", "7", "8", "9", "0", "⇞", "⇟"],
            ["↹", 0, 1, 2, 3, 4, "⌦", 5, 6, 7, 8, 9, "'", "⌫"],
            ["⇧", 0, 1, 2, 3, 4, "+", "\\", 5, 6, 7, 8, 9, "⇧", "⏎"],
            ["Ctrl", 0, 1, 2, 3, 4, "⇤", null, "⇥", 5, 6, 7, 8, "/", null, "↑", null],
            [null, "Cmd", "Fn", "Ins", "Alt", 0, "⍽", "AltGr", "Menu", "Ctrl", "←", "↓", "→"],
        ],
    },

    keyColorClass: keyColorHighlightsClass,
}
export const ergoboardCentralEnterLayoutModel: LayoutModel = {
    ...ergoboardMidshiftRightRetLayoutModel,
    name: "Ergoboard 65 MidShift Narrow, Central Return",
    keyWidths: copyAndModifyKeymap(ergoboardMidshiftRightRetLayoutModel.keyWidths!, (matrix) => {
        matrix[KeyboardRows.Home][13] = 1.5;
        matrix[KeyboardRows.Home][14] = 1;
        return matrix;
    }),
    frameMappings: mapValues(ergoboardMidshiftRightRetLayoutModel.frameMappings, (_, frameMapping) =>
        copyAndModifyKeymap(frameMapping, moveEnterToCenter)
    ),
    mainFingerAssignment: copyAndModifyKeymap(ergoboardMidshiftRightRetLayoutModel.mainFingerAssignment, (matrix) => {
        matrix[KeyboardRows.Number][14] = Finger.RPinky;
        matrix[KeyboardRows.Home][14] = null;
        return matrix;
    }),
    singleKeyEffort: copyAndModifyKeymap(ergoboardMidshiftRightRetLayoutModel.singleKeyEffort, (matrix) => {
        matrix[KeyboardRows.Number][14] = SKE_AWAY;
        matrix[KeyboardRows.Home][14] = null;
        return matrix;
    }),
}

function moveEnterToCenter(mapping: LayoutMapping): LayoutMapping {
    mapping[KeyboardRows.Number][14] = "\\";
    mapping[KeyboardRows.Number][15] = "⇞";
    mapping[KeyboardRows.Upper][6] = "⏎";
    mapping[KeyboardRows.Home][14] = "⇟";
    mapping[KeyboardRows.Bottom][3] = "⌦";
    return mapping;
}

export const ergoboardVerticalEnterLayoutModel: LayoutModel = {
    ...ergoboardMidshiftRightRetLayoutModel,
    name: "Ergoboard 65 MidShift Narrow, Vertical Return",
    keyWidths: copyAndModifyKeymap(ergoboardMidshiftRightRetLayoutModel.keyWidths!, (matrix) => {
        matrix[KeyboardRows.Home][13] = 1.5;   // Shift
        matrix[KeyboardRows.Home][14] = 1;     // Enter
        return matrix;
    }),
    keyCapHeight: (row: KeyboardRows, col: number) => {
        if (row === KeyboardRows.Home && col === 14) return 2;
        return 1;
    },
}
