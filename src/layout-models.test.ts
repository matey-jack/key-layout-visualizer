import {describe, expect, it} from "vitest";
import {
    KEY_COLOR,
    KEYMAP_TYPES,
    keyboardSymbols,
    KeyboardRows,
    KeymapTypeId,
    type FrameMapping,
    type LayoutModel,
    usefulNonAsciiCharacters
} from "./base-model.ts";
import {ergoboardRightRetLayoutModel, ergoboardVerticalEnterLayoutModel} from "./layout/ergoboardNarrowLayoutModels.ts";
import {ergoboardSemiWideLayoutModel} from "./layout/ergoboardSemiWideLayoutModel.ts";
import {createErgoPlankCenterArrows, createErgoPlankMidShiftLowerCharacters, ergoplankLayoutModel} from "./layout/ergoplankLayoutModel.ts";
import {
    majorErgoslatLayoutModel,
    numberlessErgoslatLayoutModel,
    minorErgoslatLayoutModel
} from './layout/ergoslatLayoutModel.ts';
import {splitOrthoLayoutModel} from "./layout/splitOrthoLayoutModel.ts";
import {xhkb13LayoutModel, xhkb14LayoutModel, xhkb15LayoutModel, xhkb16LayoutModel} from "./layout/xhkbLayoutModel.ts";
import {sum} from "./library/math.ts";
import {allLayoutModels} from "./all-layout-models.ts";
import {allMappings} from "./mapping/mappings.ts";


// Expected differences between ansi30 and thumb30
// TODO: use the .name references throughout to avoid test failures when names change
const IGNORED_30_KEYS: Record<string, string[]> = {
    "ANSI/IBM with wide hand position": ["Esc", "⌦", "☰"],
    "AN65 with wide hand position": ["Esc", "☰"],
    "ANSI/Apple with wide hand position": ["Esc", "⌦"], // replaces duplicate Ctrl key
    [xhkb13LayoutModel.name]: ["⇤", "⇥"],
    // The single difference here is due to removing the duplicate space key.
    [xhkb14LayoutModel.name]: ["⎀"],
    [xhkb15LayoutModel.name]: ["⎀"],
    [xhkb16LayoutModel.name]: ["€"],
    "Ergoboard 65 LowShift Big Enter": ["`~"],
    "Ergoboard 65 LowShift Wide": ["⎀"],
    "Ergoboard 65 LowShift Wide angle mod": ["⎀"],
    [ergoboardRightRetLayoutModel.name]: ["⎀"],
    [ergoboardVerticalEnterLayoutModel.name]: ["⎀"],
    [ergoboardSemiWideLayoutModel.name]: ["⎀"],
    // those are differences where I didn't want to settle on a single variant.
    "Harmonic 13 MidShift": ["\\", "`", "[", "]"],
    "Harmonic 14 Macro": ["", "☰"],
};

const IGNORED_32_KEYS: Record<string, string[]> = {
    "ANSI/IBM with wide hand position": ["\\", "☰", "⌦"],
    "AN65 with wide hand position": ["\\", "☰"],
    "ANSI/Apple with wide hand position": ["\\", "⌦"],
    [xhkb14LayoutModel.name]: ["`~"],
    [xhkb15LayoutModel.name]: ["⎀"],
    [xhkb16LayoutModel.name]: ["€"],
};

function getExpectedRowLengths(model: LayoutModel): number[] {
    if (!model.keyWidths?.length) {
        throw new Error(`Layout ${model.name} does not define keyWidths for shape validation.`);
    }
    return model.keyWidths.map((row) => row.length);
}

function expectMatrixShape(matrix: unknown[][], lengths: number[], label: string) {
    expect(matrix.length, `${label} row count`).toBe(lengths.length);
    matrix.forEach((row, idx) => {
        expect(row.length, `${label} row ${idx}`).toBe(lengths[idx]);
    });
}

