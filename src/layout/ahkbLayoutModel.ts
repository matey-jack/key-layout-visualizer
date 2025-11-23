import {FlexMapping, KEY_COLOR, KeyboardRows, LayoutMapping, RowBasedLayoutModel} from "../base-model.ts";
import {copyAndModifyKeymap, defaultKeyColor} from "./layout-functions.ts";

export const ahkbLayoutModel: RowBasedLayoutModel = {
    name: "AHKB, a wide-hand, split space keyboard with traditional typewriter row staggering.",
    description: `Apple ❤ HHKB: when keyboard layouts meet and mate.`,

    // Keyboard width is 14.5u which gives 14 keys in top three rows, 13 in the lower row, and 10 in the bottom.
    thirtyKeyMapping: [
        ["⎋ Exit", "1", "2", "3", "4", "5", "[", "]", "6", "7", "8", "9", "0", "`~"],
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

    rowStart: (row: KeyboardRows) =>
        (row == KeyboardRows.Bottom) ? 0.5 :
            (row >= KeyboardRows.Home) ? 0.25
                : 0,

    keyWidth(row: KeyboardRows, col: number): number {
        const lastCol = ahkbLayoutModel.thirtyKeyMapping![row].length - 1;
        switch (row) {
            case KeyboardRows.Number:
                return (col == 0) ? 1.5 : 1;
            case KeyboardRows.Upper:
                return (col == lastCol) ? 1.5 : 1;
            case KeyboardRows.Home:
                return 1;
            case KeyboardRows.Lower:
                return (col == 0 || col == lastCol) ? 1.5 : 1;
            case KeyboardRows.Bottom:
                // 14.5 total with, 1.5u space and outer space, 3 × 1.25 per side.
                // 7.25 per side minus 3 minus 3.75 = 0.5 gap
                const c = col > 4 ? 9 - col : col;
                return [1.25, 1.25, 1.25, 1.5, 1.5][c];
        }
    },

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

    splitColumns: [7, 6, 6, 6, 4],

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
