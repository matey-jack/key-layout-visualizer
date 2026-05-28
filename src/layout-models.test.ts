import {describe, expect, it} from "vitest";
import {KEYMAP_TYPES, KeyboardRows, KeymapTypeId, type LayoutModel} from "./base-model.ts";
import {ahkbLayoutModel} from "./layout/ahkbLayoutModel.ts";
import {ansiIBMLayoutModel, ansiWideLayoutModel, createApple, createHHKB} from "./layout/ansiLayoutModel.ts";
import {eb65BigEnterLayoutModel, eb65LowshiftLayoutModel} from "./layout/eb65LowshiftLayoutModel.ts";
import {
    eb65LowshiftWideAngleModLayoutModel,
    eb65LowshiftWideLayoutModel,
} from "./layout/eb65LowshiftWideLayoutModel.ts";
import {eb65MidshiftExtraWideLayoutModel} from "./layout/eb65MidshiftExtraWideLayoutModel.ts";
import {
    eb65CentralEnterLayoutModel,
    eb65MidshiftRightRetLayoutModel,
    eb65VerticalEnterLayoutModel,
} from "./layout/eb65MidshiftNarrowLayoutModels.ts";
import {eb65MidshiftNiceLayoutModel} from "./layout/eb65MidshiftNiceLayoutModel.ts";
import {eb65MidshiftSemiWideLayoutModel} from "./layout/eb65MidshiftSemiWideLayoutModel.ts";
import {
    createErgoPlankMidShift,
    createErgoPlankWithArrows,
    ergoPlank60LayoutModel
} from "./layout/ergoPlank60LayoutModel.ts";
import {majorErgoslatLayoutModel, makeErgoslatNumberless, minorErgoslatLayoutModel } from './layout/ergoslatLayoutModel.ts';
import {harmonic12LayoutModel} from "./layout/harmonic12LayoutModel.ts";
import {harmonic13MidshiftLayoutModel} from "./layout/harmonic13MidshiftLayoutModel.ts";
import {harmonic13WideLayoutModel} from "./layout/harmonic13WideLayoutModel.ts";
import {harmonic14TraditionalLayoutModel} from "./layout/harmonic14TraditionalLayoutModel.ts";
import {harmonic14WideLayoutModel} from "./layout/harmonic14WideLayoutModel.ts";
import {katanaLayoutModel} from "./layout/katanaLayoutModel.ts";
import {splitOrthoLayoutModel} from "./layout/splitOrthoLayoutModel.ts";
import {xhkbLayoutModel, xhkbWithArrowsLayoutModel} from "./layout/xhkbLayoutModel.ts";
import {sum} from "./library/math.ts";

const layoutModels: Array<LayoutModel> = [
    ansiIBMLayoutModel,
    ansiWideLayoutModel,
    createHHKB(ansiIBMLayoutModel),
    createApple(ansiIBMLayoutModel),
    createHHKB(ansiWideLayoutModel),
    createApple(ansiWideLayoutModel),
    xhkbLayoutModel,
    xhkbWithArrowsLayoutModel,
    ahkbLayoutModel,
    majorErgoslatLayoutModel(false),
    majorErgoslatLayoutModel(true),
    minorErgoslatLayoutModel(false),
    minorErgoslatLayoutModel(true),
    makeErgoslatNumberless(majorErgoslatLayoutModel(false)),
    makeErgoslatNumberless(minorErgoslatLayoutModel(false)),
    eb65LowshiftLayoutModel,
    eb65BigEnterLayoutModel,
    eb65LowshiftWideLayoutModel,
    eb65LowshiftWideAngleModLayoutModel,
    eb65MidshiftNiceLayoutModel,
    eb65MidshiftRightRetLayoutModel,
    eb65CentralEnterLayoutModel,
    eb65VerticalEnterLayoutModel,
    eb65MidshiftExtraWideLayoutModel,
    eb65MidshiftSemiWideLayoutModel,
    ergoPlank60LayoutModel,
    createErgoPlankMidShift(ergoPlank60LayoutModel),
    createErgoPlankWithArrows(ergoPlank60LayoutModel),
    createErgoPlankWithArrows(createErgoPlankMidShift(ergoPlank60LayoutModel)),
    harmonic12LayoutModel,
    harmonic13WideLayoutModel,
    harmonic13MidshiftLayoutModel,
    harmonic14WideLayoutModel,
    harmonic14TraditionalLayoutModel,
    katanaLayoutModel,
    splitOrthoLayoutModel(false),
    splitOrthoLayoutModel(true),
];

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

