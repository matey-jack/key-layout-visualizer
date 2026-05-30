import {KeyboardRows, KeymapTypeId, type LayoutMapping, type LayoutModel} from "../base-model.ts";
import {mapValues} from "../library/records.ts";
import {mirror, SymmetricKeyWidth} from "./keyWidth.ts";
import {copyKeymap, ergoFamilyKeyColorClass} from "./layout-functions.ts";
import {patchThumb30, patchThumb32, permute} from "./permutation-functions.ts";

/*
    We need to account for three independent variables when placing the Shift and Enter keys,
    because they look and work better on >1u keys while characters work better on 1u:
     - major/minor key size matters only in the upper letter row,
       because the Major board has 1u keys here and the Minor larger ones.
     - the lower row has wide edge-keys in both Major and Minor for LowShift,
       and 1u keys for MidShift. (Consistent with the now permanent AngleMod on the other Ergoplank and Ergoboard variants.)
 */
const ansi30FrameMapping: LayoutMapping = [
    ["Esc", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "⌫"],
    ["↹", 0, 1, 2, 3, 4, null, 5, 6, 7, 8, 9, "-"],
    ["⌦", 0, 1, 2, 3, 4, "+", 5, 6, 7, 8, 9, "'"],
    ["⇧", 0, 1, 2, 3, 4, 9, 5, 6, 7, 8, "⇧"],
    ["Ctrl", "Cmd", null, "Alt", "⏎", "⍽", "AltGr", null, "Fn", "Ctrl"],
];

const ansi32FrameMapping: LayoutMapping = [
    ["Esc", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "⌫"],
    ["↹", 0, 1, 2, 3, 4, null, 5, 6, 7, 8, 9, 10],
    ["⌦", 0, 1, 2, 3, 4, "+", 5, 6, 7, 8, 9, 10],
    ["⇧", 0, 1, 2, 3, 4, 9, 5, 6, 7, 8, "⇧"],
    ["Ctrl", "Cmd", null, "Alt", "⏎", "⍽", "AltGr", null, "Fn", "Ctrl"],
];

// The thumb frames are derived from their ansi counterparts by cyclic permutation:
// a letter moves onto the thumb (FlexMapping [4,0]), Return moves up off the bottom row, and the
// thirty-key frames swap '-' out for an explicit '/'.
// Read e.g. "[4,0]⏎-" as: the thumb letter takes ⏎'s place, ⏎ takes '-'s place, '-' leaves.
const thumb30FrameMapping: LayoutMapping = patchThumb30(ansi30FrameMapping, "[4,0]⏎-", "/[3,9]");
const thumb32FrameMapping: LayoutMapping = patchThumb32(ansi32FrameMapping, "[4,0]⏎[1,10][2,10]");

/*
    The major/minor naming comes from musical intervals, since both Ergoslat variants have only two key sizes
    and 1u is like a base note.
 */
export function majorErgoslatLayoutModel(midShift: boolean): LayoutModel {
    const keyWidths = new SymmetricKeyWidth(13, [0, 0.25, 0, midShift ? 0.5 : 0, 0.25]);
    // The MidShift frames are the LowShift ones with the left half "angle-modded": the two lower-row
    // Shift keys move up to the home row and the left letter block slides one column left. ANGLE_MOD_LEFT
    // is exactly that shared left-side rotation; the trailing cycle then settles each frame's own
    // punctuation / Return.
    // <⇧ and >⇧ pick the left and right of the two identical "⇧" keys, which a plain label can't disambiguate.
    const ANGLE_MOD_LEFT = "[3,0]<⇧⌦+[3,4][3,3][3,2][3,1]";

    return {
        name: "Major Ergoslat 13/3" + (midShift ? " MidShift" : ""),
        description: `A smaller ErgoPlank which still has enough keys to write messages, notes, and other texts 
        without excessively using higher layers. It omits only keys used for programming and more involved desktop work.
        While all keyboard layouts can be used with Android devices like smartphones and tablets, this one is specialized for that use case.
        What's also neat about it: the number of keys above the bottom row for each hand are 3 or 4 rows times 6 columns 
        which is the same as a large class of fully split keyboards. 
        Given two great thumb keys per hand, a lot of the split ergo keymaps and habits can be reused here.`,
        keyWidths: [
            keyWidths.row(0, 1.5),
            keyWidths.row(1, 1),
            keyWidths.row(2, 1),
            midShift ? keyWidths.row(3, 1) : keyWidths.row(3, 1.5),
            mirror(1.5, 1.5, 0.25, 1.5, 1.5),
        ],

        // Row lengths: 12, 12 (and 1 gap!), 13, 12, 10.
        mainFingerAssignment: [
            [1, 1, 1, 2, 3, 3, 6, 6, 7, 8, 8, 8],
            [1, 0, 1, 2, 3, 3, null, 6, 6, 7, 8, 9, 9],
            [0, 0, 1, 2, 3, 3, 6, 6, 6, 7, 8, 9, 9],
            [0, 1, 2, 3, 3, 3, 6, 6, 6, 7, 8, 9],
            [0, 1, null, 4, 4, 5, 5, null, 8, 9],
        ],

        // Only fixed values can be used. See base-model.ts SKE_*
        singleKeyEffort: [
            [3.0, 3.0, 2.0, 2.0, 3.0, 3.0, 3.0, 3.0, 2.0, 2.0, 3.0, 3.0],
            [2.0, 2.0, 1.0, 1.0, 1.5, 2.0, 3.0, 2.0, 1.5, 1.0, 1.0, 2.0, 2.0],
            [1.5, 0.2, 0.2, 0.2, 0.2, 2.0, 3.0, 2.0, 0.2, 0.2, 0.2, 0.2, 1.5],
            [1.0, 1.5, 1.5, 1.0, 2.0, 3.0, 3.0, 2.0, 1.0, 1.5, 1.5, 1.0],
            [2.0, 2.0, null, 1.5, 0.2, 0.2, 1.5, null, 2.0, 2.0],
        ],

        rowIndent: keyWidths.rowIndent,

        leftHomeIndex: 4,
        rightHomeIndex: 8,

        staggerOffsets: [0.5, 0.25, 0, -0.5],
        symmetricStagger: true,

        frameMappings: midShift ?{
            [KeymapTypeId.Ansi30]: permute(ansi30FrameMapping, ANGLE_MOD_LEFT, "-[3,9]>⇧'"),
            [KeymapTypeId.Ansi32]: permute(ansi32FrameMapping, ANGLE_MOD_LEFT, ">⇧[2,10]"),
            [KeymapTypeId.Thumb30]: permute(thumb30FrameMapping, ANGLE_MOD_LEFT, "/>⇧'"),
            [KeymapTypeId.Thumb32]: permute(thumb32FrameMapping, ANGLE_MOD_LEFT, ">⇧[1,10]"),
        } : {
            [KeymapTypeId.Ansi30]: ansi30FrameMapping,
            [KeymapTypeId.Ansi32]: ansi32FrameMapping,
            [KeymapTypeId.Thumb30]: thumb30FrameMapping,
            [KeymapTypeId.Thumb32]: thumb32FrameMapping,
        },

        keyColorClass: ergoFamilyKeyColorClass(ansi30FrameMapping),
    };
}

