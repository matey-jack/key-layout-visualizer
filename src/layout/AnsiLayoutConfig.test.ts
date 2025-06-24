import {describe, it, expect} from 'vitest';

import {KeyboardRows} from "../model.ts";
import {ansiLayoutModel} from "./AnsiLayoutConfig.ts";

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