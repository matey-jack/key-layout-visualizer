import {FlexMapping, KEY_COLOR, KeyboardRows, RowBasedLayoutModel} from "../base-model.ts";
import {defaultKeyColor} from "./layout-functions.ts";

export const ergoPlank65LayoutModel: RowBasedLayoutModel = {
    name: "ErgoPlank 65",
    description: `"The most ergonomic key layout that fits into a standard "65%" keyboard case."
    Hand distance is maximized. Row stagger is equal to a "cleave-style ergonomic" keyboard.
    Thumb keys are added. 
    Key cap sizes are harmonized to facilitate customizing the keymap. 
    This is based on the "Harmonic" layout as well as the "Katana" design by RominRonin. 
    Biggest difference to the Katana is that the Shift keys are closer to the Pinky home position.
    This is achieved by making the Shift keys bigger and the home row edge key minimally small, i.e. 1u.`,

    // row lengths: 16, 15, 14 (with 0.5u gap), 16, bottom TODO
    thirtyKeyMapping: [
        ["Esc", "`~", "1", "2", "3", "4", "5", "[", "]", "6", "7", "8", "9", "0", "\\", "⇤"],
        ["↹", 0, 1, 2, 3, 4, "-", null, 5, 6, 7, 8, 9, "'", "⌫"],
        ["Caps", 0, 1, 2, 3, 4, "⇞", "⇟",  5, 6, 7, 8, 9, "⏎"],
        ["Fn", "⇧", 0, 1, 2, 3, 4, "=", 9, 5, 6, 7, 8, "⇧", "↑", "⇥"],
        [null, "Ctrl", "Cmd", "⌦", "Alt", "⍽", "⍽", "AltGr", "Ctrl", null, "←", "↓", "→"]
    ],

    thumb30KeyMapping: [
        ["Esc", "`~", "1", "2", "3", "4", "5", "[", "]", "6", "7", "8", "9", "0", "\\", "⇤"],
        ["↹", 0, 1, 2, 3, 4, "-", null, 5, 6, 7, 8, 9, "'", "⌫"],
        ["⌦", 0, 1, 2, 3, 4, "⇞", "⇟", 5, 6, 7, 8, 9, "⏎"],
        ["Fn", "⇧", 0, 1, 2, 3, 4, "=", "/", 5, 6, 7, 8, "⇧", "↑", "⇥"],
        [null, "Ctrl", "Cmd", "", "Alt", 0, "⍽", "AltGr", "Ctrl", null, "←", "↓", "→"],
    ],

    // todo
    fullMapping: [],

    // note that for data model reason, we also have to assign a finger to gaps.
    // but it will never be shown or used in any calulations.
    mainFingerAssignment: [
        [1, 1, 1, 1, 2, 3, 3, 3, 6, 6, 7, 8, 8, 8, 8, null],
        [0, 0, 1, 2, 3, 3, 3, null, 6, 6, 7, 8, 9, 9, 9],
        [0, 0, 1, 2, 3, 3, 3, 6, 6, 6, 7, 8, 9, 9],
        [0, 0, 1, 2, 3, 3, 3, 3, 6, 6, 6, 7, 8, 9, null, null],
        [null, 0, 1, 2, 4, 4, 5, 5, 7, null, null, null, null],
    ],

    hasAltFinger: (row: number, col: number) =>
        (row == KeyboardRows.Lower) && ([1, 2, 3, 7, 8, 9].includes(col)),

    // Only fixed values can be used. See base-model.ts SKE_*
    // 'null' means the hand has to taken off the home-row. Those keys can't be used with letter or prose punctuation.
    singleKeyEffort: [
        [null, 3.0, 3.0, 2.0, 2.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 2.0, 2.0, 3.0, 3.0, null],
        [2.0, 2.0, 1.0, 1.0, 1.5, 2.0, 3.0, 3.0, 2.0, 1.5, 1.0, 1.0, 2.0, 2.0, 3.0],
        [1.5, 0.2, 0.2, 0.2, 0.2, 2.0, 3.0, 3.0, 2.0, 0.2, 0.2, 0.2, 0.2, 1.5],
        [3.0, 1.0, 1.5, 1.5, 1.0, 2.0, 3.0, 3.0, 3.0, 2.0, 1.0, 1.5, 1.5, 1.0, null, null],
        [null, 2.0, 1.5, null, 1.0, 0.2, 0.2, 1.0, null, null, null, null, null],
    ],

    rowStart: (_row: KeyboardRows) => 0,

    keyWidth: (row: KeyboardRows, col: number): number => {
        const numCols = ergoPlank65LayoutModel.thirtyKeyMapping![row].length;
        if (row == KeyboardRows.Upper && (col == 7)) {
            // the gap
            return 0.5;
        }
        if (row == KeyboardRows.Home && col == numCols - 1) {
            // Big-mouth Enter
            return 2.5;
        }
        if (row == KeyboardRows.Bottom) {
            return [0.25, 1.25, 1.25, 1.25, 1.25, 2.5, 2.5, 1.25, 1.25, 0.25, 1, 1, 1][col];
        }
        const widthOfEdgeKey = [1, 1.75, 1.5, 1]
        if (col == 0 || col == numCols - 1) {
            return widthOfEdgeKey[row];
        }
        return 1;
    },

    leftHomeIndex: 4,
    rightHomeIndex: 9,

    staggerOffsets: [0.5, 0.25, 0, -0.5],
    symmetricStagger: true,

    getSpecificMapping: (_: FlexMapping) => undefined,

    keyColorClass(label: string, row: KeyboardRows, col: number) {
        if (label == "⏎" || label == "Esc") return KEY_COLOR.HIGHLIGHT;
        return defaultKeyColor(label, row, col);
    },
}
