import {KeymapTypeId, type LayoutModel,} from "../base-model.ts";
import {eb65LowshiftWideLayoutModel} from './eb65LowshiftWideLayoutModel.ts';

export const eb65MidshiftMiddleWideLayoutModel: LayoutModel = {
    ...eb65LowshiftWideLayoutModel,
    name: "Ergoboard 65 MidShift Middle Wide",
    description: ``,

    staggerOffsets: [0.5, 0.25, 0, -0.25],
    symmetricStagger: true,

    frameMappings: {
        [KeymapTypeId.Ansi30]: [
            ["Esc", "1", "2", "3", "4", "5", "[", "`~", "]", "6", "7", "8", "9", "0", "⇞", "⇟"],
            ["↹", 0, 1, 2, 3, 4, "\\", null, 5, 6, 7, 8, 9, "'", "⌫"],
            ["⇧", 0, 1, 2, 3, 4, "=", "-", 5, 6, 7, 8, 9, "⇧", "⏎"],
            ["Ctrl", 0, 1, 2, 3, 4, "⇤", null, "⇥", 5, 6, 7, 8, 9, null, "↑", null],
            [null, "Cmd", "Fn", "⌦", "Alt", "⍽", "⍽", "AltGr", "Menu", "Ctrl", "←", "↓", "→"]
        ],
        // note: thanks to the thumb-letter, we have one less letter above the bottom row and could use a "big" key in the top center.
        // but layouts can't transform themselves when the keymap changes.
        // Anyway, my favorite layouts don't have this problem, so I won't solve it.
        [KeymapTypeId.Thumb30]: [
            ["Esc", "1", "2", "3", "4", "5", "[", "`~", "]", "6", "7", "8", "9", "0", "⇞", "⇟"],
            ["↹", 0, 1, 2, 3, 4, null, null, 5, 6, 7, 8, 9, "'", "⌫"],
            ["⇧", 0, 1, 2, 3, 4, "=", "\\", 5, 6, 7, 8, 9, "⇧", "⏎"],
            ["Ctrl", 0, 1, 2, 3, 4, "⇤", null, "⇥", 5, 6, 7, 8, "/", null, "↑", null],
            [null, "Cmd", "Fn", "⌦", "Alt", 0, "⍽", "AltGr", "Menu", "Ctrl", "←", "↓", "→"],
        ],
    },
}
