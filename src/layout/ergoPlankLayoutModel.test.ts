import {describe, expect, it} from 'vitest';

import {ergoPlankLayoutModel} from "./ergoPlankLayoutModel.ts";
import {fillMapping, getKeyPositions} from "./layout-functions.ts";
import {harmonic13WideLayoutModel} from "./harmonic13WideLayoutModel.ts";
import {qwertyMapping} from "../mapping/mappings.ts";

describe('ergoPlankLayoutModel', () => {
    it('thirtyKeyMapping row length', () => {
        const thirtyKeyMapping = ergoPlankLayoutModel.thirtyKeyMapping!;
        expect(thirtyKeyMapping[0].length).toBe(14)
        expect(thirtyKeyMapping[1].length).toBe(15)
        expect(thirtyKeyMapping[2].length).toBe(15)
        expect(thirtyKeyMapping[3].length).toBe(13)
        expect(thirtyKeyMapping[4].length).toBe(11)

    })

    it('thumb30KeyMapping row length', () => {
        const thumb30KeyMapping = ergoPlankLayoutModel.thumb30KeyMapping!;
        expect(thumb30KeyMapping[0].length).toBe(14)
        expect(thumb30KeyMapping[1].length).toBe(15)
        expect(thumb30KeyMapping[2].length).toBe(15)
        expect(thumb30KeyMapping[3].length).toBe(13)
        expect(thumb30KeyMapping[4].length).toBe(11)
    })

    it('mainFingerAssignment row length', () => {
        expect(ergoPlankLayoutModel.mainFingerAssignment[0].length).toBe(14)
        expect(ergoPlankLayoutModel.mainFingerAssignment[1].length).toBe(15)
        expect(ergoPlankLayoutModel.mainFingerAssignment[2].length).toBe(15)
        expect(ergoPlankLayoutModel.mainFingerAssignment[3].length).toBe(13)
        expect(ergoPlankLayoutModel.mainFingerAssignment[4].length).toBe(11)
    })

    it('singleKeyEffort row length', () => {
        expect(ergoPlankLayoutModel.singleKeyEffort[0].length).toBe(14)
        expect(ergoPlankLayoutModel.singleKeyEffort[1].length).toBe(15)
        expect(ergoPlankLayoutModel.singleKeyEffort[2].length).toBe(15)
        expect(ergoPlankLayoutModel.singleKeyEffort[3].length).toBe(13)
        expect(ergoPlankLayoutModel.singleKeyEffort[4].length).toBe(11)
    })

    it('has a gap in the merged mapping', () => {
        const charMap = fillMapping(ergoPlankLayoutModel, qwertyMapping)!;
        expect(charMap[1]).toEqual(['↹', 'q', 'w', 'e', 'r', 't', '-', null,  '=', 'y', 'u', 'i', 'o', 'p', '⏎']);
        const keyPositions = getKeyPositions(ergoPlankLayoutModel, false, charMap);
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
