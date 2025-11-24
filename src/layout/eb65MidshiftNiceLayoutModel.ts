import {Finger, FlexMapping, KeyboardRows, LayoutMapping, RowBasedLayoutModel, SKE_AWAY} from "../base-model.ts";
import {copyAndModifyKeymap, keyColorHighlightsClass} from "./layout-functions.ts";
import {eb65LowShiftLayoutModel} from "./eb65LowShiftLayoutModel.ts";
import {SymmetricKeyWidth, zeroIndent} from "./keyWidth.ts";

// the indent on the bottom is not symmetric, thus managed manually via gaps.
const eb65NiceKeyWidths = new SymmetricKeyWidth(16, zeroIndent);

export const eb65MidshiftNiceLayoutModel: RowBasedLayoutModel = {
    ...eb65LowShiftLayoutModel,
    name: "Ergoboard 65 MidShift Nicely Wide",

    leftHomeIndex: 4,
    rightHomeIndex: 10,
    staggerOffsets: [0.5, 0.25, 0, -0.25],

    // The keymap has a bunch of small differences to the low-shift; enough to make copy-paste-adapt easier than anything more clever.
    thirtyKeyMapping: [
        // left-side numbers move to center to make their relative position (from hand home) symmetric to the right side.
        ["Esc", "`~", "1", "2", "3", "4", "5", "[", "]", "6", "7", "8", "9", "0", "⇞", "⇟"],
        ["↹", 0, 1, 2, 3, 4, "⇤", null, "⇥", 5, 6, 7, 8, 9, "⌫"],
        ["⇧", 0, 1, 2, 3, 4, "-", "\\", "'", 5, 6, 7, 8, 9, "⇧"],
        ["Ctrl", 0, 1, 2, 3, 4, "=", "€ ¢ £ ¥", 9, 5, 6, 7, 8, null, "↑", null],
        [null, "Cmd", "Fn", "", "⌦", "Alt", "⏎", "⍽", "AltGr", null, "Ctrl", null, "←", "↓", "→"]
    ],

    thumb30KeyMapping: [
        // todo
        ["Esc", "`~", "1", "2", "3", "4", "5", "[", "]", "6", "7", "8", "9", "0", "⇞", "⇟"],
        ["↹", 0, 1, 2, 3, 4, "⇤", null, "⇥", 5, 6, 7, 8, 9, "⌫"],
        ["⇧", 0, 1, 2, 3, 4, "\\", "", "'", 5, 6, 7, 8, 9, "⇧"],
        ["Ctrl", 0, 1, 2, 3, 4, "=", "€ ¢ £ ¥", "/", 5, 6, 7, 8, null, "↑", null],
        [null, "Cmd", "Fn", "⌦", "Alt", 0, "⏎", "⍽", "AltGr", null, "Ctrl", null, "←", "↓", "→"],
    ],
    mainFingerAssignment: copyAndModifyKeymap(eb65LowShiftLayoutModel.mainFingerAssignment, (matrix) => {
        matrix[KeyboardRows.Upper].splice(8, 0, Finger.RIndex);
        matrix[KeyboardRows.Upper].pop();
        matrix[KeyboardRows.Home].splice(7, 0, null);
        matrix[KeyboardRows.Home].pop();
        matrix[KeyboardRows.Lower][7] = null;
        matrix[KeyboardRows.Bottom].splice(4, 0, Finger.LIndex);
        return matrix;
    }),
    singleKeyEffort: [
        [null, 3.0, 3.0, 2.0, 2.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 2.0, 2.0, 3.0, null, null],
        [2.0, 2.0, 1.0, 1.0, 1.5, 2.0, 3.0, 3.0, 3.0, 2.0, 1.5, 1.0, 1.0, 2.0, 2.0],
        [1.5, 0.2, 0.2, 0.2, 0.2, 2.0, 3.0, 3.0, 3.0, 2.0, 0.2, 0.2, 0.2, 0.2, 1.5],
        [3.0, 1.0, 1.5, 1.5, 1.0, 2.0, 3.0, 3.0, 3.0, 2.0, 1.0, 1.5, 1.5, 1.0, null, null],
        [null, 2.0, 1.5, null, null, 1.0, 0.2, 0.2, 1.0, null, 1.5, null, null, null, null],
    ],

    keyWidths: [
        eb65NiceKeyWidths.row(0, 1),
        eb65NiceKeyWidths.row(1, 1.75),
        eb65NiceKeyWidths.row(2, 1.5),
        eb65NiceKeyWidths.row(3, 1.25)
            .slice(0, -2)
            .concat(0.25, 1, 1),
        /*
            Center between hands is exactly the center of the keyboard, leaving 8u on each side,
            of which 2.5u are between the inner edges of the index finger home keys.
            Half of the outer space key (0.75u) should fall inside those 2.5u, leaving 1.75, which is exactly a space bar,
            so we don't need any central key between space bars.
            Committed on the left side are 1.75 space plus 0.5 left indent; total: 2.25u, unassigned: 5.75.
            Right side has 1.75 space plus 3×1u arrows; total 4.75u, unassigned 3.25.
            Two 1.25u modifiers on the right are 2.5u, leaving 0.75u for gaps which we'll split evenly.
            On the left, we could do 3×1.25 + 2×1u to fill the space exactly.
            Alternative 4×1.25 = 5u with three gaps of 0.25u.
         */
        [0.5, 1.25, 1.25, 1, 1, 1.25, 1.75, 1.75, 1.25, 0.75/2, 1.25, 0.75/2, 1, 1, 1],
    ],
    keyWidth(row: KeyboardRows, col: number) {
        return this.keyWidths[row][col];
    }
}

