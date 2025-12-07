import {KeyboardRows, KeymapTypeId, type LayoutModel} from "../base-model.ts";
import {SymmetricKeyWidth, zeroIndent} from "./keyWidth.ts";

const katanaKeyWidths = new SymmetricKeyWidth(15, zeroIndent);

export const katanaLayoutModel: LayoutModel = {
    name: "Katana 60",
    description: `The original "Katana" design by RominRonin. 
    An ergonomic keyboard layout that fits into a standard ANSI 60% case.
    Symmetric 0.25 stagger and a hand distance similar to MS Ergonomic Keyboard. `,

    // row lengths: 15, 14, 14 (but +1 gap), 15, 12
    mainFingerAssignment: [
        [1, 1, 1, 2, 2, 3, 3, 6, 6, 6, 7, 8, 8, 8, 8],
        [1, 0, 1, 2, 3, 3, 3, 6, 6, 6, 7, 8, 9, 9],
        [0, 0, 1, 2, 3, 3, 3, null, 6, 6, 6, 7, 8, 9, 9],
        [0, 0, 1, 2, 3, 3, 3, 6, 6, 6, 6, 7, 8, 9, 9],
        [0, 1, 2, 4, 4, 5, 5, 5, 6, 7, 8, 9],
    ],

    hasAltFinger: (row: number, col: number) =>
        (row === KeyboardRows.Lower) && ([1, 2, 3, 7, 8, 9].includes(col)),

    // Only fixed values can be used. see base-model.ts SKE_*
    singleKeyEffort: [
        [3.0, 3.0, 2.0, 2.0, 2.0, 3.0, 3.0, 3.0, 3.0, 3.0, 2.0, 2.0, 2.0, 3.0, 3.0],
        [2.0, 2.0, 1.0, 1.0, 1.5, 2.0, 3.0, 3.0, 2.0, 1.5, 1.0, 1.0, 2.0, 2.0],
        [1.5, 0.2, 0.2, 0.2, 0.2, 2.0, 3.0, 3.0, 3.0, 2.0, 0.2, 0.2, 0.2, 0.2, 1.5],
        [2.0, 1.0, 1.5, 1.5, 1.0, 2.0, 3.0, 3.0, 3.0, 2.0, 1.0, 1.5, 1.5, 1.0, 2.0],
        [3.0, 3.0, 2.0, 1.0, 0.2, 1.5, 0.2, 1.0, null, null, null, null],
    ],

    rowIndent: katanaKeyWidths.rowIndent,

    keyWidths: [
        katanaKeyWidths.row(KeyboardRows.Number, 1),
        katanaKeyWidths.row(KeyboardRows.Upper, 1.5),
        katanaKeyWidths.row(KeyboardRows.Home, 1.25),
        katanaKeyWidths.row(KeyboardRows.Lower, 1),
        [1, 1.25, 1.25, 1.25, 2.25, 1, 2, 1, 1, 1, 1, 1],
    ],
    leftHomeIndex: 4,
    rightHomeIndex: 10,

    staggerOffsets: [0.75, 0.25, 0, -0.25],
    symmetricStagger: true,

    supportedKeymapTypes: [
        // I'd swap ";" and "'" in the keymap, but that transcends the box of the data model.
        // It's the bane of Qwerty that ";" is considered part of the core layout, but "'" and "-" are not.
        { typeId: KeymapTypeId.Ansi30, frameMapping: [
            ["Esc", "`~", "1", "2", "3", "4", "5", "lock", "6", "7", "8", "9", "0", "-", "="],
            ["↹", 0, 1, 2, 3, 4, "[", "]", 5, 6, 7, 8, 9, "⌫"],
            ["'", 0, 1, 2, 3, 4, "⇤", null, "⇞", 5, 6, 7, 8, 9, "⏎"],
            ["⇧", 0, 1, 2, 3, 4, "⇥", "ins", "⇟", 5, 6, 7, 8, 9, "⇧"],
            ["Fn", "Ctrl", "Cmd", "Alt", "⍽", "⌦", "⍽", "AltGr", "←", "↑", "↓", "→"],
        ]},
    ],
}
