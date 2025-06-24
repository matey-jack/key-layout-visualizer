import {KeyboardRows} from "../model.ts";
import {LayoutMapping, RowBasedLayoutModel} from "./layout-model.ts";

const widthOfAnsiBoard = 15;

// those values are accumulated by the stagger of 0.5, 0.25, and 0.5 again.
const widthOfFirstKey = [1, 1.5, 1.75, 2.25,]

interface AnsiLayoutOptions {
    wide: boolean;
}

export const ansiLayoutModel: RowBasedLayoutModel = {
    layoutMapping: [
        ["`~", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "⌫"],
        ["↹", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "\\", "[", "]"],
        ["CAPS", 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 30, "⏎"],
        ["⇧", 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, "⇧"],
        ["Ctrl", "Cmd", "Alt", "⍽", "AltGr", "Fn", "Menu", "Ctrl"],
    ],

    rowStart: (_: KeyboardRows) => 0,

    keyWidth: (row: KeyboardRows, col: number): number => {
        // source is roughly https://www.wikiwand.com/en/articles/Keyboard_layout#/media/File:ANSI_Keyboard_Layout_Diagram_with_Form_Factor.svg
        if (row == KeyboardRows.Bottom) {
            // space bar
            if (col == 3) return 6;
            // 7 keys in the space of 9, all seem to have the same size.
            return 9/7;
        }
        if (col == 0) {
            return widthOfFirstKey[row];
        }
        // outer edge keys
        const numCols = ansiLayoutModel.layoutMapping[row].length;
        if (col == numCols - 1) {
            const numberOfMiddleKeys = numCols - 2;
            return widthOfAnsiBoard - numberOfMiddleKeys - widthOfFirstKey[row];
        }
        return 1;
    },

    // This split is used by all 'cleave' or split ANSI/ISO boards that I know of.
    splitColumns: [7, 6, 6, 6],

    leftHomeIndex: 4,
    rightHomeIndex: 7,
}

// how many columns are moving to the right?
// the key just after those will "jump" into the center of the board?
export const movedColumns = [5, 5, 5, 4];

export const ansiWideLayoutModel: RowBasedLayoutModel = {
    ...ansiLayoutModel,
    rightHomeIndex: 8,
    layoutMapping: moveRightHand(ansiLayoutModel, movedColumns),
}

function moveRightHand(layoutModel: RowBasedLayoutModel, movedColumns: number[]): LayoutMapping {
    return layoutModel.layoutMapping.map((layoutRow, row) => {
        if (!movedColumns[row]) return layoutRow;
        const jumpingColumn = layoutModel.splitColumns[row] + movedColumns[row];
        return [
            layoutRow.slice(0, layoutModel.splitColumns[row]),
            layoutRow[jumpingColumn],
            layoutRow.slice(layoutModel.splitColumns[row], jumpingColumn),
            layoutRow.slice(jumpingColumn + 1),
        ].flat();
    })
}
