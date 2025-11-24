import {FlexMapping, KEY_COLOR, KeyboardRows, LayoutMapping, RowBasedLayoutModel} from "../base-model.ts";
import {copyAndModifyKeymap, defaultKeyColor} from "./layout-functions.ts";
import {mirror, MonotonicKeyWidth} from "./keyWidth.ts";

const ahkbKeyWidth = new MonotonicKeyWidth(14.5, [0, 0, 0.25, 0.25, 0.5], "AHKB");

export const ahkbLayoutModel: RowBasedLayoutModel = {
    name: "AHKB",
    description: `A wide-hand, split space keyboard with traditional typewriter row staggering.
    Apple ❤ HHKB: when keyboard layouts meet and mate.`,

    // Keyboard width is 14.5u which gives 14 keys in top three rows, 13 in the lower row, and 10 in the bottom.
    thirtyKeyMapping: [
        ["⎋ Exit", "1", "2", "3", "4", "5", "`~", "6", "7", "8", "9", "0", "[", "]"],
        ["↹", 0, 1, 2, 3, 4, "-", "=", 5, 6, 7, 8, 9, "⌫"],
        ["⌦", 0, 1, 2, 3, 4, "⇤", "⇥", 5, 6, 7, 8, 9, "'"],
        ["⇧", 0, 1, 2, 3, 4, "\\", 9, 5, 6, 7, 8, "⇧"],
        ["Ctrl", "Cmd", "CAPS", "Alt", "⏎ Enter", "⍽", "AltGr", "Menu", "Fn", "Ctrl"],
    ],

    thumb30KeyMapping: [
        ["⎋ Exit", "1", "2", "3", "4", "5", "[", "]", "6", "7", "8", "9", "0", "CAPS"],
        ["↹", 0, 1, 2, 3, 4, "=", "`~", 5, 6, 7, 8, 9, "⌫"],
        ["⌦", 0, 1, 2, 3, 4, "⇤", "⇥", 5, 6, 7, 8, 9, "'"],
        ["⇧", 0, 1, 2, 3, 4, "\\", "/", 5, 6, 7, 8, "⇧"],
        ["Ctrl", "Cmd", "Alt", 0, "⏎ Enter", "⍽", "AltGr", "Menu", "Fn", "Ctrl"],
    ],

    mainFingerAssignment: [
        [1, 1, 1, 2, 2, 3, 3, 6, 6, 7, 8, 8, 8, 8],
        [1, 0, 1, 2, 3, 3, 6, 6, 7, 8, 9, 9, 8, 8],
        [0, 0, 1, 2, 3, 3, 3, 6, 6, 7, 8, 9, 9, 9],
        [0, 0, 1, 2, 3, 3, 6, 6, 6, 7, 8, 9, 9],
        [0, null, null, 4, 4, 5, 5, null, null, 9],
    ],

    hasAltFinger: (_r: number, _c: number) => false,

    singleKeyEffort: [
        [3.0, 3.0, 2.0, 2.0, 3.0, 3.0, 3.0, 3.0, 2.0, 2.0, 3.0, 3.0, 3.0, 3.0],
        [3.0, 2.0, 1.0, 1.0, 1.5, 1.5, 3.0, 3.0, 1.5, 1.5, 1.0, 1.0, 2.0, 2.0],
        [1.5, 0.2, 0.2, 0.2, 0.2, 2.0, 3.0, 3.0, 2.0, 0.2, 0.2, 0.2, 0.2, 1.5],
        [1.5, 2.0, 2.0, 1.5, 1.5, 3.0, 3.0, 3.0, 1.5, 1.0, 1.5, 1.5, 1.0],
        [2.0, null, null, 1.0, 0.2, 0.2, 1.0, null, null, 2.0],
    ],

    rowIndent: ahkbKeyWidth.rowIndent,

    keyWidths: [
        ahkbKeyWidth.row(0, 1.5, 1),
        ahkbKeyWidth.row(1, 1, 1.5),
        ahkbKeyWidth.row(2, 1),
        ahkbKeyWidth.row(3, 1.5),
        // 14.5 total with, 1.5u space and outer space, 3 × 1.25 per side.
        // 7.25 per side minus 3 minus 3.75 = 0.5 gap
        mirror(1.25, 1.25, 1.25, 1.5, 1.5),
    ],
    keyColorClass(label: string, row: KeyboardRows, col: number) {
        if (label === "↹") {
            return "";
        }
        if (label.includes("⏎") || label.includes("⎋")
            || label.includes("⌦") || label.includes("⌫")
        ) {
            return KEY_COLOR.HIGHLIGHT;
        }
        if (label.includes("⍽")) {
            return KEY_COLOR.EDGE;
        }
        return defaultKeyColor(label, row, col);
    },

    splitColumns: [7, 7, 7, 7, 5],

    leftHomeIndex: 4,
    rightHomeIndex: 9,

    staggerOffsets: [-0.75, -0.25, 0, 0.5],
    symmetricStagger: false,

    getSpecificMapping: (_: FlexMapping) => undefined,
}

export function ahkbAddAngleMod(lm: RowBasedLayoutModel = ahkbLayoutModel): RowBasedLayoutModel {
    return {
        ...lm,
        name: `${lm.name} angle mod`,
        thirtyKeyMapping: lm.thirtyKeyMapping && copyAndModifyKeymap(lm.thirtyKeyMapping, angleModKeymap),
        thumb30KeyMapping: lm.thumb30KeyMapping && copyAndModifyKeymap(lm.thumb30KeyMapping, angleModKeymap),
        fullMapping: lm.fullMapping && copyAndModifyKeymap(lm.fullMapping, angleModKeymap),
        keyColorClass(label: string, row: KeyboardRows, col: number) {
           if (label.includes("⌦")) {
                return KEY_COLOR.EDGE;
            }
            return lm.keyColorClass!(label, row, col);
        },
    };
}

function angleModKeymap(keymap: LayoutMapping): LayoutMapping {
    const lowerRow = keymap[KeyboardRows.Lower];
    keymap[KeyboardRows.Home][0] = [1, 0];
    lowerRow.splice(1, 1);

    const backslashIndex = lowerRow.indexOf("\\");
    const insertIndex = backslashIndex >= 0 ? backslashIndex + 1 : 1;
    lowerRow.splice(insertIndex, 0, "⌦");

    keymap[KeyboardRows.Lower] = lowerRow;
    return keymap;
}
