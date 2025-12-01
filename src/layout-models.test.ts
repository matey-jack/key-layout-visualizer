import {describe, expect, it} from "vitest";
import {KEYMAP_TYPES, KeyboardRows, KeymapTypeId, RowBasedLayoutModel} from "./base-model.ts";
import {ansiIBMLayoutModel, ansiWideLayoutModel, createHHKB} from "./layout/ansiLayoutModel.ts";
import {eb65BigEnterLayoutModel, eb65LowshiftLayoutModel} from "./layout/eb65LowshiftLayoutModel.ts";
import {
    eb65LowshiftWideAngleModLayoutModel,
    eb65LowshiftWideLayoutModel
} from "./layout/eb65LowshiftWideLayoutModel.ts";
import {
    eb65MidshiftNiceLayoutModel
} from "./layout/eb65MidshiftNiceLayoutModel.ts";
import {eb65MidshiftExtraWideLayoutModel} from "./layout/eb65MidshiftExtraWideLayoutModel.ts";
import {ep60WithArrowsLayoutModel, ergoPlank60LayoutModel} from "./layout/ergoPlank60LayoutModel.ts";
import {harmonic12LayoutModel} from "./layout/harmonic12LayoutModel.ts";
import {harmonic13MidshiftLayoutModel} from "./layout/harmonic13MidshiftLayoutModel.ts";
import {harmonic13WideLayoutModel} from "./layout/harmonic13WideLayoutModel.ts";
import {harmonic14TraditionalLayoutModel} from "./layout/harmonic14TraditionalLayoutModel.ts";
import {harmonic14WideLayoutModel} from "./layout/harmonic14WideLayoutModel.ts";
import {katanaLayoutModel} from "./layout/katanaLayoutModel.ts";
import {splitOrthoLayoutModel} from "./layout/splitOrthoLayoutModel.ts";
import {sum} from "./library/math.ts";
import {ahkbLayoutModel} from "./layout/ahkbLayoutModel.ts";
import {
    eb65CentralEnterLayoutModel,
    eb65MidshiftRightRetLayoutModel,
    eb65VerticalEnterLayoutModel
} from "./layout/eb65MidshiftNarrowLayoutModels.ts";

const layoutModels: Array<RowBasedLayoutModel> = [
    ansiIBMLayoutModel,
    ansiWideLayoutModel,
    createHHKB(ansiIBMLayoutModel),
    ahkbLayoutModel,
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

function getExpectedRowLengths(model: RowBasedLayoutModel): number[] {
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

function rowWidth(model: RowBasedLayoutModel, row: KeyboardRows) {
    return 2 * model.rowIndent[row]
        + sum(model.keyWidths[row].map((width) => width ?? 1))
}

describe('RowBasedLayoutModel matrix shapes', () => {
    layoutModels.forEach((model) => {
        describe(model.name, () => {
            const rowLengths = getExpectedRowLengths(model);

            if (model.thirtyKeyMapping) {
                it('thirtyKeyMapping matches expected shape', () => {
                    expectMatrixShape(model.thirtyKeyMapping!, rowLengths, "thirtyKeyMapping");
                });
            }

            if (model.thumb30KeyMapping) {
                it('thumb30KeyMapping matches expected shape', () => {
                    expectMatrixShape(model.thumb30KeyMapping!, rowLengths, "thumb30KeyMapping");
                });
            }

            if (model.fullMapping) {
                it('fullMapping matches expected shape', () => {
                    expectMatrixShape(model.fullMapping!, rowLengths, "thumb30KeyMapping");
                });
            }

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
                    if (model.name.startsWith("Ergoplank 60") && row == KeyboardRows.Bottom) continue;
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
 * 
 * For 30key and thumb30 types, the FlexMapping data is prepended with an empty row 
 * when merged (see mergeMapping), so frame row indices are offset by 1 from FlexMapping indices.
 * For full layout types (ansi, ansiWide, splitOrtho, etc.), there's no offset.
 * 
 * Simple number placeholders reference the same row index in the merged FlexMapping.
 * Tuple placeholders [rowOffset, col] reference a different row (current + offset).
 */
function countPlaceholdersByFlexRow(frameMapping: unknown[][], flexRowOffset: number): Map<number, number[]> {
    const result = new Map<number, number[]>();
    
    frameMapping.forEach((row, rowIndex) => {
        row.forEach((v) => {
            if (typeof v === "number") {
                // Simple number: references same row in merged FlexMapping
                // Subtract offset to get the actual FlexMapping row index
                const flexRow = rowIndex - flexRowOffset;
                if (flexRow >= 0) {
                    if (!result.has(flexRow)) result.set(flexRow, []);
                    result.get(flexRow)!.push(v);
                }
            } else if (Array.isArray(v)) {
                // Tuple [rowOffset, col]: references row (rowIndex + offset) in merged FlexMapping
                const flexRow = rowIndex + v[0] - flexRowOffset;
                if (flexRow >= 0) {
                    if (!result.has(flexRow)) result.set(flexRow, []);
                    result.get(flexRow)!.push(v[1]);
                }
            }
        });
    });
    
    return result;
}

/**
 * Get the row offset for a keymap type.
 * 30key and thumb30 FlexMappings are prepended with "" when merged, so offset is 1.
 * Full layout types (ansi, ansiWide, splitOrtho, etc.) have no offset.
 */
function getFlexRowOffset(typeId: KeymapTypeId): number {
    return (typeId === KeymapTypeId.Ansi30 || typeId === KeymapTypeId.Thumb30) ? 1 : 0;
}

describe('supportedKeymapTypes frame mapping validation', () => {
    const layoutsWithNewProperty = layoutModels.filter(m => m.supportedKeymapTypes?.length);

    layoutsWithNewProperty.forEach((model) => {
        describe(model.name, () => {
            model.supportedKeymapTypes!.forEach(({ typeId, frameMapping }) => {
                const keymapType = KEYMAP_TYPES[typeId as KeymapTypeId];
                const flexRowOffset = getFlexRowOffset(typeId);

                it(`${typeId}: placeholder count matches KEYMAP_TYPES.keysPerRow`, () => {
                    expect(keymapType, `Unknown keymap type: ${typeId}`).toBeDefined();
                    
                    const placeholdersByRow = countPlaceholdersByFlexRow(frameMapping, flexRowOffset);
                    
                    keymapType.keysPerRow.forEach((expected, flexRowIndex) => {
                        const placeholders = placeholdersByRow.get(flexRowIndex) ?? [];
                        expect(placeholders.length, `FlexMapping row ${flexRowIndex} placeholder count`).toBe(expected);
                    });
                });

                it(`${typeId}: placeholder values are sequential 0..N-1 per FlexMapping row`, () => {
                    const placeholdersByRow = countPlaceholdersByFlexRow(frameMapping, flexRowOffset);
                    
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
