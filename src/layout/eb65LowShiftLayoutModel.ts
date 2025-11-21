import {FlexMapping, KeyboardRows, LayoutMapping, RowBasedLayoutModel} from "../base-model.ts";
import {copyAndModifyKeymap} from "./layout-functions.ts";
import {eb65KeyColorClass} from "./eb65LowshiftWideLayoutModel.ts";

export const eb65LowShiftLayoutModel: RowBasedLayoutModel = {
    name: "Ergoboard 65",
    description: `"The most ergonomic key layout that fits into a standard "65%" keyboard case 
    and has a traditional inverted-T arrow key cluster."
    Hand distance is still much better than ANSI keyboards. 
    Row stagger is equal to a "cleave-style ergonomic" keyboard.
    Thumb keys are added. 
    Key cap sizes are harmonized to facilitate customizing the keymap. 
    I specifically made this layout so that Enter/Return is the biggest key to create a visual link to an ANSI 65% keyboard, 
    where Return is also bigger than Backspace. 
    It's also practical to have both "space bars" be the same size as the return key, 
    because you can easily map Return on one of those bottom-row bars.`,

    // row lengths: 16, 15, 15 (with 0.5u gap), 16, 14
    thirtyKeyMapping: [
        ["Esc", "1", "2", "3", "4", "5", "[", "`~", "]", "6", "7", "8", "9", "0", "⇞", "⇟"],
        ["↹", 0, 1, 2, 3, 4, "=", null, 5, 6, 7, 8, 9, "-", "⏎"],
        ["⌦", 0, 1, 2, 3, 4, "⇤", "⇥", 5, 6, 7, 8, 9, "'", "⌫"],
        ["Fn", "⇧", 0, 1, 2, 3, 4, "\\", 9, 5, 6, 7, 8, "⇧", "↑", null],
        [null, "Ctrl", "Cmd", "CAPS", "Alt", "⍽", "⍽", "AltGr", "Fn", "Ctrl", null, "←", "↓", "→"],
    ],

    thumb30KeyMapping: [
        ["Esc", "1", "2", "3", "4", "5", "[", "`~", "]", "6", "7", "8", "9", "0", "⇞", "⇟"],
        ["↹", 0, 1, 2, 3, 4, "", null, 5, 6, 7, 8, 9, "=", "⏎"],
        ["⌦", 0, 1, 2, 3, 4, "⇤", "⇥", 5, 6, 7, 8, 9, "'", "⌫"],
        ["Fn", "⇧", 0, 1, 2, 3, 4, "\\", "/", 5, 6, 7, 8, "⇧", "↑", null],
        [null, "Ctrl", "Cmd", "CAPS", "Alt", 0, "⍽", "AltGr", "Fn", "Ctrl", null, "←", "↓", "→"],
    ],

    // todo
    fullMapping: [],

    mainFingerAssignment: [
        [null, 1, 1, 1, 2, 3, 3, 3, 6, 6, 7, 8, 8, 8, null, null],
        [0, 0, 1, 2, 3, 3, 3, null, 6, 6, 7, 8, 9, 9, 9],
        [0, 0, 1, 2, 3, 3, 3, 6, 6, 6, 7, 8, 9, 9, 9],
        [0, 0, 1, 2, 3, 3, 3, 3, 6, 6, 6, 7, 8, 9, null, null],
        [null, 0, 1, 2, 4, 4, 5, 5, null, 7, null, null, null, null],
    ],

    hasAltFinger: (row: number, col: number) =>
        (row == KeyboardRows.Lower) && ([1, 2, 3, 7, 8, 9].includes(col)),

    // Only fixed values can be used. See base-model.ts SKE_*
    // 'null' means the hand has to taken off the home-row. Those keys can't be used with letter or prose punctuation.
    singleKeyEffort: [
        [null, 3.0, 3.0, 2.0, 2.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 2.0, 2.0, 3.0, null, null],
        [2.0, 2.0, 1.0, 1.0, 1.5, 2.0, 3.0, 3.0, 2.0, 1.5, 1.0, 1.0, 2.0, 2.0, 3.0],
        [1.5, 0.2, 0.2, 0.2, 0.2, 2.0, 3.0, 3.0, 2.0, 0.2, 0.2, 0.2, 0.2, 1.5, 2.0],
        [3.0, 1.0, 1.5, 1.5, 1.0, 2.0, 3.0, 3.0, 3.0, 2.0, 1.0, 1.5, 1.5, 1.0, null, null],
        [null, 2.0, 1.5, null, 1.0, 0.2, 0.2, 1.0, null, null, null, null, null],
    ],

    rowStart: (_row: KeyboardRows) => 0,

    keyWidth: (row: KeyboardRows, col: number): number => {
        const lastCol = eb65LowShiftLayoutModel.thirtyKeyMapping![row].length - 1;
        switch (row) {
            case KeyboardRows.Number:
                return 1;
            case KeyboardRows.Upper:
                switch (col) {
                    case 0:
                    case lastCol:
                        return 1.75; // Tab and Backspace
                    case 7:
                        return 0.5; // the gap
                }
                return 1;
            case KeyboardRows.Home:
                switch (col) {
                    case 0:
                    case lastCol:
                        return 1.5; // Caps and Enter
                }
                return 1;
            case KeyboardRows.Lower:
                return 1;
            case KeyboardRows.Bottom:
                /*
Center between hands is 7.5 left, 8.5 right.
Left side has 0.5 indent 4 × 1.25 plus 1.75 = 7.25. Surplus of 0.25.
Right side has 1.75 + 2 × 1.25 + 1 + 3 = 8.25.
Let's make the gap 0.5 for better looks and accept spaces to be split slightly off-center.
Then at least the right outer space key is easy to hit; the left one not so much.
                 */
                const beforeArrows = 10;
                switch (col) {
                    case 0:
                        return 0.5;
                    case 5:
                    case 6:
                        return 1.75;
                    case beforeArrows - 2:
                        return 1;
                    case beforeArrows:
                        return 0.5;
                    default:
                        return col > beforeArrows ? 1 : 1.25;
                }
            default:
                return 1;
        }
    },

    leftHomeIndex: 4,
    rightHomeIndex: 9,

    staggerOffsets: [0.5, 0.25, 0, -0.5],
    symmetricStagger: true,

    getSpecificMapping: (_: FlexMapping) => undefined,

    keyColorClass: eb65KeyColorClass,
}

