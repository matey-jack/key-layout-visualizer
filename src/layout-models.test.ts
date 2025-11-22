import {describe, expect, it} from "vitest";
import {RowBasedLayoutModel} from "./base-model.ts";
import {ansiLayoutModel, ansiWideLayoutModel} from "./layout/ansiLayoutModel.ts";
import {eb65BigEnterLayoutModel, eb65LowShiftLayoutModel} from "./layout/eb65LowShiftLayoutModel.ts";
import {eb65LowShiftWideLayoutModel} from "./layout/eb65LowshiftWideLayoutModel.ts";
import {
    eb65CentralEnterLayoutModel,
    eb65MidshiftNiceLayoutModel,
    eb65MidshiftRightRetLayoutModel,
    eb65VerticalEnterLayoutModel
} from "./layout/eb65MidshiftNiceLayoutModel.ts";
import {eb65MidshiftMaxWideLayoutModel} from "./layout/eb65MidshiftMaxWideLayoutModel.ts";
import {ep60WithArrowsLayoutModel, ergoPlank60LayoutModel} from "./layout/ergoPlank60LayoutModel.ts";
import {harmonic12LayoutModel} from "./layout/harmonic12LayoutModel.ts";
import {harmonic13MidShiftLayoutModel} from "./layout/harmonic13MidshiftLayoutModel.ts";
import {harmonic13WideLayoutModel} from "./layout/harmonic13WideLayoutModel.ts";
import {harmonic14TraditionalLayoutModel} from "./layout/harmonic14TraditionalLayoutModel.ts";
import {harmonic14WideLayoutModel} from "./layout/harmonic14WideLayoutModel.ts";
import {katanaLayoutModel} from "./layout/katanaLayoutModel.ts";
import {orthoLayoutModel, splitOrthoLayoutModel} from "./layout/orthoLayoutModel.ts";

const layoutModels: Array<RowBasedLayoutModel> = [
    ansiLayoutModel,
    ansiWideLayoutModel,
    eb65LowShiftLayoutModel,
    eb65BigEnterLayoutModel,
    eb65LowShiftWideLayoutModel,
    eb65MidshiftNiceLayoutModel,
    eb65MidshiftRightRetLayoutModel,
    eb65CentralEnterLayoutModel,
    eb65VerticalEnterLayoutModel,
    eb65MidshiftMaxWideLayoutModel,
    ergoPlank60LayoutModel,
    ep60WithArrowsLayoutModel,
    harmonic12LayoutModel,
    harmonic13WideLayoutModel,
    harmonic13MidShiftLayoutModel,
    harmonic14WideLayoutModel,
    harmonic14TraditionalLayoutModel,
    katanaLayoutModel,
    orthoLayoutModel,
    splitOrthoLayoutModel,
];

function getExpectedRowLengths(model: RowBasedLayoutModel): number[] {
    const reference = model.thirtyKeyMapping ?? model.fullMapping ?? model.thumb30KeyMapping;
    if (!reference || reference.length === 0) {
        throw new Error(`Layout ${model.name} does not define a reference mapping for shape validation.`);
    }
    return reference.map((row) => row.length);
}

function expectMatrixShape(matrix: unknown[][], lengths: number[], label: string) {
    expect(matrix.length, `${label} row count`).toBe(lengths.length);
    matrix.forEach((row, idx) => {
        expect(row.length, `${label} row ${idx}`).toBe(lengths[idx]);
    });
}

describe('RowBasedLayoutModel matrix shapes', () => {
    it("arrays work", () => {
        const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
        console.log(arr);
        arr.splice(8, 0, 66);
        console.log(arr);
        arr.pop();
        console.log(arr);
    });

    it("is so weird", () => {
        const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
        const container = [[], arr, []];
        console.log(container[1]);
        container[1].splice(8, 0, 66);
        console.log(container[1]);
        container[1].pop();
        console.log(container[1]);
    });

    layoutModels.forEach((model) => {
        describe(model.name, () => {
            const rowLengths = getExpectedRowLengths(model);

            if (model.thirtyKeyMapping) {
                it('thirtyKeyMapping matches expected shape', () => {
                    expectMatrixShape(model.thirtyKeyMapping!, rowLengths, "thirtyKeyMapping");
                });
            }

            if (model.fullMapping) {
                it('thumb30KeyMapping matches expected shape', () => {
                    expectMatrixShape(model.fullMapping!, rowLengths, "thumb30KeyMapping");
                });
            }

            if (model.thumb30KeyMapping) {
                it('thumb30KeyMapping matches expected shape', () => {
                    expectMatrixShape(model.thumb30KeyMapping!, rowLengths, "thumb30KeyMapping");
                });
            }

            it('mainFingerAssignment matches expected shape', () => {
                expectMatrixShape(model.mainFingerAssignment, rowLengths, "mainFingerAssignment");
            });

            it('singleKeyEffort matches expected shape', () => {
                expectMatrixShape(model.singleKeyEffort, rowLengths, "singleKeyEffort");
            });
        });
    });
});
