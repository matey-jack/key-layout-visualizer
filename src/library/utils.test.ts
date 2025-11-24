import {describe, expect, it} from 'vitest';

import {getSymmetricEven, getSymmetricOdd} from './utils.ts';

describe('getSymmetricEven', () => {
    it('mirrors values across the center with all values repeated', () => {
        const keys = ['a', 'b', 'c'];

        const mirrored = Array.from({length: keys.length * 2}, (_, index) => getSymmetricEven(keys, index));

        expect(mirrored).toStrictEqual(['a', 'b', 'c', 'c', 'b', 'a']);
    });
});

describe('getSymmetricOdd', () => {
    it('uses the last element as the central key without repeating it', () => {
        const keys = [1, 2, 3, 4];

        const mirrored = Array.from({length: keys.length * 2 - 1}, (_, index) => getSymmetricOdd(keys, index));

        expect(mirrored).toStrictEqual([1, 2, 3, 4, 3, 2, 1]);
        expect(mirrored.filter((value) => value === 4).length).toBe(1);
    });
});
