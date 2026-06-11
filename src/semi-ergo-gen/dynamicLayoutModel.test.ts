import {describe, expect, it} from 'vitest';
import {ergoMaker} from './dynamicLayoutModel.ts';
import {qwertyKeymap} from './seg-model.ts';

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

describe('dynamicLayoutModel', () => {
    it('Ergoplank keyWidths', () => {
        const result = ergoMaker(15, [4, 4, 2], 0, qwertyKeymap);
        compareMatrix(result.renderInfo.keyWidths, [
            [1.5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.5],
            [1.25, 1, 1, 1, 1, 1, 1, 0.5, 1, 1, 1, 1, 1, 1, 1.25],
            Array(15).fill(1),
            Array(14).fill(1),
        ]);
    });
    it('Ergoplank fullMapping', () => {
        const result = ergoMaker(15, [4, 4, 2], 0, qwertyKeymap);
        compareMatrix(result.fullMapping, [
            ['', '1', '2', '3', '4', '5', '', '', '6', '7', '8', '9', '0', ''],
            ['', 'q', 'w', 'e', 'r', 't', '', null, '', 'y', 'u', 'i', 'o', 'p', ''],
            ['', 'a', 's', 'd', 'f', 'g', '', '', '', 'h', 'j', 'k', 'l', ';', ''],
            ['z', 'x', 'c', 'v', 'b', '', '', '', '', 'n', 'm', ',', '.', '/'],
        ]);
    });
    it('Triplex keyWidths', () => {
        const result = ergoMaker(15, [3, 3, 3], 0.66, qwertyKeymap);
        compareFloatMatrix(result.renderInfo.keyWidths, [
            [1.33, 1, 1, 1, 1, 1, 1, 0.33, 1, 1, 1, 1, 1, 1, 1.33],
            Array(15).fill(1),
            [1.67, 1, 1, 1, 1, 1, 1.67, 1, 1, 1, 1, 1, 1.67],
            [1.33, 1, 1, 1, 1, 1, 1, 0.33, 1, 1, 1, 1, 1, 1, 1.33],
        ]);
    });
});