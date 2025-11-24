import {describe, it, expect} from "vitest";
import {SymmetricKeyWidth, zeroIndent} from "./keyWidth.ts";

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