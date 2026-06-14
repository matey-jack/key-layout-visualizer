import {describe, expect, it} from 'vitest';
import {ergoMaker} from './dynamicLayoutModel.ts';
import {type DynamicLayoutModel, qwertyKeymap} from './se-model.ts';
import {sum} from '../library/math.ts';

function compareMatrix<T>(actual: T[][], expected: T[][], description = "") {
    expect(actual.length, `${description}: number of rows`).toEqual(expected.length);
    const failures: string[] = [];
    actual.forEach((row, r) => {
        try {
            expect(row, `${description}: row ${r}`).toEqual(expected[r]);
        } catch (e: unknown) {
            failures.push(e instanceof Error ? e.message : String(e));
        }
    });
    if (failures.length > 0) {
        const message = `Assertion failures in compareMatrix:\n${failures.join('\n\n')}`;
        console.error(message);
        expect.fail(message);
    }
}

function compareFloatMatrix(actual: number[][], expected: number[][], description = "") {
    expect(actual.length, `${description}: number of rows`).toEqual(expected.length);
    const failures: string[] = [];
    actual.forEach((row, r) => {
        if (!expected[r]) {
            failures.push(`${description}: row ${r} is missing in expected matrix`);
            return;
        }
        row.forEach((cell, c) => {
            try {
                expect(cell, `${description}: row ${r} col ${c}`).closeTo(expected[r][c], 0.01);
            } catch (e) {
                failures.push(e instanceof Error ? e.message : String(e));
            }
        });
    });
    if (failures.length > 0) {
        const message = `Assertion failures in compareFloatMatrix:\n${failures.join('\n\n')}`;
        console.error(message);
        expect.fail(message);
    }
}

function checkAllRowWidths(model: DynamicLayoutModel, width: number) {
    const failures: string[] = [];
    model.renderInfo.keyWidths.forEach((widths, rowId) => {
        const actual = sum(widths) + 2*model.renderInfo.rowIndent[rowId];
        if (actual !== width) {
            failures.push(`Row ${rowId} adds to ${actual}u, but should be ${width}.`)
        }
    });
    expect(failures.join('\n')).toEqual('');
}

describe('dynamicLayoutModel', () => {
    it('Ergoplank keyWidths', () => {
        const result = ergoMaker(15, [4, 4, 2], 0, qwertyKeymap);
        compareMatrix(result.renderInfo.keyWidths, [
            [1.5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.5],
            [1.25, 1, 1, 1, 1, 1, 1, 0.5, 1, 1, 1, 1, 1, 1, 1.25],
            Array(15).fill(1),
            Array(14).fill(1),
            [1.25, 1.25, 1.25, 1.5, 1.75, 0.5, 1.75, 1.5, 1.25, 1.25, 1.25]
        ]);
    });
    it('Ergoplank fullMapping', () => {
        const result = ergoMaker(15, [4, 4, 2], 0, qwertyKeymap);
        compareMatrix(result.fullMapping, [
            ['', '1', '2', '3', '4', '5', '', '', '6', '7', '8', '9', '0', ''],
            ['', 'q', 'w', 'e', 'r', 't', '', null, '', 'y', 'u', 'i', 'o', 'p', ''],
            ['', 'a', 's', 'd', 'f', 'g', '', '', '', 'h', 'j', 'k', 'l', ';', ''],
            ['z', 'x', 'c', 'v', 'b', '', '', '', '', 'n', 'm', ',', '.', '/'],
            ['', '', '', '', '', null, '', '', '', '', '']
        ]);
    });
    it('Triplex keyWidths 0.66', () => {
        const result = ergoMaker(15, [3, 3, 3], 0.67, qwertyKeymap);
        compareFloatMatrix(result.renderInfo.keyWidths, [
            [1.33, 1, 1, 1, 1, 1, 1, 0.33, 1, 1, 1, 1, 1, 1, 1.33],
            Array(15).fill(1),
            [1.67, 1, 1, 1, 1, 1, 1.67, 1, 1, 1, 1, 1, 1.67],
            [1.33, 1, 1, 1, 1, 1, 1, 0.33, 1, 1, 1, 1, 1, 1, 1.33],
            [1.67, 1.33, 0.17, 1.33, 1.67, 1.33, 1.33, 1.67, 1.33, 0.17, 1.33, 1.67]
        ]);
    });
    it('Triplex keyWidths 0.33', () => {
        const result = ergoMaker(15, [3, 3, 3], 0.33, qwertyKeymap);
        compareFloatMatrix(result.renderInfo.keyWidths, [
            Array(15).fill(1),
            [1.67, 1, 1, 1, 1, 1, 1.67, 1, 1, 1, 1, 1, 1.67],
            [1.33, 1, 1, 1, 1, 1, 1, 0.33, 1, 1, 1, 1, 1, 1, 1.33],
            Array(15).fill(1),
            [1.67, 1.33, 1.33, 1.67, 1.33, 0.33, 1.33, 1.67, 1.33, 1.33, 1.67]
        ]);
    });

    it('Ergoboard 13/3', () => {
        checkAllRowWidths(ergoMaker(13, [4, 4, 4], 0, qwertyKeymap), 13);
    });
    it('Ergoboard 14/4', () => {
        checkAllRowWidths(ergoMaker(14, [4, 4, 4], 0, qwertyKeymap), 14);
    });
    it('Ergoboard 16/5', () => {
        checkAllRowWidths(ergoMaker(16, [4, 4, 4], 0.5, qwertyKeymap), 16);
    });
    it('Harmonic', () => {
        checkAllRowWidths(ergoMaker(15, [2, 2, 2], 0, qwertyKeymap), 15);
    });
});