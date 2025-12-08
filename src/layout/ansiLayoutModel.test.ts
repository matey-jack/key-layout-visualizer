import {describe, expect, it} from 'vitest';

import {ansiIBMLayoutModel, ansiWideLayoutModel, createApple} from "./ansiLayoutModel.ts";
import {KeyboardRows, KeymapTypeId} from "../base-model.ts";
import {sum} from "../library/math.ts";
import {getAnsi30mapping, getFrameMapping} from "./layout-functions.ts";

describe('ansiLayoutModel.keyWidths', () => {
    const lastCol = (row: KeyboardRows) =>
        getAnsi30mapping(ansiIBMLayoutModel)![row].length - 1;

    it("correct with of Backspace", () => {
        const row = KeyboardRows.Number;
        expect(ansiIBMLayoutModel.keyWidths[row][lastCol(row)]).toBe(2)
    });

    it("correct with of \\", () => {
        const row = KeyboardRows.Upper;
        expect(ansiIBMLayoutModel.keyWidths[row][lastCol(row)]).toBe(1.5)
    });

    it("correct with of Enter", () => {
        const row = KeyboardRows.Home;
        expect(ansiIBMLayoutModel.keyWidths[row][lastCol(row)]).toBe(2.25)
    });

    it("correct with of right Shift", () => {
        const row = KeyboardRows.Lower;
        expect(ansiIBMLayoutModel.keyWidths[row][lastCol(row)]).toBe(2.75)
    });

    it("correct total with of bottom row", () => {
        const row = KeyboardRows.Bottom;
        const widths = getAnsi30mapping(ansiIBMLayoutModel)![row]
            .map((_, col) => ansiIBMLayoutModel.keyWidths[row][col]);
        expect(sum(widths)).toBeCloseTo(15, 8)
    });

})

describe('ansiWideLayoutModel', () => {
    const expectedLayoutMapping = [
        ["`~", "1", "2", "3", "4", "5", "6", "=", "7", "8", "9", "0", "-", "⌫"],
        ["↹", 0, 1, 2, 3, 4, "[", 5, 6, 7, 8, 9, "'", "\\"],
        ["CAPS", 0, 1, 2, 3, 4, "]", 5, 6, 7, 8, 9, "⏎"],
        ["⇧", 0, 1, 2, 3, 4, 9, 5, 6, 7, 8, "⇧"],
        ["Ctrl", "Cmd", "Alt", "⍽", "AltGr", "Menu", "Fn", "Ctrl"],
    ];

    const thirtyKeyMapping = ansiWideLayoutModel.frameMappings[KeymapTypeId.Ansi30]!;
    for (let row = 0; row < 5; row++) {
        it(`correct ${KeyboardRows[row]} row`, () => {
            expect(thirtyKeyMapping[row])
                .toStrictEqual(expectedLayoutMapping[row])
        });
    }
})

describe('Apple ANSI variant', () => {
    const appleAnsi = createApple(ansiIBMLayoutModel);
    it('ANSI and Ansi30 frame maps have no bottom row variables', () => {
        const ansi30Vars = getAnsi30mapping(appleAnsi)![KeyboardRows.Bottom].filter((m) => typeof m === "number");
        expect(ansi30Vars.length).toBe(0);
        const ansiVars = getFrameMapping(appleAnsi, KeymapTypeId.Ansi)![KeyboardRows.Bottom].filter((m) => typeof m === "number");
        expect(ansiVars.length).toBe(0);
    })
})