import {KeyboardRows, LayoutType} from "../model.ts";
import {LayoutMapping, RowBasedLayoutModel} from "./layout-model.ts";
import {FlexMapping} from "../mapping/mapping-model.ts";

const widthOfAnsiBoard = 15;

// those values are accumulated by the stagger of 0.5, 0.25, and 0.5 again.
const widthOfFirstKey = [1, 1.5, 1.75, 2.25,]

export interface AnsiLayoutOptionsModel {
    wide: boolean;
}

export const defaultAnsiLayoutOptions: AnsiLayoutOptionsModel = {
    wide: false,
}

export const ansiLayoutModel: RowBasedLayoutModel = {
    name: "ANSI / Typewriter",
    description: "The ANSI keyboard layout is based on a typewriter keyboard from the 19th century which gradually evolved " +
        "to add some computer-specific keys like Ctrl, Alt, and most importantly the @ sign. " +
        "This layout has keys of widely varying withs and an awkward stagger of 0.5, 0.25, and again 0.25 between the rows. " +
        "This curiosity still dates back to old typewriter days when each key's middle needed to have a non-intersecting lever underneath to operate its type element. " +
        "To make this ancient layout a bit more user-friendly, we have moved the right hand's home position by one key to the right. " +
        "Most keys move together with this hand position so that muscle memory is strongly preserved. " +
        "While it might look very unusual, it actually is very easy to get used to. " +
        "And this setup makes it easier to switch between a laptop and an ergonomic split keyboard. ",

    // we use double quotes everywhere, just so that the one key with single quote as value isn't a special case ;)
    thirtyKeyMapping: [
        ["`~", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "⌫"],
        ["↹", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "[", "]", "\\"],
        ["CAPS", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "'", "⏎"],
        ["⇧", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "⇧"],
        ["Ctrl", "Cmd", "Alt", "⍽", "AltGr", "Fn", "Menu", "Ctrl"],
    ],

    // arbitrary decision to include one thumb key in the mapping.
    // (And one more to move AltGr to, if desired.)
    // CapsLock, however, is included with precent from Colemak and Neo 2.
    fullMapping: [
        ["`~", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", 0, 1, "⌫"],
        ["↹", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, "⏎"],
        ["⇧", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "⇧"],
        ["Ctrl", "Cmd", "Alt", "⍽", 0, 1 , "Menu", "Ctrl"],
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
        const numCols = ansiLayoutModel.thirtyKeyMapping[row].length;
        if (col == numCols - 1) {
            const numberOfMiddleKeys = numCols - 2;
            return widthOfAnsiBoard - numberOfMiddleKeys - widthOfFirstKey[row];
        }
        return 1;
    },

    // This split is used by all 'cleave' or split ANSI/ISO boards that I know of.
    // Note that for models with a central space bar, there needs to be special handling or a variant of some sort...
    // TODO: a fractional value could be a good configuration option here!
    splitColumns: [7, 6, 6, 6, 4],

    leftHomeIndex: 4,
    rightHomeIndex: 7,

    mainFingerAssignment: [
        [1, 1, 1, 2, 2, 3, 3, 6, 6, 7, 8, 8, 8, 8],
        [1, 0, 1, 2, 3, 3, 6, 6, 7, 8, 9, 9, 8, 8],
        [0, 0, 1, 2, 3, 3, 6, 6, 7, 8, 9, 9, 9],
        [0, 1, 2, 3, 3, 3, 6, 6, 7, 8, 9, 9],
        [0, 1, 4, 5, 5, 9, 9, 9],
    ],

    getSpecificMapping: (flexMapping: FlexMapping) => flexMapping.mappingAnsi,
}

// how many columns are moving to the right?
// the key just after those will "jump" into the center of the board?
export const movedColumns = [5, 7, 5, 4];

export const ansiWideLayoutModel: RowBasedLayoutModel = {
    ...ansiLayoutModel,
    rightHomeIndex: 8,
    thirtyKeyMapping: moveRightHand(ansiLayoutModel, movedColumns),
}

function moveRightHand(layoutModel: RowBasedLayoutModel, movedColumns: number[]): LayoutMapping {
    return layoutModel.thirtyKeyMapping.map((layoutRow, row) => {
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
