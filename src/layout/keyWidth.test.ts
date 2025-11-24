import {describe, it, expect, vi} from "vitest";
import {SymmetricKeyWidth, zeroIndent, MicroGapKeyWidths} from "./keyWidth.ts";
import {KeyboardRows} from "../base-model.ts";

describe('symmetric keyWidth gap position', () => {
   it('works with no gaps', () => {
       const sym = new SymmetricKeyWidth(5, zeroIndent);
       expect(sym.row(0, 1.5)).toEqual([1.5, 1, 1, 1.5]);
       expect(sym.row(0, 1)).toEqual([1, 1, 1, 1, 1]);
       expect(sym.row(0, 1, 2)).toEqual([1, 1, 1, 2]);
       expect(sym.row(0, 1.25, 1.75)).toEqual([1.25, 1, 1, 1.75]);
   });
   it('works with actual gaps in the keyboard center', () => {
       const sym = new SymmetricKeyWidth(5, zeroIndent);
       expect(sym.row(1, 1.25)).toEqual([1.25, 1, 0.5, 1, 1.25]);
       expect(sym.row(1, 1, 1.5)).toEqual([1, 1, 0.5, 1, 1.5]);
       expect(sym.row(1, 1.75)).toEqual([1.75, 1.5, 1.75]);
   });
});

describe('MicroGapKeyWidths', () => {
    it('applies micro-gaps only when a group width is provided', () => {
        const mGap = new MicroGapKeyWidths(
            KeyboardRows.Bottom,
            [NaN, 4],
            [[0.25], [1.25, 1.25, 1.25]],
        );
        expect(mGap.keyCapWidths).toEqual([0.25, 1.25, 1.25, 1.25]);
        expect(mGap.keyWidths).toHaveLength(4);
        expect(mGap.keyWidths[0]).toBe(0.25);
        mGap.keyWidths.slice(1).forEach((width) => {
            expect(width).toBeCloseTo(1.3333333333);
        });
    });

    it('returns key cap widths for its row and delegates for other rows', () => {
        const next = vi.fn().mockReturnValue(9);
        const mGap = new MicroGapKeyWidths(KeyboardRows.Home, [3], [[1.25, 1.25, 0.5]]);
        const keyCapWidth = mGap.keyCapWidthsFn(next);

        expect(keyCapWidth(KeyboardRows.Home, 1)).toBe(1.25);
        expect(next).not.toHaveBeenCalled();

        expect(keyCapWidth(KeyboardRows.Bottom, 0)).toBe(9);
        expect(next).toHaveBeenCalledWith(KeyboardRows.Bottom, 0);
    });
});
