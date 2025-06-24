import {describe, it, expect} from 'vitest';

import {KeyboardRows} from "../model.ts";
import {ansiLayoutModel, ansiWideLayoutModel} from "./AnsiLayoutConfig.ts";

describe('ansiLayoutModel.keyWidth', () => {
    const lastCol = (row: KeyboardRows) =>
        ansiLayoutModel.layoutMapping[row].length - 1;

    it("correct with of Backspace", () => {
        const row = KeyboardRows.Number;
        expect(ansiLayoutModel.keyWidth(row, lastCol(row))).toBe(2)
    });

    it("correct with of \\", () => {
        const row = KeyboardRows.Upper;
        expect(ansiLayoutModel.keyWidth(row, lastCol(row))).toBe(1.5)
    });

    it("correct with of Enter", () => {
        const row = KeyboardRows.Home;
        expect(ansiLayoutModel.keyWidth(row, lastCol(row))).toBe(2.25)
    });

    it("correct with of right Shift", () => {
        const row = KeyboardRows.Lower;
        expect(ansiLayoutModel.keyWidth(row, lastCol(row))).toBe(2.75)
    });

    it("correct total with of bottom row", () => {
        const row = KeyboardRows.Bottom;
        const total = ansiLayoutModel.layoutMapping[row]
            .map((_, col) => ansiLayoutModel.keyWidth(row, col))
            .reduce((a, b) => a + b, 0);
        expect(total).toBeCloseTo(15, 8)
    });

})

describe('ansiWideLayoutModel', () => {
    const expectedLayoutMapping = [
        ["`~", "1", "2", "3", "4", "5", "6", "=", "7", "8", "9", "0", "-", "⌫"],
        ["↹", 0, 1, 2, 3, 4, "\\", 5, 6, 7, 8, 9, "[", "]"],
        ["CAPS", 10, 11, 12, 13, 14, 30, 15, 16, 17, 18, 19, "⏎"],
        // The move of key 29 to the middle is a change required to keep the finger assignments of keys 25..28 the same as on the ANSI layout.
        // This is caused by moving the right home row to the right where the Enter key is removed.
        // But below, Shift is still there.
        ["⇧", 20, 21, 22, 23, 24, 29, 25, 26, 27, 28, "⇧"],
        ["Ctrl", "Cmd", "Alt", "⍽", "AltGr", "Fn", "Menu", "Ctrl"],
    ];

    for (let row = 0; row < 5; row++) {
        it(`correct ${KeyboardRows[row]} row`, () => {
            expect(ansiWideLayoutModel.layoutMapping[row])
                .toStrictEqual(expectedLayoutMapping[row])
        });
    }
})