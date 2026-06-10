import {describe, expect, it} from 'vitest';
import {pairKeysByPosition} from './functions.ts';
import {Finger, type KeyPosition} from '../base-model.ts';

function pos(row: number, col: number, label = ''): KeyPosition {
    return {label, row, col, colPos: col, keyCapWidth: 1, finger: Finger.LPinky, hasAltFinger: false};
}

describe('pairKeysByPosition', () => {
    it('pairs same-length row 1:1 from left to right', () => {
        const prev = [pos(0, 0), pos(0, 1), pos(0, 2)];
        const next = [pos(0, 0), pos(0, 1), pos(0, 2)];
        const movements = pairKeysByPosition(prev, next);
        expect(movements).toHaveLength(3);
        movements.forEach(m => {
            expect(m.prev).toBeDefined();
            expect(m.next).toBeDefined();
            expect(m.prev!.col).toEqual(m.next!.col);
        });
    });

    it('entering key in the middle when next row is longer', () => {
        // prev 4 keys, next 5 keys → n=4, left=2, right=2
        // left pairs:  prev[0]↔next[0], prev[1]↔next[1]
        // entering:    next[2]
        // right pairs: prev[2]↔next[3], prev[3]↔next[4]
        const prev = [pos(0, 0), pos(0, 1), pos(0, 2), pos(0, 3)];
        const next = [pos(0, 0), pos(0, 1), pos(0, 2), pos(0, 3), pos(0, 4)];
        const movements = pairKeysByPosition(prev, next);
        expect(movements).toHaveLength(5);
        const entering = movements.filter(m => m.prev === undefined);
        expect(entering).toHaveLength(1);
        expect(entering[0].next!.col).toEqual(2);
    });

    it('exiting key in the middle when prev row is longer', () => {
        // prev 5 keys, next 4 keys → n=4, left=2, right=2
        // left pairs:  prev[0]↔next[0], prev[1]↔next[1]
        // exiting:     prev[2]
        // right pairs: prev[3]↔next[2], prev[4]↔next[3]
        const prev = [pos(0, 0), pos(0, 1), pos(0, 2), pos(0, 3), pos(0, 4)];
        const next = [pos(0, 0), pos(0, 1), pos(0, 2), pos(0, 3)];
        const movements = pairKeysByPosition(prev, next);
        expect(movements).toHaveLength(5);
        const exiting = movements.filter(m => m.next === undefined);
        expect(exiting).toHaveLength(1);
        expect(exiting[0].prev!.col).toEqual(2);
        // edge keys stay anchored: rightmost prev pairs with rightmost next
        const rightPairs = movements.filter(m => m.prev !== undefined && m.next !== undefined && m.prev.col >= 3);
        expect(rightPairs[0]).toEqual({prev: prev[3], next: next[2]});
        expect(rightPairs[1]).toEqual({prev: prev[4], next: next[3]});
    });

    it('all keys exit when the row is absent in next', () => {
        const prev = [pos(1, 0), pos(1, 1)];
        const movements = pairKeysByPosition(prev, []);
        expect(movements).toHaveLength(2);
        movements.forEach(m => {
            expect(m.prev).toBeDefined();
            expect(m.next).toBeUndefined();
        });
    });

    it('all keys enter when the row is absent in prev', () => {
        const next = [pos(2, 0), pos(2, 1)];
        const movements = pairKeysByPosition([], next);
        expect(movements).toHaveLength(2);
        movements.forEach(m => {
            expect(m.prev).toBeUndefined();
            expect(m.next).toBeDefined();
        });
    });

    it('handles multiple rows independently', () => {
        const prev = [pos(0, 0), pos(0, 1), pos(1, 0), pos(1, 1)];
        const next = [pos(0, 0), pos(0, 1), pos(1, 0), pos(1, 1)];
        const movements = pairKeysByPosition(prev, next);
        expect(movements).toHaveLength(4);
        movements.forEach(m => {
            expect(m.prev!.row).toEqual(m.next!.row);
        });
    });
});
