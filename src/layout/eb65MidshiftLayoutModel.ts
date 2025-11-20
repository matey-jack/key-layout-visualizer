import {FlexMapping, KEY_COLOR, KeyboardRows, LayoutMapping, RowBasedLayoutModel} from "../base-model.ts";
import {copyAndModifyKeymap, defaultKeyColor} from "./layout-functions.ts";

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
        ["Esc", "1", "2", "3", "4", "5", "[", "`~", "]", "6", "7", "8", "9", "0", "⌫"],
        ["↹", 0, 1, 2, 3, 4, "'", null, 5, 6, 7, 8, 9, "⏎", "⇞"],
        ["⇧", 0, 1, 2, 3, 4, "=", "-", 5, 6, 7, 8, 9, "⇧", "⇟"],
        ["Ctrl", 0, 1, 2, 3, 4, "⇤", null, "⇥", 5, 6, 7, 8, 9, null, "↑", null],
        [null, "Cmd", "Fn", "⌦", "Alt", "⍽", "⍽", "AltGr", null, "Ctrl", null, "←", "↓", "→"]
    ],

    thumb30KeyMapping: [
        ["Esc", "1", "2", "3", "4", "5", "[", "`~", "]", "6", "7", "8", "9", "0", "⌫"],
        ["↹", 0, 1, 2, 3, 4, "'", null, 5, 6, 7, 8, 9, "⏎", "⇞"],
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
                // Backspace
                return col == numCols - 1 ? 2 : 1;
            case KeyboardRows.Upper:
                switch (col) {
                    // the gap
                    case 7:
                        return 0.5;
                    // Tap / Enter
                    case 0:
                    case 13:
                        return 1.75;
                    default:
                        return 1;
                }
            case KeyboardRows.Home:
                switch (col) {
                    // Shift
                    case 0:
                    case (numCols - 2):
                        return 1.5;
                    default:
                        return 1;
                }
            case  KeyboardRows.Lower:
                switch (col) {
                    case 0:
                        return 1.25;
                    // gaps
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
                    // indent
                    case 0:
                        return 0.5;
                    // space bars as big as the largest other key on the board
                    case 5:
                    case 6:
                        return 2;
                    // right gaps
                    case 8:
                    case 10:
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

    keyColorClass(label: string, row: KeyboardRows, col: number) {
        if (label == "⏎" || label == "Esc") return KEY_COLOR.HIGHLIGHT;
        return defaultKeyColor(label, row, col);
    },
}


export const eb65VerticalEnterLayoutModel: RowBasedLayoutModel = {
    ...eb65MidshiftLayoutModel,
    keyWidth: (row: KeyboardRows, col: number) => {
        switch (row) {
            case KeyboardRows.Number:
                return 1;
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
    mapping[KeyboardRows.Number][14] = "⇞";
    mapping[KeyboardRows.Number][15] = "⇟";
    mapping[KeyboardRows.Upper][13] = "⌫";
    mapping[KeyboardRows.Upper][14] = "⏎";
    mapping[KeyboardRows.Home][14] = null;
    return mapping;
}


export const eb65MidShiftEnterLayoutModel: RowBasedLayoutModel = {
    ...eb65MidshiftLayoutModel,
    keyWidth: (row: KeyboardRows, col: number) => {
        switch (row) {
            case KeyboardRows.Number:
                return 1; // Uniform key size; PageUp/Down (or Home/End) instead of 2u Backspace.
            case KeyboardRows.Upper:
                switch (col) {
                    case 13: // a character key
                        return 1;
                    case 14: // Backspace
                        return 1.75
                }
                break;
            case KeyboardRows.Home:
                switch (col) {
                    case 13: // Shift
                        return 1;
                    case 14: // Enter
                        return 1.5;
                }
                break;
            // case KeyboardRows.Bottom:
            //     switch (col) {
            //         case 5:
            //         case 6: // space bars, same as largest other key
            //             return 1.75;
            //         case 8:
            //         case 10: // compensate with larger gaps
            //             return 0.75;
            //             // TODO: half of that should go to the left side 🤔
            //     }
        }
        return eb65MidshiftLayoutModel.keyWidth(row, col);
    },
    // keyCapWidth: (row: KeyboardRows, col: number) => {
    //     switch (row) {
    //         case KeyboardRows.Upper:
    //             if (col == 14) return 1.25;
    //     }
    //     return eb65MidShiftEnterLayoutModel.keyWidth(row, col);
    // },
    thirtyKeyMapping: copyAndModifyKeymap(eb65MidshiftLayoutModel.thirtyKeyMapping!!, moveEnterToMiddle),
    thumb30KeyMapping: copyAndModifyKeymap(eb65MidshiftLayoutModel.thumb30KeyMapping!!, moveEnterToMiddle),
}

function moveEnterToMiddle(mapping: LayoutMapping): LayoutMapping {
    mapping[KeyboardRows.Number][14] = "⇞";
    mapping[KeyboardRows.Number][15] = "⇟";
    mapping[KeyboardRows.Upper][13] = "'";
    mapping[KeyboardRows.Upper][14] = "⌫";
    mapping[KeyboardRows.Home][14] = "⏎";
    // mapping[KeyboardRows.Bottom][8] = "Fn";
    return mapping;
}