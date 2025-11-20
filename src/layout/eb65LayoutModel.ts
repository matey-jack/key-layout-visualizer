import {FlexMapping, KEY_COLOR, KeyboardRows, LayoutMapping, RowBasedLayoutModel} from "../base-model.ts";
import {copyAndModifyKeymap, defaultKeyColor} from "./layout-functions.ts";

export const eb65BigEnterLayoutModel: RowBasedLayoutModel = {
    name: "Ergoboard 65",
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

    // row lengths: 16, 15, 14 (with 0.5u gap), 16, bottom TODO
    thirtyKeyMapping: [
        ["Esc", "1", "2", "3", "4", "5", "[", "`~", "]", "6", "7", "8", "9", "0", "\\", "Fn"],
        ["↹", 0, 1, 2, 3, 4, "-", null, 5, 6, 7, 8, 9, "'", "⌫"],
        ["Caps", 0, 1, 2, 3, 4, "⇞", "⇟", 5, 6, 7, 8, 9, "⏎"],
        ["⇤", "⇧", 0, 1, 2, 3, 4, "=", 9, 5, 6, 7, 8, "⇧", "↑", "⇥"],
        [null, "Ctrl", "Cmd", "⌦", "Alt", "⍽", "⍽", "AltGr", "Ctrl", null, "←", "↓", "→"]
    ],

    thumb30KeyMapping: [
        ["Esc", "1", "2", "3", "4", "5", "[", "`~", "]", "6", "7", "8", "9", "0", "", "⇤"],
        ["↹", 0, 1, 2, 3, 4, "=", null, 5, 6, 7, 8, 9, "'", "⌫"],
        ["Caps", 0, 1, 2, 3, 4, "⇞", "⇟", 5, 6, 7, 8, 9, "⏎"],
        ["Fn", "⇧", 0, 1, 2, 3, 4, "\\", "/", 5, 6, 7, 8, "⇧", "↑", "⇥"],
        [null, "Ctrl", "Cmd", "⌦", "Alt", 0, "⍽", "AltGr", "Ctrl", null, "←", "↓", "→"],
    ],

    // todo
    fullMapping: [],

    mainFingerAssignment: [
        [1, 1, 1, 1, 2, 3, 3, 3, 6, 6, 7, 8, 8, 8, 8, null],
        [0, 0, 1, 2, 3, 3, 3, null, 6, 6, 7, 8, 9, 9, 9],
        [0, 0, 1, 2, 3, 3, 3, 6, 6, 6, 7, 8, 9, 9],
        [0, 0, 1, 2, 3, 3, 3, 3, 6, 6, 6, 7, 8, 9, null, null],
        [null, 0, 1, 2, 4, 4, 5, 5, 7, null, null, null, null],
    ],

    hasAltFinger: (row: number, col: number) =>
        (row == KeyboardRows.Lower) && ([1, 2, 3, 7, 8, 9].includes(col)),

    // Only fixed values can be used. See base-model.ts SKE_*
    // 'null' means the hand has to taken off the home-row. Those keys can't be used with letter or prose punctuation.
    singleKeyEffort: [
        [null, 3.0, 3.0, 2.0, 2.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 2.0, 2.0, 3.0, 3.0, null],
        [2.0, 2.0, 1.0, 1.0, 1.5, 2.0, 3.0, 3.0, 2.0, 1.5, 1.0, 1.0, 2.0, 2.0, 3.0],
        [1.5, 0.2, 0.2, 0.2, 0.2, 2.0, 3.0, 3.0, 2.0, 0.2, 0.2, 0.2, 0.2, 1.5],
        [3.0, 1.0, 1.5, 1.5, 1.0, 2.0, 3.0, 3.0, 3.0, 2.0, 1.0, 1.5, 1.5, 1.0, null, null],
        [null, 2.0, 1.5, null, 1.0, 0.2, 0.2, 1.0, null, null, null, null, null],
    ],

    rowStart: (_row: KeyboardRows) => 0,

    keyWidth: (row: KeyboardRows, col: number): number => {
        const numCols = eb65BigEnterLayoutModel.thirtyKeyMapping![row].length;
        if (row == KeyboardRows.Upper && (col == 7)) {
            // the gap
            return 0.5;
        }
        if (row == KeyboardRows.Home && col == numCols - 1) {
            // Big-mouth Enter
            return 2.5;
        }
        if (row == KeyboardRows.Bottom) {
            return [0.25, 1.25, 1.25, 1.25, 1.25, 2.5, 2.5, 1.25, 1.25, 0.25, 1, 1, 1][col];
        }
        // TODO: make CAPS key 1.25 with indent or two 0.125 gaps, because the current 1.5 is the only keycap of that size.
        const widthOfEdgeKey = [1, 1.75, 1.5, 1]
        if (col == 0 || col == numCols - 1) {
            return widthOfEdgeKey[row];
        }
        return 1;
    },

    leftHomeIndex: 4,
    rightHomeIndex: 9,

    staggerOffsets: [0.5, 0.25, 0, -0.5],
    symmetricStagger: true,

    getSpecificMapping: (_: FlexMapping) => undefined,

    keyColorClass(label: string, row: KeyboardRows, col: number) {
        if (label == "⏎" || label == "Esc") return KEY_COLOR.HIGHLIGHT;
        return defaultKeyColor(label, row, col);
    },
}

