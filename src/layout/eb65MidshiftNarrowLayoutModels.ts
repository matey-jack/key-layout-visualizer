import {
    Finger,
    KeyboardRows,
    KeymapTypeId,
    type LayoutMapping,
    type LayoutModel,
    SKE_AWAY,
} from "../base-model.ts";
import {copyAndModifyKeymap, keyColorHighlightsClass} from "./layout-functions.ts";

export const eb65MidshiftRightRetLayoutModel: LayoutModel = {
    name: "Ergoboard 65 MidShift Narrow, Right Return",
    description: ``,

    mainFingerAssignment: [
        [null, 1, 1, 1, 2, 3, 3, 3, 6, 6, 7, 8, 8, 8, null, null],
        [0, 0, 1, 2, 3, 3, 3, null, 6, 6, 7, 8, 9, 9, null],
        [0, 0, 1, 2, 3, 3, 3, 6, 6, 6, 7, 8, 9, 9, 9],
        [0, 0, 1, 2, 3, 3, 3, 3, 6, 6, 6, 7, 8, 9, null, null, null],
        [null, 0, null, null, 4, 4, 5, 5, null, 7, null, null, null, null],
    ],

    hasAltFinger: (row: number, col: number) =>
        (row === KeyboardRows.Lower) && ([1, 2, 3, 7, 8, 9].includes(col)),

    singleKeyEffort: [
        [null, 3.0, 3.0, 2.0, 2.0, 3.0, 3.0, 3.0, 3.0, 3.0, 2.0, 2.0, 3.0, 3.0, null, null],
        [2.0, 2.0, 1.0, 1.0, 1.5, 2.0, 3.0, 3.0, 2.0, 1.5, 1.0, 1.0, 2.0, 2.0, 3.0],
        [1.5, 0.2, 0.2, 0.2, 0.2, 2.0, 3.0, 3.0, 2.0, 0.2, 0.2, 0.2, 0.2, 1.5, 3.0],
        [3.0, 1.0, 1.5, 1.5, 1.0, 2.0, 3.0, 3.0, 3.0, 2.0, 1.0, 1.5, 1.5, 1.0, null, null, null],
        [null, 2.0, 1.5, null, 1.0, 0.2, 0.2, 1.0, null, null, null, null, null, null],
    ],

    rowIndent: [0, 0, 0, 0, 0],

    // Turns out that my genius gap-creation logic doesn't apply here, because those three layouts explicitly prefer
    // smaller gaps, to have more 1u keys for mapping characters onto them. So let's just brute it today.
    keyWidths: [
        Array(16).fill(1),
        [1.75, 1, 1, 1, 1, 1, 1, 0.5, 1, 1, 1, 1, 1, 1, 1.75],
        [1.5, ...Array(13).fill(1), 1.5],
        [1.25, 1, 1, 1, 1, 1, 1, 0.5, 1, 1, 1, 1, 1, 1, 0.25, 1, 1],
        [0.5, 1.25, 1.25, 1.25, 1.25, 1.75, 1.75, 1.25, 0.75, 1.25, 0.75, 1, 1, 1]
    ],

    leftHomeIndex: 4,
    rightHomeIndex: 9,

    staggerOffsets: [0.5, 0.25, 0, -0.25],
    symmetricStagger: true,

    frameMappings: {
        [KeymapTypeId.Ansi30]: [
            ["Esc", "1", "2", "3", "4", "5", "[", "`~", "]", "6", "7", "8", "9", "0", "⇞", "⇟"],
            ["↹", 0, 1, 2, 3, 4, "\\", null, 5, 6, 7, 8, 9, "'", "⌫"],
            ["⇧", 0, 1, 2, 3, 4, "=", "-", 5, 6, 7, 8, 9, "⇧", "⏎"],
            ["Ctrl", 0, 1, 2, 3, 4, "⇤", null, "⇥", 5, 6, 7, 8, 9, null, "↑", null],
            [null, "Cmd", "Fn", "⌦", "Alt", "⍽", "⍽", "AltGr", null, "Ctrl", null, "←", "↓", "→"]
        ],
        // note: thanks to the thumb-letter, we have one less letter above the bottom row and could use a "big" key in the top center.
        // but layouts can't transform themselves when the keymap changes.
        // Anyway, my favorite layouts don't have this problem, so I won't solve it.
        [KeymapTypeId.Thumb30]: [
            ["Esc", "1", "2", "3", "4", "5", "[", "`~", "]", "6", "7", "8", "9", "0", "⇞", "⇟"],
            ["↹", 0, 1, 2, 3, 4, null, null, 5, 6, 7, 8, 9, "'", "⌫"],
            ["⇧", 0, 1, 2, 3, 4, "=", "\\", 5, 6, 7, 8, 9, "⇧", "⏎"],
            ["Ctrl", 0, 1, 2, 3, 4, "⇤", null, "⇥", 5, 6, 7, 8, "/", null, "↑", null],
            [null, "Cmd", "Fn", "⌦", "Alt", 0, "⍽", "AltGr", null, "Ctrl", null, "←", "↓", "→"],
        ],
    },

    keyColorClass: keyColorHighlightsClass,
}
export const eb65CentralEnterLayoutModel: LayoutModel = {
    ...eb65MidshiftRightRetLayoutModel,
    name: "Ergoboard 65 MidShift Narrow, Central Return",
    keyWidths: copyAndModifyKeymap(eb65MidshiftRightRetLayoutModel.keyWidths!, (matrix) => {
        matrix[KeyboardRows.Upper].splice(6, 2, 1.5);
        matrix[KeyboardRows.Home][13] = 1.5;
        matrix[KeyboardRows.Home][14] = 1;
        return matrix;
    }),
    frameMappings: Object.fromEntries(
        Object.entries(eb65MidshiftRightRetLayoutModel.frameMappings).map(([typeId, frameMapping]) => [
            typeId,
            copyAndModifyKeymap(frameMapping, moveEnterToCenter),
        ])
    ),
    mainFingerAssignment: copyAndModifyKeymap(eb65MidshiftRightRetLayoutModel.mainFingerAssignment, (matrix) => {
        matrix[KeyboardRows.Number][14] = Finger.RPinky;
        matrix[KeyboardRows.Upper].splice(6, 1);
        matrix[KeyboardRows.Home][14] = null;
        return matrix;
    }),
    singleKeyEffort: copyAndModifyKeymap(eb65MidshiftRightRetLayoutModel.singleKeyEffort, (matrix) => {
        matrix[KeyboardRows.Number][14] = SKE_AWAY;
        matrix[KeyboardRows.Upper].splice(6, 1);
        matrix[KeyboardRows.Home][14] = null;
        return matrix;
    }),
}