export function minorErgoslatLayoutModel(midShift: boolean): LayoutModel {
    const base = majorErgoslatLayoutModel(midShift);
    const keyWidths = new SymmetricKeyWidth(13, [0.25, 0, 0, midShift ? 0.5 : 0.25, 0.25]);

    return {
        ...base,
        name: "Minor Ergoslat 13/3" + (midShift ? " MidShift" : ""),
        keyWidths: [
            keyWidths.row(0, 1.25),
            keyWidths.row(1, 1.25),
            keyWidths.row(2, 1),
            keyWidths.row(3, midShift ? 1 : 1.25),
            mirror(1.25, 1.25, 1.25, 1.25, 1.25),
        ],
        mainFingerAssignment: [
            base.mainFingerAssignment[0],
            base.mainFingerAssignment[1],
            base.mainFingerAssignment[2],
            base.mainFingerAssignment[3],
            [0, 1, 2, 4, 4, 5, 5, 7, 8, 9],
        ],
        singleKeyEffort: [
            base.singleKeyEffort[0],
            base.singleKeyEffort[1],
            base.singleKeyEffort[2],
            base.singleKeyEffort[3],
            [2.0, 2.0, 1.5, 1.0, 0.2, 0.2, 1.0, 1.5, 2.0, 2.0],
        ],
        rowIndent: keyWidths.rowIndent,
        frameMappings: mapValues(base.frameMappings, (_, mapping) => replaceBottomRowGaps(mapping)) as Partial<Record<KeymapTypeId, LayoutMapping>>,
    };
}

export function makeErgoslatNumberless(lm: LayoutModel): LayoutModel {
    return {
        ...lm,
        name: lm.name + " (numberless)",
        rowIndent: [0, ...lm.rowIndent.slice(1)] as [number, number, number, number, number],
        keyWidths: [
            [13], // just put a full-width gap here, so the test passes
            ...lm.keyWidths.slice(1),
        ],

        mainFingerAssignment: [[null], ...lm.mainFingerAssignment.slice(1, 5)],
        singleKeyEffort: [[null], ...lm.singleKeyEffort.slice(1, 5)],
        frameMappings: mapValues(lm.frameMappings, (_, mapping) =>
            numberlessKeymap(copyKeymap(mapping))
        ) as Partial<Record<KeymapTypeId, LayoutMapping>>,
    };
}

function numberlessKeymap(keymap: LayoutMapping): LayoutMapping {
    const overriddenUpper0 = keymap[KeyboardRows.Upper][0];
    const overriddenUpper12 = keymap[KeyboardRows.Upper][12];

    keymap[KeyboardRows.Number] = [null];
    keymap[KeyboardRows.Upper][0] = "Esc";
    keymap[KeyboardRows.Upper][12] = "⌫";

    keymap[KeyboardRows.Bottom][2] = adjustPlaceholderRow(overriddenUpper0, -3);
    keymap[KeyboardRows.Bottom][7] = adjustPlaceholderRow(overriddenUpper12, -3);

    return keymap;
}

function adjustPlaceholderRow(
    v: string | number | null | [number, number],
    offset: number
): string | number | null | [number, number] {
    if (typeof v === "number") {
        return [offset, v];
    }
    if (Array.isArray(v)) {
        return [v[0] + offset, v[1]];
    }
    return v;
}

function replaceBottomRowGaps(mapping: LayoutMapping): LayoutMapping {
    const newMapping = mapping.map((row) => [...row]);
    const bottomRow = newMapping[KeyboardRows.Bottom];
    bottomRow[2] = "⇤";
    bottomRow[7] = "⇥";
    return newMapping;
}