function getStringKeys(frameMapping: unknown[][], ignoredKeys?: Iterable<string>): string[] {
    const keys = new Set<string>();
    const ignored = new Set<string>(ignoredKeys);
    frameMapping.forEach((row) => {
        row.forEach((v) => {
            if (typeof v === "string" && !ignored.has(v)) {
                keys.add(v);
            }
        });
    });
    return Array.from(keys).sort();
}

function rowWidth(model: LayoutModel, row: KeyboardRows) {
    return 2 * model.rowIndent[row]
        + sum(model.keyWidths[row].map((width) => width ?? 1))
}

describe('RowBasedLayoutModel matrix shapes', () => {
    allLayoutModels.forEach((model) => {
        describe(model.name, () => {
            const rowLengths = getExpectedRowLengths(model);

            Object.entries(model.frameMappings).forEach(([typeId, frameMapping]) => {
                it(`${typeId} matches expected shape`, () => {
                    expectMatrixShape(frameMapping, rowLengths, "thirtyKeyMapping");
                });

            });

            it('mainFingerAssignment matches expected shape', () => {
                expectMatrixShape(model.mainFingerAssignment, rowLengths, "mainFingerAssignment");
            });

            it('singleKeyEffort matches expected shape', () => {
                expectMatrixShape(model.singleKeyEffort, rowLengths, "singleKeyEffort");
            });

            it.skipIf(model.name.includes('Split'))
            ('keyWidths add up to same number', () => {
                const numberRowWidth = rowWidth(model, KeyboardRows.Number);
                for (let row = 0; row <= KeyboardRows.Bottom; row++) {
                    if (model.name.startsWith("Ergoplank 60") && row === KeyboardRows.Bottom) continue;
                    expect(rowWidth(model, row), `row ${row}`).toBeCloseTo(numberRowWidth);
                }
            });
        });
    });
});

// --- NEW: Tests for supportedKeymapTypes frame mappings ---

/**
 * For frame mappings, we count placeholders across the entire frame mapping,
 * grouped by the row they reference in the FlexMapping.
 */
function collectPlaceholdersByFlexRow(frameMapping: unknown[][]): Map<number, number[]> {
    const result = new Map<number, number[]>();
    for (let i = 0; i <= KeyboardRows.Bottom; i++) {
        result.set(i, []);
    }
    frameMapping.forEach((row, rowIndex) => {
        row.forEach((v) => {
            if (typeof v === "number") {
                result.get(rowIndex)!.push(v);
            } else if (Array.isArray(v)) {
                result.get(v[0])!.push(v[1]);
            }
        });
    });
    
    return result;
}

describe('frameMappings frame mapping validation', () => {
     allLayoutModels.forEach((model) => {
         describe(model.name, () => {
             Object.entries(model.frameMappings).forEach(([typeId, frameMapping]) => {
                 const keymapType = KEYMAP_TYPES[typeId as KeymapTypeId];

                 it(`${typeId}: placeholder count matches KEYMAP_TYPES.keysPerRow`, () => {
                     expect(keymapType, `Unknown keymap type: ${typeId}`).toBeDefined();
                     
                     const placeholdersByRow = collectPlaceholdersByFlexRow(frameMapping);
                     
                     keymapType.keysPerRow.forEach((expected, flexRowIndex) => {
                         const placeholders = placeholdersByRow.get(flexRowIndex)!;
                         expect(placeholders.length, `FlexMapping row ${flexRowIndex} placeholder count`).toBe(expected);
                     });
                 });

                 it(`${typeId}: placeholder values are sequential 0..N-1 per FlexMapping row`, () => {
                     const placeholdersByRow = collectPlaceholdersByFlexRow(frameMapping);
                     
                     keymapType.keysPerRow.forEach((expected, flexRowIndex) => {
                         if (expected === 0) return; // skip empty rows
                         
                         const placeholders = placeholdersByRow.get(flexRowIndex) ?? [];
                         const expectedSequence = Array.from({ length: expected }, (_, i) => i);
                         const sorted = [...placeholders].sort((a, b) => a - b);
                         expect(sorted, `FlexMapping row ${flexRowIndex} placeholders should be 0..${expected - 1}`).toEqual(expectedSequence);
                     });
                 });
             });

             const ansi30frame = model.frameMappings[KeymapTypeId.Ansi30];
             const thumb30frame = model.frameMappings[KeymapTypeId.Thumb30];
             if (ansi30frame && thumb30frame) {
                 it('ansi30 and thumb30 have the same string keys (modulo - and /)', () => {
                     const ignored = IGNORED_30_KEYS[model.name] || [];
                     const ansi30Array = getStringKeys(ansi30frame, ['-', '/', ...ignored]);
                     const thumb30Array = getStringKeys(thumb30frame, ['-', '/', ...ignored]);
                     expect(ansi30Array).toEqual(thumb30Array);
                 });
             }

             const ansi32frame = model.frameMappings[KeymapTypeId.Ansi32];
             const thumb32frame = model.frameMappings[KeymapTypeId.Thumb32];
             if (ansi32frame && thumb32frame) {
                 it('ansi32 and thumb32 have the same string keys', () => {
                     const ignored = IGNORED_32_KEYS[model.name] || [];
                     const ansi32Array = getStringKeys(ansi32frame, ignored);
                     const thumb32Array = getStringKeys(thumb32frame, ignored);
                     expect(ansi32Array).toEqual(thumb32Array);
                 });
             }

         });
     });
 });

