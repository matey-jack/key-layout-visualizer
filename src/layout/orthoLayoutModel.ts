import {FlexMapping, KeyboardRows, RowBasedLayoutModel} from "../base-model.ts";

export interface OrthoLayoutOptionsModel {
    thumbKeys: boolean;
}

export const orthoLayoutModel: RowBasedLayoutModel = {
    name: "Ortholinear",
    description: "Ortholinear keyboards remove the weird row stagger and usually also use uniform key sizes. " +
        "Those are just as easy to use, but save a lot of space and also allow for easy changing of the key mapping. " +
        "The layout shown here corresponds to the Preonic, one of several similar available designs. ",

    // This is arbitrarily based on the Preonic 12×5 with only space as a 2u key.
    // I decided to map all ANSI keys except `[` and `]`. Actual users might omit more or less from their base layer.
    // (All ANSI keys fit when using mod/tap double mappings.)
    thirtyKeyMapping: [
        ["Esc", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "⌫"],
        ["↹", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "'"],
        ["CAPS", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "⏎"],
        ["⇧", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "⇧"],
        ["Ctrl", "Cmd", "`", "-", "Alt", "⍽", "AltGr", "=", "\\", "Fn", "Ctrl"],
    ],

    // This is not properly supported, no mappings use it.
    // It's just here to avoid crashes and more filtering logic when selecting the Ortho one-piece layout
    fullMapping: [
        ["Esc", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "⌫"],
        ["↹", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        ["CAPS", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "⏎"],
        ["⇧", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "⇧"],
        ["Ctrl", "Cmd", 0, 1, "Alt", "⍽", "AltGr", 2, 3, "Fn", "Ctrl"],
    ],

    rowStart: (_: KeyboardRows) => 0,

    keyWidth: (row: KeyboardRows, col: number): number =>
        ((row == KeyboardRows.Bottom) && (col == 5)) ? 2 : 1,

    // Ortho is the only one with a straight split.
    splitColumns: [6, 6, 6, 6, 6],

    leftHomeIndex: 4,
    // Since the board only has 12 columns, the same index as on the ANSI board actually leads to a symmetric hand position <3.
    rightHomeIndex: 7,

    mainFingerAssignment: [
        [1, 1, 1, 2, 2, 3, 6, 7, 7, 8, 8, 8],
        [0, 0, 1, 2, 3, 3, 6, 6, 7, 8, 9, 9],
        [0, 0, 1, 2, 3, 3, 6, 6, 7, 8, 9, 9],
        [0, 0, 1, 2, 3, 3, 6, 6, 7, 8, 9, 9],
        [0, 0, 1, 2, 4,/**/5, 5, 7, 8, 9, 9],
    ],

    hasAltFinger: (_r, _c) => false,

    // From my personal experience, there's only one difference to row-staggered keyboards that actually results in a
    // change of numbers here: it's that pinky moving down straight in the column is indeed easier than moving the pinky
    // down and slightly to the side.
    singleKeyEffort: [
        [NaN, 3.0, 2.0, 2.0, 3.0, 3.0, 3.0, 3.0, 2.0, 2.0, 3.0, NaN],
        [NaN, 1.5, 1.0, 1.0, 1.5, 1.5, 1.5, 1.5, 1.0, 1.0, 1.5, 2.0],
        [NaN, 0.2, 0.2, 0.2, 0.2, 2.0, 2.0, 0.2, 0.2, 0.2, 0.2, 1.5],
        [NaN, 1.0, 1.5, 1.5, 1.0, 2.0, 2.0, 1.5, 1.0, 1.5, 1.0, NaN],
        [NaN, NaN, 2.0, 1.5, NaN, 0.2, NaN, 1.5, 2.0, NaN, NaN],
    ],

    // NOT USED since its different from split and this layout is not recommended anyways.
    getSpecificMapping: (_: FlexMapping) => undefined,
}

export const splitOrthoLayoutModel: RowBasedLayoutModel = {
    ...orthoLayoutModel,
    name: "Split Ortholinear with thumb keys",
    description: "The Ortholinear is especially popular with two-piece keyboards. " +
        "This allows to position and rotate the two keyboard halves to make columns line up exactly with your finger's natural extension movement. " +
        "Most split models include at least two thumb keys on each side that users can map to any function they want. " +
        "The layout shown here is not too different to the Iris CE, a 56-key split keyboard which is incidentally the one that I used for coding this app. ",
    // more splitties here: https://jhelvy.shinyapps.io/splitkbcompare/
    // if it's down, you can run it locally: https://github.com/jhelvy/splitKbCompare

    // Mapping Enter as a thumb key allows `'` to stay in its Qwerty position.
    // We use the freed space to improve `-` position, since this is the third most frequently used punctuation character.
    thirtyKeyMapping: [
        ["Esc", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "⌫"],
        ["↹", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "-"],
        ["CAPS", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "'"],
        ["⇧", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "⇧"],
        ["Ctrl", "Cmd", "=", "\\", "Alt", "⍽", "⏎", "AltGr", "Menu", "`", "Fn", "Ctrl"],
    ],

    thumb30KeyMapping: [
        ["Esc", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "⌫"],
        ["↹", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "="],
        ["CAPS", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "'"],
        ["⇧", 0, 1, 2, 3, 4, 5, 6, 7, 8, "/", "⇧"],
        ["Ctrl", "Cmd", "`", "\\", "Alt", "⍽", "⏎", 0, "AltGr", "Menu", "Fn", "Ctrl"],
    ],

    // I arbitrarily decide that the top (number) row shall not be changed by the flex mapping.
    // But there has to be an empty list in the mapping to keep the format consistent with the algorithms.
    fullMapping: [
        ["Esc", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "⌫"],
        ["↹", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        ["CAPS", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        ["⇧", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "⇧"],
        ["Ctrl", "Cmd", 0, "Alt", 1, "⍽", "⏎", 2, "AltGr", 3, "Fn", "Ctrl"],
    ],

    rowStart: (row: KeyboardRows) => (row == KeyboardRows.Bottom) ? 1 : 0,
    keyWidth: (_row: KeyboardRows, _col: number): number => 1,

    mainFingerAssignment: [
        [0, 0, 1, 2, 3, 3, 6, 6, 7, 8, 9, 9],
        [0, 0, 1, 2, 3, 3, 6, 6, 7, 8, 9, 9],
        [0, 0, 1, 2, 3, 3, 6, 6, 7, 8, 9, 9],
        [0, 0, 1, 2, 3, 3, 6, 6, 7, 8, 9, 9],
        [0, 1, 2, 4, 4, 4, 5, 5, 5, 7, 8, 9],
    ],

    singleKeyEffort: ((orig) => [
        ...orig.slice(0, 4),
        [NaN, NaN, 2, NaN, 0.2, 0.2, 0.2, 0.2, NaN, 2, NaN, NaN],
    ])(orthoLayoutModel.singleKeyEffort),

    getSpecificMapping: (flexMapping: FlexMapping) => flexMapping.mappingSplitOrtho,
}