export const eb65LayoutModel: RowBasedLayoutModel = {
    ...eb65BigEnterLayoutModel,
    keyWidth: (row: KeyboardRows, col: number) => {
        // This reduces the number of keys larger than 1.25u compare to the big Enter.
        // There are now two keys of size 1.5 and four keys of 1.75 (Tab, Backspace, bottom row bars).
        switch (row) {
            case KeyboardRows.Home:
                // split a new key from Enter
                switch (col) {
                    case 13:
                        return 1;
                    case 14:
                        return 1.5;
                }
                break;
            case KeyboardRows.Bottom:
                // Make Space bars as long as the Backspace key, biggest that we have.
                // Unlike the Big Enter variant, space bars can now be exactly centered between the hands.
                switch (col) {
                    case 0:
                        return 0.25; // same gap as big Enter
                    case 5:
                    case 7:
                        return 1.75;
                    case 6:
                        return 1; // new central key
                    case 10:
                        return 0.75; // larger gap
                }
                // we also create one more modifier and thus move the arrow cluster.
                return col > 10 ? 1 : 1.25;
        }
        return eb65BigEnterLayoutModel.keyWidth(row, col);
    },
    thirtyKeyMapping: copyAndModifyKeymap(eb65BigEnterLayoutModel.thirtyKeyMapping!!, movePagingKeysRight),
    thumb30KeyMapping: copyAndModifyKeymap(eb65BigEnterLayoutModel.thumb30KeyMapping!!, movePagingKeysRight),
    // todo: finger assignment and key effort!
}

function movePagingKeysRight(mapping: LayoutMapping): LayoutMapping {
    mapping[KeyboardRows.Number][14] = "⇞";
    mapping[KeyboardRows.Number][15] = "⇟";
    mapping[KeyboardRows.Upper][6] = "=";
    mapping[KeyboardRows.Upper][13] = "-"; // TODO: this has to be "=" for the thumb30 !
    mapping[KeyboardRows.Home][6] = "⇤";
    mapping[KeyboardRows.Home][7] = "⇥";
    mapping[KeyboardRows.Home][13] = "'";
    mapping[KeyboardRows.Home][14] = "⏎";
    mapping[KeyboardRows.Lower][0] = "Fn";
    mapping[KeyboardRows.Lower][7] = "\\";
    mapping[KeyboardRows.Lower][15] = null;
    // add a key between the space bars
    mapping[KeyboardRows.Bottom].splice(6, 0, "");
    return mapping;
}