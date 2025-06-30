import {KeyboardRows} from "../model.ts";
import {Finger, LayoutMapping, RowBasedLayoutModel} from "./layout-model.ts";
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
        ["Ctrl", "Cmd", "Alt", "⍽", 0, 1, "Menu", "Ctrl"],
    ],

    rowStart: (_: KeyboardRows) => 0,

    keyWidth: (row: KeyboardRows, col: number): number => {
        // source is roughly https://www.wikiwand.com/en/articles/Keyboard_layout#/media/File:ANSI_Keyboard_Layout_Diagram_with_Form_Factor.svg
        if (row == KeyboardRows.Bottom) {
            // Modifier sizes are where commercially available keyboards vary the most, but 7 keys are the most common,
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
    splitColumns: [7, 6, 6, 6, 4],

    leftHomeIndex: 4,
    rightHomeIndex: 7,

    mainFingerAssignment: [
        [1, 1, 1, 2, 2, 3, 3, 6, 6, 7, 8, 8, 8, 8],
        [1, 0, 1, 2, 3, 3, 6, 6, 7, 8, 9, 9, 8, 8],
        [0, 0, 1, 2, 3, 3, 6, 6, 7, 8, 9, 9, 9],
        [0, 1, 2, 3, 3, 3, 6, 6, 7, 8, 9, 9],
        [0, 1, 4, 5, 5, 7, 8, 9],
    ],

    getSpecificMapping: (flexMapping: FlexMapping) => flexMapping.mappingAnsi,
}

// How many columns are moving to the right?
// The key just after those will "jump" into the center of the board.
export const movedColumns = [5, 7, 5, 4];

export const customAnsiWideLayoutModel = (movedColumns: number[]): RowBasedLayoutModel =>
    ({
        ...ansiLayoutModel,
        name: "ANSI with wide hand position",
        rightHomeIndex: 8,
        thirtyKeyMapping: moveRightHand(ansiLayoutModel.thirtyKeyMapping, ansiLayoutModel.splitColumns, movedColumns),
        fullMapping: moveRightHand(ansiLayoutModel.fullMapping!!, ansiLayoutModel.splitColumns, movedColumns),
        mainFingerAssignment: [
            [1, 1, 1, 2, 2, 3, 3, 6, 6, 6, 7, 8, 8, 8],
            [1, 0, 1, 2, 3, 3, 6, 6, 6, 7, 8, 9, 9, 8],
            [0, 0, 1, 2, 3, 3, 6, 6, 6, 7, 8, 9, 9],
            [0, 0, 1, 2, 3, 3, 3, 6, 6, 7, 8, 9],
            [0, 1, 4, 5, 5, 7, 8, 9],
        ],
    });

export const ansiWideLayoutModel = customAnsiWideLayoutModel(movedColumns);

function moveRightHand(mapping: LayoutMapping, splitColumns: number[], movedColumns: number[]): LayoutMapping {
    return mapping.map((layoutRow, row) => {
        if (!movedColumns[row]) return layoutRow;
        const jumpingColumn = splitColumns[row] + movedColumns[row];
        return [
            layoutRow.slice(0, splitColumns[row]),
            layoutRow[jumpingColumn],
            layoutRow.slice(splitColumns[row], jumpingColumn),
            layoutRow.slice(jumpingColumn + 1),
        ].flat();
    })
}

/* Duplicate the middle key in the bottom row.
   Set both clones to:
     - same key mapping
     - half the original size
     - two different thumbs
*/
export const splitSpaceBar = (baseModel: RowBasedLayoutModel): RowBasedLayoutModel => {
    const bottomIdx = 4;
    // If we ever introduce variants with different number of modifier keys, we can calculate the middle key
    // by cumulatively adding up all the keyWidths and finding the last key that starts before half of the total width.
    const middleIdx = 3;
    const btmFingers = baseModel.mainFingerAssignment[bottomIdx];
    return {
        ...baseModel,
        fullMapping: baseModel.fullMapping && duplicateBottomMiddle(baseModel.fullMapping, bottomIdx, middleIdx),
        thirtyKeyMapping: baseModel.thirtyKeyMapping && duplicateBottomMiddle(baseModel.thirtyKeyMapping, bottomIdx, middleIdx),
        keyWidth: (row: KeyboardRows, col: number): number => {
            if (row != bottomIdx) return baseModel.keyWidth(row, col);
            if (col < middleIdx || col > middleIdx + 1) return baseModel.keyWidth(row, col);
            return baseModel.keyWidth(row, middleIdx) / 2;
        },
        mainFingerAssignment: [
            ...baseModel.mainFingerAssignment.slice(0, bottomIdx),
            [...btmFingers.slice(0, middleIdx), Finger.LThumb, Finger.RThumb, ...btmFingers.slice(middleIdx + 1)],
        ],
    };
}

function duplicateBottomMiddle(mapping: LayoutMapping, bottomIdx: number, middleIdx: number): LayoutMapping {
    const bottom = mapping[bottomIdx];
    return [
        ...mapping.slice(0, bottomIdx),
        [...bottom.slice(0, middleIdx), bottom[middleIdx], bottom[middleIdx], ...bottom.slice(middleIdx + 1)],
    ];
}