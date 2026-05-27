import {KeyboardRows, KeymapTypeId, type LayoutModel,} from "../base-model.ts";
import {eb65LowshiftWideLayoutModel} from './eb65LowshiftWideLayoutModel.ts';
import {SymmetricKeyWidth, zeroIndent} from './keyWidth.ts';

const keyWidths = new SymmetricKeyWidth(16, zeroIndent);

export const eb65MidshiftMiddleWideLayoutModel: LayoutModel = {
    ...eb65LowshiftWideLayoutModel,
    name: "Ergoboard 65 MidShift Middle Wide",
    description: ``,

    staggerOffsets: [0.5, 0.25, 0, -0.25],
    symmetricStagger: true,

    keyWidths: [
        // TODO: make the delete key in the center 1.5u wide.
        keyWidths.row(0, 1.5, 1),
        ...eb65LowshiftWideLayoutModel.keyWidths.slice(1, 3),
        [0.75, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0.25, 1, 1],
        eb65LowshiftWideLayoutModel.keyWidths[KeyboardRows.Bottom],
    ],

    frameMappings: {
        [KeymapTypeId.Ansi30]: [
            ["Esc", "1", "2", "3", "4", "5", "⌦", null, "6", "7", "8", "9", "0", "\\", "⇞", "⇟"],
            ["↹", 0, 1, 2, 3, 4, "[", "]", 5, 6, 7, 8, 9, "'", "⌫"],
            ["⇧", 0, 1, 2, 3, 4, "⇤", null, "⇥", 5, 6, 7, 8, 9, "⇧", "⏎"],
            [null, 0, 1, 2, 3, 4, "=", "`~", "-", 5, 6, 7, 8, 9, null, "↑", null],
            [null, "Ctrl", "Cmd", "CAPS", "Alt", "⍽", "⍽", "AltGr", "Fn", "Ctrl", null, "←", "↓", "→"],
        ], [KeymapTypeId.Thumb30]: [
            ["Esc", "1", "2", "3", "4", "5", "⌦", null, "6", "7", "8", "9", "0", "\\", "⇞", "⇟"],
            ["↹", 0, 1, 2, 3, 4, "[", "]", 5, 6, 7, 8, 9, "'", "⌫"],
            ["⇧", 0, 1, 2, 3, 4, "⇤", null, "⇥", 5, 6, 7, 8, 9, "⇧", "⏎"],
            [null, 0, 1, 2, 3, 4, "=", "`~", "Ins", 5, 6, 7, 8, "/", null, "↑", null],
            [null, "Ctrl", "Cmd", "CAPS", "Alt", 0, "⍽", "AltGr", "Fn", "Ctrl", null, "←", "↓", "→"],
        ],
    },
}
