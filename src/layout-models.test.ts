import {describe, expect, it} from "vitest";
import {KEYMAP_TYPES, KeyboardRows, type KeymapTypeId, type LayoutModel} from "./base-model.ts";
import {ahkbLayoutModel} from "./layout/ahkbLayoutModel.ts";
import {ansiIBMLayoutModel, ansiWideLayoutModel, createApple, createHHKB} from "./layout/ansiLayoutModel.ts";
import {eb65BigEnterLayoutModel, eb65LowshiftLayoutModel} from "./layout/eb65LowshiftLayoutModel.ts";
import {
    eb65LowshiftWideAngleModLayoutModel,
    eb65LowshiftWideLayoutModel
} from "./layout/eb65LowshiftWideLayoutModel.ts";
import {eb65MidshiftExtraWideLayoutModel} from "./layout/eb65MidshiftExtraWideLayoutModel.ts";
import {
    eb65CentralEnterLayoutModel,
    eb65MidshiftRightRetLayoutModel,
    eb65VerticalEnterLayoutModel
} from "./layout/eb65MidshiftNarrowLayoutModels.ts";
import {
    eb65MidshiftNiceLayoutModel
} from "./layout/eb65MidshiftNiceLayoutModel.ts";
import {ep60WithArrowsLayoutModel, ergoPlank60LayoutModel} from "./layout/ergoPlank60LayoutModel.ts";
import {ergoslatAddNumberless, ergoslatLayoutModel} from './layout/ergoslatLayoutModel.ts';
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
    ergoslatLayoutModel,
    ergoslatAddNumberless(ergoslatLayoutModel),
    eb65LowshiftLayoutModel,
    eb65BigEnterLayoutModel,
    eb65LowshiftWideLayoutModel,
    eb65LowshiftWideAngleModLayoutModel,
    eb65MidshiftNiceLayoutModel,
    eb65MidshiftRightRetLayoutModel,
    eb65CentralEnterLayoutModel,
    eb65VerticalEnterLayoutModel,
    eb65MidshiftExtraWideLayoutModel,
    ergoPlank60LayoutModel,
    ep60WithArrowsLayoutModel,
    harmonic12LayoutModel,
    harmonic13WideLayoutModel,
    harmonic13MidshiftLayoutModel,
    harmonic14WideLayoutModel,
    harmonic14TraditionalLayoutModel,
    katanaLayoutModel,
    splitOrthoLayoutModel,
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
         });
     });
 });
