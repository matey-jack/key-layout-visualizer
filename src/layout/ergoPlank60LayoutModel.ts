import {FlexMapping, KEY_COLOR, KeyboardRows, RowBasedLayoutModel} from "../base-model.ts";
import {defaultKeyColor} from "./layout-functions.ts";

export function getEP60LayoutModel(includeArrows: boolean) {
    return includeArrows ? ep60WithArrowsLayoutModel : ergoPlank60LayoutModel;
}

export const ergoPlank60LayoutModel: RowBasedLayoutModel = {
    name: "ErgoPlank 60",
    description: `"The most ergonomic key layout that fits into a standard "60%" keyboard case."
    Hand distance is maximized. Row stagger is equal to a "cleave-style ergonomic" keyboard.
    Thumb keys are added. 
    Key cap sizes are harmonized to facilitate customizing the keymap. 
    This is based on the "Harmonic" layout as well as the "Katana" design by RominRonin. 
    Biggest difference to the Katana is that the Shift keys are closer to the Pinky home position.
    This is achieved by making the Shift keys bigger and the home row edge key minimally small, i.e. 1u.`,

    // row lengths: 14, 14 (but +1 gap!), 15, 14, 11
    thirtyKeyMapping: [
        ["Esc", "1", "2", "3", "4", "5", "[", "]", "6", "7", "8", "9", "0", "⌫"],
        ["↹", 0, 1, 2, 3, 4, "-", null, "=", 5, 6, 7, 8, 9, "\\"],
        ["⌦", 0, 1, 2, 3, 4, "⇤", "`~", "⇥", 5, 6, 7, 8, 9, "'"],
        ["⇧", 0, 1, 2, 3, 4, "⇞", "⇟", 9, 5, 6, 7, 8, "⇧"],
        ["Ctrl", "Cmd", "", "Alt", "⏎", "Fn", "⍽", "AltGr", "Menu", "Cmd", "Ctrl"],
    ],

    thumb30KeyMapping: [
        ["Esc", "1", "2", "3", "4", "5", "[", "]", "6", "7", "8", "9", "0", "⌫"],
        ["↹", 0, 1, 2, 3, 4, "=", null, "`~", 5, 6, 7, 8, 9, "⏎"],
        ["⌦", 0, 1, 2, 3, 4, "⇤", "\\", "⇥", 5, 6, 7, 8, 9, "'"],
        ["⇧", 0, 1, 2, 3, 4, "⇞", "⇟", "/", 5, 6, 7, 8, "⇧"],
        ["Ctrl", "Cmd", "", "Alt", 0, "Fn", "⍽", "AltGr", "Menu", "Cmd", "Ctrl"],
    ],

    // todo
    fullMapping: [],

    // note that for data model reason, we also have to assign a finger to gaps.
    // but it will never be shown or used in any calulations.
    mainFingerAssignment: [
        [1, 1, 1, 2, 3, 3, 3, 6, 6, 6, 7, 8, 8, 8],
        [1, 0, 1, 2, 3, 3, 3, null, 6, 6, 6, 7, 8, 9, 9],
        [0, 0, 1, 2, 3, 3, 3, 6, 6, 6, 6, 7, 8, 9, 9],
        [0, 1, 2, 3, 3, 3, 3, 6, 6, 6, 6, 7, 8, 9],
        [0, 1, 2, 4, 4, 5, 5, 5, 7, 8, 9],
    ],

    hasAltFinger: (row: number, col: number) =>
        (row == KeyboardRows.Lower) && ([1, 2, 3, 7, 8, 9].includes(col)),

    // Only fixed values can be used. see base-model.ts SKE_*
    singleKeyEffort: [
        [3.0, 3.0, 2.0, 2.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 2.0, 2.0, 3.0, 3.0],
        [2.0, 2.0, 1.0, 1.0, 1.5, 2.0, 3.0, 3.0, 3.0, 2.0, 1.5, 1.0, 1.0, 2.0, 2.0],
        [1.5, 0.2, 0.2, 0.2, 0.2, 2.0, 3.0, 3.0, 3.0, 2.0, 0.2, 0.2, 0.2, 0.2, 1.5],
        [1.0, 1.5, 1.5, 1.0, 2.0, 3.0, 3.0, 3.0, 3.0, 2.0, 1.0, 1.5, 1.5, 1.0],
        [3.0, 3.0, 2.0, 1.5, 0.2, 1.5, 0.2, 1.5, 2.0, 3.0, 3.0],
    ],

    rowStart: (row: KeyboardRows) => row >= KeyboardRows.Lower ? 0.25 : 0,

    keyWidth: (row: KeyboardRows, col: number): number => {
        const numCols = ergoPlank60LayoutModel.thirtyKeyMapping![row].length;
        if (row == KeyboardRows.Bottom) {
            // Having one central key serves the purpose of bringing its neighbors into the "hands-fixed" range of the thumbs.
            // I saw this not only on the Katana60, but also some conventional keyboards with a split space bar.
            // The big question is: can we size and position thumb keys such that each thumb can comfortably hit two of them
            // without moving the hand?
            // The typical use would be one per thumb as Space or a letter, the other as a modifier or layer key.
            switch (col) {
                case 4:
                case 6:
                    return 1.5;
                default:
                    return 1.25;
            }
        }
        const widthOfEdgeKey = [1.5, 1.25, 1, 1.25];
        if (col == 0 || col == numCols - 1) {
            return widthOfEdgeKey[row];
        }
        if (row == KeyboardRows.Upper && col == 7) {
            return 0.5;
        }
        return 1;
    },

    leftHomeIndex: 4,
    rightHomeIndex: 10,

    staggerOffsets: [0.5, 0.25, 0, -0.5],
    symmetricStagger: true,

    getSpecificMapping: (_: FlexMapping) => undefined,

    keyColorClass(label: string, row: KeyboardRows, col: number) {
        if (label == "⏎" || label == "Esc") return KEY_COLOR.HIGHLIGHT;
        return defaultKeyColor(label, row, col);
    },
}

