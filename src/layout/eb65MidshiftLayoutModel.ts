import {Finger, FlexMapping, KeyboardRows, LayoutMapping, RowBasedLayoutModel, SKE_AWAY} from "../base-model.ts";
import {copyAndModifyKeymap, eb65KeyColorClass} from "./layout-functions.ts";
import {eb65LowShiftLayoutModel} from "./eb65LowShiftLayoutModel.ts";

export const eb65MidshiftLayoutModel: RowBasedLayoutModel = {
    ...eb65LowShiftLayoutModel,
    name: "Ergoboard 65 MidShift Wide",

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
        matrix[KeyboardRows.Home].splice(7, 0, null);
        matrix[KeyboardRows.Lower][7] = null;
        // matrix[KeyboardRows.Lower].splice(8, 1);
        matrix[KeyboardRows.Bottom].splice(4, 0, Finger.LIndex);
        return matrix;
    }),
    singleKeyEffort: [
        [null, 3.0, 3.0, 2.0, 2.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 2.0, 2.0, 3.0, null, null],
        [2.0, 2.0, 1.0, 1.0, 1.5, 2.0, 3.0, 3.0, 3.0, 2.0, 1.5, 1.0, 1.0, 2.0, 2.0, 3.0],
        [1.5, 0.2, 0.2, 0.2, 0.2, 2.0, 3.0, 3.0, 3.0, 2.0, 0.2, 0.2, 0.2, 0.2, 1.5, 2.0],
        [3.0, 1.0, 1.5, 1.5, 1.0, 2.0, 3.0, 3.0, 3.0, 2.0, 1.0, 1.5, 1.5, 1.0, null, null],
        [null, 2.0, 1.5, null, null, 1.0, 0.2, 0.2, 1.0, null, 1.5, null, null, null],
    ],
    keyWidth: (row: KeyboardRows, col: number)=> {
        switch (row) {
            case KeyboardRows.Bottom:
                // The Bottom Row needs customizing to center the space bars under the wider hand position.
                // arrow keys, always easy:
                if (col > 11) return 1;
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
                switch (col) {
                    case 0:
                        return 0.5;
                    case 3:
                    case 4:
                        return 1;
                    case 6:
                    case 7:
                        return 1.75;
                    case 9:
                    case 11:
                        return 0.75 / 2;
                    default:
                        return 1.25;
                }

            case KeyboardRows.Lower:
                switch (col) {
                    case 0:
                        return 1.25;
                    case 7:
                        return 1.5
                    case 13:
                        return 0.25
                    default:
                        return 1;
                }
        }
        return eb65LowShiftLayoutModel.keyWidth(row, col);
    }
}

export const eb65MidshiftRightRetLayoutModel: RowBasedLayoutModel = {
    name: "Ergoboard 65 MidShift Narrow",
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
        [null, 3.0, 3.0, 2.0, 2.0, 3.0, 3.0, 3.0, 3.0, 3.0, 2.0, 2.0, 3.0, 3.0, null],
        [2.0, 2.0, 1.0, 1.0, 1.5, 2.0, 3.0, 3.0, 2.0, 1.5, 1.0, 1.0, 2.0, 2.0, 3.0],
        [1.5, 0.2, 0.2, 0.2, 0.2, 2.0, 3.0, 3.0, 2.0, 0.2, 0.2, 0.2, 0.2, 1.5, 3.0],
        [3.0, 1.0, 1.5, 1.5, 1.0, 2.0, 3.0, 3.0, 3.0, 2.0, 1.0, 1.5, 1.5, 1.0, null, null, null],
        [null, 2.0, 1.5, null, 1.0, 0.2, 0.2, 1.0, null, null, null, null, null, null],
    ],

    rowStart: (_row: KeyboardRows) => 0,

    keyWidth: (row: KeyboardRows, col: number): number => {
        const numCols = eb65MidshiftLayoutModel.thirtyKeyMapping![row].length;
        switch (row) {
            case KeyboardRows.Number:
                return 1;
            case KeyboardRows.Upper:
                switch (col) {
                    case 7: // the gap
                        return 0.5;
                    case 0:
                    case 14: // Tab / Backspace (or Enter)
                        return 1.75;
                    default:
                        return 1;
                }
            case KeyboardRows.Home:
                switch (col) {
                    case 0: // Left Shift, Enter
                    case (numCols - 1):
                        return 1.5;
                    default:
                        return 1;
                }
            case  KeyboardRows.Lower:
                switch (col) {
                    case 0:
                        return 1.25;
                    case 7:
                        return 0.5
                    case 14:
                        return 0.25
                    default:
                        return 1;
                }
            case KeyboardRows.Bottom:
                /*
Center between hand leaves 7.5u left, 8.5u right.
Left side has 0.5 indent, 1.75u space bar; 5.25 to spread.
Let's just increase the indent and put 4 modifiers.
Right side has three arrows, leaving 5.5u, space bar leaving 3.75u.
Two mods make 2.5u.
                 */
                // arrow keys
                if (col > 10) return 1;
                switch (col) {
                    case 0:
                        return 0.75;
                    case 5:
                    case 6:
                        return 1.75;
                    case 8:
                    case 10:
                        return 1.25/2;
                    default:
                        return 1.25;
                }
        }
    },

    leftHomeIndex: 4,
    rightHomeIndex: 9,

    staggerOffsets: [0.5, 0.25, 0, -0.25],
    symmetricStagger: true,

    getSpecificMapping: (_: FlexMapping) => undefined,

    keyColorClass: eb65KeyColorClass,
}


export const eb65CentralEnterLayoutModel: RowBasedLayoutModel = {
    ...eb65MidshiftRightRetLayoutModel,
    keyWidth: (row: KeyboardRows, col: number) => {
        switch (row) {
            // todo
            case KeyboardRows.Upper:
                if (col === 6) {
                    return 1.5;
                }
                break;
            case KeyboardRows.Home:
                switch (col) {
                    case 13: // Right Shift
                        return 1.5;
                    case 14: // Page Down
                        return 1;
                }
        }
        return eb65MidshiftRightRetLayoutModel.keyWidth(row, col);
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
    keyWidth: (row: KeyboardRows, col: number) => {
        switch (row) {
            case KeyboardRows.Upper:
                switch (col) {
                    case 13: // Backspace
                        return 1.75;
                    case 14: // Enter
                        return 1;
                }
                break;
            case KeyboardRows.Home:
                switch (col) {
                    case 13: // Right Shift
                        return 1.5;
                    case 14: // gap for Enter
                        return 1;
                }
            // Note that the 2u vertical Enter key also entitles us to a 2u space bar,
            // but this would make the outer space harder to reach, so I'm not doing it.
        }
        return eb65MidshiftRightRetLayoutModel.keyWidth(row, col);
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
