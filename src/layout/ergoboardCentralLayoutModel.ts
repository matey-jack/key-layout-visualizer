import {KEY_COLOR, KeyboardRows, KeymapTypeId, type LayoutMapping, type LayoutModel} from "../base-model.ts";
import {mirrorOdd, SymmetricKeyWidth} from './keyWidth.ts';

const keyWidthsGen = new SymmetricKeyWidth(16, [0, 0, 0, 0, 0]);

const keyWidths: number[][] = [
    keyWidthsGen.row(0, 1),
    keyWidthsGen.row(1, 1.75),
    keyWidthsGen.row(2, 1.5),
    // The center between hand positions is at 7.75u (leaving 8.25u to the right).
    // Placing the Up arrow at 7.25 (to 8.25) with a gap of 0.25u leaves 7u left and 7.5u right.
    mirrorOdd(1.25, 1, 1, 1, 1, 1, 1, 0.25, 1),
    // With a similar 0.25u gap on each side, there remain 6u left and 6.5u right.
    mirrorOdd(1.5, 1.25, 1.25, 1.75, 0.25, 1, 1),
];

// Helper to auto-generate matching arrays for hot-reloading
function generateEmpty<T>(fillValue: T): (T | null)[][] {
    return keyWidths.map(row => row.map(w => w >= 1 ? fillValue : null));
}

// Auto-generate dummy frame mapping so you can see where keys are.
// Edit these directly with real strings once you settle on the keyWidths!
const dummyFrameMapping = keyWidths.map((row, r) => {
    let count = 0;
    return row.map(w => w >= 1 ? `${r}:${count++}` : null);
});

// Optionally give arrow keys a nice highlight
dummyFrameMapping[3][7] = '↑';
dummyFrameMapping[4][4] = '←';
dummyFrameMapping[4][5] = '↓';
dummyFrameMapping[4][6] = '→';

const ansi30FrameMapping: LayoutMapping = [
    ["Esc", "`~", "1", "2", "3", "4", "5", "[", "]", "6", "7", "8", "9", "0", "⇞", "⇟"],
    ["↹", 0, 1, 2, 3, 4, "-", null, "+", 5, 6, 7, 8, 9, "⌫"],
    ["⇧", 0, 1, 2, 3, 4, "\\", "Ins", "'", 5, 6, 7, 8, 9, "⇧"],
    ["Ctrl", 0, 1, 2, 3, 4, "⇤", null, "↑", null, "⇥", 5, 6, 7, 8, 9, "Fn"],
    ["Cmd", "⌦", "Alt", "⏎", null, "←", "↓", "→", null, "⍽", "AltGr", "Menu", "Ctrl"],
];

export const ergoboardCentralLayoutModel: LayoutModel = {
    name: "Ergo-TODO-Someting",
    description: `A 16u wide variant of the Ergoplank with central navigation keys. 
    Edit the keyWidths and frameMappings directly in code to experiment with stagger and gaps!`,
    rowIndent: keyWidthsGen.rowIndent,
    keyWidths,
    mainFingerAssignment: generateEmpty(0),
    singleKeyEffort: generateEmpty(1.0),
    leftHomeIndex: 4,
    rightHomeIndex: 10,
    staggerOffsets: [0, 0, 0, 0], // Customize as needed
    symmetricStagger: false,

    // When you're ready, replace the dummy generators with real explicit mappings
    frameMappings: {
        [KeymapTypeId.Ansi30]: ansi30FrameMapping,
        [KeymapTypeId.Ansi32]: dummyFrameMapping,
        [KeymapTypeId.Thumb30]: dummyFrameMapping,
        [KeymapTypeId.Thumb32]: dummyFrameMapping,
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
