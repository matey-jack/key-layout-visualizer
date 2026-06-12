import {describe, expect, it} from 'vitest';
import {pairKeysByPosition} from './functions.ts';
import {type LayoutModel} from '../base-model.ts';
import {getKeyPositions} from '../layout/layout-functions.ts';

function makeTestModel(keyWidths: number[][]): LayoutModel {
    return {
        name: '', description: '',
        rowIndent: [0, 0, 0, 0, 0],
        keyWidths,
        leftHomeIndex: 0, rightHomeIndex: 0,
        staggerOffsets: [],
        symmetricStagger: false,
        frameMappings: {},
        mainFingerAssignment: keyWidths.map(row => row.map(() => null)),
        singleKeyEffort: keyWidths.map(row => row.map(() => 0)),
    };
}

describe('pairKeysByPosition', () => {
    it('pairs same-length row 1:1 from left to right', () => {
        const model = makeTestModel([[1, 1, 1]]);
        const fullLayout = [['a', 'b', 'c']];
        const prev = getKeyPositions(model, false, fullLayout);
        const next = getKeyPositions(model, false, fullLayout);
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
        const prev = getKeyPositions(makeTestModel([[1, 1, 1, 1]]), false, [['', '', '', '']]);
        const next = getKeyPositions(makeTestModel([[1, 1, 1, 1, 1]]), false, [['', '', '', '', '']]);
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
        const prev = getKeyPositions(makeTestModel([[1, 1, 1, 1, 1]]), false, [['', '', '', '', '']]);
        const next = getKeyPositions(makeTestModel([[1, 1, 1, 1]]), false, [['', '', '', '']]);
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
        const prev = getKeyPositions(makeTestModel([[1, 1]]), false, [['', '']]);
        const movements = pairKeysByPosition(prev, []);
        expect(movements).toHaveLength(2);
        movements.forEach(m => {
            expect(m.prev).toBeDefined();
            expect(m.next).toBeUndefined();
        });
    });

    it('all keys enter when the row is absent in prev', () => {
        const next = getKeyPositions(makeTestModel([[1, 1]]), false, [['', '']]);
        const movements = pairKeysByPosition([], next);
        expect(movements).toHaveLength(2);
        movements.forEach(m => {
            expect(m.prev).toBeUndefined();
            expect(m.next).toBeDefined();
        });
    });

    it('handles multiple rows independently', () => {
        const model = makeTestModel([[1, 1], [1, 1]]);
        const fullLayout = [['', ''], ['', '']];
        const prev = getKeyPositions(model, false, fullLayout);
        const next = getKeyPositions(model, false, fullLayout);
        const movements = pairKeysByPosition(prev, next);
        expect(movements).toHaveLength(4);
        movements.forEach(m => {
            expect(m.prev!.row).toEqual(m.next!.row);
        });
    });

    it('labeled keys pair by label value regardless of column position', () => {
        // prev: ['x', '']  →  'x' at col 0, unlabeled at col 1
        // next: ['', 'x']  →  unlabeled at col 0, 'x' at col 1
        // 'x' anchors the pairing; the unlabeled keys fall in different gaps on each side
        const prev = getKeyPositions(makeTestModel([[1, 1]]), false, [['x', '']]);
        const next = getKeyPositions(makeTestModel([[1, 1]]), false, [['', 'x']]);
        const movements = pairKeysByPosition(prev, next);
        expect(movements).toHaveLength(3);
        const labeled = movements.filter(m => m.prev !== undefined && m.next !== undefined);
        expect(labeled).toHaveLength(1);
        expect(labeled[0].prev!.label).toEqual('x');
        expect(labeled[0].next!.label).toEqual('x');
        // unlabeled key in prev (right of 'x') exits; unlabeled key in next (left of 'x') enters
        expect(movements.filter(m => m.next === undefined)).toHaveLength(1);
        expect(movements.filter(m => m.prev === undefined)).toHaveLength(1);
    });

    it('pairs labeled keys first, then unlabeled gaps from anchors inward (TODO example)', () => {
        // prev: ['', '1', '2', '3', '', '', '4', '5', '6', '']
        // next: ['1', '2', '3', '', '', '', '4', '5', '6']
        // labeled pairs: 1↔1, 2↔2, 3↔3, 4↔4, 5↔5, 6↔6
        // left edge: prev col 0 exits
        // interior gap ('3'→'4'): prev[4]↔next[3], next[4] enters, prev[5]↔next[5]
        // right edge: prev col 9 exits
        const prev = getKeyPositions(makeTestModel([[1, 1, 1, 1, 1, 1, 1, 1, 1, 1]]), false,
            [['', '1', '2', '3', '', '', '4', '5', '6', '']]);
        const next = getKeyPositions(makeTestModel([[1, 1, 1, 1, 1, 1, 1, 1, 1]]), false,
            [['1', '2', '3', '', '', '', '4', '5', '6']]);
        const movements = pairKeysByPosition(prev, next);
        expect(movements).toHaveLength(11);
        // all labeled keys pair with their label match
        const labeled = movements.filter(m => m.prev?.label && m.next?.label);
        expect(labeled).toHaveLength(6);
        labeled.forEach(m => expect(m.prev!.label).toEqual(m.next!.label));
        // edge unlabeled keys exit
        const exiting = movements.filter(m => m.next === undefined);
        expect(exiting).toHaveLength(2);
        expect(exiting.map(m => m.prev!.col).sort((a, b) => a - b)).toEqual([0, 9]);
        // one unlabeled key enters in the middle of the interior gap (next col 4)
        const entering = movements.filter(m => m.prev === undefined);
        expect(entering).toHaveLength(1);
        expect(entering[0].next!.col).toEqual(4);
    });
});
