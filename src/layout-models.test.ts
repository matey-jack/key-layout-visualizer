import {describe, expect, it} from "vitest";
import {KeyboardRows, RowBasedLayoutModel} from "./base-model.ts";
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
