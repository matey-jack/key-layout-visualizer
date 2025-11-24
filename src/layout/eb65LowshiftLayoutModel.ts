import {FlexMapping, KeyboardRows, LayoutMapping, RowBasedLayoutModel} from "../base-model.ts";
import {copyAndModifyKeymap, keyColorHighlightsClass} from "./layout-functions.ts";
import {SymmetricKeyWidth, zeroIndent} from "./keyWidth.ts";

const keyWidths = new SymmetricKeyWidth(16, zeroIndent);

export const eb65LowshiftLayoutModel: RowBasedLayoutModel = {
    name: "Ergoboard 65 LowShift Narrow",
    description: `"The most ergonomic key layout that fits into a standard "65%" keyboard case 
    and has a traditional inverted-T arrow key cluster."
    Hand distance is still much better than ANSI keyboards. 
    Row stagger is equal to a "cleave-style ergonomic" keyboard.
    Thumb keys are added. 
    Key cap sizes are harmonized to facilitate customizing the keymap. 
    I specifically made this layout so that Enter/Return is the biggest key to create a visual link to an ANSI 65% keyboard, 
    where Return is also bigger than Backspace. 
    It's also practical to have both "space bars" be the same size as the return key, 
    because you can easily map Return on one of those bottom-row bars.`,

    // row lengths: 16, 15, 15 (with 0.5u gap), 16, 14
    thirtyKeyMapping: [
        ["Esc", "1", "2", "3", "4", "5", "[", "`~", "]", "6", "7", "8", "9", "0", "⇞", "⇟"],
        ["↹", 0, 1, 2, 3, 4, "=", null, 5, 6, 7, 8, 9, "-", "⏎"],
        ["⌦", 0, 1, 2, 3, 4, "⇤", "⇥", 5, 6, 7, 8, 9, "'", "⌫"],
        ["Fn", "⇧", 0, 1, 2, 3, 4, "\\", 9, 5, 6, 7, 8, "⇧", "↑", null],
        [null, "Ctrl", "Cmd", "CAPS", "Alt", "⍽", "⍽", "AltGr", "Fn", "Ctrl", null, "←", "↓", "→"],
    ],

    thumb30KeyMapping: [
        ["Esc", "1", "2", "3", "4", "5", "[", "`~", "]", "6", "7", "8", "9", "0", "⇞", "⇟"],
        ["↹", 0, 1, 2, 3, 4, null, null, 5, 6, 7, 8, 9, "=", "⏎"],
        ["⌦", 0, 1, 2, 3, 4, "⇤", "⇥", 5, 6, 7, 8, 9, "'", "⌫"],
        ["Fn", "⇧", 0, 1, 2, 3, 4, "\\", "/", 5, 6, 7, 8, "⇧", "↑", null],
        [null, "Ctrl", "Cmd", "CAPS", "Alt", 0, "⍽", "AltGr", "Fn", "Ctrl", null, "←", "↓", "→"],
    ],

    mainFingerAssignment: [
        [null, 1, 1, 1, 2, 3, 3, 3, 6, 6, 7, 8, 8, 8, null, null],
        [0, 0, 1, 2, 3, 3, 3, null, 6, 6, 7, 8, 9, 9, 9],
        [0, 0, 1, 2, 3, 3, 3, 6, 6, 6, 7, 8, 9, 9, 9],
        [0, 0, 1, 2, 3, 3, 3, 3, 6, 6, 6, 7, 8, 9, null, null],
        [null, 0, 1, 2, 4, 4, 5, 5, null, 7, null, null, null, null],
    ],

    hasAltFinger: (row: number, col: number) =>
        (row == KeyboardRows.Lower) && ([1, 2, 3, 7, 8, 9].includes(col)),

    // Only fixed values can be used. See base-model.ts SKE_*
    // 'null' means the hand has to taken off the home-row. Those keys can't be used with letter or prose punctuation.
    singleKeyEffort: [
        [null, 3.0, 3.0, 2.0, 2.0, 3.0, 3.0, 3.0, 3.0, 3.0, 2.0, 2.0, 3.0, 3.0, null, null],
        [2.0, 2.0, 1.0, 1.0, 1.5, 2.0, 3.0, 3.0, 2.0, 1.5, 1.0, 1.0, 2.0, 2.0, 3.0],
        [1.5, 0.2, 0.2, 0.2, 0.2, 2.0, 3.0, 3.0, 2.0, 0.2, 0.2, 0.2, 0.2, 1.5, 2.0],
        [3.0, 1.0, 1.5, 1.5, 1.0, 2.0, 3.0, 3.0, 3.0, 2.0, 1.0, 1.5, 1.5, 1.0, null, null],
        [null, 2.0, 1.5, null, 1.0, 0.2, 0.2, 1.0, null, null, null, null, null, null],
    ],

    rowIndent: keyWidths.rowIndent,

    keyWidths: [
        keyWidths.row(KeyboardRows.Number, 1),
        keyWidths.row(KeyboardRows.Upper, 1.75),
        keyWidths.row(KeyboardRows.Home, 1.5),
        keyWidths.row(KeyboardRows.Lower, 1),
        [0.5, 1.25, 1.25, 1.25, 1.25, 1.75, 1.75, 1.25, 1, 1.25, 0.5, 1, 1, 1],
    ],
    leftHomeIndex: 4,
    rightHomeIndex: 9,

    staggerOffsets: [0.5, 0.25, 0, -0.5],
    symmetricStagger: true,

    getSpecificMapping: (_: FlexMapping) => undefined,

    keyColorClass: keyColorHighlightsClass,
}

export const eb65BigEnterLayoutModel: RowBasedLayoutModel = {
    ...eb65LowshiftLayoutModel,
    name: "Ergoboard 65 LowShift Big Enter",
    keyWidths: copyAndModifyKeymap(eb65LowshiftLayoutModel.keyWidths, (matrix) => {
        const homeRow = matrix[KeyboardRows.Home];
        homeRow.pop();
        homeRow[homeRow.length - 1] = 2.5;
        matrix[KeyboardRows.Bottom] = [0.25, 1.25, 1.25, 1, 1.25, 2.5, 2.5, 1.25, 0.25, 1.25, 0.25, 1, 1, 1];
        return matrix;
    }),
    thirtyKeyMapping: copyAndModifyKeymap(eb65LowshiftLayoutModel.thirtyKeyMapping!!, (m) => moveKeys(m, false)),
    thumb30KeyMapping: copyAndModifyKeymap(eb65LowshiftLayoutModel.thumb30KeyMapping!!, (m) => moveKeys(m, true)),
    mainFingerAssignment: copyAndModifyKeymap(eb65LowshiftLayoutModel.mainFingerAssignment!!, (m) => removeKey(m)),
    singleKeyEffort: copyAndModifyKeymap(eb65LowshiftLayoutModel.singleKeyEffort!!, (m) => removeKey(m)),
}

function moveKeys(mapping: LayoutMapping, thumby: boolean): LayoutMapping {
    mapping[KeyboardRows.Number][7] = "=";
    mapping[KeyboardRows.Upper][6] = thumby ? "`~" : "-";
    mapping[KeyboardRows.Upper].splice(-2, 2, "'", "⏎");
    mapping[KeyboardRows.Home].splice(-2, 2, "⌫");
    mapping[KeyboardRows.Bottom][8] = null;
    return mapping;
}

function removeKey<T>(mapping: T[][]): T[][] {
    mapping[KeyboardRows.Home].pop();
    return mapping;
}