// todo: move this where it's actually needed and use it there.
function isKeyWithMicrogap(col: number) {
    return col > 0 && col < 4;
}

export const eb65BigEnterLayoutModel: RowBasedLayoutModel = {
    ...eb65LowShiftLayoutModel,
    keyWidth: (row: KeyboardRows, col: number): number => {
        const lastCol = eb65BigEnterLayoutModel.thirtyKeyMapping![row].length - 1;
        switch (row) {
            case KeyboardRows.Home:
                switch (col) {
                    case lastCol:
                        return 2.5; // Big Enter
                }
                break;
            case KeyboardRows.Bottom:
                return [0.25, 1.25, 1.25, 1, 1.25, 2.5, 2.5, 1.25, 0.25, 1.25, 0.25, 1, 1, 1][col];
        }
        return eb65LowShiftLayoutModel.keyWidth(row, col);
    },
    thirtyKeyMapping: copyAndModifyKeymap(eb65LowShiftLayoutModel.thirtyKeyMapping!!, moveKeys),
    thumb30KeyMapping: copyAndModifyKeymap(eb65LowShiftLayoutModel.thumb30KeyMapping!!, moveKeys),
}

function moveKeys(mapping: LayoutMapping): LayoutMapping {
    mapping[KeyboardRows.Number][7] = "=";
    mapping[KeyboardRows.Upper][6] = "-";
    mapping[KeyboardRows.Upper].splice(-2, 2, "'", "⏎");
    mapping[KeyboardRows.Home].splice(-2, 2, "⌫");
    mapping[KeyboardRows.Bottom][8] = null;
    return mapping;
}
