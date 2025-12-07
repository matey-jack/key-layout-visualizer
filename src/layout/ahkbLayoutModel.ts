import {KEY_COLOR, KeyboardRows, KeymapTypeId, type LayoutMapping, type RowBasedLayoutModel} from "../base-model.ts";
import {mirror, MonotonicKeyWidth} from "./keyWidth.ts";
import {copyAndModifyKeymap, defaultKeyColor} from "./layout-functions.ts";

const ahkbKeyWidth = new MonotonicKeyWidth(14.5, [0, 0, 0.25, 0.25, 0.25], "AHKB Narrow");

const thirtyKeyMapping: LayoutMapping = [
    ["⎋ Exit", "1", "2", "3", "4", "5", "`~", "6", "7", "8", "9", "0", "[", "]"],
    ["↹", 0, 1, 2, 3, 4, "-", "=", 5, 6, 7, 8, 9, "⌫"],
    ["⌦", 0, 1, 2, 3, 4, "⇤", "⇥", 5, 6, 7, 8, 9, "'"],
    ["⇧", 0, 1, 2, 3, 4, "\\", 9, 5, 6, 7, 8, "⇧"],
    ["Ctrl", "Cmd", "CAPS", "Alt", "⏎ Enter", "⍽", "AltGr", "Menu", "Fn", "Ctrl"],
];

const thumb30KeyMapping: LayoutMapping = [
    ["⎋ Exit", "1", "2", "3", "4", "5", "[", "]", "6", "7", "8", "9", "0", "CAPS"],
    ["↹", 0, 1, 2, 3, 4, "=", "`~", 5, 6, 7, 8, 9, "⌫"],
    ["⌦", 0, 1, 2, 3, 4, "⇤", "⇥", 5, 6, 7, 8, 9, "'"],
    ["⇧", 0, 1, 2, 3, 4, "\\", "/", 5, 6, 7, 8, "⇧"],
    ["Ctrl", "Cmd", "Alt", 0, "⏎ Enter", "⍽", "AltGr", "Menu", "Fn", "Ctrl"],
];

export const ahkbLayoutModel: RowBasedLayoutModel = {
    name: "AHKB",
    description: `Less different key sizes make a board more customizable by allowing keycaps to be swapped to different places.
    Using just two keycap sizes, the AHKB get as close as one can to the famous OLKB keyboards with all square keys.
    But it still features the traditional typewriter row staggering which some love, some hate, but for sure everybody is used to.
    Additionally, the AHKB offers an ergonomically wider hand position and a short split space bar creating two nice thumb keys for each hand.
    If you want even better ergonomics, give up that obsolete typewriter stagger and try the Ergoplank or Ergoboard! 
    Apple ❤ HHKB: when keyboard layouts meet and mate.`,

    // Keyboard width is 14.5u which gives 14 keys in top three rows, 13 in the lower row, and 10 in the bottom.
    keyWidths: [
        ahkbKeyWidth.row(0, 1.5, 1),
        ahkbKeyWidth.row(1, 1, 1.5),
        ahkbKeyWidth.row(2, 1),
        ahkbKeyWidth.row(3, 1.5),
        // 14.5 total with, 7.25 per side.
        // 4 × 1.5u = 6u per side in keys, 0.75 indent, leaves 0.5 gap.
        mirror(1.5, 1.5, 1.0, 1.5, 1.5),
    ],

    rowIndent: ahkbKeyWidth.rowIndent,
    hasAltFinger: (_r: number, _c: number) => false,

    mainFingerAssignment: [
        [1, 1, 1, 2, 2, 3, 3, 6, 6, 7, 8, 8, 8, 8],
        [1, 0, 1, 2, 3, 3, 3, 6, 6, 6, 7, 8, 9, 9],
        [0, 0, 1, 2, 3, 3, 3, 6, 6, 6, 7, 8, 9, 9],
        [0, 0, 1, 2, 3, 3, 3, 6, 6, 6, 7, 8, 9],
        [0, 1, 2, 4, 4, 5, 5, 7, 7, 9],
    ],

    singleKeyEffort: [
        [3.0, 3.0, 2.0, 2.0, 3.0, 3.0, 3.0, 3.0, 2.0, 2.0, 3.0, 3.0, 3.0, 3.0],
        [3.0, 2.0, 1.0, 1.0, 1.5, 1.5, 3.0, 3.0, 1.5, 1.5, 1.0, 1.0, 2.0, 2.0],
        [1.5, 0.2, 0.2, 0.2, 0.2, 2.0, 3.0, 3.0, 2.0, 0.2, 0.2, 0.2, 0.2, 1.5],
        [1.0, 2.0, 2.0, 1.5, 1.5, 3.0, 3.0, 3.0, 1.5, 1.0, 1.5, 1.5, 1.0],
        [null, null, null, 1.0, 0.2, 0.2, 1.0, null, null, null],
    ],

    keyColorClass(label: string, row: KeyboardRows, col: number) {
        if (label === "↹") {
            return "";
        }
        if (label.includes("⏎") || label.includes("⎋")
            || label.includes("⌦") || label.includes("⌫")
        ) {
            return KEY_COLOR.HIGHLIGHT;
        }
        if (label.includes("⍽")) {
            return KEY_COLOR.EDGE;
        }
        return defaultKeyColor(label, row, col);
    },

    splitColumns: [7, 7, 7, 7, 5],

    leftHomeIndex: 4,
    rightHomeIndex: 9,

    staggerOffsets: [-0.75, -0.25, 0, 0.5],
    symmetricStagger: false,

    supportedKeymapTypes: [
        {typeId: KeymapTypeId.Ansi30, frameMapping: thirtyKeyMapping},
        {typeId: KeymapTypeId.Thumb30, frameMapping: thumb30KeyMapping},
    ],
};

export function ahkbAddAngleMod(lm: RowBasedLayoutModel = ahkbLayoutModel): RowBasedLayoutModel {
    return {
        ...lm,
        name: `${lm.name} angle mod`,
        supportedKeymapTypes: lm.supportedKeymapTypes?.map(supported => ({
            ...supported,
            frameMapping: copyAndModifyKeymap(supported.frameMapping, angleModKeymap),
        })),
        keyColorClass(label: string, row: KeyboardRows, col: number) {
            if (label.includes("⌦")) {
                return KEY_COLOR.EDGE;
            }
            return lm.keyColorClass!(label, row, col);
        },
    };
}

function angleModKeymap(keymap: LayoutMapping): LayoutMapping {
    const lowerRow = keymap[KeyboardRows.Lower];
    keymap[KeyboardRows.Home][0] = [1, 0];
    lowerRow.splice(1, 1);

    const backslashIndex = lowerRow.indexOf("\\");
    const insertIndex = backslashIndex >= 0 ? backslashIndex + 1 : 1;
    lowerRow.splice(insertIndex, 0, "⌦");

    keymap[KeyboardRows.Lower] = lowerRow;
    return keymap;
}
