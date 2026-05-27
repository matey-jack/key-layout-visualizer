import {KeyboardRows, KeymapTypeId, type LayoutMapping, type LayoutModel} from "../base-model.ts";
import {mapValues} from "../library/records.ts";
import {mirror, SymmetricKeyWidth} from "./keyWidth.ts";
import {copyAndModifyKeymap, copyKeymap, ergoFamilyKeyColorClass} from "./layout-functions.ts";

const ansi30FrameMapping: LayoutMapping = [
    ["Esc", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "⌫"],
    ["↹", 0, 1, 2, 3, 4, null, 5, 6, 7, 8, 9, "-"],
    ["⌦", 0, 1, 2, 3, 4, "=", 5, 6, 7, 8, 9, "'"],
    ["⇧", 0, 1, 2, 3, 4, 9, 5, 6, 7, 8, "⇧"],
    ["Ctrl", "Cmd", "Alt", "⏎", "⍽", "AltGr", "Fn", "Ctrl"],
];

// This would be better with the right-most lower row key being a 1u.
// But since keymaps with a thumb-letter have ⏎ in that position, it would be worse for them.
const ansi30MidshiftFrame: LayoutMapping = [
    ["Esc", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "⌫"],
    ["↹", 0, 1, 2, 3, 4, null, 5, 6, 7, 8, 9, "'"],
    ["⇧", 0, 1, 2, 3, 4, "-", 5, 6, 7, 8, 9, "⇧"],
    ["Ctrl", 0, 1, 2, 3, 4, "=", 5, 6, 7, 8, 9],
    ["Cmd", "Alt", "⌦", "⏎", "⍽", "AltGr", "Fn", "Ctrl"],
];

const ansi32FrameMapping: LayoutMapping = [
    ["Esc", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "⌫"],
    ["↹", 0, 1, 2, 3, 4, null, 5, 6, 7, 8, 9, 10],
    ["⌦", 0, 1, 2, 3, 4, "=", 5, 6, 7, 8, 9, 10],
    ["⇧", 0, 1, 2, 3, 4, 9, 5, 6, 7, 8, "⇧"],
    ["Ctrl", "Cmd", "Alt", "⏎", "⍽", "AltGr", "Fn", "Ctrl"],
];

const ansi32MidshiftFrame: LayoutMapping = [
    ["Esc", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "⌫"],
    ["↹", 0, 1, 2, 3, 4, null, 5, 6, 7, 8, 9, 10],
    ["⇧", 0, 1, 2, 3, 4, 10, 5, 6, 7, 8, 9, "⇧"],
    ["Ctrl", 0, 1, 2, 3, 4, "=", 5, 6, 7, 8, 9],
    ["Cmd", "Alt", "⌦", "⏎", "⍽", "AltGr", "Fn", "Ctrl"],
];

const thumb30FrameMapping: LayoutMapping = [
    ["Esc", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "⌫"],
    ["↹", 0, 1, 2, 3, 4, null, 5, 6, 7, 8, 9, "⏎"],
    ["⌦", 0, 1, 2, 3, 4, "=", 5, 6, 7, 8, 9, "'"],
    ["⇧", 0, 1, 2, 3, 4, "/", 5, 6, 7, 8, "⇧"],
    ["Ctrl", "Cmd", "Alt", 0, "⍽", "AltGr", "Fn", "Ctrl"],
];

const thumb30MidshiftFrame: LayoutMapping = [
    ["Esc", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "⌫"],
    ["↹", 0, 1, 2, 3, 4, null, 5, 6, 7, 8, 9, "'"],
    ["⇧", 0, 1, 2, 3, 4, "=", 5, 6, 7, 8, 9, "⇧"],
    ["Ctrl", 0, 1, 2, 3, 4, "/", 5, 6, 7, 8, "⏎"],
    ["Cmd", "Alt", "⌦", 0, "⍽", "AltGr", "Fn", "Ctrl"],
];

