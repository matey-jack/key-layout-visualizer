import {KeyboardRows, KeymapTypeId, type LayoutMapping, type LayoutModel} from "../base-model.ts";
import {mapValues} from "../library/records.ts";
import {mirror, SymmetricKeyWidth} from "./keyWidth.ts";
import {copyAndModifyKeymap, ergoFamilyKeyColorClass} from "./layout-functions.ts";

const keyWidths = new SymmetricKeyWidth(13, [0, 0.25, 0, 0, 0.25]);

const ansi30FrameMapping: LayoutMapping = [
    ["Esc", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "⌫"],
    ["↹", 0, 1, 2, 3, 4, null, 5, 6, 7, 8, 9, "-"],
    ["⌦", 0, 1, 2, 3, 4, "=", 5, 6, 7, 8, 9, "'"],
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

export const ergoslatLayoutModel: LayoutModel = {
    name: "Ergoslat 13/3",
    description: `A smaller ErgoPlank which still has enough keys to write messages, notes, and other texts 
    without excessively using higher layers. It omits only keys used for programming and more involved desktop work.
    While all keyboard layouts can be used with Android devices like smartphones and tablets, this one is specialized for that use case.
    What's also neat about it: the number of keys above the bottom row for each hand are 3 or 4 rows times 6 columns 
    which is the same as the majority of fully split keyboards. This makes the ErGo `,
    /*
    Naming ideas from Claude: ErgoGo (which sounds weird at first, but cute on the second impression *grin*.)
    Ergopad, Ergolite, Ergonote, Ergoslate,
    Claude Opus really has better ideas than Sonnet!
    My own: EP Mobile, R-Go, Ergomobile.
    https://claude.ai/share/256f86c4-2693-47d8-847e-a0c8f6301862
    Wood based: Ergoslat, Ergotwig, Ergopeg, Ergochip ("wood chips" aren't what people think of first, though...)
    Ergoteja (Spanish for 'roof tile' which used to wood, now is clay.)
    Ergotile, Ergoseki (Go game piece), Ergocairn.

    Slate refers to a fine-grained metamorphic rock used for roofing or writing, a bluish-gray color, or a list of political candidates,
    while slat means a thin, narrow strip of wood or metal ==> since 'slate' is much more used, 'slat' has strong risk of being read as 'slate' anyway.
     */
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

    keyColorClass: ergoFamilyKeyColorClass(ansi30FrameMapping),
};

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

const numberlessKeyWidths = new SymmetricKeyWidth(13, [0, 0, 0, 0, 0.25]);

export function makeErgoslatNumberless(lm: LayoutModel): LayoutModel {
    return {
        ...lm,
        name: "Ergoslat 13/3 (numberless)",
        rowIndent: numberlessKeyWidths.rowIndent,
        keyWidths: [
            [13], // just put a full-width gap here, so the test passes
            numberlessKeyWidths.row(0, 1.25),     // Upper row: escape and backspace take full 1.25u
            numberlessKeyWidths.row(2, 1),        // Home row unchanged
            numberlessKeyWidths.row(3, 1.5),      // Lower row unchanged
            // With 0.25 indent and 0.5u from the central 1u key, both halves have exactly 7.5u
            mirror(1.25, 1.25, 1, 1.25, 1.5),
        ],

        mainFingerAssignment: [[null], ...lm.mainFingerAssignment.slice(1, 5)],
        singleKeyEffort: [[null], ...lm.singleKeyEffort.slice(1, 5)],
        frameMappings: {
            [KeymapTypeId.Ansi30]: copyAndModifyKeymap(ansi30FrameMapping, numberlessKeymap),
            [KeymapTypeId.Thumb30]: moveReturn(copyAndModifyKeymap(thumb30FrameMapping, numberlessKeymap)),
        },
    };
}

function numberlessKeymap(keymap: LayoutMapping): LayoutMapping {
    keymap[KeyboardRows.Number] = [null];
    keymap[KeyboardRows.Upper][0] = "Esc";
    keymap[KeyboardRows.Upper][12] = "⌫";  // because of the gap, there's actual 13 entries here and 12 is the last.
    return keymap;
}

function moveReturn(keymap: LayoutMapping): LayoutMapping {
    keymap[KeyboardRows.Home][6] = "'";
    keymap[KeyboardRows.Home][12] = "⏎";
    return keymap;
}
