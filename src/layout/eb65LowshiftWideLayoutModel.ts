import {FlexMapping, KeyboardRows, RowBasedLayoutModel} from "../base-model.ts";
import {keyColorHighlightsClass} from "./layout-functions.ts";

export const eb65LowShiftWideLayoutModel: RowBasedLayoutModel = {
    name: "Ergoboard 65 LowShift Wide",
    description: `Widest possible hand position with the arrow cluster and lower row Shift keys.`,

    // row lengths: 16, 15, 15 (with 0.5u gap), 16, 14
    thirtyKeyMapping: [
        ["Esc", "1", "2", "3", "4", "5", "`~", null, "6", "7", "8", "9", "0", "=", "⇞", "⇟"],
        ["↹", 0, 1, 2, 3, 4, "[", "]", 5, 6, 7, 8, 9, "-", "⏎"],
        ["⌦", 0, 1, 2, 3, 4, "⇤", null, "⇥", 5, 6, 7, 8, 9, "'", "⌫"],
        [null, "⇧", 1, 2, 3, 4, 0, "\\", 9, 5, 6, 7, 8, "⇧", "↑", null],
        [null, "Ctrl", "Cmd", "CAPS", "Alt", "⍽", "⍽", "AltGr", "Fn", "Ctrl", null, "←", "↓", "→"],
    ],

    thumb30KeyMapping: [
        ["Esc", "1", "2", "3", "4", "5", "`~", null, "6", "7", "8", "9", "0", "", "⇞", "⇟"],
        ["↹", 0, 1, 2, 3, 4, "[", "]", 5, 6, 7, 8, 9, "=", "⏎"],
        ["⌦", 0, 1, 2, 3, 4, "⇤", null, "⇥", 5, 6, 7, 8, 9, "'", "⌫"],
        // this modified angle fix works with Quip Thumby and Cozy keymaps. In Colemak Thumby, -B should swap.
        [null, "⇧", 1, 2, 3, 0, 4, "\\", "/", 5, 6, 7, 8, "⇧", "↑", null],
        [null, "Ctrl", "Cmd", "CAPS", "Alt", 0, "⍽", "AltGr", "Fn", "Ctrl", null, "←", "↓", "→"],
    ],

    // todo
    fullMapping: [],

    mainFingerAssignment: [
        [1, 1, 1, 1, 2, 3, 3, 3, 6, 6, 7, 8, 8, 8, null, null],
        [0, 0, 1, 2, 3, 3, 3, 6, 6, 6, 7, 8, 9, 9, 9],
        [0, 0, 1, 2, 3, 3, 3, null, 6, 6, 6, 7, 8, 9, 9, 9],
        [0, 0, 1, 2, 3, 3, 3, 3, 6, 6, 6, 7, 8, 9, null, null],
        [null, 0, 1, 2, 4, 4, 5, 5, null, 7, null, null, null, null],
    ],

    hasAltFinger: (row: number, col: number) =>
        (row == KeyboardRows.Lower) && ([1, 2, 3, 7, 8, 9].includes(col)),

    // Only fixed values can be used. See base-model.ts SKE_*
    // 'null' means the hand has to taken off the home-row. Those keys can't be used with letter or prose punctuation.
    singleKeyEffort: [
        [null, 3.0, 2.0, 2.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 2.0, 2.0, 3.0, 3.0, null, null],
        [2.0, 2.0, 1.0, 1.0, 1.5, 2.0, 3.0, 3.0, 2.0, 1.5, 1.0, 1.0, 2.0, 2.0, 3.0],
        [1.5, 0.2, 0.2, 0.2, 0.2, 2.0, 3.0, null, 3.0, 2.0, 0.2, 0.2, 0.2, 0.2, 1.5, 2.0],
        [3.0, 1.0, 1.5, 1.5, 1.0, 2.0, 3.0, 3.0, 3.0, 2.0, 1.0, 1.5, 1.5, 1.0, null, null],
        [null, 1.5, 2.0, 2.0, 1.0, 0.2, 0.2, 1.0, null, 2.0, null, null, null, null],
    ],

    rowStart: [0, 0, 0, 0, 0],

    keyWidth: (row: KeyboardRows, col: number): number => {
        const lastCol = eb65LowShiftWideLayoutModel.thirtyKeyMapping![row].length - 1;
        switch (row) {
            case KeyboardRows.Number:
                switch (col) {
                    case 0:
                        return 1.5; // Escape
                    case 7:
                        return 0.5; // gap
                }
                return 1;
            case KeyboardRows.Upper:
                switch (col) {
                    case 0:
                        return 1.25; // Tab
                    case lastCol:
                        return 1.75; // Backspace
                }
                return 1;
            case KeyboardRows.Home:
                switch (col) {
                    case 7:
                        return 0.5;
                    case lastCol:
                        return 1.5; // Enter
                }
                return 1;
            case KeyboardRows.Lower:
                switch (col) {
                    case 0:
                        return 0.5; // gap
                    case 1:
                    case 13:
                        return 1.25; // Shift
                }
                return 1;
            case KeyboardRows.Bottom:
                // center between hands is at 7.25 / 8.75.
                // left side filled perfectly by 0.5 indent + 4×1.25u + 1.75u.
                const beforeArrows = 10;
                switch (col) {
                    case 0:
                        return 0.5; // gap
                    case 5:
                    case 6:
                        return 1.75; // space
                    case 8:
                        return 1; // Fn
                    case beforeArrows:
                        return 0.5; // gap
                }
                return col > beforeArrows ? 1 : 1.25;
            default:
                return 1;
        }
    },

    leftHomeIndex: 4,
    rightHomeIndex: 10,

    staggerOffsets: [0.5, 0.25, 0, -0.5],
    symmetricStagger: true,

    getSpecificMapping: (_: FlexMapping) => undefined,
    keyColorClass: keyColorHighlightsClass,
}
