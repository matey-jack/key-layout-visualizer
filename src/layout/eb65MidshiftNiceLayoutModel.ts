import {KeymapTypeId, RowBasedLayoutModel, SupportedKeymapType} from "../base-model.ts";
import {eb65LowshiftLayoutModel} from "./eb65LowshiftLayoutModel.ts";
import {SymmetricKeyWidth, zeroIndent} from "./keyWidth.ts";

// the indent on the bottom is not symmetric, thus managed manually via gaps.
const eb65NiceKeyWidths = new SymmetricKeyWidth(16, zeroIndent);

export const eb65MidshiftNiceLayoutModel: RowBasedLayoutModel = {
    ...eb65LowshiftLayoutModel,
    name: "Ergoboard 65 MidShift Nicely Wide",

    leftHomeIndex: 4,
    rightHomeIndex: 10,
    staggerOffsets: [0.5, 0.25, 0, -0.25],

    mainFingerAssignment: [
        [null, 1, 1, 1, 2, 3, 3, 3, 6, 6, 6, 7, 8, 8, null, null],
        [0, 0, 1, 2, 3, 3, 3, null, 6, 6, 7, 8, 9, 9, 9],
        [0, 0, 1, 2, 3, 3, 3, null, 6, 6, 7, 8, 9, 9, 9],
        [0, 0, 1, 2, 3, 3, 3, null, 6, 6, 7, 8, 9, null, null, null],
        [null, 0, 1, 2, 4, 4, 5, 5, null, 8, null, null, null, null],
    ],
    singleKeyEffort: [
        [null, 3.0, 3.0, 2.0, 2.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 2.0, 2.0, 3.0, null, null],
        [2.0, 2.0, 1.0, 1.0, 1.5, 2.0, 3.0, 3.0, 3.0, 2.0, 1.5, 1.0, 1.0, 2.0, 2.0],
        [1.5, 0.2, 0.2, 0.2, 0.2, 2.0, 3.0, 3.0, 3.0, 2.0, 0.2, 0.2, 0.2, 0.2, 1.5],
        [3.0, 1.0, 1.5, 1.5, 1.0, 2.0, 3.0, 3.0, 3.0, 2.0, 1.0, 1.5, 1.5, 1.0, null, null],
        [null, 2.0, 1.5, 1.5, 1.0, 0.2, 0.2, 1.0, null, 1.5, null, null, null, null],
    ],

    supportedKeymapTypes: [
        // The keymap has a bunch of small differences to the low-shift; enough to make copy-paste-adapt easier than anything more clever.
        // left-side numbers move to center to make their relative position (from hand home) symmetric to the right side.
        { typeId: KeymapTypeId.Ansi30, frameMapping: [
            ["Esc", "`~", "1", "2", "3", "4", "5", "[", "]", "6", "7", "8", "9", "0", "⇞", "⇟"],
            ["↹", 0, 1, 2, 3, 4, "⇤", null, "⇥", 5, 6, 7, 8, 9, "⌫"],
            ["⇧", 0, 1, 2, 3, 4, "-", "\\", "'", 5, 6, 7, 8, 9, "⇧"],
            ["Ctrl", 0, 1, 2, 3, 4, "=", "€ ¢ £ ¥", 9, 5, 6, 7, 8, null, "↑", null],
            [null, "Cmd", "Fn", "⌦", "Alt", "⏎", "⍽", "AltGr", null, "Ctrl", null, "←", "↓", "→"]
        ]},
        { typeId: KeymapTypeId.Thumb30, frameMapping: [
            ["Esc", "`~", "1", "2", "3", "4", "5", "[", "]", "6", "7", "8", "9", "0", "⇞", "⇟"],
            ["↹", 0, 1, 2, 3, 4, "⇤", null, "⇥", 5, 6, 7, 8, 9, "⌫"],
            ["⇧", 0, 1, 2, 3, 4, "\\", "€ £ ¥", "'", 5, 6, 7, 8, 9, "⇧"],
            ["Ctrl", 0, 1, 2, 3, 4, "=", "⌦", "/", 5, 6, 7, 8, null, "↑", null],
            [null, "Cmd", "Fn", "Alt", 0, "⏎", "⍽", "AltGr", null, "Ctrl", null, "←", "↓", "→"],
        ]},
    ],

    keyWidths:
        [
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
             */
            [0.5, 1.5, 1.25, 1.5, 1.5, 1.75, 1.75, 1.5, 0, 1.5, 0.25, 1, 1, 1],
            // alternative, if you like one more key:
            // [0.5, 1.25, 1.25, 1, 1, 1.25, 1.75, 1.75, 1.25, 0.75/2, 1.25, 0.75/2, 1, 1, 1],
        ],
}