export function ergoslatLayoutModel(midShift: boolean, smallerThumbs: boolean = false): LayoutModel {
    const keyWidths = smallerThumbs
        ? new SymmetricKeyWidth(13, [0.25, 0, 0, 0.5, 0.25])
        : new SymmetricKeyWidth(13, [0, 0.25, 0, 0, 0.5]);

    const baseMappings = {
        [KeymapTypeId.Ansi30]: midShift ? ansi30MidshiftFrame : ansi30FrameMapping,
        [KeymapTypeId.Ansi32]: midShift ? ansi32MidshiftFrame : ansi32FrameMapping,
        [KeymapTypeId.Thumb30]: midShift ? thumb30MidshiftFrame : thumb30FrameMapping,
    };

    return {
    name: "Ergoslat 13/3",
    description: `A smaller ErgoPlank which still has enough keys to write messages, notes, and other texts 
    without excessively using higher layers. It omits only keys used for programming and more involved desktop work.
    While all keyboard layouts can be used with Android devices like smartphones and tablets, this one is specialized for that use case.
    What's also neat about it: the number of keys above the bottom row for each hand are 3 or 4 rows times 6 columns 
    which is the same as a large class of fully split keyboards. 
    Given two great thumb keys per hand, a lot of the split ergo keymaps and habits can be reused here.`,
    keyWidths: smallerThumbs
        ? [
        keyWidths.row(0, 1.25),
        keyWidths.row(1, 1.25),
        keyWidths.row(2, 1),
        keyWidths.row(3, 1),
        mirror(1.25, 1.25, 1.25, 1.25, 1.25),
    ]
    : [
        keyWidths.row(0, 1.5),
        keyWidths.row(1, 1),
        keyWidths.row(2, 1),
        keyWidths.row(3, 1.5),
        mirror(1.5, 1.5, 1.5, 1.5),
    ],

    // Row lengths: 12, 12 (and 1 gap!), 13, 12, 8 or 10.
    // Note that for data model reasons, we also have to assign a finger to gaps.
    // But it will never be shown or used in any calculations.
    mainFingerAssignment: [
        [1, 1, 1, 2, 3, 3, 6, 6, 7, 8, 8, 8],
        [1, 0, 1, 2, 3, 3, null, 6, 6, 7, 8, 9, 9],
        [0, 0, 1, 2, 3, 3, 6, 6, 6, 7, 8, 9, 9],
        [0, 1, 2, 3, 3, 3, 6, 6, 6, 7, 8, 9],
        smallerThumbs ? [0, 1, 2, 4, 4, 5, 5, 7, 8, 9] : [0, 1, 4, 4, 5, 5, 8, 9],
    ],

    // Only fixed values can be used. See base-model.ts SKE_*
    singleKeyEffort: [
        [3.0, 3.0, 2.0, 2.0, 3.0, 3.0, 3.0, 3.0, 2.0, 2.0, 3.0, 3.0],
        [2.0, 2.0, 1.0, 1.0, 1.5, 2.0, 3.0, 2.0, 1.5, 1.0, 1.0, 2.0, 2.0],
        [1.5, 0.2, 0.2, 0.2, 0.2, 2.0, 3.0, 2.0, 0.2, 0.2, 0.2, 0.2, 1.5],
        [1.0, 1.5, 1.5, 1.0, 2.0, 3.0, 3.0, 2.0, 1.0, 1.5, 1.5, 1.0],
        smallerThumbs ? [2.0, 2.0, 1.5, 1.0, 0.2, 0.2, 1.0, 1.5, 2.0, 2.0] : [2.0, 2.0, 1.5, 0.2, 0.2, 1.5, 2.0, 2.0],
    ],

    rowIndent: keyWidths.rowIndent,

    leftHomeIndex: 4,
    rightHomeIndex: 8,

    staggerOffsets: [0.5, 0.25, 0, -0.5],
    symmetricStagger: true,

    frameMappings: smallerThumbs
        ? mapValues(baseMappings, (_, mapping) => addBottomRowKeys(mapping)) as Partial<Record<KeymapTypeId, LayoutMapping>>
        : baseMappings,

    keyColorClass: ergoFamilyKeyColorClass(ansi30FrameMapping),
    };
}

