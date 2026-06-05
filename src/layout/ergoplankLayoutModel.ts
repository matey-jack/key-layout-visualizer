import {KeyboardRows, KeymapTypeId, type LayoutMapping, type LayoutModel} from "../base-model.ts";
import {mapValues} from "../library/records.ts";
import {mirrorOdd, SymmetricKeyWidth} from "./keyWidth.ts";
import {ergoFamilyKeyColorClass} from "./layout-functions.ts";
import {permute} from "./permutation-functions.ts";

// TODO: find a way to evaluate if this chamfering of the bottom corner is as useful as it is pretty.
//       Given that our arms come from that direction, moving the edge key toward the center, might make it harder to hit.
const keyWidths = new SymmetricKeyWidth(15, [0, 0, 0, 0, 0.25]);

const ansi30FrameMapping: LayoutMapping = [
    ["Esc", "1", "2", "3", "4", "5", "[", "]", "6", "7", "8", "9", "0", "⌫"],
    ["↹", 0, 1, 2, 3, 4, "-", null, "+", 5, 6, 7, 8, 9, "\\"],
    ["⌦", 0, 1, 2, 3, 4, "⇤", "`~", "⇥", 5, 6, 7, 8, 9, "'"],
    ["⇧", 0, 1, 2, 3, 4, "⇞", "⇟", 9, 5, 6, 7, 8, "⇧"],
    ["Ctrl", "Cmd", "Fn", "Alt", "⏎", "⎀", "⍽", "AltGr", "☰", "Cmd", "Ctrl"],
];

const ansi32FrameMapping: LayoutMapping = [
    ["Esc", "1", "2", "3", "4", "5", "\\", "/", "6", "7", "8", "9", "0", "⌫"],
    ["↹", 0, 1, 2, 3, 4, "'", null, "+", 5, 6, 7, 8, 9, 10],
    ["⌦", 0, 1, 2, 3, 4, "⇤", "`~", "⇥", 5, 6, 7, 8, 9, 10],
    ["⇧", 0, 1, 2, 3, 4, "⇞", "⇟", 9, 5, 6, 7, 8, "⇧"],
    ["Ctrl", "Cmd", "Fn", "Alt", "⏎", "⎀", "⍽", "AltGr", "☰", "Cmd", "Ctrl"],
];

const thumb30FrameMapping: LayoutMapping = [
    ["Esc", "1", "2", "3", "4", "5", "[", "]", "6", "7", "8", "9", "0", "⌫"],
    ["↹", 0, 1, 2, 3, 4, "+", null, "\\", 5, 6, 7, 8, 9, "⏎"],
    ["⌦", 0, 1, 2, 3, 4, "⇤", "`~", "⇥", 5, 6, 7, 8, 9, "'"],
    ["⇧", 0, 1, 2, 3, 4, "⇞", "⇟", "/", 5, 6, 7, 8, "⇧"],
    ["Ctrl", "Cmd", "Fn", "Alt", 0, "⎀", "⍽", "AltGr", "☰", "Cmd", "Ctrl"],
];

const thumb32FrameMapping: LayoutMapping = [
    ["Esc", "1", "2", "3", "4", "5", "\\", "/", "6", "7", "8", "9", "0", "⌫"],
    ["↹", 0, 1, 2, 3, 4, "'", null, "+", 5, 6, 7, 8, 9, "⏎"],
    ["⌦", 0, 1, 2, 3, 4, "⇤", "`~", "⇥", 5, 6, 7, 8, 9, [1, 10]],
    ["⇧", 0, 1, 2, 3, 4, "⇞", "⇟", 9, 5, 6, 7, 8, "⇧"],
    ["Ctrl", "Cmd", "Fn", "Alt", 0, "⎀", "⍽", "AltGr", "☰", "Cmd", "Ctrl"],
];

