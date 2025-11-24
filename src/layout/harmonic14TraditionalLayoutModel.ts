import {FlexMapping, harmonicStaggerOffsets, KeyboardRows, LayoutMapping, RowBasedLayoutModel} from "../base-model.ts";
import {mirrorOdd, MonotonicKeyWidth, zeroIndent} from "./keyWidth.ts";

const fullMapping: LayoutMapping = [
    ["Esc", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", 0, "⌫"], // 13 keys
    ["↹", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], // 14 keys
    ["¤", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, "⏎"], // 13 keys
    ["⇧", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "⇧"], // 12 keys, due to 2u Shift keys.
    // 1×3u space, 2×4×1u, 2×1.5u at the end (take up stagger), makes 1+10 keys.
    ["Ctrl", "Cmd", "Alt", 0, "⌦", "⍽", 1, 2, 3, "Fn", "Ctrl"],
]; // total of 63 keys, compared to 62 in the Harmonic 13. (Another bottom bar config could yield one or two more ;-). )

const h14tKeyWidth = new MonotonicKeyWidth(14, zeroIndent, "H14T");

export const harmonic14TraditionalLayoutModel: RowBasedLayoutModel = {
    name: "Harmonic 14 Traditional",
    description: "With its large shift keys and Enter/Backspace/Caps in the same position as the ANSI keyboard, " +
        "this Harmonic variant might be the easiest to get used to. We even put a central space bar for that special retro feeling. " +
        "But other than that we keep the Harmonic virtues of a fully symmetric keyboard and only two key sizes " +
        "for all remaining keys to allow for flexible changes to the key mapping. " +
        "Its regular row stagger allows for many keys to be comfortably typed by two fingers, " +
        "which let's you intuitively avoid the awkward same-finger bigrams that make new key mappings feel so awkward. " +
        "Despite its size, the H14T is still one key unit narrower than an ANSI-based 60% keyboard, " +
        "yet the hand home position is one key further apart, allowing for arms to relax and shoulders to open. " +
        "This also puts a bit of typing load on the index fingers and less on the pinkies. ",

    thirtyKeyMapping: [
        ["Esc", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "=", "⌫"], // 13 keys
        ["↹", 0, 1, 2, 3, 4, "`", 5, 6, 7, 8, 9, "'", "\\"], // 14 keys
        ["¤", 0, 1, 2, 3, 4, "-", 5, 6, 7, 8, 9, "⏎"], // 13 keys
        // The move of key 9 to the middle is a change required to keep the key-to-finger assignments
        // the same as on the ANSI layout. This is caused by moving the right home row to the right.
        ["⇧", 0, 1, 2, 3, 4, 9, 5, 6, 7, 8, "⇧"], // 12 keys
        ["Ctrl", "Cmd", "Alt", "[", "⌦", "⍽", "AltGr", "]", "Menu", "Fn", "Ctrl"], // 11 keys
    ],
    thumb30KeyMapping: [
        ["Esc", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "`", "⌫"], // 13 keys
        ["↹", 0, 1, 2, 3, 4, "=", 5, 6, 7, 8, 9, "'", "\\"], // 14 keys
        ["¤", 0, 1, 2, 3, 4, "[", 5, 6, 7, 8, 9, "⏎"], // 13 keys
        ["⇧", 0, 1, 2, 3, 4, "]", 5, 6, 7, 8, "⇧"], // 12 keys
        ["Ctrl", "Cmd", "Alt", "/", "⌦", "⍽", 0, "AltGr", "Menu", "Fn", "Ctrl"], // 11 keys
    ],
    fullMapping,

    rowIndent: h14tKeyWidth.rowIndent,

    keyWidths: [
        h14tKeyWidth.row(0, 1.5),
        h14tKeyWidth.row(0, 1),
        h14tKeyWidth.row(0, 1.5),
        h14tKeyWidth.row(0, 2),
        mirrorOdd(1.5, 1, 1, 1, 1, 3),
    ],
    keyWidth(row: number, col: number){
        return this.keyWidths[row][col];
    },

    // You'll notice that it's the same as in ANSI, making it easy to use both.
    splitColumns: [7, 7, 6, 6, 5],

    leftHomeIndex: 4,
    rightHomeIndex: 8,

    staggerOffsets: harmonicStaggerOffsets,
    symmetricStagger: true,

    mainFingerAssignment: [
        [1, 1, 2, 2, 3, 3, 3, 6, 6, 7, 7, 8, 8],
        [1, 0, 1, 1, 2, 3, 3, 6, 6, 7, 8, 8, 9, 8],
        [0, 0, 1, 2, 3, 3, 6, 6, 6, 7, 8, 9, 9],
        [0, 1, 2, 3, 3, 3, 6, 6, 6, 7, 8, 9],
        [0, 1, 2, 2, 4, 5, 5, 7, 7, 8, 9],
    ],

    hasAltFinger: (row: number, col: number) =>
        (row == KeyboardRows.Upper || row == KeyboardRows.Lower) &&
        ([1, 2, 3, 9, 10, 11].includes(col)),

    singleKeyEffort: [
        [NaN, 3.0, 2.0, 2.0, 2.0, 3.0, 3.0, 3.0, 2.0, 2.0, 2.0, 3.0, NaN],
        [3.0, 1.5, 1.5, 1.0, 1.0, 1.5, 2.0, 2.0, 1.5, 1.0, 1.0, 1.5, 1.5, 3.0],
        [1.0, 0.2, 0.2, 0.2, 0.2, 2.0, 3.0, 2.0, 0.2, 0.2, 0.2, 0.2, 1.0],
        [1.0, 1.5, 1.5, 1.0, 1.5, 3.0, 3.0, 1.5, 1.0, 1.5, 1.5, 1.0],
        [NaN, NaN, 1.5, 1.0, 0.2, 1.0, 0.2, 1.0, 1.5, NaN, NaN],
    ],

    getSpecificMapping: (f: FlexMapping) => f.mappingHarmonic14t,
}