export function ergoSlatAddAngleMod(lm: LayoutModel): LayoutModel {
    return {
        ...lm,
        name: "ErGO 13/3 (angle-mod)",
        frameMappings: mapValues(lm.frameMappings, (_, mapping) =>
            copyAndModifyKeymap(mapping, angleModKeymap),
        ) as typeof lm.frameMappings,
        // Now we could go to 0.25 stagger without making Z awkward to type and put ⌦ on the newly fusioned 1.5u central key...
        // but this key fusion removes one key from the board which makes it hard to place Home/End without moving a lot of stuff around.
    };
}

function angleModKeymap(keymap: LayoutMapping): LayoutMapping {
    keymap[KeyboardRows.Home][0] = [1, 0];
    keymap[KeyboardRows.Home][7] = '⌦';
    const lower = keymap[KeyboardRows.Lower];
    const lMiddle = 6;
    keymap[KeyboardRows.Lower] = ['⇧', ...lower.slice(2, lMiddle), '`~', ...lower.slice(lMiddle)];
    return keymap;
}

const numberlessKeyWidths = new SymmetricKeyWidth(13, [0, 0, 0, 0, 0.5]);

export function makeErgoslatNumberless(lm: LayoutModel): LayoutModel {
    return {
        ...lm,
        name: "Ergoslat 13/3 (numberless)",
        rowIndent: [
            numberlessKeyWidths.rowIndent[0],
            numberlessKeyWidths.rowIndent[1],
            numberlessKeyWidths.rowIndent[2],
            numberlessKeyWidths.rowIndent[3],
            lm.rowIndent[4],
        ],
        keyWidths: [
            [13], // just put a full-width gap here, so the test passes
            numberlessKeyWidths.row(0, 1.25),     // Upper row: escape and backspace take full 1.25u
            numberlessKeyWidths.row(2, 1),        // Home row unchanged
            numberlessKeyWidths.row(3, 1.5),      // Lower row unchanged
            lm.keyWidths[4],
        ],

        mainFingerAssignment: [[null], ...lm.mainFingerAssignment.slice(1, 5)],
        singleKeyEffort: [[null], ...lm.singleKeyEffort.slice(1, 5)],
        frameMappings: {
            // TODO: ansi30 numberless misses '-'
            [KeymapTypeId.Ansi30]: numberlessKeymap(copyKeymap(lm.frameMappings[KeymapTypeId.Ansi30]!)),
            [KeymapTypeId.Thumb30]: moveReturn(numberlessKeymap(copyKeymap(lm.frameMappings[KeymapTypeId.Thumb30]!))),
        },
    };
}

function numberlessKeymap(keymap: LayoutMapping): LayoutMapping {
    keymap[KeyboardRows.Number] = [null];
    keymap[KeyboardRows.Upper][0] = "Esc";
    // because of the gap, there's actually 13 entries in the upper row and 12 is the last.
    keymap[KeyboardRows.Home][6] = keymap[KeyboardRows.Upper][12];
    keymap[KeyboardRows.Upper][12] = "⌫";
    return keymap;
}

function moveReturn(keymap: LayoutMapping): LayoutMapping {
    keymap[KeyboardRows.Home][6] = "'";
    if (!keymap[KeyboardRows.Lower].includes("⏎")) {
        keymap[KeyboardRows.Home][12] = "⏎";
    }
    return keymap;
}

function addBottomRowKeys(mapping: LayoutMapping): LayoutMapping {
    const newMapping = mapping.map((row) => [...row]);
    const bottomRow = newMapping[KeyboardRows.Bottom];
    bottomRow.splice(2, 0, "");
    bottomRow.splice(bottomRow.length - 2, 0, "");
    return newMapping;
}
