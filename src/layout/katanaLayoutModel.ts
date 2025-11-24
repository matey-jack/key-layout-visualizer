import {FlexMapping, KeyboardRows, RowBasedLayoutModel} from "../base-model.ts";

// those values are accumulated by the stagger of 0.25, with the home row being maximal length.
const widthOfEdgeKey = [1, 1.5, 1.25, 1]

export const katanaLayoutModel: RowBasedLayoutModel = {
    name: "Katana 60",
    description: `The original "Katana" design by RominRonin. 
    An ergonomic keyboard layout that fits into a standard ANSI 60% case.
    Symmetric 0.25 stagger and a hand distance similar to MS Ergonomic Keyboard. `,

    // row lengths: 15, 14, 14 (but +1 gap), 15, 12
    // I'd swap ";" and "'" in the keymap, but that transcends the box of the data model.
    // It's the bane of Qwerty that ";" is considered part of the core layout, but "'" and "-" are not.
    thirtyKeyMapping: [
        ["Esc", "`~", "1", "2", "3", "4", "5", "lock", "6", "7", "8", "9", "0", "-", "="],
        ["↹", 0, 1, 2, 3, 4, "[", "]", 5, 6, 7, 8, 9, "⌫"],
        ["'", 0, 1, 2, 3, 4, "⇤", null, "⇞", 5, 6, 7, 8, 9, "⏎"],
        ["⇧", 0, 1, 2, 3, 4, "⇥", "ins", "⇟", 5, 6, 7, 8, 9, "⇧"],
        ["Fn", "Ctrl", "Cmd", "Alt", "⍽", "⌦", "⍽", "AltGr", "←", "↑", "↓", "→"],
    ],

    // todo
    // thumb30KeyMapping: [
    //     ["Esc", "1", "2", "3", "4", "5", "[", "]", "6", "7", "8", "9", "0", "⌫"],
    //     ["↹", 0, 1, 2, 3, 4, "=", null, "`~", 5, 6, 7, 8, 9, "⏎"],
    //     ["", 0, 1, 2, 3, 4, "⇤", "\\", "⇥", 5, 6, 7, 8, 9, "'"],
    //     ["⇧", 0, 1, 2, 3, 4, "⇞", "⇟", "/", 5, 6, 7, 8, "⇧"],
    //     ["Hack", "Ctrl", "Alt", "Cmd", 0, "⍽", "⌦", "AltGr", "Menu", "Cmd", "Ctrl"],
    // ],

    // todo
    fullMapping: [],

    // note that for data model reason, we also have to assign a finger to gaps.
    // but it will never be shown or used in any calulations.
    mainFingerAssignment: [
        [1, 1, 1, 2, 2, 3, 3, 6, 6, 6, 7, 8, 8, 8, 8],
        [1, 0, 1, 2, 3, 3, 3, 6, 6, 6, 7, 8, 9, 9],
        [0, 0, 1, 2, 3, 3, 3, 6, 6, 6, 6, 7, 8, 9, 9],
        [0, 0, 1, 2, 3, 3, 3, 6, 6, 6, 6, 7, 8, 9, 9],
        [0, 1, 2, 4, 4, 5, 5, 5, 6, 7, 8, 9],
    ],

    hasAltFinger: (row: number, col: number) =>
        (row == KeyboardRows.Lower) && ([1, 2, 3, 7, 8, 9].includes(col)),

    // Only fixed values can be used. see base-model.ts SKE_*
    singleKeyEffort: [
        [3.0, 3.0, 2.0, 2.0, 2.0, 3.0, 3.0, 3.0, 3.0, 3.0, 2.0, 2.0, 2.0, 3.0, 3.0],
        [2.0, 2.0, 1.0, 1.0, 1.5, 2.0, 3.0, 3.0, 2.0, 1.5, 1.0, 1.0, 2.0, 2.0],
        [1.5, 0.2, 0.2, 0.2, 0.2, 2.0, 3.0, 3.0, 3.0, 2.0, 0.2, 0.2, 0.2, 0.2, 1.5],
        [2.0, 1.0, 1.5, 1.5, 1.0, 2.0, 3.0, 3.0, 3.0, 2.0, 1.0, 1.5, 1.5, 1.0, 2.0],
        [3.0, 3.0, 2.0, 1.0, 0.2, 1.5, 0.2, 1.0, null, null, null, null],
    ],

    rowStart: [0, 0, 0, 0, 0],

    keyWidth: (row: KeyboardRows, col: number): number => {
        const numCols = katanaLayoutModel.thirtyKeyMapping![row].length;
        if (row == KeyboardRows.Bottom) {
            if (col == 0 || col == 5 || col >= 7) return 1;
            if (col == 4) return 2.25;
            if (col == 6) return 2;
            return 1.25;
        }
        if (col == 0 || col == numCols - 1) {
            return widthOfEdgeKey[row];
        }
        if (row == KeyboardRows.Home && (col == 7)) {
            return 0.5;
        }
        return 1;
    },

    leftHomeIndex: 4,
    rightHomeIndex: 10,

    staggerOffsets: [0.75, 0.25, 0, -0.25],
    symmetricStagger: true,

    getSpecificMapping: (_: FlexMapping) => undefined,
}
