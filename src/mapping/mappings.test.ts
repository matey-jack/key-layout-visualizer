import {describe, expect, it} from "vitest";
import {allMappings} from "./mappings.ts";
import {ansiLayoutModel} from "../layout/ansiLayoutModel.ts";
import {harmonic13cLayoutModel} from "../layout/harmonic13cLayoutModel.ts";
import {harmonic14LayoutModel} from "../layout/harmonic14LayoutModel.ts";
import {splitOrthoLayoutModel} from "../layout/orthoLayoutModel.ts";

const rowLengths = (mapping: any[][]): number[] =>
    mapping.map((row) => row.filter((v) => typeof v == "number").length);

describe('flex mappings consistency', () => {
    allMappings.forEach((mapping) => {
        const mapping30 = mapping.mapping30;
        if (mapping30) {
            it(mapping.name + " – 30 key core – array shape", () => {
                expect(mapping30.length, "number of rows").toBe(3);
                [10, 10, 10].forEach((expected, row) => {
                    expect(mapping30[row].length).toBe(expected);
                });
            });

            it(mapping.name + " – 30 key core – character completeness", () => {
                const allChars = mapping30.join().split('').sort();
                expect(allChars).to.include.members("abcdefghijklmnopqrstuvwxyz".split(''));
                expect(allChars).to.include.members(",./;".split(''));
            });
        }

        const mappingAnsi = mapping.mappingAnsi;
        if (mappingAnsi) {
            it(mapping.name + " – Ansi – array shape", () => {
                expect(mappingAnsi.length).toBe(5);
                rowLengths(ansiLayoutModel.fullMapping).forEach((expected, row) => {
                    expect(mappingAnsi[row].length, `row ${row}`).toBe(expected);
                });
            });

            it(mapping.name + " – Ansi – character completeness", {
                skip:  mappingAnsi.join().includes('ä')
            }, () => {
                const allChars = mappingAnsi.join().split('').sort();
                expect(allChars).to.include.members("abcdefghijklmnopqrstuvwxyz".split(''));
                // There are (from top to bottom) 2+2+1+0+1 = 6 more positions in the full mapping,
                // but we require only three additional punctuation characters ' and - because they are so frequent,
                // and = because it has the `+` character, which is such a nice complement to `-`.
                expect(allChars).to.include.members(",./;'-=".split(''));
            });
        }

        const mappingHarmonic = mapping.mappingHarmonic;
        if (mappingHarmonic) {
            it(mapping.name + " – Harmonic – array shape", () => {
                expect(mappingHarmonic.length).toBe(5);
                rowLengths(harmonic14LayoutModel.fullMapping).forEach((expected, row) => {
                    expect(mappingHarmonic[row].length, `row ${row}`).toBe(expected);
                });
            });

            it(mapping.name + " – Harmonic – character completeness", {
                skip:  mappingHarmonic.join().includes('ä')
            }, () => {
                const allChars = mappingHarmonic.join().split('').sort();
                expect(allChars).to.include.members("abcdefghijklmnopqrstuvwxyz".split(''));
                expect(allChars).to.include.members(",./;'-=".split(''));
            });
        }

        const mappingSplitOrtho = mapping.mappingSplitOrtho;
        if (mappingSplitOrtho) {
            it(mapping.name + " – Split-Ortho – array shape", () => {
                expect(mappingSplitOrtho.length).toBe(5);
                rowLengths(splitOrthoLayoutModel.fullMapping).forEach((expected, row) => {
                    expect(mappingSplitOrtho[row].length, `row ${row}`).toBe(expected);
                });
            });

            it(mapping.name + " – Split-Ortho – character completeness", {
                skip:  mappingSplitOrtho.join().includes('ä')
            }, () => {
                const allChars = mappingSplitOrtho.join().split('').sort();
                expect(allChars).to.include.members("abcdefghijklmnopqrstuvwxyz".split(''));
                expect(allChars).to.include.members(",./;'-=".split(''));
            });
        }
    })
});