import {FlexMapping, KeyboardRows, RowBasedLayoutModel} from "../base-model.ts";

import {keyColorHighlightsClass} from "./layout-functions.ts";
import {SymmetricKeyWidth, zeroIndent} from "./keyWidth.ts";

const eb65MidshiftExtraWideKeyWidths = new SymmetricKeyWidth(16, zeroIndent);

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

    rowIndent: [0, 0, 0, 0, 0],

    keyWidths: [
        eb65MidshiftExtraWideKeyWidths.row(KeyboardRows.Number, 1.5, 1),
        eb65MidshiftExtraWideKeyWidths.row(KeyboardRows.Upper, 1.25, 1.75),
        // todo: something like this should work:
        //eb65MidshiftExtraWideKeyWidths.row(KeyboardRows.Home, 1, 1.5, ),
        // maybe need a new unit test case to check what's going wrong there.
        [1, 1, 1, 1, 1, 1, 1, 1.5, 1, 1, 1, 1, 1, 1, 1.5],
        [0.75, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0.25, 1, 1],
        [0.5, 1.25, 1.25, 1.25, 1.25, 1.75, 1, 1.75, 1.25, 0.25, 1.25, 0.25, 1, 1, 1],
    ],
    keyWidth(row: KeyboardRows, col: number): number {
        return this.keyWidths[row][col];
    },
    keyCapWidth(row: KeyboardRows, col: number) {
        if (row == KeyboardRows.Bottom && col > 0 && col < 4) return 1.25;
        return this.keyWidths![row][col];
    },
    leftHomeIndex: 4,
    rightHomeIndex: 10,

    staggerOffsets: [0.5, 0.25, 0, -0.25],
    symmetricStagger: true,

    getSpecificMapping: (_: FlexMapping) => undefined,

    keyColorClass: keyColorHighlightsClass,
}
