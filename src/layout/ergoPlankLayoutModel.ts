import {FlexMapping, KeyboardRows, RowBasedLayoutModel} from "../base-model.ts";

// todo: data model for gaps between keys and for using a smaller keycap plus gaps on Esc.
const caseWidth = 15;

// those values are accumulated by the stagger of 0.25, with the home row being maximal length.
const widthOfEdgeKey = [1.5, 1.25, 1, 1.75]

export const ergoPlankRegularLayoutModel: RowBasedLayoutModel = {
    name: "ErgoPlank",
    description: `The most ergonomic key layout that fits into a standard "60%" keyboard case. 
    Hand distance is maximized. Row stagger is equal to a "cleave-style ergonomic" keyboard.
    Thumb keys are added. 
    Key cap sizes are harmonized to facilitate customizing the keymap. 
    This is based on the "Harmonic" layout as well as the "Katana" design by RominRonin. `,

    // row lengths: 14, 14, 15, 13, 12
    thirtyKeyMapping: [
        ["Esc", "1", "2", "3", "4", "5", "[", "]", "6", "7", "8", "9", "0", "⌫"],
        ["↹", 0, 1, 2, 3, 4, "-", null, "=", 5, 6, 7, 8, 9, "⏎"],
        ["", 0, 1, 2, 3, 4, "`~", "", "\\", 5, 6, 7, 8, 9, "'"],
        ["⇧", 0, 1, 2, 3, 4, "", 9, 5, 6, 7, 8, "⇧"],
        ["Ctrl", "Cmd", "", "Alt", "Fn", "⏎", "⍽", "Fn", "AltGr", "Menu", "Cmd", "Ctrl"],
    ],

    thumb30KeyMapping: [
        ["Esc", "1", "2", "3", "4", "5", "[", "]", "6", "7", "8", "9", "0", "⌫"],
        ["↹", 0, 1, 2, 3, 4, "=", null, "`~", 5, 6, 7, 8, 9, "⏎"],
        ["\\", 0, 1, 2, 3, 4, "", "", "", 5, 6, 7, 8, 9, "'"],
        ["⇧", 0, 1, 2, 3, 4, "", "/", 5, 6, 7, 8, "⇧"],
        ["Ctrl", "Cmd", "", "Alt", "Fn", 0, "⍽", "Fn", "AltGr", "Menu", "Cmd", "Ctrl"],
    ],

    // todo
    fullMapping: [],

    // note that for data model reason, we also have to assign a finger to gaps.
    // but it will never be shown or used in any calulations.
    mainFingerAssignment: [
        [1, 1, 1, 2, 2, 3, 3, 6, 6, 7, 8, 8, 8, 8],
        [1, 0, 1, 2, 3, 3, 3, 6, 6, 6, 6, 7, 8, 9, 9],
        [0, 0, 1, 2, 3, 3, 3, 6, 6, 6, 6, 7, 8, 9, 9],
        [0, 1, 2, 3, 3, 3, 6, 6, 6, 6, 7, 8, 9],
        [0, 1, 2, 4, 4, 4, 5, 5, 5, 7, 8, 9],
    ],

    hasAltFinger: (row: number, col: number) =>
        (row == KeyboardRows.Lower) && ([1, 2, 3, 7, 8, 9].includes(col)),

    // Only fixed values can be used. see base-model.ts SKE_*
    singleKeyEffort: [
        [3.0, 3.0, 2.0, 2.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 2.0, 2.0, 3.0, 3.0],
        [2.0, 2.0, 1.0, 1.0, 1.5, 2.0, 3.0, 3.0, 3.0, 2.0, 1.5, 1.0, 1.0, 2.0, 2.0],
        [1.5, 0.2, 0.2, 0.2, 0.2, 2.0, 3.0, 3.0, 3.0, 2, 0.2, 0.2, 0.2, 0.2, 1.5],
        [1.0, 1.5, 1.5, 1.0, 2.0, 3.0, 3.0, 3.0, 2.0, 1.0, 1.5, 1.5, 1.0],
        [3.0, 3.0, 2.0, 1.5, 0.2, 1.0, 1.0, 0.2, 1.5, 2.0, 3.0, 3.0],
    ],

    rowStart: (_: KeyboardRows) => 0,

    keyWidth: (row: KeyboardRows, col: number): number => {
        if (row == KeyboardRows.Bottom) {
            return 1.25;
        }
        const numCols = ergoPlankLayoutModel.thirtyKeyMapping[row].length;
        if (col == 0 || col == numCols - 1) {
            return widthOfEdgeKey[row];
        }
        if (row == KeyboardRows.Upper && (col == 7)) {
            return 0.5;
        }
        if (row == KeyboardRows.Lower && (col == 6)) {
            return 1.5;
        }
        return 1;
    },

    leftHomeIndex: 4,
    rightHomeIndex: 10,

    staggerOffsets: [0.5, 0.25, 0, -0.25],

    getSpecificMapping: (_: FlexMapping) => undefined,
}

export const ergoPlankLayoutModel: RowBasedLayoutModel = {
    ...ergoPlankRegularLayoutModel,
    thirtyKeyMapping: replaceLast(ergoPlankRegularLayoutModel.thirtyKeyMapping,
        ["Ctrl", "Cmd", "", "Alt", "⏎", "Fn", "⍽", "AltGr", "Menu", "Cmd", "Ctrl"]
    ),
    thumb30KeyMapping: replaceLast(ergoPlankRegularLayoutModel.thumb30KeyMapping,
        ["Ctrl", "Cmd", "", "Alt", 0, "Fn", "⍽", "AltGr", "Menu", "Cmd", "Ctrl"]
    ),
    // fullMapping: replaceLast(ergoPlankRegularLayoutModel.fullMapping, []),
    singleKeyEffort: replaceLast(ergoPlankRegularLayoutModel.singleKeyEffort,
        [3.0, 3.0, 2.0, 1.5, 0.2, 1.5, 0.2, 1.5, 2.0, 3.0, 3.0]
    ),
    mainFingerAssignment: replaceLast(ergoPlankRegularLayoutModel.mainFingerAssignment,
        [0, 1, 2, 4, 4, 5, 5, 5, 7, 8, 9]
    ),
    keyWidth: (row: KeyboardRows, col: number): number => {
        if (row == KeyboardRows.Bottom) {
            switch (col) {
                case 4:
                case 6:
                    return 1.75;
                case 5:
                    return 1.5;
            }
        }
        return ergoPlankRegularLayoutModel.keyWidth(row, col);
    }
}

function replaceLast<T>(list: T[], last: T) {
    return [...list.slice(0, -1), last];
}