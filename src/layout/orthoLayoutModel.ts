import {KeyboardRows} from "../model.ts";
import {RowBasedLayoutModel} from "./layout-model.ts";
import {FlexMapping} from "../mapping/mapping-model.ts";

export interface OrthoLayoutOptionsModel {
    thumbKeys: boolean;
}

export const defaultOrthoLayoutOptions: OrthoLayoutOptionsModel = {
    thumbKeys: false,
}

export const orthoLayoutModel: RowBasedLayoutModel = {
    name: "Ortholinear",
    description: "Ortholinear keyboards remove the weird row stagger and usually also use uniform key sizes. " +
        "Those are just as easy to use, but save a lot of space and also allow for easy changing of the key mapping. " +
        "The layout shown here corresponds to the Iris CE, a split keyboard which is incidentally the one that I used for coding this app. ",

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

    rowStart: (_: KeyboardRows) => 0,

    keyWidth: (row: KeyboardRows, col: number): number =>
        ((row == KeyboardRows.Bottom) && (col == 5)) ? 2 : 1,

    // Ortho is the only one with a straight split.
    splitColumns: [6, 6, 6, 6, 6],

    leftHomeIndex: 4,
    // Since the board only has 12 columns, the same index as on the ANSI board actually leads to a symmetric hand position <3.
    rightHomeIndex: 7,

    mainFingerAssignment: [
        [0, 0, 1, 2, 3, 3, 6, 6, 7, 8, 9, 9],
        [0, 0, 1, 2, 3, 3, 6, 6, 7, 8, 9, 9],
        [0, 0, 1, 2, 3, 3, 6, 6, 7, 8, 9, 9],
        [0, 0, 1, 2, 3, 3, 6, 6, 7, 8, 9, 9],
        [0, 0, 1, 2, 3, 6, 6, 7, 8, 9, 9],
    ],

    getSpecificMapping: (flexMapping: FlexMapping) => flexMapping.mappingOrtho,
}

export const splitOrthoLayoutModel: RowBasedLayoutModel = {
    ...orthoLayoutModel,
    rowStart: (row: number) =>
        (row == KeyboardRows.Bottom) ? 1 : 0,
}