export const eb65MidshiftRightRetLayoutModel: RowBasedLayoutModel = {
    name: "Ergoboard 65 MidShift Narrow, Right Return",
    description: ``,

    thirtyKeyMapping: [
        ["Esc", "1", "2", "3", "4", "5", "[", "`~", "]", "6", "7", "8", "9", "0", "⇞", "⇟"],
        ["↹", 0, 1, 2, 3, 4, "\\", null, 5, 6, 7, 8, 9, "'", "⏎"],
        ["⇧", 0, 1, 2, 3, 4, "=", "-", 5, 6, 7, 8, 9, "⇧", "⌫"],
        ["Ctrl", 0, 1, 2, 3, 4, "⇤", null, "⇥", 5, 6, 7, 8, 9, null, "↑", null],
        [null, "Cmd", "Fn", "⌦", "Alt", "⍽", "⍽", "AltGr", null, "Ctrl", null, "←", "↓", "→"]
    ],

    thumb30KeyMapping: [
        // note: thanks to the thumb-letter, we have one less letter and could use a "big" key in the top center.
        // but layouts can't transform themselves when the keymap changes.
        // Anyway, the layouts that I want to build don't have this problem, so I won't solve it.
        ["Esc", "1", "2", "3", "4", "5", "[", "`~", "]", "6", "7", "8", "9", "0", "⇞", "⇟"],
        ["↹", 0, 1, 2, 3, 4, null, null, 5, 6, 7, 8, 9, "'", "⏎"],
        ["⇧", 0, 1, 2, 3, 4, "=", "\\", 5, 6, 7, 8, 9, "⇧", "⌫"],
        ["Ctrl", 0, 1, 2, 3, 4, "⇤", null, "⇥", 5, 6, 7, 8, "/", null, "↑", null],
        [null, "Cmd", "Fn", "⌦", "Alt", 0, "⍽", "AltGr", null, "Ctrl", null, "←", "↓", "→"],
    ],

    // todo
    fullMapping: [],

    mainFingerAssignment: [
        [null, 1, 1, 1, 2, 3, 3, 3, 6, 6, 7, 8, 8, 8, null, null],
        [0, 0, 1, 2, 3, 3, 3, null, 6, 6, 7, 8, 9, 9, null],
        [0, 0, 1, 2, 3, 3, 3, 6, 6, 6, 7, 8, 9, 9, 9],
        [0, 0, 1, 2, 3, 3, 3, 3, 6, 6, 6, 7, 8, 9, null, null, null],
        [null, 0, null, null, 4, 4, 5, 5, null, 7, null, null, null, null],
    ],

    hasAltFinger: (row: number, col: number) =>
        (row == KeyboardRows.Lower) && ([1, 2, 3, 7, 8, 9].includes(col)),

    // Only fixed values can be used. See base-model.ts SKE_*
    // 'null' means the hand has to taken off the home-row. Those keys can't be used with letter or prose punctuation.
    singleKeyEffort: [
        [null, 3.0, 3.0, 2.0, 2.0, 3.0, 3.0, 3.0, 3.0, 3.0, 2.0, 2.0, 3.0, 3.0, null, null],
        [2.0, 2.0, 1.0, 1.0, 1.5, 2.0, 3.0, 3.0, 2.0, 1.5, 1.0, 1.0, 2.0, 2.0, 3.0],
        [1.5, 0.2, 0.2, 0.2, 0.2, 2.0, 3.0, 3.0, 2.0, 0.2, 0.2, 0.2, 0.2, 1.5, 3.0],
        [3.0, 1.0, 1.5, 1.5, 1.0, 2.0, 3.0, 3.0, 3.0, 2.0, 1.0, 1.5, 1.5, 1.0, null, null, null],
        [null, 2.0, 1.5, null, 1.0, 0.2, 0.2, 1.0, null, null, null, null, null, null],
    ],

    rowIndent: [0, 0, 0, 0, 0],

    keyWidths: copyAndModifyKeymap(eb65MidshiftNiceLayoutModel.keyWidths, (matrix) => {
        matrix[KeyboardRows.Bottom] = eb65LowShiftLayoutModel.keyWidths[KeyboardRows.Bottom];
        return matrix;
    }),
    keyWidth(row: KeyboardRows, col: number): number {
        return this.keyWidths![row][col];
    },

    leftHomeIndex: 4,
    rightHomeIndex: 9,

    staggerOffsets: [0.5, 0.25, 0, -0.25],
    symmetricStagger: true,

    getSpecificMapping: (_: FlexMapping) => undefined,

    keyColorClass: keyColorHighlightsClass,
}


