import {describe, expect, it} from 'vitest';

import {ergoPlank60LayoutModel} from "./ergoPlank60LayoutModel.ts";
import {fillMapping, getKeyPositions} from "./layout-functions.ts";
import {qwertyMapping} from "../mapping/mappings.ts";

describe('ergoPlankLayoutModel', () => {
    it('thirtyKeyMapping row length', () => {
        const thirtyKeyMapping = ergoPlank60LayoutModel.thirtyKeyMapping!;
        expect(thirtyKeyMapping[0].length).toBe(14)
        expect(thirtyKeyMapping[1].length).toBe(15)
        expect(thirtyKeyMapping[2].length).toBe(15)
        expect(thirtyKeyMapping[3].length).toBe(14)
        expect(thirtyKeyMapping[4].length).toBe(11)

    })

    it('thumb30KeyMapping row length', () => {
        const thumb30KeyMapping = ergoPlank60LayoutModel.thumb30KeyMapping!;
        expect(thumb30KeyMapping[0].length).toBe(14)
        expect(thumb30KeyMapping[1].length).toBe(15)
        expect(thumb30KeyMapping[2].length).toBe(15)
        expect(thumb30KeyMapping[3].length).toBe(14)
        expect(thumb30KeyMapping[4].length).toBe(11)
    })

    it('mainFingerAssignment row length', () => {
        expect(ergoPlank60LayoutModel.mainFingerAssignment[0].length).toBe(14)
        expect(ergoPlank60LayoutModel.mainFingerAssignment[1].length).toBe(15)
        expect(ergoPlank60LayoutModel.mainFingerAssignment[2].length).toBe(15)
        expect(ergoPlank60LayoutModel.mainFingerAssignment[3].length).toBe(14)
        expect(ergoPlank60LayoutModel.mainFingerAssignment[4].length).toBe(11)
    })

    it('singleKeyEffort row length', () => {
        expect(ergoPlank60LayoutModel.singleKeyEffort[0].length).toBe(14)
        expect(ergoPlank60LayoutModel.singleKeyEffort[1].length).toBe(15)
        expect(ergoPlank60LayoutModel.singleKeyEffort[2].length).toBe(15)
        expect(ergoPlank60LayoutModel.singleKeyEffort[3].length).toBe(14)
        expect(ergoPlank60LayoutModel.singleKeyEffort[4].length).toBe(11)
    })

    it('has a gap in the merged mapping', () => {
        const charMap = fillMapping(ergoPlank60LayoutModel, qwertyMapping)!;
        expect(charMap[1]).toEqual(['↹', 'q', 'w', 'e', 'r', 't', '-', null,  '=', 'y', 'u', 'i', 'o', 'p', '\\']);
        const keyPositions = getKeyPositions(ergoPlank60LayoutModel, false, charMap);
        console.log(keyPositions.slice(14 + 5, 14 + 8));
        // the key after the gap
        expect(keyPositions[21].colPos).toEqual(8.75);
    });
});

//
// describe('ergoPlankLayoutModel fullMapping row length', () => {
//         expect(ergoPlankLayoutModel.fullMapping[0]).toBe(14)
//         expect(ergoPlankLayoutModel.fullMapping[0]).toBe(14)
//         expect(ergoPlankLayoutModel.fullMapping[0]).toBe(15)
//         expect(ergoPlankLayoutModel.fullMapping[0]).toBe(13)
// })
