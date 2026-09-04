import {
    type FrameMapping,
    KEY_COLOR,
    KeyboardRows,
    KeyColorClassifier,
    KeymapTypeId,
    type LayoutModel
} from "../base-model.ts";
import {mapValues} from "../library/records.ts";
import {mirror, SymmetricKeyWidth} from "./keyWidth.ts";
import {ergoFamilyKeyColorClass} from "./layout-functions.ts";
import {patchThumb30, patchThumb32, permute} from "./permutation-functions.ts";

/*
    We need to account for three independent variables when placing the Shift and Enter keys,
    because they look and work better on >1u keys while characters work better on 1u:
     - major/minor key size matters only in the upper letter row,
       because the Major board has 1u keys here and the Minor larger ones.
     - the lower row has wide edge-keys in both Major and Minor for LowShift,
       and 1u keys for MidShift. (Consistent with the now permanent AngleMod on the other Ergoplank and Ergoboard variants.)
 */
const ansi30FrameMapping: FrameMapping = [
    ["Esc", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "⌫"],
    ["↹", 0, 1, 2, 3, 4, null, 5, 6, 7, 8, 9, "-"],
    ["⌦", 0, 1, 2, 3, 4, "+", 5, 6, 7, 8, 9, "'"],
    ["⇧", 0, 1, 2, 3, 4, 9, 5, 6, 7, 8, "⇧"],
    ["Ctrl", "Cmd", null, "Alt", "⏎", "␣", "AltGr", null, "Fn", "Ctrl"],
];

const ansi32FrameMapping: FrameMapping = [
    ["Esc", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "⌫"],
    ["↹", 0, 1, 2, 3, 4, null, 5, 6, 7, 8, 9, 10],
    ["⌦", 0, 1, 2, 3, 4, "'", 5, 6, 7, 8, 9, 10],
    ["⇧", 0, 1, 2, 3, 4, 9, 5, 6, 7, 8, "⇧"],
    ["Ctrl", "Cmd", null, "Alt", "⏎", "␣", "AltGr", null, "Fn", "Ctrl"],
];

// The thumb frames are derived from their ansi counterparts by cyclic permutation:
// a letter moves onto the thumb (FlexMapping {4:0}), Return moves up off the bottom row, and the
// thirty-key frames swap '-' out for an explicit '/'.
// Read e.g. "{4:0}⏎-" as: the thumb letter takes ⏎'s place, ⏎ takes '-'s place, '-' leaves.
const thumb30FrameMapping: FrameMapping = patchThumb30(ansi30FrameMapping, "{4:0}⏎-", "/{3:9}");
const thumb32FrameMapping: FrameMapping = patchThumb32(ansi32FrameMapping, "{4:0}⏎{1:10}{2:10}");

/*
    The major/minor naming comes from musical intervals, since both Ergoslat variants have only two key sizes
    and 1u is like a base note.
 */
