import {describe, it, expect} from 'vitest';

import {KeyboardRows} from "./model.ts";
import {ansiKeyWidth, ansiMapping} from "./AnsiLayoutConfig.ts";

describe('ansiKeyWidth', () => {
    const lastCol = (row: KeyboardRows) =>
        ansiMapping[row].length - 1;

    it("correct with of Backspace", () => {
        const row = KeyboardRows.Number;
        expect(ansiKeyWidth(row, lastCol(row))).toBe(2)
    });

    it("correct with of \\", () => {
        const row = KeyboardRows.Upper;
        expect(ansiKeyWidth(row, lastCol(row))).toBe(1.5)
    });

    it("correct with of Enter", () => {
        const row = KeyboardRows.Home;
        expect(ansiKeyWidth(row, lastCol(row))).toBe(2.25)
    });

    it("correct with of right Shift", () => {
        const row = KeyboardRows.Lower;
        expect(ansiKeyWidth(row, lastCol(row))).toBe(2.75)
    });

    it("correct total with of bottom row", () => {
        const row = KeyboardRows.Bottom;
        const total = ansiMapping[row]
            .map((_, col) => ansiKeyWidth(row, col))
            .reduce((a, b) => a + b, 0);
        expect(total).toBeCloseTo(15, 8)
    });

})