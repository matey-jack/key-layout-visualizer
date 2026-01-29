import {KeyboardRows, KeymapTypeId, type LayoutMapping, type LayoutModel} from "../base-model.ts";
import {mapValues} from "../library/records.ts";
import {mirrorOdd, SymmetricKeyWidth} from "./keyWidth.ts";
import {copyAndModifyKeymap, ergoFamilyKeyColorClass} from "./layout-functions.ts";

const keyWidths = new SymmetricKeyWidth(15, [0, 0, 0, 0, 0.25]);

const ansi30FrameMapping: LayoutMapping = [
    ["Esc", "1", "2", "3", "4", "5", "[", "]", "6", "7", "8", "9", "0", "⌫"],
    ["↹", 0, 1, 2, 3, 4, "-", null, "=", 5, 6, 7, 8, 9, "\\"],
    ["⌦", 0, 1, 2, 3, 4, "⇤", "`~", "⇥", 5, 6, 7, 8, 9, "'"],
    ["⇧", 0, 1, 2, 3, 4, "⇞", "⇟", 9, 5, 6, 7, 8, "⇧"],
    ["Ctrl", "Cmd", "Fn", "Alt", "⏎", "", "⍽", "AltGr", "Menu", "Cmd", "Ctrl"],
];

const thumb30FrameMapping: LayoutMapping = [
    ["Esc", "1", "2", "3", "4", "5", "[", "]", "6", "7", "8", "9", "0", "⌫"],
    ["↹", 0, 1, 2, 3, 4, "=", null, "\\", 5, 6, 7, 8, 9, "⏎"],
    ["⌦", 0, 1, 2, 3, 4, "⇤", "`~", "⇥", 5, 6, 7, 8, 9, "'"],
    ["⇧", 0, 1, 2, 3, 4, "⇞", "⇟", "/", 5, 6, 7, 8, "⇧"],
    ["Ctrl", "Cmd", "Fn", "Alt", 0, "", "⍽", "AltGr", "Menu", "Cmd", "Ctrl"],
];

export const ergoPlank60LayoutModel: LayoutModel = {
    name: "Ergoplank / ANSI angle",
    description: `"The most ergonomic key layout that fits into a standard "60%" keyboard case."
    Hand distance is maximized. Row stagger is equal to a "cleave-style ergonomic" keyboard.
    Thumb keys are added. 
    Key cap sizes are harmonized to facilitate customizing the keymap. 
    This is based on the "Harmonic" layout as well as the "Katana" design by RominRonin. 
    Biggest difference to the Katana is that the Shift keys are closer to the Pinky home position.
    This is achieved by making the Shift keys bigger and the home row edge key minimally small, i.e. 1u.`,
    // row lengths: 14, 14 (but +1 gap!), 15, 14, 11
    // note that for data model reason, we also have to assign a finger to gaps.
    // but it will never be shown or used in any calulations.
    mainFingerAssignment: [
        [1, 1, 1, 2, 3, 3, 3, 6, 6, 6, 7, 8, 8, 8],
        [1, 0, 1, 2, 3, 3, 3, null, 6, 6, 6, 7, 8, 9, 9],
        [0, 0, 1, 2, 3, 3, 3, 6, 6, 6, 6, 7, 8, 9, 9],
        [0, 1, 2, 3, 3, 3, 3, 6, 6, 6, 6, 7, 8, 9],
        [0, 1, 2, 4, 4, 5, 5, 5, 7, 8, 9],
    ],

    hasAltFinger: (row: number, col: number) =>
        (row === KeyboardRows.Lower) && ([1, 2, 3, 7, 8, 9].includes(col)),

    // Only fixed values can be used. see base-model.ts SKE_*
    singleKeyEffort: [
        [3.0, 3.0, 2.0, 2.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 2.0, 2.0, 3.0, 3.0],
        [2.0, 2.0, 1.0, 1.0, 1.5, 2.0, 3.0, 3.0, 3.0, 2.0, 1.5, 1.0, 1.0, 2.0, 2.0],
        [1.5, 0.2, 0.2, 0.2, 0.2, 2.0, 3.0, 3.0, 3.0, 2.0, 0.2, 0.2, 0.2, 0.2, 1.5],
        [1.0, 1.5, 1.5, 1.0, 2.0, 3.0, 3.0, 3.0, 3.0, 2.0, 1.0, 1.5, 1.5, 1.0],
        [3.0, 3.0, 2.0, 1.5, 0.2, 1.5, 0.2, 1.5, 2.0, 3.0, 3.0],
    ],

    rowIndent: keyWidths.rowIndent,

    keyWidths: [
        keyWidths.row(0, 1.5),
        keyWidths.row(1, 1.25),
        keyWidths.row(2, 1),
        keyWidths.row(3, 1.5),
        // With 0.25 indent and 0.5u from the central 1u key, both halves have exactly 7.5u
        mirrorOdd(1.5, 1.25, 1.25, 1.25, 1.5, 1),
    ],

    leftHomeIndex: 4,
    rightHomeIndex: 10,

    staggerOffsets: [0.5, 0.25, 0, -0.5],
    symmetricStagger: true,

    frameMappings: {
        [KeymapTypeId.Ansi30]: ansi30FrameMapping,
        [KeymapTypeId.Thumb30]: thumb30FrameMapping,
    },

    keyColorClass: ergoFamilyKeyColorClass(ansi30FrameMapping),
}

export function ep60addAngleMod(lm: LayoutModel): LayoutModel {
    return {
        ...lm,
        name: "Ergoplank 60",
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

export const ep60WithArrowsLayoutModel: LayoutModel = {
    ...ergoPlank60LayoutModel,
    name: "Ergoplank 60 with cursor block",
    frameMappings: {
        [KeymapTypeId.Ansi30]: replaceLast(ansi30FrameMapping, [null, "Ctrl", "Cmd", "AltGr", "Alt", "⏎", "Fn", "⍽", "Ctrl", null, "←", "↑", "↓", "→"]),
        [KeymapTypeId.Thumb30]: replaceLast(thumb30FrameMapping, [null, "Ctrl", "Cmd", "AltGr", "Alt", 0, "Fn", "⍽", "Ctrl", null, "←", "↑", "↓", "→"]),
    },

    singleKeyEffort: replaceLast(ergoPlank60LayoutModel.singleKeyEffort,
        [null, 3.0, 3.0, 2.0, 1.5, 0.2, 1.5, 0.2, 1.5, null, null, null, null, null]
    ),
    mainFingerAssignment: replaceLast(ergoPlank60LayoutModel.mainFingerAssignment,
        [null, 0, 1, 2, 4, 4, 5, 5, 5, null, null, null, null, null]
    ),
    // remove the bottom row indent
    rowIndent: [0, 0, 0, 0, 0],
    keyWidths: replaceLast(
        ergoPlank60LayoutModel.keyWidths,
        [0.25, 1.5, 1.25, 1.25, 1.25, 1.5, 1, 1.5, 1.25, 0.25, 1, 1, 1, 1]
    ),
}

function replaceLast<T>(list: T[], last: T) {
    return [...list.slice(0, -1), last];
}