describe("midShift variants don't change the character set", () => {
    const pairs = [
        [ majorErgoslatLayoutModel(false), majorErgoslatLayoutModel(true) ],
        [ minorErgoslatLayoutModel(false), minorErgoslatLayoutModel(true) ],
        [ splitOrthoLayoutModel(false), splitOrthoLayoutModel(true) ],
        [ ergoplankLayoutModel, createErgoPlankMidShiftLowerCharacters(ergoplankLayoutModel) ],
        [ createErgoPlankCenterArrows(ergoplankLayoutModel), createErgoPlankCenterArrows(createErgoPlankMidShiftLowerCharacters(ergoplankLayoutModel)) ],
    ]
     pairs.forEach(([lowShift, midShift]) => {
         (Object.keys(lowShift.frameMappings) as KeymapTypeId[]).forEach((keymapType) => {
             it(`${lowShift.name}[${keymapType}] has the same keys in Low- and Mid-shift variants`, () => {
                 const lsKeys = getStringKeys(lowShift.frameMappings[keymapType]!);
                 const msKeys = getStringKeys(midShift.frameMappings[keymapType]!);
                 expect(lsKeys).toEqual(msKeys);
             });
         })
     })
});

describe("key labels", () => {
    // Every non-ASCII glyph on a key has to be a letter of some alphabet, a known symbol, or a character
    // we chose to offer. Anything else is a typo or a symbol someone forgot to add to keyboardSymbols,
    // where it would render as an ordinary character key instead of a command key.
    const knownNonAscii = keyboardSymbols + usefulNonAsciiCharacters;
    const unknownGlyphs = (label: string) =>
        [...label].filter((c) =>
            c.charCodeAt(0) > 127 && !knownNonAscii.includes(c) && !/\p{L}/u.test(c)
        );

    allLayoutModels.forEach((model) => {
        it(`frame mappings of ${model.name} use only known symbols and characters`, () => {
            for (const [keymapType, frameMapping] of Object.entries(model.frameMappings)) {
                for (const [r, row] of frameMapping.entries()) {
                    for (const [c, entry] of row.entries()) {
                        if (typeof entry !== "string") continue;
                        expect(unknownGlyphs(entry), `${keymapType} [${r},${c}] = "${entry}"`).toEqual([]);
                    }
                }
            }
        });
    });

    allMappings.forEach((mapping) => {
        it(`flex mapping ${mapping.name} uses only known symbols and characters`, () => {
            for (const [keymapType, rows] of Object.entries(mapping.mappings)) {
                for (const [r, row] of rows.entries()) {
                    expect(unknownGlyphs(row), `${keymapType} row ${r} = "${row}"`).toEqual([]);
                }
            }
        });
    });
});
