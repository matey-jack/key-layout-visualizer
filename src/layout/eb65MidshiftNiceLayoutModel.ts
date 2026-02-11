import {KEY_COLOR, KeyboardRows, KeymapTypeId, type LayoutModel} from "../base-model.ts";
import {eb65LowshiftLayoutModel} from "./eb65LowshiftLayoutModel.ts";
import {SymmetricKeyWidth, zeroIndent} from "./keyWidth.ts";

// the indent on the bottom is not symmetric, thus managed manually via gaps.
const eb65NiceKeyWidths = new SymmetricKeyWidth(16, zeroIndent);

const singleKeyEffort = [
    [null, 3.0, 3.0, 2.0, 2.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 2.0, 2.0, 3.0, null, null],
    [2.0, 2.0, 1.0, 1.0, 1.5, 2.0, 3.0, 3.0, 3.0, 2.0, 1.5, 1.0, 1.0, 2.0, 2.0],
    [1.5, 0.2, 0.2, 0.2, 0.2, 2.0, 3.0, 3.0, 3.0, 2.0, 0.2, 0.2, 0.2, 0.2, 1.5],
    [3.0, 1.0, 1.5, 1.5, 1.0, 2.0, 3.0, 3.0, 3.0, 2.0, 1.0, 1.5, 1.5, 1.0, null, null],
    [null, 2.0, 1.5, 1.5, 1.0, 0.2, 0.2, 1.0, null, 1.5, null, null, null, null],
];

export const eb65MidshiftNiceLayoutModel: LayoutModel = {
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
    singleKeyEffort,

    frameMappings: {
        // The keymap has a bunch of small differences to the low-shift; enough to make copy-paste-adapt easier than anything more clever.
        // left-side numbers move to center to make their relative position (from hand home) symmetric to the right side.
        [KeymapTypeId.Ansi30]: [
            ["Esc", "`~", "1", "2", "3", "4", "5", "[", "]", "6", "7", "8", "9", "0", "⇞", "⇟"],
            ["↹", 0, 1, 2, 3, 4, "⇤", null, "⇥", 5, 6, 7, 8, 9, "⌫"],
            ["⇧", 0, 1, 2, 3, 4, "-", "\\", "'", 5, 6, 7, 8, 9, "⇧"],
            ["Ctrl", 0, 1, 2, 3, 4, "=", "€ ¢ £ ¥", 9, 5, 6, 7, 8, null, "↑", null],
            [null, "Cmd", "Fn", "⌦", "Alt", "⏎", "⍽", "AltGr", null, "Ctrl", null, "←", "↓", "→"]
        ],
        [KeymapTypeId.Thumb30]: [
            ["Esc", "`~", "1", "2", "3", "4", "5", "[", "]", "6", "7", "8", "9", "0", "⇞", "⇟"],
            ["↹", 0, 1, 2, 3, 4, "⇤", null, "⇥", 5, 6, 7, 8, 9, "⌫"],
            ["⇧", 0, 1, 2, 3, 4, "\\", "€ £ ¥", "'", 5, 6, 7, 8, 9, "⇧"],
            ["Ctrl", 0, 1, 2, 3, 4, "=", "⌦", "/", 5, 6, 7, 8, null, "↑", null],
            [null, "Cmd", "Fn", "Alt", 0, "⏎", "⍽", "AltGr", null, "Ctrl", null, "←", "↓", "→"],
        ],
    },

    keyWidths:
        [
            eb65NiceKeyWidths.row(0, 1),
            eb65NiceKeyWidths.row(1, 1.75),
            eb65NiceKeyWidths.row(2, 1.5),
            eb65NiceKeyWidths.row(3, 1.25)
                .slice(0, -2)
                .concat(0.25, 1, 1),
            /*
            Since the largest key above the bottom is 1.75u, we also use this for the space bars.
            Space bars are the 0.75u away from the inner edge of the index finger home key,
            which is a bit more than the ideal 0.5u realized in the Ergoplank, but still acceptable.
             */
            [0.5, 1.5, 1.25, 1.5, 1.5, 1.75, 1.75, 1.5, 0, 1.5, 0.25, 1, 1, 1],

            // Alternatively, use an indent of only 0.25 and only 1.5u keys on both sides of the 1.75 space bars.
            // But that raises the question of also replacing the only remaining 1.25u key to get a simpler keycap size set.

            // Another alternative is using 1.25u universally, which produces one more key:
            // [0.5, 1.25, 1.25, 1, 1, 1.25, 1.75, 1.75, 1.25, 0.75/2, 1.25, 0.75/2, 1, 1, 1],
        ],

    keyColorClass(label: string, row: KeyboardRows, col: number) {
        if (label && "⏎↑↓←→".includes(label) || label === "Esc") return KEY_COLOR.HIGHLIGHT;
        if (row === KeyboardRows.Bottom) return KEY_COLOR.EDGE;
        const len = singleKeyEffort[row].length - 1;
        const c = col > len / 2 ? len - col : col;
        switch (row) {
            case KeyboardRows.Number:
                if (c <= 1) return KEY_COLOR.EDGE;
                if (c <= 6) return KEY_COLOR.BORING;
                return KEY_COLOR.EDGE;
            case KeyboardRows.Upper:
            case KeyboardRows.Home:
                if (c === 0) return KEY_COLOR.EDGE;
                if (c < 6) return KEY_COLOR.BORING;
                return KEY_COLOR.EDGE;
            case KeyboardRows.Lower:
                // not symmetric, so define it manually using `col`
                if (col === 0) return KEY_COLOR.EDGE;
                if (col < 6) return KEY_COLOR.BORING;
                if (col < 9) return KEY_COLOR.EDGE;
                return KEY_COLOR.BORING;
        }
    },
}