export function majorErgoslatLayoutModel(midShift: boolean): LayoutModel {
    const keyWidths = new SymmetricKeyWidth(13, [0, 0.25, 0, midShift ? 0.5 : 0, 0.25]);
    // The MidShift frames are the LowShift ones with the left half "angle-modded": the two lower-row
    // Shift keys move up to the home row and the left letter block slides one column left; the trailing
    // cycle then settles each frame's own punctuation / Return.
    // The rotation pivots on the home row's centre key, which ⌦ takes over. That key is `+` on the
    // thirty-key frames and `'` on the 32-key ones, whose eleventh flex spot claims the end of the row,
    // so the two families need their own cycle.
    // <⇧ and >⇧ pick the left and right of the two identical "⇧" keys, which a plain label can't disambiguate.
    const ANGLE_MOD_LEFT_30 = "<⇧⌦+{3:4,3,2,1,0}";
    const ANGLE_MOD_LEFT_32 = "<⇧⌦'{3:4,3,2,1,0}";

    return {
        name: "Major Ergoslat 13/3" + (midShift ? " MidShift" : ""),
        description: `A smaller ErgoPlank which still has enough keys to write messages, notes, and other texts 
        without excessively using higher layers. It omits only keys used for programming and more involved desktop work.
        While all keyboard layouts can be used with Android devices like smartphones and tablets, this one is specialized for that use case.
        What's also neat about it: the number of keys above the bottom row for each hand are 3 or 4 rows times 6 columns 
        which is the same as a large class of fully split keyboards. 
        Given two great thumb keys per hand, a lot of the split ergo keymaps and habits can be reused here.
        To promote swapping keycaps around as the user pleases, each variant of the Ergoslat only uses two keycap sizes: 
        The Major has 1u and 1.5u; the Minor has 1u and 1.25u, which fits one more key on each half of the bottom row.`,
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

        colloquialCycles: midShift ?{
            [KeymapTypeId.Ansi30]: ["()"],
            [KeymapTypeId.Thumb30]: ["=()"],
        } : {
            [KeymapTypeId.Ansi30]: ["()-="],
            [KeymapTypeId.Thumb30]: ["-)"],
        },

        frameMappings: midShift ?{
            [KeymapTypeId.Ansi30]: permute(ansi30FrameMapping, ANGLE_MOD_LEFT_30, "-{3:9}>⇧'"),
            [KeymapTypeId.Ansi32]: permute(ansi32FrameMapping, ANGLE_MOD_LEFT_32, ">⇧{2:10}"),
            [KeymapTypeId.Thumb30]: permute(thumb30FrameMapping, ANGLE_MOD_LEFT_30, "/>⇧'"),
            [KeymapTypeId.Thumb32]: permute(thumb32FrameMapping, ANGLE_MOD_LEFT_32, ">⇧{1:10}"),
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
        frameMappings: mapValues(base.frameMappings, (_, mapping) => replaceBottomRowGaps(mapping)) as Partial<Record<KeymapTypeId, FrameMapping>>,
    };
}

function numberlessKeyColorClass(base: KeyColorClassifier): KeyColorClassifier {
    return (label, row, col) =>
        (row === KeyboardRows.Lower && (col === 0 || col === 11) && label !== "⏎") ? KEY_COLOR.EDGE : base(label, row, col);
}

const numberlessAnsi30FrameMapping: FrameMapping = [
    [null],
    ["Esc", 0, 1, 2, 3, 4, null, 5, 6, 7, 8, 9, "⌫"],
    ["↹", 0, 1, 2, 3, 4, "'", 5, 6, 7, 8, 9, "-"],
    ["⇧", 0, 1, 2, 3, 4, 9, 5, 6, 7, 8, "⇧"],
    ["Ctrl", "Cmd", "Alt", "⇩", "⏎", "␣", "⇩", "⌦", "Fn", "Ctrl"],
];
const numberlessThumb30FrameMapping: FrameMapping = patchThumb30(numberlessAnsi30FrameMapping, "{4:0}⏎-", "/{3:9}");

export function numberlessErgoslatLayoutModel(midshift: boolean): LayoutModel {
    // we always use the lowshift minor model as base, because we'll use the larger keys for Shaft.
    const base = minorErgoslatLayoutModel(false);
    const LEFT_MIDSHIFT_CYCLE = "<⇧↹AC<^";
    return {
        ...base,
        name: "Numberless Ergoslat 13/3" + (midshift ? " MidShift" : ""),
        description: `This is the only numberless layout model in this app and it isn't as fine-tuned as other keyboards here.
        With such a small board, users would probably configure tap/hold keys and other Firmware tricks that this app can't show.
        But what we can show is a pair of Shaft keys ⇩ which take AltGr's role, but are mapped on both sides of they keyboard, 
        just as the Shift ⇧ keys are.`,
        rowIndent: [0, ...base.rowIndent.slice(1)] as [number, number, number, number, number],
        keyWidths: [
            [13], // just put a full-width gap here, so the test passes
            ...base.keyWidths.slice(1),
        ],

        mainFingerAssignment: [[null], ...base.mainFingerAssignment.slice(1, 5)],
        singleKeyEffort: [[null], ...base.singleKeyEffort.slice(1, 5)],
        frameMappings: midshift ? {
            [KeymapTypeId.Ansi30]:  permute(numberlessAnsi30FrameMapping, LEFT_MIDSHIFT_CYCLE, ">⇧-⌦⏎"),
            [KeymapTypeId.Thumb30]:  permute(numberlessThumb30FrameMapping, LEFT_MIDSHIFT_CYCLE, ">⇧⏎"),
        } : {
            [KeymapTypeId.Ansi30]:  numberlessAnsi30FrameMapping,
            [KeymapTypeId.Thumb30]:  numberlessThumb30FrameMapping,
        },
        keyColorClass: numberlessKeyColorClass(base.keyColorClass!),
    };
}

function replaceBottomRowGaps(mapping: FrameMapping): FrameMapping {
    const newMapping = mapping.map((row) => [...row]);
    const bottomRow = newMapping[KeyboardRows.Bottom];
    bottomRow[2] = "⇤";
    bottomRow[7] = "⇥";
    return newMapping;
}