function getStringKeys(frameMapping: unknown[][], initialKeys?: Iterable<string>): string[] {
    const keys = new Set<string>(initialKeys);
    frameMapping.forEach((row) => {
        row.forEach((v) => {
            if (typeof v === "string") {
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
    layoutModels.forEach((model) => {
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
                // Simple number: references same row in FlexMapping
                result.get(rowIndex)!.push(v);
            } else if (Array.isArray(v)) {
                // Tuple [rowOffset, col]: references row (rowIndex + offset) in FlexMapping
                const flexRow = rowIndex + v[0];
                if (flexRow >= 0) {
                    result.get(flexRow)!.push(v[1]);
                }
            }
        });
    });
    
    return result;
}

describe('frameMappings frame mapping validation', () => {
     layoutModels.forEach((model) => {
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
                 it('ansi30 and thumb30 have the same keys (modulo - and /)', () => {
                     const ansi30Array = getStringKeys(ansi30frame, ['-', '/']);
                     const thumb30Array = getStringKeys(thumb30frame, ['-', '/']);
                     expect(ansi30Array).toEqual(thumb30Array);
                 });
             }

             const ansi32frame = model.frameMappings[KeymapTypeId.Ansi32];
             const thumb32frame = model.frameMappings[KeymapTypeId.Thumb32];
             if (ansi32frame && thumb32frame) {
                 it('ansi32 and thumb32 have the same keys', () => {
                     const ansi32Array = getStringKeys(ansi32frame);
                     const thumb32Array = getStringKeys(thumb32frame);
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
        [ ergoPlank60LayoutModel, createErgoPlankMidShift(ergoPlank60LayoutModel) ],
    ]
     pairs.forEach(([lowShift, midShift]) => {
         (Object.keys(lowShift.frameMappings) as KeymapTypeId[]).forEach((keymapType) => {
             it(`${lowShift.name}[${keymapType}] has the same keys in low and mid shift variants`, () => {
                 const lsKeys = getStringKeys(lowShift.frameMappings[keymapType]!);
                 const msKeys = getStringKeys(midShift.frameMappings[keymapType]!);
                 expect(lsKeys).toEqual(msKeys);
             });
         })
     })
});

describe('Ergoslat numberless key placements', () => {
    it('moves upper row overridden keys to the bottom row instead of Home and End', () => {
        const baseMinor = minorErgoslatLayoutModel(false);
        const numberlessMinor = makeErgoslatNumberless(baseMinor);

        // Check Ansi30
        const baseAnsi30 = baseMinor.frameMappings[KeymapTypeId.Ansi30]!;
        const numAnsi30 = numberlessMinor.frameMappings[KeymapTypeId.Ansi30]!;

        const expectedBottom2 = baseAnsi30[KeyboardRows.Upper][0]; // "↹"
        const expectedBottom7 = baseAnsi30[KeyboardRows.Upper][12]; // "-"

        expect(numAnsi30[KeyboardRows.Upper][0]).toBe("Esc");
        expect(numAnsi30[KeyboardRows.Upper][12]).toBe("⌫");
        expect(numAnsi30[KeyboardRows.Bottom][2]).toBe(expectedBottom2);
        expect(numAnsi30[KeyboardRows.Bottom][7]).toBe(expectedBottom7);

        // Check Thumb30
        const baseThumb30 = baseMinor.frameMappings[KeymapTypeId.Thumb30]!;
        const numThumb30 = numberlessMinor.frameMappings[KeymapTypeId.Thumb30]!;

        const expectedThumbBottom2 = baseThumb30[KeyboardRows.Upper][0]; // "↹"
        const expectedThumbBottom7 = baseThumb30[KeyboardRows.Upper][12]; // "⏎"

        expect(numThumb30[KeyboardRows.Upper][0]).toBe("Esc");
        expect(numThumb30[KeyboardRows.Upper][12]).toBe("⌫");
        expect(numThumb30[KeyboardRows.Bottom][2]).toBe(expectedThumbBottom2);
        expect(numThumb30[KeyboardRows.Bottom][7]).toBe(expectedThumbBottom7);
    });
});
