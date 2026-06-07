import {KEY_COLOR, KeyboardRows, KeymapTypeId, type LayoutMapping, type LayoutModel} from "../base-model.ts";
import {mirrorOdd, SymmetricKeyWidth} from './keyWidth.ts';
import {patchThumb30, patchThumb32, permute} from './permutation-functions.ts';

const keyWidthsGen = new SymmetricKeyWidth(16, [0, 0, 0, 0.75, 0.25]);

/*
- maximally wide hand position.
- one less key than Ergoboard Central with 1.5u edges in the home row,
  because gaps in the lower row are so huge.
- the reconciliation is a 1.5u key instead of a gap
- no 1.75u is required on the edges or the bottom (because the center is filled with the arrows)
- we could even replace the Tab-key pair with a 1u (good for putting the apostrophe!) and have a pure 1 and 1.5u board!
- instead of the gaps around the up arrow, home/end could move closer, leaving the gaps to their outside
  and/or making them smaller by being larger themselves.

The original idea of filling the bottom gap with the up arrow has been overdone here,
because the gap is so big that we lose an entire key.
Anyway, the original concern was to repurpose one of the gaps to avoid heterogeneous gaps,
but all the Ergoboard legacy variants show that this gap can be wonderfully filled with a delete key
(that could also be Return or the Windows key or whatever one pleases).

Maybe then try how it looks with 1.25u home edge?
0.5u gap up top; 1.5u button on the home row; 0.5u gaps around up arrow (and 1u modifier keys lower row left and right).

The only thing that we don't want is 1.75u home edge, because a 1.5u lower edge would have zero gap to the up arrow or waste a full two keys just to create gaps there!
*/
const keyWidths: number[][] = [
    keyWidthsGen.row(0, 1.5),
    keyWidthsGen.row(1, 1.25),
    keyWidthsGen.row(2, 1),
    mirrorOdd(1, 1, 1, 1, 1, 1.25, 0.5, 1),
    mirrorOdd(1.5, 1.5, 1.5, 1.5, 0.25, 1, 1),
];

// This has one key less than the Central Ergoboard with 1.5u edges in the home row
// Also, the lower row edge was a good place to place modifiers.
// Missing that place now, we drop the menu key and place ⌦ in the center instead of the bottom.
const ansi30FrameMapping: LayoutMapping = [
    ["Esc", "1", "2", "3", "4", "5", "[", "`~", "]", "6", "7", "8", "9", "0", "⌫"],
    ["↹", 0, 1, 2, 3, 4, "-", "⌦", "+", 5, 6, 7, 8, 9, "⎀"],
    ["⇧", 0, 1, 2, 3, 4, "\\", "⇞", "⇟", "'", 5, 6, 7, 8, 9, "⇧"],
    [0, 1, 2, 3, 4, "⇤", null, "↑", null, "⇥", 5, 6, 7, 8, 9],
    ["Ctrl", "Cmd", "Alt", "⏎", null, "←", "↓", "→", null, "⍽", "AltGr", "Fn", "Ctrl"],
];

const ansi32FrameMapping: LayoutMapping = [
    ["Esc", "`~", "1", "2", "3", "4", "5", "[", "]", "6", "7", "8", "9", "0", "⇞", "⇟"],
    ["↹", 0, 1, 2, 3, 4, [2, 10], null, 10, 5, 6, 7, 8, 9, "⌫"],
    ["⇧", 0, 1, 2, 3, 4, "/", "+", "'", 5, 6, 7, 8, 9, "⇧"],
    ["Ctrl", 0, 1, 2, 3, 4, "⇤", null, "↑", null, "⇥", 5, 6, 7, 8, 9, "Fn"],
    ["Cmd", "⌦", "Alt", "⏎", null, "←", "↓", "→", null, "⍽", "AltGr", "⎀", "Ctrl"],
];

export const ergoboardCentralWideLayoutModel: LayoutModel = {
    name: "Ergoboard 16/6 with Central Arrows",
    description: `A 16u wide variant of the Ergoplank with maximally wide hand distance and central navigation keys.
    It doesn't need any variants or options, because it's just great as it is. `,
    rowIndent: keyWidthsGen.rowIndent,
    keyWidths,
    // TODO
    mainFingerAssignment: [
        [null, 1, 1, 1, 2, 3, 3, 3, 6, 6, 6, 7, 8, 8, null, null],
        [0, 0, 1, 2, 3, 3, 3, null, 6, 6, 6, 7, 8, 9, 9],
        [0, 0, 1, 2, 3, 3, 3, null, 6, 6, 6, 7, 8, 9, 9],
        [0, 0, 1, 2, 3, 3, null, null, null, null, null, 6, 6, 7, 8, 9, 9],
        [0, 1, 4, 4, null, null, null, null, null, 5, 5, 8, 9],
    ],
    // TODO
    singleKeyEffort: [
        [null, 3.0, 3.0, 2.0, 2.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 2.0, 2.0, 3.0, null, null],
        [2.0, 2.0, 1.0, 1.0, 1.5, 2.0, 3.0, 3.0, 3.0, 2.0, 1.5, 1.0, 1.0, 2.0, 2.0],
        [1.5, 0.2, 0.2, 0.2, 0.2, 2.0, 3.0, null, 3.0, 2.0, 0.2, 0.2, 0.2, 0.2, 1.5],
        [3.0, 1.0, 1.5, 1.5, 1.0, 2.0, null, null, null, null, null, 2.0, 1.0, 1.5, 1.5, 1.0, 3.0],
        [2.0, 1.5, 1.5, 0.2, null, null, null, null, null, 0.2, 1.5, 1.5, 2.0],
    ],
    leftHomeIndex: 4,
    rightHomeIndex: 11,
    staggerOffsets: [0.5, 0.25, 0, -0.25],
    symmetricStagger: true,

    frameMappings: {
        [KeymapTypeId.Ansi30]: ansi30FrameMapping,
        [KeymapTypeId.Thumb30]: patchThumb30(ansi30FrameMapping, "[4:0]⏎F+-", "/[3:9]"),
        [KeymapTypeId.Ansi32]: ansi32FrameMapping,
        [KeymapTypeId.Thumb32]: permute(
            patchThumb32(ansi32FrameMapping, "[4:0]⏎F⎀+[2:10]"),
        ),
    },

    keyColorClass(label: string, row: KeyboardRows, col: number) {
        if (label && "⌫↑↓←→".includes(label) || label === "Esc") return KEY_COLOR.HIGHLIGHT;
        if (row === KeyboardRows.Bottom) return KEY_COLOR.EDGE;
        if (col === 0) return KEY_COLOR.EDGE;
        const rightEdge = [13, 13, 14, 15]
        if (col > rightEdge[row]) return KEY_COLOR.EDGE;

        const boringKeys = 5;
        if (col <= boringKeys) return KEY_COLOR.BORING;
        if (col <= rightEdge[row] - 5) return KEY_COLOR.EDGE;
        return KEY_COLOR.BORING;
    },
}
