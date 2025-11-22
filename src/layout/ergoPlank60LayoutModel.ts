import {FlexMapping, KEY_COLOR, KeyboardRows, LayoutMapping, RowBasedLayoutModel} from "../base-model.ts";
import {copyAndModifyKeymap, defaultKeyColor, keyColorHighlightsClass} from "./layout-functions.ts";

export const ergoPlank60AnsiAngleLayoutModel: RowBasedLayoutModel = {
    name: "Ergoplank 60 ANSI angle",
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
        ["Ctrl", "Cmd", "Fn", "Alt", "⏎", "", "⍽", "AltGr", "Menu", "Cmd", "Ctrl"],
    ],

    thumb30KeyMapping: [
        ["Esc", "1", "2", "3", "4", "5", "[", "]", "6", "7", "8", "9", "0", "⌫"],
        ["↹", 0, 1, 2, 3, 4, "=", null, "\\", 5, 6, 7, 8, 9, "⏎"],
        ["⌦", 0, 1, 2, 3, 4, "⇤", "`~", "⇥", 5, 6, 7, 8, 9, "'"],
        ["⇧", 0, 1, 2, 3, 4, "⇞", "⇟", "/", 5, 6, 7, 8, "⇧"],
        ["Ctrl", "Cmd", "Fn", "Alt", 0, "", "⍽", "AltGr", "Menu", "Cmd", "Ctrl"],
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
        const numCols = ergoPlank60AnsiAngleLayoutModel.thirtyKeyMapping![row].length;
        if (row == KeyboardRows.Bottom) {
            /*
Both sides have 7.5u space to distribute, of which 0.25 is indent, 1.5 space and 1.25/2 half the central key.
Currently, we have 0.25 gap + 4×1.25 + 1.5 per side. That's 6.75u not counting the central key.
So the total diff to spread in microgaps is only 0.25 for the entire width.
We could be marginally more ergonomic by keeping space and outer space with zero gap
and spread the 0.125u per side only among the remaining modifier keys.
             */
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

    keyColorClass: keyColorHighlightsClass,
}

export function ep60addAngleMod(lm: RowBasedLayoutModel): RowBasedLayoutModel {
    return {
        ...lm,
        name: "Ergoplank 60",
        thirtyKeyMapping: copyAndModifyKeymap(lm.thirtyKeyMapping!, ansifyKeymap),
        thumb30KeyMapping: copyAndModifyKeymap(lm.thumb30KeyMapping!, ansifyKeymap),
        fullMapping: copyAndModifyKeymap(lm.fullMapping!, ansifyKeymap),
        // Now we could go to 0.25 stagger without making Z awkward to type and put ⌦ on the newly fusioned 1.5u central key...
        // but this key fusion removes one key from the board and we'd end up having
    }
}

function ansifyKeymap(keymap: LayoutMapping): LayoutMapping {
    keymap[KeyboardRows.Home][0] = [-1, 0];
    const lower = keymap[KeyboardRows.Lower];
    keymap[KeyboardRows.Lower] = [...lower.slice(1, 6), '⌦', ...lower.slice(6)];
    return keymap;
}

export const ep60WithArrowsLayoutModel: RowBasedLayoutModel = {
    ...ergoPlank60AnsiAngleLayoutModel,
    name: "Ergoplank 60 with cursor block",
    thirtyKeyMapping: replaceLast(ergoPlank60AnsiAngleLayoutModel.thirtyKeyMapping!,
        [null, "Ctrl", "Cmd", "AltGr", "Alt", "⏎", "Fn", "⍽", "Ctrl", null, "←", "↑", "↓", "→"]
    ),
    thumb30KeyMapping: replaceLast(ergoPlank60AnsiAngleLayoutModel.thumb30KeyMapping!,
        [null, "Ctrl", "Cmd", "AltGr", "Alt", 0, "Fn", "⍽", "Ctrl", null, "←", "↑", "↓", "→"]
    ),
    // fullMapping: replaceLast(ergoPlankRegularLayoutModel.fullMapping, []),
    singleKeyEffort: replaceLast(ergoPlank60AnsiAngleLayoutModel.singleKeyEffort,
        [null, 3.0, 3.0, 2.0, 1.5, 0.2, 1.5, 0.2, 1.5, null, null, null, null, null]
    ),
    mainFingerAssignment: replaceLast(ergoPlank60AnsiAngleLayoutModel.mainFingerAssignment,
        [null, 0, 1, 2, 4, 4, 5, 5, 5, null, null, null, null, null]
    ),
    rowStart: (row: KeyboardRows) => row == KeyboardRows.Lower ? 0.25 : 0,
    keyWidth: (row: KeyboardRows, col: number): number => {
        /*
7.5u on each side, thereof 1.5 space and 0.5u for the half of the central key, leaves 5.5u per side.
Left: 0.25 gap, leaving 5.25, which is 4×1.25 plus 0.25 to split in three small gaps.
Right: 4u for arrows leaves 1.5u, which is one 1.25u key and a 0.25u gap.
Much simpler to look at is the old solution where we omit the micro-gaps and increase the central key by 0.25u.
But this makes the left outer space key harder to hit, because it'd be too far under the palm.
         */
        if (row == KeyboardRows.Bottom) {
            if (col > 9) {
                return 1;
            }
            if (col > 0 && col < 4) {
                // no small gap between outer space and space!
                return 1.25 + 0.25/3;
            }
            switch (col) {
                case 0:
                case 9:
                    return 0.25;
                case 5:
                case 7:
                    return 1.5;
                case 6:
                    return 1;
                default:
                    return 1.25;
            }
        }
        return ergoPlank60AnsiAngleLayoutModel.keyWidth(row, col);
    },
    keyCapWidth: (row: KeyboardRows, col: number): number => {
        if (row == KeyboardRows.Bottom) {
            if (col > 0 && col < 4) {
                return 1.25;
            }
        }
        return ep60WithArrowsLayoutModel.keyWidth(row, col);
    }
}

function replaceLast<T>(list: T[], last: T) {
    return [...list.slice(0, -1), last];
}