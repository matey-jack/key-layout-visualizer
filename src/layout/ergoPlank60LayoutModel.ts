import {KeyboardRows, KeymapTypeId, type LayoutMapping, type LayoutModel} from "../base-model.ts";
import {mirrorOdd, SymmetricKeyWidth} from "./keyWidth.ts";
import {ergoFamilyKeyColorClass} from "./layout-functions.ts";

const keyWidths = new SymmetricKeyWidth(15, [0, 0, 0, 0, 0.25]);

const ansi30FrameMapping: LayoutMapping = [
    ["Esc", "1", "2", "3", "4", "5", "[", "]", "6", "7", "8", "9", "0", "⌫"],
    ["↹", 0, 1, 2, 3, 4, "-", null, "=", 5, 6, 7, 8, 9, "\\"],
    ["⌦", 0, 1, 2, 3, 4, "⇤", "`~", "⇥", 5, 6, 7, 8, 9, "'"],
    ["⇧", 0, 1, 2, 3, 4, "⇞", "⇟", 9, 5, 6, 7, 8, "⇧"],
    ["Ctrl", "Cmd", "Fn", "Alt", "⏎", "Ins", "⍽", "AltGr", "Menu", "Cmd", "Ctrl"],
];

const ansi32FrameMapping: LayoutMapping = [
    ["Esc", "1", "2", "3", "4", "5", "\\", "/", "6", "7", "8", "9", "0", "⌫"],
    ["↹", 0, 1, 2, 3, 4, "'", null, "=", 5, 6, 7, 8, 9, 10],
    ["⌦", 0, 1, 2, 3, 4, "⇤", "`~", "⇥", 5, 6, 7, 8, 9, 10],
    ["⇧", 0, 1, 2, 3, 4, "⇞", "⇟", 9, 5, 6, 7, 8, "⇧"],
    ["Ctrl", "Cmd", "Fn", "Alt", "⏎", "Ins", "⍽", "AltGr", "Menu", "Cmd", "Ctrl"],
];

const thumb30FrameMapping: LayoutMapping = [
    ["Esc", "1", "2", "3", "4", "5", "[", "]", "6", "7", "8", "9", "0", "⌫"],
    ["↹", 0, 1, 2, 3, 4, "=", null, "\\", 5, 6, 7, 8, 9, "⏎"],
    ["⌦", 0, 1, 2, 3, 4, "⇤", "`~", "⇥", 5, 6, 7, 8, 9, "'"],
    ["⇧", 0, 1, 2, 3, 4, "⇞", "⇟", "/", 5, 6, 7, 8, "⇧"],
    ["Ctrl", "Cmd", "Fn", "Alt", 0, "Ins", "⍽", "AltGr", "Menu", "Cmd", "Ctrl"],
];

const thumb32FrameMapping: LayoutMapping = [
    ["Esc", "1", "2", "3", "4", "5", "\\", "/", "6", "7", "8", "9", "0", "⌫"],
    ["↹", 0, 1, 2, 3, 4, "'", null, "=", 5, 6, 7, 8, 9, "⏎"],
    ["⌦", 0, 1, 2, 3, 4, "⇤", "`~", "⇥", 5, 6, 7, 8, 9, [-1, 10]],
    ["⇧", 0, 1, 2, 3, 4, "⇞", "⇟", 9, 5, 6, 7, 8, "⇧"],
    ["Ctrl", "Cmd", "Fn", "Alt", 0, "Ins", "⍽", "AltGr", "Menu", "Cmd", "Ctrl"],
];

export const ergoPlank60LayoutModel: LayoutModel = {
    name: "Ergoplank",
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
        [KeymapTypeId.Ansi32]: ansi32FrameMapping,
        [KeymapTypeId.Thumb30]: thumb30FrameMapping,
        [KeymapTypeId.Thumb32]: thumb32FrameMapping,
    },

    keyColorClass: ergoFamilyKeyColorClass(ansi30FrameMapping),
}

const midShiftKeyWidths = new SymmetricKeyWidth(15, [0, 0, 0, 0.5, 0.5]);

