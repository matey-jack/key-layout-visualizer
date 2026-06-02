import {KeyboardRows, KeymapTypeId, type LayoutModel,} from "../base-model.ts";
import {ergoboardLowshiftWideLayoutModel} from './ergoboardLowshiftWideLayoutModel.ts';
import {SymmetricKeyWidth, zeroIndent} from './keyWidth.ts';

const keyWidths = new SymmetricKeyWidth(16, zeroIndent);

export const ergoboardSemiWideLayoutModel: LayoutModel = {
    ...ergoboardLowshiftWideLayoutModel,
    name: "Ergoboard 16/4.5 Semi Wide",
    description: ``,

    staggerOffsets: [0.5, 0.25, 0, -0.25],
    symmetricStagger: true,

    keyWidths: [
        keyWidths.row(0, 1.5, 1, 7.25),
        ...ergoboardLowshiftWideLayoutModel.keyWidths.slice(1, 3),
        [0.75, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0.25, 1, 1],
        ergoboardLowshiftWideLayoutModel.keyWidths[KeyboardRows.Bottom],
    ],

    mainFingerAssignment: [
        [1, 1, 1, 1, 2, 3, 3, 6, 6, 7, 8, 8, 8, null, null],
        ergoboardLowshiftWideLayoutModel.mainFingerAssignment[KeyboardRows.Upper],
        ergoboardLowshiftWideLayoutModel.mainFingerAssignment[KeyboardRows.Home],
        [0, 0, 1, 2, 3, 3, 3, 3, 6, 6, 6, 7, 8, 9, null, null, null],
        ergoboardLowshiftWideLayoutModel.mainFingerAssignment[KeyboardRows.Bottom],
    ],

    singleKeyEffort: [
        [null, 3.0, 2.0, 2.0, 3.0, 3.0, 3.0, 3.0, 3.0, 2.0, 2.0, 3.0, 3.0, null, null],
        ergoboardLowshiftWideLayoutModel.singleKeyEffort[KeyboardRows.Upper],
        ergoboardLowshiftWideLayoutModel.singleKeyEffort[KeyboardRows.Home],
        [3.0, 1.0, 1.5, 1.5, 1.0, 2.0, 3.0, 3.0, 3.0, 2.0, 1.0, 1.5, 1.5, 1.0, null, null, null],
        ergoboardLowshiftWideLayoutModel.singleKeyEffort[KeyboardRows.Bottom],
    ],

    frameMappings: {
        [KeymapTypeId.Ansi30]: [
            ["Esc", "1", "2", "3", "4", "5", "⌦", "6", "7", "8", "9", "0", "\\", "⇞", "⇟"],
            ["↹", 0, 1, 2, 3, 4, "[", "]", 5, 6, 7, 8, 9, "'", "⌫"],
            ["⇧", 0, 1, 2, 3, 4, "⇤", null, "⇥", 5, 6, 7, 8, 9, "⇧", "⏎"],
            [null, 0, 1, 2, 3, 4, "+", "`~", "-", 5, 6, 7, 8, 9, null, "↑", null],
            [null, "Ctrl", "Cmd", "CAPS", "Alt", "⍽", "⍽", "AltGr", "Fn", "Ctrl", null, "←", "↓", "→"],
        ], [KeymapTypeId.Thumb30]: [
            ["Esc", "1", "2", "3", "4", "5", "⌦", "6", "7", "8", "9", "0", "⎀", "⇞", "⇟"],
            ["↹", 0, 1, 2, 3, 4, "[", "]", 5, 6, 7, 8, 9, "'", "⌫"],
            ["⇧", 0, 1, 2, 3, 4, "⇤", null, "⇥", 5, 6, 7, 8, 9, "⇧", "⏎"],
            [null, 0, 1, 2, 3, 4, "+", "`~", "\\", 5, 6, 7, 8, "/", null, "↑", null],
            [null, "Ctrl", "Cmd", "CAPS", "Alt", 0, "⍽", "AltGr", "Fn", "Ctrl", null, "←", "↓", "→"],
        ],
    },
}
