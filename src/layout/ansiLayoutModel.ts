import {
    Finger,
    FlexMapping,
    KEY_COLOR,
    KeyboardRows,
    LayoutMapping,
    RowBasedLayoutModel,
    SKE_AWAY,
    SKE_HOME
} from "../base-model.ts";
import {copyAndModifyKeymap, defaultKeyColor} from "./layout-functions.ts";
import {AnsiVariant, LayoutOptions} from "../app-model.ts";
import {ahkbAddAngleMod, ahkbLayoutModel} from "./ahkbLayoutModel.ts";

export function getAnsiVariant(layoutOptions: LayoutOptions) {
    let base: AnsiLayoutModel = layoutOptions.ansiWide ? ansiWideLayoutModel : ansiLayoutModel;
    switch (layoutOptions.ansiVariant) {
        case AnsiVariant.ANSI_IBM:
            break;
        case AnsiVariant.ANSI_APPLE:
            base = {...base, keyboardWidth: 14.5};
            break;
        case AnsiVariant.ANSI_HHKB:
            base = createHHKB(base);
            break;
        case AnsiVariant.ANSI_AHKB:
            // no need to split the space bar, because it's already split
            return layoutOptions.angleMod ? ahkbAddAngleMod(ahkbLayoutModel) : ahkbLayoutModel;
    }
    return layoutOptions.ansiSplit ? splitSpaceBar(base) : base;
}

// those values are accumulated by the stagger of 0.5, 0.25, and 0.5 again.
const widthOfFirstKey = [1, 1.5, 1.75, 2.25,]

interface AnsiLayoutModel extends RowBasedLayoutModel {
    keyboardWidth: number;
}

