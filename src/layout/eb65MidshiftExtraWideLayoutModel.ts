import {FlexMapping, KeyboardRows, RowBasedLayoutModel} from "../base-model.ts";

import {keyColorHighlightsClass} from "./layout-functions.ts";

export const eb65MidshiftExtraWideLayoutModel: RowBasedLayoutModel = {
    name: "Ergoboard 65 MidShift Max Wide",
    description: ``,

    // Key sizes are mostly the same as EB65 Lowshift Midsize Enter, except for 2u Backspace up top.
    // But the lower row has a regular 0.25 stagger.
    thirtyKeyMapping: [
        ["Esc", "1", "2", "3", "4", "5", "[", null, "]", "6", "7", "8", "9", "0", "⇞", "⇟"],
        ["↹", 0, 1, 2, 3, 4, "`~", "", "\\", 5, 6, 7, 8, 9, "⌫"],
        ["⇧", 0, 1, 2, 3, 4, "-", "⌦", "'", 5, 6, 7, 8, 9, "⇧"],
        [null, 0, 1, 2, 3, 4, "=", "⇤", "⇥", 9, 5, 6, 7, 8, null, "↑", null],
        [null, "Ctrl", "Cmd", "Fn", "Alt", "⏎", "", "⍽", "AltGr", null, "Ctrl", null, "←", "↓", "→"]
    ],

    thumb30KeyMapping: [
        ["Esc", "1", "2", "3", "4", "5", "[", null, "]", "6", "7", "8", "9", "0", "⇞", "⇟"],
        ["↹", 0, 1, 2, 3, 4, "`~", "Fn", "", 5, 6, 7, 8, 9, "⌫"],
        ["⇧", 0, 1, 2, 3, 4, "=", "⌦", "'", 5, 6, 7, 8, 9, "⇧"],
        [null, 0, 1, 2, 3, 4, "\\", "⇤", "⇥", "/", 5, 6, 7, 8, null, "↑", null],
        [null, "Ctrl", "Cmd", "Alt", 0, "⏎", "", "⍽", "AltGr", null, "Ctrl", null, "←", "↓", "→"]
    ],

    // thumb30KeyMapping: [
    //     // todo
    //     ["Esc", "1", "2", "3", "4", "5", "[", null, "]", "6", "7", "8", "9", "0", "⇞", "⇟"],
    //     ["↹", 0, 1, 2, 3, 4, "`~", "'", 5, 6, 7, 8, 9, "⌫", "⏎"],
    //     ["⇧", 0, 1, 2, 3, 4, "=", "\\", 5, 6, 7, 8, 9, "⇧"],
    //     ["Ctrl", 0, 1, 2, 3, 4, "⇤", null, "⇥", 5, 6, 7, 8, "/", null, "↑", null],
    //     [null, "Cmd", "Fn", "⌦", "Alt", 0, "⍽", "AltGr", null, "Ctrl", null, "←", "↓", "→"],
    // ],

    // todo
    fullMapping: [],

    mainFingerAssignment: [
        [null, 1, 1, 2, 3, 3, 3, 6, 6, 6, 7, 8, 8, 8, null, null],
        [0, 0, 1, 2, 3, 3, 3, null, 6, 6, 6, 7, 8, 9, 9],
        [0, 0, 1, 2, 3, 3, 3, null, 6, 6, 6, 7, 8, 9, 9],
        [0, 0, 1, 2, 3, 3, 3, null, null, 6, 6, 6, 7, 8, null, null, null],
        [null, 0, 1, 2, 4, 4, null, 5, 5, null, 7, null, null, null, null],
    ],

    hasAltFinger: (row: number, col: number) =>
        (row == KeyboardRows.Lower) && ([1, 2, 3, 7, 8, 9].includes(col)),

    // Only fixed values can be used. See base-model.ts SKE_*
    // 'null' means the hand has to taken off the home-row. Those keys can't be used with letter or prose punctuation.
    singleKeyEffort: [
        [null, 3.0, 2.0, 2.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 2.0, 2.0, 3.0, null, null],
        [2.0, 2.0, 1.0, 1.0, 1.5, 2.0, 3.0, null, 3.0, 2.0, 1.5, 1.0, 1.0, 2.0, 2.0],
        [1.5, 0.2, 0.2, 0.2, 0.2, 2.0, 3.0, null, 3.0, 2.0, 0.2, 0.2, 0.2, 0.2, 1.5],
        [3.0, 1.0, 1.5, 1.5, 1.0, 2.0, 3.0, null, null, 3.0, 2.0, 1.0, 1.5, 1.5, null, null, null],
        [null, 2.0, 2.0, null, 1.0, 0.2, 0.2, 1.0, null, null, 2.0, null, null, null, null],
    ],

    rowStart: (_row: KeyboardRows) => 0,

    keyWidth: (row: KeyboardRows, col: number): number => {
        const lastCol = eb65MidshiftExtraWideLayoutModel.thirtyKeyMapping![row].length - 1;
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
                        return 1.75; // Backspace or Enter
                }
                return 1;
            case KeyboardRows.Home:
                switch (col) {
                    case 7:
                        return 1.5;
                    case lastCol: // Right Shift
                        return 1.5;
                }
                return 1;
            case  KeyboardRows.Lower:
                switch (col) {
                    case 0:
                        return 0.75;
                    case 14:
                        return 0.25
                }
                return 1;
            case KeyboardRows.Bottom:
                /*
Center between hands is 7.75u left and 8.25u right.
Space + half central key is 2.25u.
Left side has 0.75u indent, leaving 4.75 to spread.
Let's reduce the indent to 0.5; then 4×1.25u just fits.
Right side has 3u arrows, leaving 3u to spread.
Two 1.25u keys leave exactly 2×0.25u for the gaps.
                 */
                // arrow keys
                if (col > 11) return 1;
                // spread a gap between the modifiers
                // if (col > 0 && col < 4) return 1.25 + 0.25/3;
                switch (col) {
                    case 0:
                        return 0.5;
                    case 5:
                    case 7:
                        return 1.75;
                    case 6:
                        return 1;
                    case 9:
                    case 11:
                        return 0.25;
                }
                return 1.25;
        }
    },
    keyCapWidth: (row: KeyboardRows, col: number) => {
        if (row == KeyboardRows.Bottom && col > 0 && col < 4) return 1.25;
        return eb65MidshiftExtraWideLayoutModel.keyWidth(row, col);
    },
    leftHomeIndex: 4,
    rightHomeIndex: 10,

    staggerOffsets: [0.5, 0.25, 0, -0.25],
    symmetricStagger: true,

    getSpecificMapping: (_: FlexMapping) => undefined,

    keyColorClass: keyColorHighlightsClass,
}