export function createErgoPlankMidShift(lm: LayoutModel): LayoutModel {
    return {
        ...lm,
        name: "Ergoplank MidShift",
        description: `"The most ergonomic key layout that fits into a standard "60%" keyboard case."
    Hand distance is maximized. Row stagger is equal to a "cleave-style ergonomic" keyboard.
    Thumb keys are added. 
    Key cap sizes are harmonized to facilitate customizing the keymap. 
    This is based on the "Harmonic" layout as well as the "Katana" design by RominRonin. 
    The MidShift variant takes even more inspiration from split-ortho layouts 
    with the side-effect of keeping ANSI fingerings on the right lower row and the comfortable 'angle-mod' on its left.`,
        rowIndent: midShiftKeyWidths.rowIndent,

        keyWidths: [
            midShiftKeyWidths.row(0, 1.5),
            midShiftKeyWidths.row(1, 1.25),
            midShiftKeyWidths.row(2, 1),
            midShiftKeyWidths.row(3, 1),
            // With 0.5 indent and 0.5u from the central 1u key, both halves have exactly 7.25u.
            // To compensate for the larger indent compared to the base variant, we simply make the outer-most key smaller.
            mirrorOdd(1.25, 1.25, 1.25, 1.25, 1.5, 1),
        ],

        frameMappings:  {
            [KeymapTypeId.Ansi30]: [
                ['Esc', '1', '2', '3', '4', '5', '[', ']', '6', '7', '8', '9', '0', '⌫'],
                ['↹', 0, 1, 2, 3, 4, '-', null, "=", 5, 6, 7, 8, 9, "'"],
                ['⇧', 0, 1, 2, 3, 4, '⇤', '⌦', '⇥', 5, 6, 7, 8, 9, '⇧'],
                [0, 1, 2, 3, 4, '`~', '⇞', '⇟', '\\', 5, 6, 7, 8, 9],
                ['Ctrl', 'Cmd', 'Fn', 'Alt', '⏎', 'Ins', '⍽', 'AltGr', 'Menu', 'Cmd', 'Ctrl']
            ],
            [KeymapTypeId.Ansi32]: [
                ['Esc', '1', '2', '3', '4', '5', '\\', '/', '6', '7', '8', '9', '0', '⌫'],
                ['↹', 0, 1, 2, 3, 4, "'", null, [1, 10], 5, 6, 7, 8, 9, 10],
                ['⇧', 0, 1, 2, 3, 4, '⇤', '⌦', '⇥', 5, 6, 7, 8, 9, '⇧'],
                [0, 1, 2, 3, 4, '`~', '⇞', '⇟', '=', 5, 6, 7, 8, 9],
                ['Ctrl', 'Cmd', 'Fn', 'Alt', '⏎', 'Ins', '⍽', 'AltGr', 'Menu', 'Cmd', 'Ctrl']
            ],
            [KeymapTypeId.Thumb30]:  [
                ['Esc', '1', '2', '3', '4', '5', '[', ']', '6', '7', '8', '9', '0', '⌫'],
                ['↹', 0, 1, 2, 3, 4, '`~', null, "'", 5, 6, 7, 8, 9, '⏎'],
                ['⇧', 0, 1, 2, 3, 4, '⇤', '⌦', '⇥', 5, 6, 7, 8, 9, '⇧'],
                [0, 1, 2, 3, 4, '=', '⇞', '⇟', '\\', 5, 6, 7, 8, '/'],
                ['Ctrl', 'Cmd', 'Fn', 'Alt', 0, 'Ins', '⍽', 'AltGr', 'Menu', 'Cmd', 'Ctrl']
            ],
            [KeymapTypeId.Thumb32]: [
                ['Esc', '1', '2', '3', '4', '5', '\\', '/', '6', '7', '8', '9', '0', '⌫'],
                ['↹', 0, 1, 2, 3, 4, "'", null, 10, 5, 6, 7, 8, 9, '⏎'],
                ['⇧', 0, 1, 2, 3, 4, '⇤', '⌦', '⇥', 5, 6, 7, 8, 9, '⇧'],
                [0, 1, 2, 3, 4, '`~', '⇞', '⇟', '=', 5, 6, 7, 8, 9],
                ['Ctrl', 'Cmd', 'Fn', 'Alt', 0, 'Ins', '⍽', 'AltGr', 'Menu', 'Cmd', 'Ctrl']
            ],
        },
    }
}

export function createErgoPlankWithArrows(lm: LayoutModel): LayoutModel {
    return {
        ...lm,
        name: lm.name + " with cursor block",
        frameMappings: {
            [KeymapTypeId.Ansi30]: replaceLast(lm.frameMappings[KeymapTypeId.Ansi30]!,
                [null, "Ctrl", "Cmd", "AltGr", "Alt", "⏎", "Fn", "⍽", "Ctrl", null, "←", "↑", "↓", "→"]),
            [KeymapTypeId.Thumb30]: replaceLast(lm.frameMappings[KeymapTypeId.Thumb30]!,
                [null, "Ctrl", "Cmd", "AltGr", "Alt", 0, "Fn", "⍽", "Ctrl", null, "←", "↑", "↓", "→"]),
            [KeymapTypeId.Thumb32]: replaceLast(lm.frameMappings[KeymapTypeId.Thumb32]!,
                [null, "Ctrl", "Cmd", "AltGr", "Alt", 0, "Fn", "⍽", "Ctrl", null, "←", "↑", "↓", "→"]),
        },

        singleKeyEffort: replaceLast(lm.singleKeyEffort,
            [null, 3.0, 3.0, 2.0, 1.5, 0.2, 1.5, 0.2, 1.5, null, null, null, null, null]
        ),
        mainFingerAssignment: replaceLast(lm.mainFingerAssignment,
            [null, 0, 1, 2, 4, 4, 5, 5, 5, null, null, null, null, null]
        ),
        // remove the bottom row indent
        rowIndent: [...lm.rowIndent.slice(0, 4), 0] as typeof lm.rowIndent,
        keyWidths: replaceLast(
            lm.keyWidths,
            [lm.rowIndent[KeyboardRows.Bottom], lm.keyWidths[KeyboardRows.Bottom][0], 1.25, 1.25, 1.25, 1.5, 1, 1.5, 1.25, 0.25, 1, 1, 1, 1]
        ),
    }
}

function replaceLast<T>(list: T[], last: T) {
    return [...list.slice(0, -1), last];
}
