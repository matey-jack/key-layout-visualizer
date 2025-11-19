import {describe, expect, it} from 'vitest';

import {ep65MidshiftLayoutModel as model} from "./eb65MidshiftLayoutModel.ts";
import {sum} from "../library/math.ts";

describe('ep65MidshiftLayoutModel', () => {
    const thirtyKeyMapping = model.thirtyKeyMapping!;
    it('thirtyKeyMapping row length', () => {
        expect(thirtyKeyMapping[0].length).toBe(15);
        expect(thirtyKeyMapping[1].length).toBe(15); // including gap
        expect(thirtyKeyMapping[2].length).toBe(15);
        expect(thirtyKeyMapping[3].length).toBe(17); // including several gaps
        expect(thirtyKeyMapping[4].length).toBe(14);

    })

    it('row width', () => {
       const rowWidth = (row: number)  => (
           2 * model.rowStart(row) + sum(model.thirtyKeyMapping![row].map((_, col) => model.keyWidth(row, col)))
       );
        for (let i = 0; i < 5; i++) {
            expect(rowWidth(i), `row ${i}`).toEqual(16);
        }
    });

    it('thumb30KeyMapping row length', () => {
        for (let i = 0; i < 5; i++) {
            expect(model.thumb30KeyMapping![i].length, `row ${i}`).toBe(thirtyKeyMapping[i].length);
        }
    })

    it('mainFingerAssignment row length', () => {
        for (let i = 0; i < 5; i++) {
            expect(model.mainFingerAssignment[i].length, `row ${i}`).toBe(thirtyKeyMapping[i].length);
        }
    })

    it('singleKeyEffort row length', () => {
        for (let i = 0; i < 5; i++) {
            expect(model.singleKeyEffort[i].length, `row ${i}`).toBe(thirtyKeyMapping[i].length);
        }
    })
});
