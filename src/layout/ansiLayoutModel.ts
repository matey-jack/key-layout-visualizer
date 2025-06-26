import {KeyboardRows} from "../model.ts";
import {LayoutMapping, RowBasedLayoutModel} from "./layout-model.ts";

const widthOfAnsiBoard = 15;

// those values are accumulated by the stagger of 0.5, 0.25, and 0.5 again.
const widthOfFirstKey = [1, 1.5, 1.75, 2.25,]

interface AnsiLayoutOptions {
    wide: boolean;
}

export const ansiLayoutModel: RowBasedLayoutModel = {
    // we use double quotes everywhere, just so that the one key with single quote as value isn't a special case ;)
    mapping30keys: [
        ["`~", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "⌫"],
        ["↹", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "\\", "[", "]"],
        ["CAPS", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "'", "⏎"],
        ["⇧", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "⇧"],
        ["Ctrl", "Cmd", "Alt", "⍽", "AltGr", "Fn", "Menu", "Ctrl"],
    ],

    rowStart: (_: KeyboardRows) => 0,

    keyWidth: (row: KeyboardRows, col: number): number => {
        // source is roughly https://www.wikiwand.com/en/articles/Keyboard_layout#/media/File:ANSI_Keyboard_Layout_Diagram_with_Form_Factor.svg
        if (row == KeyboardRows.Bottom) {
            // Modifier sizes are where commercially available keybaords vary the most, but 7 keys are the most common,
            // and equal size for them is the simplest choice. (Also makes them incompatible with any other key on the board.)
            // space bar
            if (col == 3) return 6.25;
            // The space bar leaves 8.75 units for 7 keys and that just works out to:
            return 1.25;
        }
        if (col == 0) {
            return widthOfFirstKey[row];
        }
        // outer edge keys
        const numCols = ansiLayoutModel.mapping30keys[row].length;
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
    mapping30keys: moveRightHand(ansiLayoutModel, movedColumns),
}

function moveRightHand(layoutModel: RowBasedLayoutModel, movedColumns: number[]): LayoutMapping {
    return layoutModel.mapping30keys.map((layoutRow, row) => {
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