export const ep60WithArrowsLayoutModel: RowBasedLayoutModel = {
    ...ergoPlank60LayoutModel,
    thirtyKeyMapping: replaceLast(ergoPlank60LayoutModel.thirtyKeyMapping!,
        [null, "Ctrl", "Cmd", "AltGr", "Alt", "⏎", "Fn", "⍽", "Ctrl", null, "←", "↑", "↓", "→"]
    ),
    thumb30KeyMapping: replaceLast(ergoPlank60LayoutModel.thumb30KeyMapping!,
        [null, "Ctrl", "Cmd", "AltGr", "Alt", 0, "Fn", "⍽", "Ctrl", null, "←", "↑", "↓", "→"]
    ),
    // fullMapping: replaceLast(ergoPlankRegularLayoutModel.fullMapping, []),
    singleKeyEffort: replaceLast(ergoPlank60LayoutModel.singleKeyEffort,
        [null, 3.0, 3.0, 2.0, 1.5, 0.2, 1.5, 0.2, 1.5, null, null, null, null, null]
    ),
    mainFingerAssignment: replaceLast(ergoPlank60LayoutModel.mainFingerAssignment,
        [null, 0, 1, 2, 4, 4, 5, 5, 5, 7, null, null, null, null, null]
    ),
    rowStart: (row: KeyboardRows) => row == KeyboardRows.Lower ? 0.25 : 0,
    keyWidth: (row: KeyboardRows, col: number): number => {
        if (row == KeyboardRows.Bottom) {
            if (col > 9) {
                return 1;
            }
            switch (col) {
                case 0:
                case 9:
                    // gaps
                    return 0.25;
                case 5:
                case 7:
                    // "space bars"
                    return 1.5;
                default:
                    return 1.25;
            }
        }
        return ergoPlank60LayoutModel.keyWidth(row, col);
    },
}

function replaceLast<T>(list: T[], last: T) {
    return [...list.slice(0, -1), last];
}