export const ansiLayoutModel: AnsiLayoutModel = {
    name: "ANSI / Typewriter",
    description: "The ANSI keyboard layout is based on a typewriter keyboard from the 19th century which gradually evolved " +
        "to add some computer-specific keys like Ctrl, Alt, and most importantly the @ sign. " +
        "This layout has keys of widely varying widths and an awkward stagger of 0.5, 0.25, and again 0.5 between the rows. " +
        "This curiosity still dates back to old typewriter days when each key's middle needed to have a non-intersecting lever underneath to operate its type element. " +
        "To make this ancient layout a bit more user-friendly, some smart people have come up with the \"wide key mapping\" variant, " +
        "which moves the right hand's home position by one key to the right. " +
        "Most keys move together with this hand position so that muscle memory is strongly preserved. " +
        "While it might look very unusual, it actually is very easy to get used to. " +
        "And this setup makes it easier to switch between a laptop and an ergonomic split keyboard. ",

    // Default value, see appleAnsi above.
    keyboardWidth: 15,

    // we use double quotes everywhere, just so that the one key with single quote as value isn't a special case ;)
    thirtyKeyMapping: [
        ["`~", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "⌫"],
        ["↹", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "[", "]", "\\"],
        ["CAPS", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "'", "⏎"],
        ["⇧", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "⇧"],
        ["Ctrl", "Cmd", "Alt", "⍽", "AltGr", "Menu", "Fn", "Ctrl"],
    ],

    // arbitrary decision to include two thumb keys in the mapping.
    // (One for a letter and one more to move AltGr to, if desired.)
    // Exclude CapsLock from the flex mapping, because it distracts from the lettering changes,
    // especially when showing the diff with Qwerty.
    fullMapping: [
        ["`~", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", 0, 1, "⌫"],
        ["↹", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
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
        [3.0, 3.0, 2.0, 2.0, 3.0, 3.0, 3.0, 3.0, 2.0, 2.0, 3.0, 3.0, 3.0, 3.0],
        [3.0, 2.0, 1.0, 1.0, 1.5, 1.5, 1.5, 1.5, 1.0, 1.0, 2.0, 2.0, 3.0, 3.0],
        [1.5, 0.2, 0.2, 0.2, 0.2, 2.0, 2.0, 0.2, 0.2, 0.2, 0.2, 1.5, 2.0],
        [1.5, 2.0, 2.0, 1.5, 1.5, 3.0, 1.5, 1.0, 1.5, 1.5, 1.0, 2.0],
        [NaN, NaN, NaN, 0.2, 1.5, NaN, NaN, NaN],
    ],

    rowStart: (_: KeyboardRows) => 0,

    keyWidth(row: KeyboardRows, col: number): number {
        // source is roughly https://www.wikiwand.com/en/articles/Keyboard_layout#/media/File:ANSI_Keyboard_Layout_Diagram_with_Form_Factor.svg
        // This automatically adapts to both ANSI's 15u and Apple's 14.5u width.
        const numCols = ansiLayoutModel.thirtyKeyMapping![row].length;
        if (row == KeyboardRows.Bottom) {
            const modifierKeyWidth = 1.25;
            // space bar: 6.25 on ANSI, and smaller when we decrease keyboard width.
            if (col == 3) return this.keyboardWidth - 7 * modifierKeyWidth;
            return modifierKeyWidth;
        }
        if (col == 0) {
            return widthOfFirstKey[row];
        }
        // outer edge keys
        if (col == numCols - 1) {
            const numberOfMiddleKeys = numCols - 2;
            return this.keyboardWidth - numberOfMiddleKeys - widthOfFirstKey[row];
        }
        return 1;
    },

    keyColorClass: (label, row, col) => {
        if (label == "⏎") return KEY_COLOR.EDGE;
        return defaultKeyColor(label, row, col);
    },

    // This split is used by all 'cleave' or split ANSI/ISO boards that I know of.
    // Note that for models with a central space bar, there needs to be special handling or a variant of some sort...
    splitColumns: [7, 6, 6, 6, 4],

    leftHomeIndex: 4,
    rightHomeIndex: 7,

    staggerOffsets: [-0.75, -0.25, 0, 0.5],
    symmetricStagger: false,

    getSpecificMapping: (flexMapping: FlexMapping) => flexMapping.mappingAnsi,
}

export const ansiWideLayoutModel = {
    ...ansiLayoutModel,
    name: "ANSI with wide hand position",
    rightHomeIndex: 8,
    thirtyKeyMapping: [
        // https://colemakmods.github.io/ergonomic-mods/wide.html
        ["`~", "1", "2", "3", "4", "5", "6", "=", "7", "8", "9", "0", "-", "⌫"],
        ["↹", 0, 1, 2, 3, 4, "[", 5, 6, 7, 8, 9, "'", "\\"],
        ["CAPS", 0, 1, 2, 3, 4, "]", 5, 6, 7, 8, 9, "⏎"],
        // note how 9 is flipped here, as well.
        ["⇧", 0, 1, 2, 3, 4, 9, 5, 6, 7, 8, "⇧"],
        ["Ctrl", "Cmd", "Alt", "⍽", "AltGr", "Menu", "Fn", "Ctrl"],
    ],
    thumb30KeyMapping: [
        ["Esc", "1", "2", "3", "4", "5", "6", "`~", "7", "8", "9", "0", "=", "⌫"],
        ["↹", 0, 1, 2, 3, 4, "[", 5, 6, 7, 8, 9, "'", "\\"],
        ["CAPS", 0, 1, 2, 3, 4, "]", 5, 6, 7, 8, 9, "⏎"],
        ["⇧", 0, 1, 2, 3, 4, '/', 5, 6, 7, 8, "⇧"],
        ["Ctrl", "Cmd", "Alt", "⍽", 0, "AltGr", "Fn", "Ctrl"],
    ],
    fullMapping: [
        ["`~", "1", "2", "3", "4", "5", "6", 0, "7", "8", "9", "0", 1, "⌫"],
        ...ansiLayoutModel.fullMapping!.slice(1),
    ],
    mainFingerAssignment: [
        [1, 1, 1, 2, 2, 3, 3, 6, 6, 6, 7, 8, 8, 8],
        [1, 0, 1, 2, 3, 3, 3, 6, 6, 7, 8, 9, 9, 8],
        [0, 0, 1, 2, 3, 3, 6, 6, 6, 7, 8, 9, 9],
        [0, 0, 1, 2, 3, 3, 6, 6, 6, 7, 8, 9],
        [0, 0, 1, 4, 5, 8, 9, 9],
    ],

    hasAltFinger: (row: number, col: number) =>
        (row == KeyboardRows.Lower) && ([1, 2, 3, 8, 9, 10].includes(col)),

    // moveRightHand now only used here. maybe just make this array explicit as well.
    singleKeyEffort: widenSingleKeyEffort(
        moveRightHand(ansiLayoutModel.singleKeyEffort, ansiLayoutModel.splitColumns!!)
    ),
    getSpecificMapping: (flexMapping: FlexMapping) => flexMapping.mappingAnsiWide,
};

function widenSingleKeyEffort(effort: (number | null)[][]) {
    ansiLayoutModel.splitColumns!!.forEach((splitCol, row) => {
        if (row != KeyboardRows.Bottom) {
            const lastCol = ansiLayoutModel.thirtyKeyMapping![row].length - 1;
            // keys at splitCol have the wrapped-around effort from the right-hand side.
            effort[row][lastCol] = effort[row][splitCol];
            effort[row][splitCol] = SKE_AWAY;
        }
    })
    effort[KeyboardRows.Bottom][4] = SKE_HOME;
    return effort;
}

function moveRightHand<T>(mapping: T[][], splitColumns: number[]): T[][] {
    // How many columns are moving to the right?
    // The key just after those will "jump" into the center of the board.
    const movedColumns = [5, 7, 5, 4];

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

export function createHHKB(lm: AnsiLayoutModel): AnsiLayoutModel {
    return {
        ...lm,
        name: lm.name.replace("ANSI", "Happy Hacker Keyboard"),
        thirtyKeyMapping: copyAndModifyKeymap(lm.thirtyKeyMapping!, splitKeys),
        thumb30KeyMapping: undefined,
        fullMapping: lm.fullMapping && copyAndModifyKeymap(lm.fullMapping!, splitKeys),
        mainFingerAssignment: copyAndModifyKeymap(lm.mainFingerAssignment, (m) => {
            m[KeyboardRows.Number].push(Finger.RRing);
            m[KeyboardRows.Lower].push(null);
            m[KeyboardRows.Bottom] = [null, Finger.LPinky, Finger.LRing, Finger.RThumb, Finger.RMiddle, Finger.RRing, null];
            return m;
        }),
        singleKeyEffort: copyAndModifyKeymap(lm.singleKeyEffort, (m) => {
            m[KeyboardRows.Number].push(SKE_AWAY);
            m[KeyboardRows.Lower].push(null);
            m[KeyboardRows.Bottom] = [null, null, null, SKE_HOME, null, null, null];
            return m;
        }),
        keyWidth(row: number, col: number) {
            switch (row) {
                case KeyboardRows.Number:
                    return 1;
                case KeyboardRows.Lower:
                    // no '-1' because the modified one has an added key, we just avoid the reference to the object under construction.
                    const last = lm.thirtyKeyMapping![row].length;
                    switch (col) {
                        case last:
                            return 1;
                        case last - 1:
                            return lm.keyWidth(row, col) - 1;
                    }
                    break;
                case KeyboardRows.Bottom:
                    // sum of key widths is 11u, leaving 4u to split between the indentation gaps.
                    return [1.5, 1, 1.5, 6, 1.5, 1, 2.5][col];
            }
            return lm.keyWidth(row, col);
        },
        // HHKB can use the generic wide keymap with "thirtyKeyMapping", but specific key maps that need a thumb key.
        getSpecificMapping: (flexMapping: FlexMapping) => flexMapping.mappingAnsi,
    };
}

function splitKeys(matrix: LayoutMapping): LayoutMapping {
    matrix[KeyboardRows.Number].pop();
    const bslKey = matrix[KeyboardRows.Upper].pop()!;
    const newKey: (string | [number, number]) = typeof bslKey === "number" ? [1, bslKey] : bslKey;
    matrix[KeyboardRows.Number].push(newKey);
    matrix[KeyboardRows.Number].push("`~");
    matrix[KeyboardRows.Home][0] = "Ctrl";
    matrix[KeyboardRows.Upper].push("⌫");
    matrix[KeyboardRows.Lower].push("Fn");
    // explicit gaps instead of "rowStart", because both sides are different.
    // and still the space bar is not centered, *sigh*.
    matrix[KeyboardRows.Bottom] = [null, "Alt", "Cmd", "⍽", "Cmd", "Alt", null];
    return matrix
}
