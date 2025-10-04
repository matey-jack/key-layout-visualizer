import {describe, expect, it} from "vitest";
import {allMappings} from "./mappings.ts";
import {allLayoutModels} from "../layout/layout-functions.test.ts";

const rowLengths = (mapping: any[][]): number[] =>
    mapping.map((row) =>
        row.filter(
            (v) => typeof v == "number" || Array.isArray(v)
        ).length
    );

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

        const mappingThumb30 = mapping.mappingThumb30;
        if (mappingThumb30) {
            it(mapping.name + " – Thumb30 array shape", () => {
                expect(mappingThumb30.length, "number of rows").toBe(4);
                [10, 10, 9, 1].forEach((expected, row) => {
                    expect(mappingThumb30[row].length).toBe(expected);
                });
            });

            it(mapping.name + " – Thumb30 character completeness", () => {
                const allChars = mappingThumb30.join().split('').sort();
                expect(allChars).to.include.members("abcdefghijklmnopqrstuvwxyz".split(''));
                expect(allChars).to.include.members(",.;-".split(''));
            });
        }

        if (mapping.mappingAnsi || mapping.mappingAnsiWide) {
            it(mapping.name + " has both ANSI and ANSI wide mapping, or at least one generic mapping.", () => {
                if (!(mapping.mappingThumb30 || mapping.mapping30)) {
                    expect(mapping.mappingAnsi).toBeDefined();
                    expect(mapping.mappingAnsiWide).toBeDefined();
                }
            });
        }

        if (mapping.mappingSplitOrtho) {
            it(mapping.name + " has also non-split Ortho mapping.", () => {
                if (!(mapping.mappingThumb30 || mapping.mapping30)) {
                    // unlike for ANSI wide, we accept that some don't comply.
                    console.log("FYI: missing");
                }
            });
        }

        Object.values(allLayoutModels).forEach((layoutModel) => {
            const specificMapping = layoutModel.getSpecificMapping(mapping);
            if (specificMapping) {
                it(mapping.name + ` – ${layoutModel.name} – array shape`, () => {
                    expect(specificMapping.length).toBe(5);
                    // TODO: take new default value into account – or rethink that concept!
                    rowLengths(layoutModel.fullMapping).forEach((expected, row) => {
                        expect(specificMapping[row].length, `row ${row}`).toBe(expected);
                    });
                });

                it(mapping.name + ` – ${layoutModel.name} – character completeness`, {
                    skip: specificMapping.join().includes('ä')
                }, () => {
                    const allChars = specificMapping.join().split('').sort();
                    expect(allChars).to.include.members("abcdefghijklmnopqrstuvwxyz".split(''));
                    // There are (from top to bottom) 2+2+1+0+1 = 6 more positions in the full mapping,
                    // but we require only three additional punctuation characters ' and - because they are so frequent,
                    // and = because it has the `+` character, which is such a nice complement to `-`.
                    expect(allChars).to.include.members(",./;'-=".split(''));
                });
            }
        });
    });
});