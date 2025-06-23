import {KeyboardRows} from "./model.ts";
import {LayoutMapping} from "./mapping-functions.ts";

export const ansiMapping: LayoutMapping = [
    ["`~", "1", "2", "3", "4", "5", "6", "=", "7", "8", "9", "0", "-", "⌫"],
    ["↹", 0, 1, 2, 3, 4, "\\", 5, 6, 7, 8, 9, "[", "]"],
    ["CAPS", 10, 11, 12, 13, 14, 30, 15, 16, 17, 18, 19, "⏎"],
    // The move of key 29 to the middle is a change required to keep the finger assignments of keys 25..28 the same as on the ANSI layout.
    // This is caused by moving the right home row to the right where the Enter key is removed.
    // But below, Shift is still there.
    ["⇧", 20, 21, 22, 23, 24, 29, 25, 26, 27, 28, "⇧"],
    ["Ctrl", "Cmd", "Alt", "⍽", "AltGr", "Fn", "Menu", "Ctrl"],
]
// Maybe offer a boring option where \| and {} keys are placed on the three free spots –
// especially {} in the symmetric bottom positions does at least look cute.

const widthOfAnsiBoard = 15;

// those values are accumulated by the stagger of 0.5, 0.25, and 0.5 again.
const widthOfFirstKey = [1, 1.5, 1.75, 2.25,]

export const ansiKeyWidth = (row: KeyboardRows, col: number): number => {
    // source is roughly https://www.wikiwand.com/en/articles/Keyboard_layout#/media/File:ANSI_Keyboard_Layout_Diagram_with_Form_Factor.svg
    if (row == KeyboardRows.Bottom) {
        // space bar
        if (col == 3) return 6;
        // 7 keys in the space of 9, all seem to have the same size.
        return 9/7;
    }
    if (col == 0) {
        return widthOfFirstKey[row];
    }
    // outer edge keys
    if (col == ansiMapping[row].length - 1) {
        const numberOfMiddleKeys = ansiMapping[row].length - 2;
        return widthOfAnsiBoard - numberOfMiddleKeys - widthOfFirstKey[row];
    }
    return 1;
}