export const ergoplankLayoutModel: LayoutModel = {
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
        [0, 0, 1, 2, 3, 3, null, null, null, 6, 6, 7, 8, 9, 9],
        [0, 1, 2, 3, 3, 3, null, null, 6, 6, 6, 7, 8, 9],
        [0, 1, 2, 4, 4, null, 5, 5, 7, 8, 9],
    ],

    // Only fixed values can be used. see base-model.ts SKE_*
    singleKeyEffort: [
        [null, 3.0, 2.0, 2.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 2.0, 2.0, 3.0, 3.0],
        [2.0, 2.0, 1.0, 1.0, 1.5, 2.0, 3.0, null, 3.0, 2.0, 1.5, 1.0, 1.0, 2.0, 2.0],
        [1.5, 0.2, 0.2, 0.2, 0.2, 2.0, null, null, null, 2.0, 0.2, 0.2, 0.2, 0.2, 1.5],
        [1.0, 1.5, 1.5, 1.0, 2.0, 3.0, null, null, 3.0, 2.0, 1.0, 1.5, 1.5, 1.0],
        [3.0, 3.0, 2.0, 1.5, 0.2, null, 0.2, 1.5, 2.0, 3.0, 3.0],
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

const lowerCharactersKeyWidths = new SymmetricKeyWidth(15, [0, 0, 0, 0.5, 0.5]);

// Shared left-side "angle-mod" rotation used by the MidShift lower-row-characters frames.
const ANGLE_MOD_LEFT = "<⇧⌦`[3:4,3,2,1,0]";

export function createErgoPlankMidShiftLowerCharacters(lm: LayoutModel): LayoutModel {
    return {
        ...lm,
        name: "Ergoplank MidShift Lower Row Characters",
        description: `"The most ergonomic key layout that fits into a standard "60%" keyboard case."
    Hand distance is maximized. Row stagger is equal to a "cleave-style ergonomic" keyboard.
    Thumb keys are added. 
    Key cap sizes are harmonized to facilitate customizing the keymap. 
    This is based on the "Harmonic" layout as well as the "Katana" design by RominRonin. 
    The MidShift variant takes even more inspiration from split-ortho layouts 
    with the side-effect of keeping ANSI fingerings on the right lower row and the comfortable 'angle-mod' on its left.`,
        rowIndent: lowerCharactersKeyWidths.rowIndent,

        keyWidths: [
            lowerCharactersKeyWidths.row(0, 1.5),
            lowerCharactersKeyWidths.row(1, 1.25),
            lowerCharactersKeyWidths.row(2, 1),
            lowerCharactersKeyWidths.row(3, 1),
            // With 0.5 indent and 0.5u from the central 1u key, both halves have exactly 7.25u.
            // To compensate for the larger indent compared to the base variant, we simply make the outer-most key smaller.
            mirrorOdd(1.25, 1.25, 1.25, 1.25, 1.5, 1),
        ],

        // Thumb30 needs its own left cycle because + (not `~) ends up on its home row,
        // so the cycle threads + in before the letter block.
        frameMappings:  {
            [KeymapTypeId.Ansi30]: permute(lm.frameMappings[KeymapTypeId.Ansi30]!, ANGLE_MOD_LEFT, ">⇧'\\[3:9]"),
            [KeymapTypeId.Thumb30]: permute(lm.frameMappings[KeymapTypeId.Thumb30]!, "<⇧⌦`+[3:4,3,2,1,0]", ">⇧'\\/"),
            [KeymapTypeId.Ansi32]: permute(lm.frameMappings[KeymapTypeId.Ansi32]!, ANGLE_MOD_LEFT, ">⇧[2:10]+[3:9]"),
            [KeymapTypeId.Thumb32]: permute(lm.frameMappings[KeymapTypeId.Thumb32]!, ANGLE_MOD_LEFT, ">⇧[1:10]+[3:9]"),
        },
    }
}

export function createErgoPlankMidShiftRightReturn(lm: LayoutModel): LayoutModel {
    return {
        ...lm,
        name: "Ergoplank MidShift Lower Right Return",
        description: `"The most ergonomic key layout that fits into a standard "60%" keyboard case."
            Hand distance is maximized. Row stagger is equal to a "cleave-style ergonomic" keyboard.
            Thumb keys are added. 
            Key cap sizes are harmonized to facilitate customizing the keymap. 
            This is based on the "Harmonic" layout as well as the "Katana" design by RominRonin. 
            Ths variant takes the MidShift from split-ortho layouts and leaves the Return key on the keyboard side where
            it can occupy the large key in the lower row and be operated by your thumb when the hand is on the mouse. 
            (Simply mirror Return and Ctrl if you use the other hand for your mouse or trackpad.)
            Moving Ctrl one-up on the opposite side also makes the one-handed shortcuts Ctrl+F, Ctrl+R, Ctrl+S, Ctrl+W etc.
            easier to press.`,
        // physical key widths and finger assignments are the same as for low-shift.

        frameMappings:  {
            [KeymapTypeId.Ansi30]: permute(lm.frameMappings[KeymapTypeId.Ansi30]!, "`F<C<^<S⌦⏎>S'\\"),
            [KeymapTypeId.Ansi32]: permute(lm.frameMappings[KeymapTypeId.Ansi32]!, "[2:10]+`F<C<^<S⌦⏎>S"),
            [KeymapTypeId.Thumb30]: permute(lm.frameMappings[KeymapTypeId.Thumb30]!, "<S⌦F<C<^", "⏎>S'"),
            [KeymapTypeId.Thumb32]: permute(lm.frameMappings[KeymapTypeId.Thumb32]!, "<S⌦F<C<^", "⏎>S[1:10]"),
        },
    }
}

export function createErgoPlankInlineArrows(lm: LayoutModel): LayoutModel {
    return {
        ...lm,
        name: lm.name + " with inline arrow keys",
        frameMappings: mapValues(lm.frameMappings, (_, mapping) => addInlineArrows(mapping)),

        singleKeyEffort: replaceLast(lm.singleKeyEffort,
            [null, 3.0, 3.0, 2.0, 1.5, 0.2, null, 0.2, 1.5, null, null, null, null, null]
        ),
        mainFingerAssignment: replaceLast(lm.mainFingerAssignment,
            [null, 0, 1, 2, 4, 4, null, 5, 5, null, null, null, null, null]
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

function addInlineArrows(list: LayoutMapping):  LayoutMapping {
    const lastRow = list[list.length - 1];
    const left = lastRow.slice(0, 5);
    const leftMod = left.map(key => key === "Fn" ? "AltGr" : key);
    const right = ["Fn", "⍽", "Ctrl", null, "←", "↑", "↓", "→"];
    const newBottomRow = [null, ...leftMod, ...right];
    return [...list.slice(0, -1), newBottomRow];
}

export function createErgoPlankCenterArrows(lm: LayoutModel): LayoutModel {
    const rowIndent = [...lm.rowIndent] as typeof lm.rowIndent;
    rowIndent[KeyboardRows.Bottom] = 0.25;
    let upArrowGap = 0.5;
    // For the "lower row characters" variant, we can tune the stagger to a perfect 0.25,
    // which the others don't support because lower left keys would move away from their fingers.
    // (The famous angle-mod problem.)
    const lowerEdgeWidth = lm.keyWidths[KeyboardRows.Lower][0];
    const staggerOffsets = [0.5, 0.25, 0, -0.5];
    if (lowerEdgeWidth === 1) {
        upArrowGap = 0.25;
        rowIndent[KeyboardRows.Lower] = 0.75;
        staggerOffsets[3] = -0.25;
    }
    const frameMappings = mapValues(lm.frameMappings, (_, mapping) => addCenterArrows(mapping));
    return {
        ...lm,
        name: lm.name + " with center arrow keys",
        frameMappings,

        singleKeyEffort: [
            ...lm.singleKeyEffort.slice(0, 3),
            [1.0, 1.5, 1.5, 1.0, 2.0, 3.0, null, null, null, 3.0, 2.0, 1.0, 1.5, 1.5, 1.0],
            [3.0, 3.0, 2.0, 0.2, null, null, null, null, null, 0.2, 1.5, 2.0, 3.0]
        ],
        rowIndent,
        mainFingerAssignment: [
            ...lm.mainFingerAssignment.slice(0, 3),
            [0, 1, 2, 3, 3, 3, null, null, null, 6, 6, 6, 7, 8, 9],
            [0, 1, 2, 4, null, null, null, null, null, 5, 5, 7, 9]
        ],
        // Set keyWidths for rows 3 and 4 (index 3 and 4), keeping left and right edge key sizes from the base layout
        keyWidths: [
            ...lm.keyWidths.slice(0, 3),
            mirrorOdd(lowerEdgeWidth, 1, 1, 1, 1, 1, upArrowGap, 1),
            mirrorOdd(1.5, 1.25, 1.25, 1.5, 0.25, 1, 1),
        ],
        // pass the changed layout of the lower row.
        keyColorClass: ergoFamilyKeyColorClass(frameMappings[KeymapTypeId.Ansi30]),
        staggerOffsets,
    }
}

function addCenterArrows(list: LayoutMapping): LayoutMapping {
    const lowerLeft = list[KeyboardRows.Lower].slice(0, 6);
    const lowerRight = list[KeyboardRows.Lower].slice(8);
    const lowerRow = [...lowerLeft, null, "↑", null, ...lowerRight];

    // Bottom Row: move Fn to the right
    const oldBottomRow = list[KeyboardRows.Bottom];
    const bottomLeft = oldBottomRow.slice(0, 5).filter(key => key !== "Fn");
    const newBottomRow = [
        ...bottomLeft,
        null, "←", "↓", "→", null,
        oldBottomRow[6], oldBottomRow[7], "Fn", oldBottomRow[10]
    ];

    return [...list.slice(0, 3), lowerRow, newBottomRow];
}
