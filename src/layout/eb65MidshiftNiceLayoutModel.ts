import {Finger, KeyboardRows, RowBasedLayoutModel} from "../base-model.ts";
import {copyAndModifyKeymap} from "./layout-functions.ts";
import {eb65LowShiftLayoutModel} from "./eb65LowShiftLayoutModel.ts";
import {SymmetricKeyWidth, zeroIndent} from "./keyWidth.ts";

// the indent on the bottom is not symmetric, thus managed manually via gaps.
const eb65NiceKeyWidths = new SymmetricKeyWidth(16, zeroIndent);

export const eb65MidshiftNiceLayoutModel: RowBasedLayoutModel = {
    ...eb65LowShiftLayoutModel,
    name: "Ergoboard 65 MidShift Nicely Wide",

    leftHomeIndex: 4,
    rightHomeIndex: 10,
    staggerOffsets: [0.5, 0.25, 0, -0.25],

    // The keymap has a bunch of small differences to the low-shift; enough to make copy-paste-adapt easier than anything more clever.
    thirtyKeyMapping: [
        // left-side numbers move to center to make their relative position (from hand home) symmetric to the right side.
        ["Esc", "`~", "1", "2", "3", "4", "5", "[", "]", "6", "7", "8", "9", "0", "⇞", "⇟"],
        ["↹", 0, 1, 2, 3, 4, "⇤", null, "⇥", 5, 6, 7, 8, 9, "⌫"],
        ["⇧", 0, 1, 2, 3, 4, "-", "\\", "'", 5, 6, 7, 8, 9, "⇧"],
        ["Ctrl", 0, 1, 2, 3, 4, "=", "€ ¢ £ ¥", 9, 5, 6, 7, 8, null, "↑", null],
        [null, "Cmd", "Fn", "", "⌦", "Alt", "⏎", "⍽", "AltGr", null, "Ctrl", null, "←", "↓", "→"]
    ],

    thumb30KeyMapping: [
        // todo
        ["Esc", "`~", "1", "2", "3", "4", "5", "[", "]", "6", "7", "8", "9", "0", "⇞", "⇟"],
        ["↹", 0, 1, 2, 3, 4, "⇤", null, "⇥", 5, 6, 7, 8, 9, "⌫"],
        ["⇧", 0, 1, 2, 3, 4, "\\", "", "'", 5, 6, 7, 8, 9, "⇧"],
        ["Ctrl", 0, 1, 2, 3, 4, "=", "€ ¢ £ ¥", "/", 5, 6, 7, 8, null, "↑", null],
        [null, "Cmd", "Fn", "⌦", "Alt", 0, "⏎", "⍽", "AltGr", null, "Ctrl", null, "←", "↓", "→"],
    ],
    mainFingerAssignment: copyAndModifyKeymap(eb65LowShiftLayoutModel.mainFingerAssignment, (matrix) => {
        matrix[KeyboardRows.Upper].splice(8, 0, Finger.RIndex);
        matrix[KeyboardRows.Upper].pop();
        matrix[KeyboardRows.Home].splice(7, 0, null);
        matrix[KeyboardRows.Home].pop();
        matrix[KeyboardRows.Lower][7] = null;
        matrix[KeyboardRows.Bottom].splice(4, 0, Finger.LIndex);
        return matrix;
    }),
    singleKeyEffort: [
        [null, 3.0, 3.0, 2.0, 2.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 2.0, 2.0, 3.0, null, null],
        [2.0, 2.0, 1.0, 1.0, 1.5, 2.0, 3.0, 3.0, 3.0, 2.0, 1.5, 1.0, 1.0, 2.0, 2.0],
        [1.5, 0.2, 0.2, 0.2, 0.2, 2.0, 3.0, 3.0, 3.0, 2.0, 0.2, 0.2, 0.2, 0.2, 1.5],
        [3.0, 1.0, 1.5, 1.5, 1.0, 2.0, 3.0, 3.0, 3.0, 2.0, 1.0, 1.5, 1.5, 1.0, null, null],
        [null, 2.0, 1.5, null, null, 1.0, 0.2, 0.2, 1.0, null, 1.5, null, null, null, null],
    ],

    keyWidths: [
        eb65NiceKeyWidths.row(0, 1),
        eb65NiceKeyWidths.row(1, 1.75),
        eb65NiceKeyWidths.row(2, 1.5),
        eb65NiceKeyWidths.row(3, 1.25)
            .slice(0, -2)
            .concat(0.25, 1, 1),
        /*
            Center between hands is exactly the center of the keyboard, leaving 8u on each side,
            of which 2.5u are between the inner edges of the index finger home keys.
            Half of the outer space key (0.75u) should fall inside those 2.5u, leaving 1.75, which is exactly a space bar,
            so we don't need any central key between space bars.
            Committed on the left side are 1.75 space plus 0.5 left indent; total: 2.25u, unassigned: 5.75.
            Right side has 1.75 space plus 3×1u arrows; total 4.75u, unassigned 3.25.
            Two 1.25u modifiers on the right are 2.5u, leaving 0.75u for gaps which we'll split evenly.
            On the left, we could do 3×1.25 + 2×1u to fill the space exactly.
            Alternative 4×1.25 = 5u with three gaps of 0.25u.
         */
        [0.5, 1.25, 1.25, 1, 1, 1.25, 1.75, 1.75, 1.25, 0.75/2, 1.25, 0.75/2, 1, 1, 1],
    ],
}