function moveEnterToCenter(mapping: LayoutMapping): LayoutMapping {
    mapping[KeyboardRows.Number][14] = "\\";
    mapping[KeyboardRows.Number][15] = "⇞";
    mapping[KeyboardRows.Upper].splice(6, 2, "⏎");
    mapping[KeyboardRows.Home][14] = "⇟";
    return mapping;
}

export const eb65VerticalEnterLayoutModel: LayoutModel = {
    ...eb65MidshiftRightRetLayoutModel,
    name: "Ergoboard 65 MidShift Narrow, Vertical Return",
    keyWidths: copyAndModifyKeymap(eb65MidshiftRightRetLayoutModel.keyWidths!, (matrix) => {
        matrix[KeyboardRows.Upper][13] = 1.75; // Backspace
        matrix[KeyboardRows.Upper][14] = 1;    // Enter
        matrix[KeyboardRows.Home][13] = 1.5;   // Shift
        matrix[KeyboardRows.Home][14] = 1;     // gap for Enter
        return matrix;
    }),
    keyCapHeight: (row: KeyboardRows, col: number) => {
        if (row === KeyboardRows.Upper && col === 14) return 2;
        return 1;
    },
    frameMappings: Object.fromEntries(
        Object.entries(eb65MidshiftRightRetLayoutModel.frameMappings).map(([typeId, frameMapping]) => [
            typeId,
            copyAndModifyKeymap(frameMapping, moveEnterToVertical),
        ])
    ),
}

function moveEnterToVertical(mapping: LayoutMapping): LayoutMapping {
    mapping[KeyboardRows.Upper][14] = "⏎";
    mapping[KeyboardRows.Upper][13] = "⌫";
    mapping[KeyboardRows.Home][14] = null;
    return mapping;
}
