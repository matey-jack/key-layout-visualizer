import {describe, expect, it} from 'vitest';

import {eb65LayoutModel as model} from "./eb65LayoutModel.ts";

describe('ergoPlank65LayoutModel', () => {
    const thirtyKeyMapping = model.thirtyKeyMapping!;
    it('thirtyKeyMapping row length', () => {
        expect(thirtyKeyMapping[0].length).toBe(16);
        expect(thirtyKeyMapping[1].length).toBe(15);
        expect(thirtyKeyMapping[2].length).toBe(15);
        expect(thirtyKeyMapping[3].length).toBe(16);
        expect(thirtyKeyMapping[4].length).toBe(14);

    })

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
