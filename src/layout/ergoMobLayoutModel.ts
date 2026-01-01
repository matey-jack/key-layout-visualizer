import {KeyboardRows, KeymapTypeId, type LayoutMapping, type LayoutModel} from "../base-model.ts";
import {mirror, mirrorOdd, SymmetricKeyWidth, zeroIndent} from "./keyWidth.ts";
import {copyAndModifyKeymap, keyColorHighlightsClass} from "./layout-functions.ts";
import {mapValues} from "../library/records.ts";

const keyWidths = new SymmetricKeyWidth(13, [0, 0.25, 0, 0, 0.25]);

const ansi30FrameMapping: LayoutMapping = [
    ["Esc", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "⌫"],
    ["↹", 0, 1, 2, 3, 4, null, 5, 6, 7, 8, 9, "-"],
    ["⌦", 0, 1, 2, 3, 4, "=",  5, 6, 7, 8, 9, "'"],
    ["⇧", 0, 1, 2, 3, 4, 9, 5, 6, 7, 8, "⇧"],
    ["Ctrl", "Cmd", "Fn", "Alt", "⏎", "⍽", "AltGr", "Menu", "Cmd", "Ctrl"],
];

const thumb30FrameMapping: LayoutMapping = [
    ["Esc", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "⌫"],
    ["↹", 0, 1, 2, 3, 4, null, 5, 6, 7, 8, 9, "⏎"],
    ["⌦", 0, 1, 2, 3, 4, "=", 5, 6, 7, 8, 9, "'"],
    ["⇧", 0, 1, 2, 3, 4, "/", 5, 6, 7, 8, "⇧"],
    ["Ctrl", "Cmd", "Fn", "Alt", 0, "⍽", "AltGr", "Menu", "Cmd", "Ctrl"],
];

export const ergoMobLayoutModel: LayoutModel = {
    name: "Ergomob 13/3 (ANSI angle)",
    description: `A smaller ErgoPlank which still has enough keys to write messages, notes, and other texts 
    without excessively using higher layers. It omits only keys used for programming and more involved desktop work.
    While all keyboard layouts can be used with Android devices like smartphones and tablets, this one is specialized for that use case.`,
    keyWidths: [
        keyWidths.row(0, 1.5),
        keyWidths.row(1, 1),
        keyWidths.row(2, 1),
        keyWidths.row(3, 1.5),
        // With 0.25 indent and 0.5u from the central 1u key, both halves have exactly 7.5u
        mirror(1.25, 1.25, 1, 1.25, 1.5),
    ],

    // row lengths: 12, 12 (and 1 gap!), 13, 12, 10
    // note that for data model reason, we also have to assign a finger to gaps.
    // but it will never be shown or used in any calulations.
    mainFingerAssignment: [
        [1, 1, 1, 2, 3, 3, 6, 6, 7, 8, 8, 8],
        [1, 0, 1, 2, 3, 3, null, 6, 6, 7, 8, 9, 9],
        [0, 0, 1, 2, 3, 3, 6, 6, 6, 7, 8, 9, 9],
        [0, 1, 2, 3, 3, 3, 6, 6, 6, 7, 8, 9],
        [0, 1, 2, 4, 4, 5, 5, 7, 8, 9],
    ],

    hasAltFinger: (row: number, col: number) =>
        (row === KeyboardRows.Lower) && ([1, 2, 3, 7, 8, 9].includes(col)),

    // Only fixed values can be used. see base-model.ts SKE_*
    singleKeyEffort: [
        [3.0, 3.0, 2.0, 2.0, 3.0, 3.0, 3.0, 3.0, 2.0, 2.0, 3.0, 3.0],
        [2.0, 2.0, 1.0, 1.0, 1.5, 2.0, 3.0, 2.0, 1.5, 1.0, 1.0, 2.0, 2.0],
        [1.5, 0.2, 0.2, 0.2, 0.2, 2.0, 3.0, 2.0, 0.2, 0.2, 0.2, 0.2, 1.5],
        [1.0, 1.5, 1.5, 1.0, 2.0, 3.0, 3.0, 2.0, 1.0, 1.5, 1.5, 1.0],
        [3.0, 3.0, 2.0, 1.5, 0.2, 0.2, 1.5, 2.0, 3.0, 3.0],
    ],

    rowIndent: keyWidths.rowIndent,

    leftHomeIndex: 4,
    rightHomeIndex: 8,

    staggerOffsets: [0.5, 0.25, 0, -0.5],
    symmetricStagger: true,

    frameMappings: {
        [KeymapTypeId.Ansi30]: ansi30FrameMapping,
        [KeymapTypeId.Thumb30]: thumb30FrameMapping,
    },

    keyColorClass: keyColorHighlightsClass,
}

export function ep60addAngleMod(lm: LayoutModel): LayoutModel {
    return {
        ...lm,
        name: "Ergomob 13/3 (angle-mod)",
        frameMappings: mapValues(lm.frameMappings, (_, mapping) =>
            copyAndModifyKeymap(mapping, angleModKeymap)
        ) as typeof lm.frameMappings,
        // Now we could go to 0.25 stagger without making Z awkward to type and put ⌦ on the newly fusioned 1.5u central key...
        // but this key fusion removes one key from the board which makes it hard to place Home/End without moving a lot of stuff around.
    }
}

function angleModKeymap(keymap: LayoutMapping): LayoutMapping {
    keymap[KeyboardRows.Home][0] = [1, 0];
    keymap[KeyboardRows.Home][7] = '⌦';
    const lower = keymap[KeyboardRows.Lower];
    const lMiddle = 6;
    keymap[KeyboardRows.Lower] = ['⇧', ...lower.slice(2, lMiddle), '`~', ...lower.slice(lMiddle)];
    return keymap;
}
