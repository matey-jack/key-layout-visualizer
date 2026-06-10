import {describe, expect, it} from 'vitest';
import {ergoMaker} from './dynamicLayoutModel.ts';
import {qwertyKeymap} from './seg-model.ts';

function compareMatrix<T>(actual: T[][], expected: T[][], description = "") {
    expect(actual.length, `${description}: number of rows`).toEqual(expected.length);
    actual.forEach((row, r) => {
        // expect(row.length, `${description}: length of row ${r}`).toEqual(expected[r].length);
        expect(row, `${description}: row ${r}`).toEqual(expected[r]);
    })
}

describe('dynamicLayoutModel', () => {
    it('Ergoplank keyWidths', () => {
        const result = ergoMaker(15, [4, 4, 2], 0, qwertyKeymap);
        compareMatrix(result.keyWidths, [
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
});