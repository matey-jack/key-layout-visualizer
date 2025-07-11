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
            it(mapping.name + " – array shape", () => {
                expect(mappingThumb30.length, "number of rows").toBe(4);
                [10, 10, 9, 1].forEach((expected, row) => {
                    expect(mappingThumb30[row].length).toBe(expected);
                });
            });

            it(mapping.name + " – character completeness", () => {
                const allChars = mappingThumb30.join().split('').sort();
                expect(allChars).to.include.members("abcdefghijklmnopqrstuvwxyz".split(''));
                expect(allChars).to.include.members(",.;-".split(''));
            });
        }

        Object.values(allLayoutModels).forEach((layoutModel) => {
            const specificMapping = layoutModel.getSpecificMapping(mapping);
            if (specificMapping) {
                it(mapping.name + ` – ${layoutModel.name} – array shape`, () => {
                    expect(specificMapping.length).toBe(5);
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