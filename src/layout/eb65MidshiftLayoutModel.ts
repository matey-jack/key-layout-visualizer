import {FlexMapping, KeyboardRows, LayoutMapping, RowBasedLayoutModel} from "../base-model.ts";
import {copyAndModifyKeymap} from "./layout-functions.ts";
import {eb65KeyColorClass} from "./eb65AysmLayoutModel.ts";

export const eb65MidshiftLayoutModel: RowBasedLayoutModel = {
    name: "Ergoboard 65 MidShift",
    description: `"The most ergonomic key layout that fits into a standard "65%" keyboard case
    and has some gaps around the arrow cluster so your fingers can find it without looking."
    Hand distance is still much better than ANSI keyboards. 
    Row stagger is equal to a "cleave-style ergonomic" keyboard.
    Moving the Shift keys finally allows to stagger even the lower letter row by the same amount as the others
    without having to swap around keymappings there.`,

    // Key sizes are mostly the same as EP65 Midsize Enter, except for 2u Backspace up top.
    // But the lower row has a regular 0.25 stagger.
    thirtyKeyMapping: [
        ["Esc", "1", "2", "3", "4", "5", "[", "`~", "]", "6", "7", "8", "9", "0", "⇞", "⇟"],
        ["↹", 0, 1, 2, 3, 4, "\\", null, 5, 6, 7, 8, 9, "'", "⌫"],
        ["⇧", 0, 1, 2, 3, 4, "=", "-", 5, 6, 7, 8, 9, "⇧", "⏎"],
        ["Ctrl", 0, 1, 2, 3, 4, "⇤", null, "⇥", 5, 6, 7, 8, 9, null, "↑", null],
        [null, "Cmd", "Fn", "⌦", "Alt", "⍽", "⍽", "AltGr", null, "Ctrl", null, "←", "↓", "→"]
    ],

    thumb30KeyMapping: [
        ["Esc", "1", "2", "3", "4", "5", "[", "`~", "]", "6", "7", "8", "9", "0"],
        ["↹", 0, 1, 2, 3, 4, "'", null, 5, 6, 7, 8, 9, "⌫", "⏎", "⇞"],
        ["⇧", 0, 1, 2, 3, 4, "=", "\\", 5, 6, 7, 8, 9, "⇧", "⇟"],
        ["Ctrl", 0, 1, 2, 3, 4, "⇤", null, "⇥", 5, 6, 7, 8, "/", null, "↑", null],
        [null, "Cmd", "Fn", "⌦", "Alt", 0, "⍽", "AltGr", null, "Ctrl", null, "←", "↓", "→"],
    ],

    // todo
    fullMapping: [],

    mainFingerAssignment: [
        [1, 1, 1, 1, 2, 3, 3, 3, 6, 6, 7, 8, 8, 8, 8],
        [0, 0, 1, 2, 3, 3, 3, null, 6, 6, 7, 8, 9, 9, null],
        [0, 0, 1, 2, 3, 3, 3, 6, 6, 6, 7, 8, 9, 9, null],
        [0, 0, 1, 2, 3, 3, 3, 3, 6, 6, 6, 7, 8, 9, null, null, null],
        [null, 0, null, null, 4, 4, 5, 5, null, null, null, null, null, null],
    ],

    hasAltFinger: (row: number, col: number) =>
        (row == KeyboardRows.Lower) && ([1, 2, 3, 7, 8, 9].includes(col)),

    // Only fixed values can be used. See base-model.ts SKE_*
    // 'null' means the hand has to taken off the home-row. Those keys can't be used with letter or prose punctuation.
    singleKeyEffort: [
        [null, 3.0, 3.0, 2.0, 2.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 2.0, 2.0, 3.0, null],
        [2.0, 2.0, 1.0, 1.0, 1.5, 2.0, 3.0, 3.0, 2.0, 1.5, 1.0, 1.0, 2.0, 2.0, null],
        [1.5, 0.2, 0.2, 0.2, 0.2, 2.0, null, null, 2.0, 0.2, 0.2, 0.2, 0.2, 1.5, null],
        [3.0, 1.0, 1.5, 1.5, 1.0, 2.0, 3.0, 3.0, 3.0, 2.0, 1.0, 1.5, 1.5, 1.0, null, 2.0, null],
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
                    case 0: // gaps
                        return 1.25;
                    case 7:
                        return 0.5
                    case 14:
                        return 0.25
                    default:
                        return 1;
                }
            case KeyboardRows.Bottom:
                // arrow keys
                if (col > 10) return 1;
                switch (col) {
                    case 0: // indent
                        return 0.5;
                    case 5:
                    case 6: // todo: space bars should be 1.75; need to distribute the space
                        return 2;
                    case 8:
                    case 10: // right gaps
                        return 0.5;
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


export const eb65VerticalEnterLayoutModel: RowBasedLayoutModel = {
    ...eb65MidshiftLayoutModel,
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
                    case 14: // gap
                        return 1;
                }
        }
        return eb65MidshiftLayoutModel.keyWidth(row, col);
    },
    keyCapHeight: (row: KeyboardRows, col: number) => {
        if (row == KeyboardRows.Upper && col == 14) return 2;
        return 1;
    },
    thirtyKeyMapping: copyAndModifyKeymap(eb65MidshiftLayoutModel.thirtyKeyMapping!!, moveEnterToVertical),
    thumb30KeyMapping: copyAndModifyKeymap(eb65MidshiftLayoutModel.thumb30KeyMapping!!, moveEnterToVertical),
}

function moveEnterToVertical(mapping: LayoutMapping): LayoutMapping {
    mapping[KeyboardRows.Upper][13] = "⌫";
    mapping[KeyboardRows.Upper][14] = "⏎";
    mapping[KeyboardRows.Home][14] = null;
    return mapping;
}
