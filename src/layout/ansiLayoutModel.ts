import {Finger, FlexMapping, KeyboardRows, RowBasedLayoutModel, SKE_AWAY, SKE_HOME} from "../base-model.ts";

const widthOfAnsiBoard = 15;

// those values are accumulated by the stagger of 0.5, 0.25, and 0.5 again.
const widthOfFirstKey = [1, 1.5, 1.75, 2.25,]

export interface AnsiLayoutOptionsModel {
    wide: boolean;
}

export const ansiLayoutModel: RowBasedLayoutModel = {
    name: "ANSI / Typewriter",
    description: "The ANSI keyboard layout is based on a typewriter keyboard from the 19th century which gradually evolved " +
        "to add some computer-specific keys like Ctrl, Alt, and most importantly the @ sign. " +
        "This layout has keys of widely varying widths and an awkward stagger of 0.5, 0.25, and again 0.25 between the rows. " +
        "This curiosity still dates back to old typewriter days when each key's middle needed to have a non-intersecting lever underneath to operate its type element. " +
        "To make this ancient layout a bit more user-friendly, some smart people have come up with the \"wide key mapping\" variant, " +
        "which moves the right hand's home position by one key to the right. " +
        "Most keys move together with this hand position so that muscle memory is strongly preserved. " +
        "While it might look very unusual, it actually is very easy to get used to. " +
        "And this setup makes it easier to switch between a laptop and an ergonomic split keyboard. ",

    // we use double quotes everywhere, just so that the one key with single quote as value isn't a special case ;)
    thirtyKeyMapping: [
        ["`~", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "⌫"],
        ["↹", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "[", "]", "\\"],
        ["CAPS", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "'", "⏎"],
        ["⇧", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "⇧"],
        ["Ctrl", "Cmd", "Alt", "⍽", "AltGr", "Menu", "Fn", "Ctrl"],
    ],

    thumb30KeyMapping: [
        ["Esc", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "=", "`~", "⌫"],
        ["↹", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "[", "]", "\\"],
        ["CAPS", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "'", "⏎"],
            ["⇧", 0, 1, 2, 3, 4, 5, 6, 7, 8, '/', "⇧"],
        ["Ctrl", "Cmd", "Alt", "⍽", 0, "AltGr", "Fn", "Ctrl"],
    ],

    // arbitrary decision to include one thumb key in the mapping.
    // (And one more to move AltGr to, if desired.)
    // Exclude CapsLock and "slightly wide character key" from the flex mapping,
    // because it distracts from the lettering changes, especially when show the diff with Qwerty.
    fullMapping: [
        ["`~", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", 0, 1, "⌫"],
        ["↹", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, ""],
        ["CAPS", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, "⏎"],
        ["⇧", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "⇧"],
        ["Ctrl", "Cmd", "Alt", "⍽", 0, 1, "Fn", "Ctrl"],
    ],

    mainFingerAssignment: [
        [1, 1, 1, 2, 2, 3, 3, 6, 6, 7, 8, 8, 8, 8],
        [1, 0, 1, 2, 3, 3, 6, 6, 7, 8, 9, 9, 8, 8],
        [0, 0, 1, 2, 3, 3, 6, 6, 7, 8, 9, 9, 9],
        [0, 0, 1, 2, 3, 3, 6, 6, 7, 8, 9, 9],
        [0, 0, 1, 5, 7, 8, 9, 9],
    ],

    hasAltFinger: (row: number, col: number) =>
        (row == KeyboardRows.Lower) && ([1, 2, 3, 7, 8, 9].includes(col)),

    /*
        0.2 for Home Keys (incl. thumb, if present) – 8 or 9 keys, since I don't have any layout proposal with two thumbs hitting letters.
        1   for long finger upper letter row keys – 4 keys
        1.5 for index finger straight and diagonal up (F T U) and pinky lateral (only ') – 4 keys
        1.5 for right lower letter row (J to /) because they have well-aligned stagger – 5 keys
        2   for pinky straight or half-diagonal up – 3 keys
        2   for left lower letter row (Z to V) because of misaligned stagger – 4 keys
        2   for index lateral movement – 2 keys in total
        2   for "long diagonal up" (only Y) and long fingers straight to number row (hits 230-, but only - is relevant as VIP) – 1 key
        2.5 for the 1! key (which I hit with a short-diagonal long finger) – only relevant if actually count ! as VIP – 1 optional key
        3   for long diagonal down (only B) – 1 key
        Just to check, that's 8+4+4+5+3+4+2+1+1 key (32 keys) in the three letter rows, which is (11+11+10) per row. ✅
     */
    singleKeyEffort: [
        [3, 3, 2, 2, 3, 3, 3, 3, 2, 2, 3, 3, 3, NaN],
        [NaN, 2, 1, 1, 1.5, 1.5, 2, 1.5, 1, 1, 2, 2, 3, 3],
        [NaN, 0.2, 0.2, 0.2, 0.2, 2, 2, 0.2, 0.2, 0.2, 0.2, 1.5, 2],
        [NaN, 2, 2, 2, 2, 3, 1.5, 1.5, 1.5, 1.5, 1.5, NaN],
        [NaN, NaN, NaN, 0.2, 1.5, NaN, NaN, NaN],
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

    getSpecificMapping: (flexMapping: FlexMapping) => flexMapping.mappingAnsi,
}

// How many columns are moving to the right?
// The key just after those will "jump" into the center of the board.
export const movedColumns = [5, 7, 5, 4];

export const ansiWideLayoutModel = customAnsiWideLayoutModel(movedColumns);

export function customAnsiWideLayoutModel(movedColumns: number[]): RowBasedLayoutModel {
    let {thirtyKeyMapping, thumb30KeyMapping, fullMapping, splitColumns, singleKeyEffort} = ansiLayoutModel;
    return {
        ...ansiLayoutModel,
        name: "ANSI with wide hand position",
        rightHomeIndex: 8,
        thirtyKeyMapping: moveRightHand(thirtyKeyMapping, splitColumns, movedColumns),
        thumb30KeyMapping: thumb30KeyMapping && moveRightHand(thumb30KeyMapping, splitColumns, movedColumns),
        fullMapping: moveRightHand(fullMapping!!, splitColumns, movedColumns),
        mainFingerAssignment: [
            [1, 1, 1, 2, 2, 3, 3, 6, 6, 6, 7, 8, 8, 8],
            [1, 0, 1, 2, 3, 3, 3, 6, 6, 7, 8, 9, 9, 8],
            [0, 0, 1, 2, 3, 3, 6, 6, 6, 7, 8, 9, 9],
            [0, 0, 1, 2, 3, 3, 6, 6, 6, 7, 8, 9],
            [0, 0, 1, 5, 5, 8, 9, 9],
        ],

        hasAltFinger: (row: number, col: number) =>
            (row == KeyboardRows.Lower) && ([1, 2, 3, 8, 9, 10].includes(col)),

        singleKeyEffort: widenSingleKeyEffort(moveRightHand(singleKeyEffort, splitColumns, movedColumns)),
    }
}

function widenSingleKeyEffort(effort: number[][]) {
    ansiLayoutModel.splitColumns.forEach((splitCol, row) => {
        if (row != KeyboardRows.Bottom) effort[row][splitCol] = SKE_AWAY;
    })
    effort[KeyboardRows.Bottom][4] = SKE_HOME;
    return effort;
}

function moveRightHand<T>(mapping: T[][], splitColumns: number[], movedColumns: number[]): T[][] {
    return mapping.map((layoutRow, row) => {
        if (!movedColumns[row]) return [...layoutRow];
        const jumpingColumn = splitColumns[row] + movedColumns[row];
        return [
            layoutRow.slice(0, splitColumns[row]),
            layoutRow[jumpingColumn],
            layoutRow.slice(splitColumns[row], jumpingColumn),
            layoutRow.slice(jumpingColumn + 1),
        ].flat() as T[];
    })
}

/* Duplicate the middle key in the bottom row.
   Set both clones to:
     - same key mapping
     - half the original size
     - two different thumbs
*/
export const splitSpaceBar = (baseModel: RowBasedLayoutModel): RowBasedLayoutModel => {
    // If we ever introduce variants with different number of modifier keys, we can calculate the middle key
    // by cumulatively adding up all the keyWidths and finding the last key that starts before half of the total width.
    const middleIdx = 3;
    // finger assignment needs more than a duplicated bottom middle
    const mainFingerAssignment = duplicateBottomMiddle(baseModel.mainFingerAssignment, KeyboardRows.Bottom, middleIdx);
    mainFingerAssignment[KeyboardRows.Bottom][middleIdx] = Finger.LThumb;
    if (baseModel.name.includes("wide")) {
        // On non-split keyboards this key is closer to the left home on the wide layout, but on split, it's part of the right half,
        // because keyboard makers don't know about the wide layout.
        mainFingerAssignment[KeyboardRows.Upper][6] = Finger.RIndex;
    }
    return {
        ...baseModel,
        fullMapping: baseModel.fullMapping && duplicateBottomMiddle(baseModel.fullMapping, KeyboardRows.Bottom, middleIdx),
        thirtyKeyMapping: baseModel.thirtyKeyMapping && duplicateBottomMiddle(baseModel.thirtyKeyMapping, KeyboardRows.Bottom, middleIdx),
        thumb30KeyMapping: baseModel.thumb30KeyMapping && duplicateBottomMiddle(baseModel.thumb30KeyMapping, KeyboardRows.Bottom, middleIdx),
        singleKeyEffort: duplicateBottomMiddle(baseModel.singleKeyEffort, KeyboardRows.Bottom, middleIdx),
        keyWidth: (row: number, col: number): number => {
            if (row != KeyboardRows.Bottom) return baseModel.keyWidth(row, col);
            if (col < middleIdx || col > middleIdx + 1) return baseModel.keyWidth(row, col);
            return baseModel.keyWidth(row, middleIdx) / 2;
        },
        mainFingerAssignment,
    };
}

function duplicateBottomMiddle<T>(mapping: T[][], bottomIdx: number, middleIdx: number): T[][] {
    const bottom = mapping[bottomIdx];
    return [
        // actually copy each row, so we can tweak it further without affecting the original.
        ...mapping.slice(0, bottomIdx).map((row) => [...row]),
        [...bottom.slice(0, middleIdx), bottom[middleIdx], bottom[middleIdx], ...bottom.slice(middleIdx + 1)],
    ];
}