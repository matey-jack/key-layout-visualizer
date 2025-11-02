import {FlexMapping, KEY_COLOR, KeyboardRows, RowBasedLayoutModel} from "../base-model.ts";
import {defaultKeyColor} from "./layout-functions.ts";

// those values are accumulated by the stagger of 0.25, with the home row being maximal length.
const widthOfEdgeKey = [1.5, 1.25, 1, 1.25]

export const ergoPlankRegularLayoutModel: RowBasedLayoutModel = {
    name: "ErgoPlank",
    description: `"The most ergonomic key layout that fits into a standard "60%" keyboard case."
    Hand distance is maximized. Row stagger is equal to a "cleave-style ergonomic" keyboard.
    Thumb keys are added. 
    Key cap sizes are harmonized to facilitate customizing the keymap. 
    This is based on the "Harmonic" layout as well as the "Katana" design by RominRonin. 
    Biggest difference to the Katana is that the Shift keys are closer to the Pinky home position.
    This is achieved by making the Shift keys bigger and the home row edge key minimally small, i.e. 1u.`,

    // row lengths: 14, 14 (but +1 gap!), 15, 14, 12
    thirtyKeyMapping: [
        ["Esc", "1", "2", "3", "4", "5", "[", "]", "6", "7", "8", "9", "0", "⌫"],
        ["↹", 0, 1, 2, 3, 4, "-", null, "=", 5, 6, 7, 8, 9, "\\"],
        ["⌦", 0, 1, 2, 3, 4, "⇤", "`~", "⇥", 5, 6, 7, 8, 9, "'"],
        ["⇧", 0, 1, 2, 3, 4, "⇞", "⇟", 9, 5, 6, 7, 8, "⇧"],
        ["Ctrl", "Cmd", "", "Alt", "Fn", "⏎", "⍽", "Fn", "AltGr", "Menu", "Cmd", "Ctrl"],
    ],

    thumb30KeyMapping: [
        ["Esc", "1", "2", "3", "4", "5", "[", "]", "6", "7", "8", "9", "0", "⌫"],
        ["↹", 0, 1, 2, 3, 4, "=", null, "`~", 5, 6, 7, 8, 9, "⏎"],
        ["⌦", 0, 1, 2, 3, 4, "⇤", "\\", "⇥", 5, 6, 7, 8, 9, "'"],
        ["⇧", 0, 1, 2, 3, 4, "⇞", "⇟", "/", 5, 6, 7, 8, "⇧"],
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
        [0, 1, 2, 3, 3, 3, 3, 6, 6, 6, 6, 7, 8, 9],
        [0, 1, 2, 4, 4, 4, 5, 5, 5, 7, 8, 9],
    ],

    hasAltFinger: (row: number, col: number) =>
        (row == KeyboardRows.Lower) && ([1, 2, 3, 7, 8, 9].includes(col)),

    // Only fixed values can be used. see base-model.ts SKE_*
    singleKeyEffort: [
        [3.0, 3.0, 2.0, 2.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 2.0, 2.0, 3.0, 3.0],
        [2.0, 2.0, 1.0, 1.0, 1.5, 2.0, 3.0, 3.0, 3.0, 2.0, 1.5, 1.0, 1.0, 2.0, 2.0],
        [1.5, 0.2, 0.2, 0.2, 0.2, 2.0, 3.0, 3.0, 3.0, 2.0, 0.2, 0.2, 0.2, 0.2, 1.5],
        [1.0, 1.5, 1.5, 1.0, 2.0, 3.0, 3.0, 3.0, 3.0, 2.0, 1.0, 1.5, 1.5, 1.0],
        [3.0, 3.0, 2.0, 1.5, 0.2, 1.0, 1.0, 0.2, 1.5, 2.0, 3.0, 3.0],
    ],

    rowStart: (row: KeyboardRows) => row >= KeyboardRows.Lower ? 0.25 : 0,

    keyWidth: (row: KeyboardRows, col: number): number => {
        const numCols = ergoPlankLayoutModel.thirtyKeyMapping![row].length;
        if (row == KeyboardRows.Bottom) {
            // using 12 equal 1.25u keys is pretty, but the central ones are hard to reach.
            // we could use 10 equal 1.5u keys,
            // that would still be enough keys, but not sure if that improves the center enough.
            // also I think it's too big for modifiers under the palm.
            return 1.25;
        }
        if (col == 0 || col == numCols - 1) {
            return widthOfEdgeKey[row];
        }
        if (row == KeyboardRows.Upper && (col == 7)) {
            return 0.5;
        }
        // if (row == KeyboardRows.Lower && (col == 6)) {
        //     return 1.5;
        // }
        return 1;
    },

    leftHomeIndex: 4,
    rightHomeIndex: 10,

    staggerOffsets: [0.5, 0.25, 0, -0.5],
    symmetricStagger: true,

    getSpecificMapping: (_: FlexMapping) => undefined,
}

export const ergoPlankLayoutModel: RowBasedLayoutModel = {
    ...ergoPlankRegularLayoutModel,
    thirtyKeyMapping: replaceLast(ergoPlankRegularLayoutModel.thirtyKeyMapping!,
        ["Ctrl", "Cmd", "", "Alt", "⏎", "Fn", "⍽", "AltGr", "Menu", "Cmd", "Ctrl"]
    ),
    thumb30KeyMapping: replaceLast(ergoPlankRegularLayoutModel.thumb30KeyMapping!,
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
            // Having one central key serves the purpose of bringing its neighbors into the "hands-fixed" range of the thumbs.
            // I saw this not only on the Katana60, but also some conventional keyboards with a split space bar.
            // The big question is: can we size and position thumb keys such that each thumb can comfortably hit two of them
            // without moving the hand?
            // The typical use would be one per thumb as Space or a letter, the other as a modifier or layer key.
            switch (col) {
                case 4:
                case 6:
                    // todo: make it a standard 1.5 and spread the wasted 0.25u evenly across all 10 bottom row gaps.
                    // this is going to need another change in the data model.
                    return 1.5; // + 0.125;
                case 5:
                    return 1.25;
            }
        }
        return ergoPlankRegularLayoutModel.keyWidth(row, col);
    },

    // keyCapWidth(row: KeyboardRows, col: number): number {
    //     // We have this entire concept of keyCapWidth only for the Escape key.
    //     // But, let's see: maybe it will be useful elsewhere later.
    //     if (row == KeyboardRows.Number && col == 0) return 1;
    //     return this.keyWidth(row, col);
    // },

    keyColorClass(label: string, row: KeyboardRows, col: number) {
        if (label == "⏎" || label == "Esc") return KEY_COLOR.HIGHLIGHT;
        return defaultKeyColor(label, row, col);
    },
}

function replaceLast<T>(list: T[], last: T) {
    return [...list.slice(0, -1), last];
}