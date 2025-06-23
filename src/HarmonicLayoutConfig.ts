import {KeyboardRows} from "./model.ts";
import {LayoutMapping} from "./mapping-functions.ts";

export const harmonicMapping: LayoutMapping = [
    ["Esc", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "="],
    ["↹", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "⌫"],
    ["", 10, 11, 12, 13, 14, "", 15, 16, 17, 18, 19, 30],
    ["⇧", 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, "⇧"],
    ["Ctrl", "", "", "", "⍽", "⏎", "", "", "", "Ctrl"],
]

export const harmonicRowStart = (row: number) =>
    (row == KeyboardRows.Bottom) ? 0.5 : 0;

export const harmonicKeyWidth = (row: number, col: number) => {
    // outer edge keys
    if ((row == KeyboardRows.Upper || row == KeyboardRows.Lower || row == KeyboardRows.Bottom) &&
        (col == 0 || col == harmonicMapping[row].length - 1)) return 1.5;
    // space and enter
    if (row == KeyboardRows.Bottom && (col == 4 || col == 5)) return 1.5;
    // all others
    return 1;
}
