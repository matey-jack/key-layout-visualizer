import {describe, expect, it} from "vitest";
import {allMappings} from "./mappings.ts";
import {ansiLayoutModel} from "../layout/ansiLayoutModel.ts";
import {harmonicLayoutModel} from "../layout/harmonicLayoutModel.ts";
import {splitOrthoLayoutModel} from "../layout/orthoLayoutModel.ts";

const rowLengths = (mapping: any[][]): number[] =>
    mapping.map((row) => row.filter((v) => typeof v == "number").length);

describe('flex mappings consistency', () => {
    allMappings.forEach((mapping) => {
        const mapping30 = mapping.mapping30;
        if (mapping30) {
            it(mapping.name + " – 30 key core", () => {
                expect(mapping30.length, "number of rows").toBe(3);
                [10, 10, 10].forEach((expected, row) => {
                    expect(mapping30[row].length).toBe(expected);
                });
            });
        }

        const mappingAnsi = mapping.mappingAnsi;
        if (mappingAnsi) {
            it(mapping.name + " – Ansi", () => {
                expect(mappingAnsi.length).toBe(5);
                rowLengths(ansiLayoutModel.fullMapping).forEach((expected, row) => {
                    expect(mappingAnsi[row].length, `row ${row}`).toBe(expected);
                });
            });
        }

        const mappingHarmonic = mapping.mappingHarmonic;
        if (mappingHarmonic) {
            it(mapping.name + " – Harmonic", () => {
                expect(mappingHarmonic.length).toBe(5);
                rowLengths(harmonicLayoutModel.fullMapping).forEach((expected, row) => {
                    expect(mappingHarmonic[row].length, `row ${row}`).toBe(expected);
                });
            });
        }

        const mappingSplitOrtho = mapping.mappingSplitOrtho;
        if (mappingSplitOrtho) {
            it(mapping.name + " – Split-Ortho", () => {
                expect(mappingSplitOrtho.length).toBe(5);
                rowLengths(splitOrthoLayoutModel.fullMapping).forEach((expected, row) => {
                    expect(mappingSplitOrtho[row].length, `row ${row}`).toBe(expected);
                });
            });
        }
    })
});