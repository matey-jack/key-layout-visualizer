import {FlexMapping, KEY_COLOR, KeyboardRows, KeymapTypeId, LayoutMapping, RowBasedLayoutModel} from "../base-model.ts";
import {copyAndModifyKeymap, defaultKeyColor, keyColorHighlightsClass} from "./layout-functions.ts";
import {mirror, MonotonicKeyWidth, zeroIndent} from "./keyWidth.ts";

const ahkbKeyWidth = new MonotonicKeyWidth(15, zeroIndent, "AHKB");

const thirtyKeyMapping: LayoutMapping = [
    ["Esc", "1", "2", "3", "4", "5", "[", "]", "6", "7", "8", "9", "0", "⌫"],
    ["↹", 0, 1, 2, 3, 4, "-", "=", "'", 5, 6, 7, 8, 9, "⇞"],
    ["⌦", 0, 1, 2, 3, 4, "⇤", "⇥", 5, 6, 7, 8, 9, "⏎"],
    ["⇧", 0, 1, 2, 3, 4, "\\", 9, 5, 6, 7, 8, "⇧", "⇟"],
    ["Ctrl", "Cmd", "`~", "Alt", "⍽", "⍽", "AltGr", "CAPS", "Fn", "Ctrl"],
];

const thumb30KeyMapping: LayoutMapping = [
    ["Esc", "1", "2", "3", "4", "5", "[", "]", "6", "7", "8", "9", "0", "⌫"],
    ["↹", 0, 1, 2, 3, 4, "=", "`~", "'", 5, 6, 7, 8, 9, "⇞"],
    ["⌦", 0, 1, 2, 3, 4, "⇤", "⇥", 5, 6, 7, 8, 9, "⏎"],
    ["⇧", 0, 1, 2, 3, 4, "\\", "/", 5, 6, 7, 8, "⇧", "⇟"],
    ["Ctrl", "Cmd", "", "Alt", 0, "⍽", "AltGr", "CAPS", "Fn", "Ctrl"],
];

export const xhkbLayoutModel: RowBasedLayoutModel = {
    name: "XHKB",
    description: `The eXhilarted Hacking Keyboard continues HHKB's idea of splitting large keys to a point that
    delivers us a layout with ergonomically wider hand positions and some extra keys that can be used for navigation 
    or whatever you like. And to top it off, let's also split the space bar to create two great thumb keys per side.
    Using only four keycap sizes, the XHKB is the most versatile keyboard with traditional typewriter row staggering 
    and the classic 60% box shape.`,

    keyWidths: [
        ahkbKeyWidth.row(0, 1.5), // 14 keys
        ahkbKeyWidth.row(1, 1),   // 15 keys
        ahkbKeyWidth.row(2, 1.25),// 14 keys
        [1.75, ...Array(11).fill(1), 1.25, 1], // 14 keys
        // Center of keyboard is at 7.25 / 7.75.
        // Key sizes are 3 × 1.5u + 1.75u = 6.25u, which leaves an additional 1u key left and 1.5u key right.
        [1.5, 1.5, 1, 1.5, 1.75, 1.75, 1.5, 1.5, 1.5, 1.5],
    ],

    mainFingerAssignment: [
        [1, 1, 1, 2, 2, 3, 3, 6, 6, 7, 7, 8, 8, 8],
        [1, 0, 1, 2, 3, 3, 3, 6, 6, 6, 7, 8, 9, 9, 8],
        [0, 0, 1, 2, 3, 3, 3, 6, 6, 6, 7, 8, 9, 9],
        [0, 0, 1, 2, 3, 3, 3, 6, 6, 6, 7, 8, 9, 9],
        [0, 1, 1, 4, 4, 5, 5, 7, 8, 9],
    ],

    singleKeyEffort: [
        [3.0, 3.0, 2.0, 2.0, 3.0, 3.0, 3.0, 3.0, 2.0, 2.0, 3.0, 3.0, 3.0, 3.0],
        [3.0, 2.0, 1.0, 1.0, 1.5, 1.5, 3.0, 3.0, 1.5, 1.5, 1.0, 1.0, 2.0, 2.0, 3.0],
        [1.5, 0.2, 0.2, 0.2, 0.2, 2.0, 3.0, 3.0, 2.0, 0.2, 0.2, 0.2, 0.2, 1.5],
        [1.0, 2.0, 2.0, 1.5, 1.5, 3.0, 3.0, 3.0, 1.5, 1.0, 1.5, 1.5, 1.0, 3.0],
        [2.0, 2.0, 2.0, 1.0, 0.2, 0.2, 1.0, 2.0, 2.0, 2.0],
    ],

    hasAltFinger: (_r: number, _c: number) => false,

    rowIndent: ahkbKeyWidth.rowIndent,

    keyColorClass: keyColorHighlightsClass,

    splitColumns: [7, 7, 7, 7, 5],

    leftHomeIndex: 4,
    rightHomeIndex: 9,

    staggerOffsets: [-0.75, -0.25, 0, 0.5],
    symmetricStagger: false,

    supportedKeymapTypes: [
        {typeId: KeymapTypeId.Ansi30, frameMapping: thirtyKeyMapping},
        {typeId: KeymapTypeId.Thumb30, frameMapping: thumb30KeyMapping},
    ],
}
