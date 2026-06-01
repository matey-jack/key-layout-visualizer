import {KEY_COLOR, KeyboardRows, KeymapTypeId, type LayoutMapping, type LayoutModel} from "../base-model.ts";
import {mirrorOdd, SymmetricKeyWidth} from './keyWidth.ts';
import {patchThumb30, patchThumb32, permute} from './permutation-functions.ts';

const keyWidthsGen = new SymmetricKeyWidth(16, [0, 0, 0, 0, 0.5]);

const keyWidths: number[][] = [
    keyWidthsGen.row(0, 1),
    keyWidthsGen.row(1, 1.75),
    keyWidthsGen.row(2, 1.5),
    mirrorOdd(1.25, 1, 1, 1, 1, 1, 1, 0.25, 1),
    mirrorOdd(1.5, 1.25, 1.25, 1.75, 0.25, 1, 1),
];

const ansi30FrameMapping: LayoutMapping = [
    ["Esc", "`~", "1", "2", "3", "4", "5", "[", "]", "6", "7", "8", "9", "0", "⇞", "⇟"],
    ["↹", 0, 1, 2, 3, 4, "-", null, "+", 5, 6, 7, 8, 9, "⌫"],
    ["⇧", 0, 1, 2, 3, 4, "\\", "Ins", "'", 5, 6, 7, 8, 9, "⇧"],
    ["Ctrl", 0, 1, 2, 3, 4, "⇤", null, "↑", null, "⇥", 5, 6, 7, 8, 9, "Fn"],
    ["Cmd", "⌦", "Alt", "⏎", null, "←", "↓", "→", null, "⍽", "AltGr", "Menu", "Ctrl"],
];

const ansi32FrameMapping: LayoutMapping = [
    ["Esc", "`~", "1", "2", "3", "4", "5", "⇤", "⇥", "6", "7", "8", "9", "0", "⇞", "⇟"],
    ["↹", 0, 1, 2, 3, 4, [2, 10], null, 10, 5, 6, 7, 8, 9, "⌫"],
    ["⇧", 0, 1, 2, 3, 4, "/", "\\", "'", 5, 6, 7, 8, 9, "⇧"],
    ["Ctrl", 0, 1, 2, 3, 4, "⇤", null, "↑", null, "⇥", 5, 6, 7, 8, 9, "Fn"],
    ["Cmd", "⌦", "Alt", "⏎", null, "←", "↓", "→", null, "⍽", "AltGr", "Menu", "Ctrl"],
];

export const ergoboardCentralLayoutModel: LayoutModel = {
    name: "Ergoboard with Central Arrows",
    description: `A 16u wide variant of the Ergoplank with central navigation keys.
    Edit the keyWidths and frameMappings directly in code to experiment with stagger and gaps!`,
    rowIndent: keyWidthsGen.rowIndent,
    keyWidths,
    mainFingerAssignment: [
        [null, 1, 1, 1, 2, 3, 3, 3, 6, 6, 6, 7, 8, 8, null, null],
        [0, 0, 1, 2, 3, 3, 3, null, 6, 6, 6, 7, 8, 9, 9],
        [0, 0, 1, 2, 3, 3, 3, null, 6, 6, 6, 7, 8, 9, 9],
        [0, 0, 1, 2, 3, 3, null, null, null, null, null, 6, 6, 7, 8, 9, 9],
        [0, 1, 4, 4, null, null, null, null, null, 5, 5, 8, 9],
    ],
    singleKeyEffort: [
        [null, 3.0, 3.0, 2.0, 2.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 2.0, 2.0, 3.0, null, null],
        [2.0, 2.0, 1.0, 1.0, 1.5, 2.0, 3.0, 3.0, 3.0, 2.0, 1.5, 1.0, 1.0, 2.0, 2.0],
        [1.5, 0.2, 0.2, 0.2, 0.2, 2.0, 3.0, null, 3.0, 2.0, 0.2, 0.2, 0.2, 0.2, 1.5],
        [3.0, 1.0, 1.5, 1.5, 1.0, 2.0, null, null, null, null, null, 2.0, 1.0, 1.5, 1.5, 1.0, 3.0],
        [2.0, 1.5, 1.5, 0.2, null, null, null, null, null, 0.2, 1.5, 1.5, 2.0],
    ],
    leftHomeIndex: 4,
    rightHomeIndex: 10,
    staggerOffsets: [0.5, 0.25, 0, -0.25],
    symmetricStagger: true,

    frameMappings: {
        [KeymapTypeId.Ansi30]: ansi30FrameMapping,
        [KeymapTypeId.Thumb30]: patchThumb30(ansi30FrameMapping, "[4:0]⏎F+-", "/[3:9]"),
        [KeymapTypeId.Ansi32]: ansi32FrameMapping,
        [KeymapTypeId.Thumb32]: permute(
            patchThumb32(ansi32FrameMapping, "[4:0]⏎F[2:10]"),
            // just an attempt to have no modifier/command key in the main area ;-)
            "€FM"
        ),
    },

    keyColorClass(label: string, row: KeyboardRows, col: number) {
        if (label && "⌫↑↓←→".includes(label) || label === "Esc") return KEY_COLOR.HIGHLIGHT;
        if (row === KeyboardRows.Bottom) return KEY_COLOR.EDGE;
        if (col === 0) return KEY_COLOR.EDGE;
        const rightEdge = [13, 13, 13, 15]
        if (col > rightEdge[row]) return KEY_COLOR.EDGE;

        const boringKeys = (row === KeyboardRows.Number) ? 6 : 5;
        if (col <= boringKeys) return KEY_COLOR.BORING;
        if (col <= rightEdge[row] - 5) return KEY_COLOR.EDGE;
        return KEY_COLOR.BORING;
    },
}
