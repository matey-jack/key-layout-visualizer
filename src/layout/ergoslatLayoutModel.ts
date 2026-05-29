import {KeyboardRows, KeymapTypeId, type LayoutMapping, type LayoutModel} from "../base-model.ts";
import {mapValues} from "../library/records.ts";
import {mirror, SymmetricKeyWidth} from "./keyWidth.ts";
import {copyKeymap, ergoFamilyKeyColorClass} from "./layout-functions.ts";

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
    ["Ctrl", "Cmd", "Alt", "⏎", "⍽", "AltGr", "Fn", "Ctrl"],
];

// This would be better with the right-most lower row key being a 1u.
// But since keymaps with a thumb-letter have ⏎ in that position, it would be worse for them.
const ansi30MidshiftFrame: LayoutMapping = [
    ["Esc", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "⌫"],
    ["↹", 0, 1, 2, 3, 4, null, 5, 6, 7, 8, 9, "'"],
    ["⇧", 0, 1, 2, 3, 4, "⌦", 5, 6, 7, 8, 9, "⇧"],
    [0, 1, 2, 3, 4, "+", "-" ,5, 6, 7, 8, 9],
    ["Ctrl", "Cmd", "Alt", "⏎", "⍽", "AltGr", "Fn", "Ctrl"],
];

const ansi32FrameMapping: LayoutMapping = [
    ["Esc", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "⌫"],
    ["↹", 0, 1, 2, 3, 4, null, 5, 6, 7, 8, 9, 10],
    ["⌦", 0, 1, 2, 3, 4, "+", 5, 6, 7, 8, 9, 10],
    ["⇧", 0, 1, 2, 3, 4, 9, 5, 6, 7, 8, "⇧"],
    ["Ctrl", "Cmd", "Alt", "⏎", "⍽", "AltGr", "Fn", "Ctrl"],
];

const ansi32MidshiftFrame: LayoutMapping = [
    ["Esc", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "⌫"],
    ["↹", 0, 1, 2, 3, 4, null, 5, 6, 7, 8, 9, 10],
    ["⇧", 0, 1, 2, 3, 4, "⌦", 5, 6, 7, 8, 9, "⇧"],
    [0, 1, 2, 3, 4, [-1, 10], "+", 5, 6, 7, 8, 9],
    ["Ctrl", "Cmd", "Alt", "⏎", "⍽", "AltGr", "Fn", "Ctrl"],
];

// top-right Return mapping isn't great, because in the Major variant, this is a 1u key.
// we can map Return in the bottom row, but then a modifier would have to go somewhere above the bottom.
const thumb30FrameMapping: LayoutMapping = [
    ["Esc", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "⌫"],
    ["↹", 0, 1, 2, 3, 4, null, 5, 6, 7, 8, 9, "⏎"],
    ["⌦", 0, 1, 2, 3, 4, "+", 5, 6, 7, 8, 9, "'"],
    ["⇧", 0, 1, 2, 3, 4, "/", 5, 6, 7, 8, "⇧"],
    ["Ctrl", "Cmd", "Alt", 0, "⍽", "AltGr", "Fn", "Ctrl"],
];

const thumb30MidshiftFrame: LayoutMapping = [
    ["Esc", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "⌫"],
    ["↹", 0, 1, 2, 3, 4, null, 5, 6, 7, 8, 9, "⏎"],
    ["⇧", 0, 1, 2, 3, 4, "⌦", 5, 6, 7, 8, 9, "⇧"],
    [0, 1, 2, 3, 4, "+", "'", 5, 6, 7, 8, "/"],
    ["Ctrl", "Cmd", "Alt", 0, "⍽", "AltGr", "Fn", "Ctrl"],
];

const thumb32FrameMapping: LayoutMapping = [
    ["Esc", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "⌫"],
    ["↹", 0, 1, 2, 3, 4, null, 5, 6, 7, 8, 9, "⏎"],
    ["⌦", 0, 1, 2, 3, 4, "+", 5, 6, 7, 8, 9, [-1, 10]],
    ["⇧", 0, 1, 2, 3, 4, 9, 5, 6, 7, 8, "⇧"],
    ["Ctrl", "Cmd", "Alt", 0, "⍽", "AltGr", "Fn", "Ctrl"],
];

const thumb32MidshiftFrame: LayoutMapping = [
    ["Esc", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "⌫"],
    ["↹", 0, 1, 2, 3, 4, null, 5, 6, 7, 8, 9, "⏎"],
    ["⇧", 0, 1, 2, 3, 4, "⌦", 5, 6, 7, 8, 9, "⇧"],
    [0, 1, 2, 3, 4, "+", 9, 5, 6, 7, 8, [-2, 10]],
    ["Ctrl", "Cmd", "Alt", 0, "⍽", "AltGr", "Fn", "Ctrl"],
];

/*
    The major/minor naming comes from musical intervals, since both Ergoslat variants have only two key sizes
    and 1u is like a base note.
 */
export function majorErgoslatLayoutModel(midShift: boolean): LayoutModel {
    const keyWidths = new SymmetricKeyWidth(13, [0, 0.25, 0, midShift ? 0.5 : 0, 0.25]);

    const baseMappings = {
        [KeymapTypeId.Ansi30]: midShift ? ansi30MidshiftFrame : ansi30FrameMapping,
        [KeymapTypeId.Ansi32]: midShift ? ansi32MidshiftFrame : ansi32FrameMapping,
        [KeymapTypeId.Thumb30]: midShift ? thumb30MidshiftFrame : thumb30FrameMapping,
        [KeymapTypeId.Thumb32]: midShift ? thumb32MidshiftFrame : thumb32FrameMapping,
    };

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

        frameMappings: mapValues(baseMappings, (_, mapping) => addBottomRowGaps(mapping)) as Partial<Record<KeymapTypeId, LayoutMapping>>,

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

function addBottomRowGaps(mapping: LayoutMapping): LayoutMapping {
    const newMapping = mapping.map((row) => [...row]);
    const bottomRow = newMapping[KeyboardRows.Bottom];
    bottomRow.splice(2, 0, null);
    bottomRow.splice(bottomRow.length - 2, 0, null);
    return newMapping;
}

function replaceBottomRowGaps(mapping: LayoutMapping): LayoutMapping {
    const newMapping = mapping.map((row) => [...row]);
    const bottomRow = newMapping[KeyboardRows.Bottom];
    bottomRow[2] = "⇤";
    bottomRow[7] = "⇥";
    return newMapping;
}