export const eb65CentralEnterLayoutModel: RowBasedLayoutModel = {
    ...eb65MidshiftRightRetLayoutModel,
    name: "Ergoboard 65 MidShift Narrow, Central Return",
    keyWidths: copyAndModifyKeymap(eb65MidshiftRightRetLayoutModel.keyWidths!, (matrix) => {
        matrix[KeyboardRows.Upper][6] = 1.5;
        matrix[KeyboardRows.Home][13] = 1.5;
        matrix[KeyboardRows.Home][14] = 1;
        return matrix;
    }),
    keyWidth(row: KeyboardRows, col: number) {
        return this.keyWidths![row][col];
    },
    thirtyKeyMapping: copyAndModifyKeymap(eb65MidshiftRightRetLayoutModel.thirtyKeyMapping!, moveEnterToCenter),
    thumb30KeyMapping: copyAndModifyKeymap(eb65MidshiftRightRetLayoutModel.thumb30KeyMapping!, moveEnterToCenter),
    mainFingerAssignment: copyAndModifyKeymap(eb65MidshiftRightRetLayoutModel.mainFingerAssignment, (matrix) => {
        matrix[KeyboardRows.Number][14] = Finger.RPinky;
        matrix[KeyboardRows.Home][14] = null;
        return matrix;
    }),
    singleKeyEffort: copyAndModifyKeymap(eb65MidshiftRightRetLayoutModel.singleKeyEffort, (matrix) => {
        matrix[KeyboardRows.Number][14] = SKE_AWAY;
        matrix[KeyboardRows.Home][14] = null;
        return matrix;
    }),
}

function moveEnterToCenter(mapping: LayoutMapping): LayoutMapping {
    mapping[KeyboardRows.Number][14] = "\\";
    mapping[KeyboardRows.Number][15] = "⇞";
    mapping[KeyboardRows.Upper][6] = "⏎";
    delete mapping[KeyboardRows.Upper][7];
    mapping[KeyboardRows.Upper][14] = "⌫";
    mapping[KeyboardRows.Home][14] = "⇟";
    return mapping;
}

export const eb65VerticalEnterLayoutModel: RowBasedLayoutModel = {
    ...eb65MidshiftRightRetLayoutModel,
    name: "Ergoboard 65 MidShift Narrow, Vertical Return",
    keyWidths: copyAndModifyKeymap(eb65MidshiftRightRetLayoutModel.keyWidths!, (matrix) => {
        matrix[KeyboardRows.Upper][13] = 1.75; // Backspace
        matrix[KeyboardRows.Upper][14] = 1;    // Enter
        matrix[KeyboardRows.Home][13] = 1.5;   // Shift
        matrix[KeyboardRows.Home][14] = 1;     // gap for Enter
        return matrix;
    }),
    keyWidth(row: KeyboardRows, col: number) {
        return this.keyWidths![row][col];
    },
    keyCapHeight: (row: KeyboardRows, col: number) => {
        if (row == KeyboardRows.Upper && col == 14) return 2;
        return 1;
    },
    thirtyKeyMapping: copyAndModifyKeymap(eb65MidshiftRightRetLayoutModel.thirtyKeyMapping!!, moveEnterToVertical),
    thumb30KeyMapping: copyAndModifyKeymap(eb65MidshiftRightRetLayoutModel.thumb30KeyMapping!!, moveEnterToVertical),
}

function moveEnterToVertical(mapping: LayoutMapping): LayoutMapping {
    mapping[KeyboardRows.Upper][13] = "⌫";
    mapping[KeyboardRows.Home][14] = null;
    return mapping;
}
