import {describe, expect, it} from 'vitest';

import {ergoPlankLayoutModel} from "./ergoPlankLayoutModel.ts";

describe('ergoPlankLayoutModel', () => {
    it('thirtyKeyMapping row length', () => {
        expect(ergoPlankLayoutModel.thirtyKeyMapping[0].length).toBe(14)
        expect(ergoPlankLayoutModel.thirtyKeyMapping[1].length).toBe(14)
        expect(ergoPlankLayoutModel.thirtyKeyMapping[2].length).toBe(15)
        expect(ergoPlankLayoutModel.thirtyKeyMapping[3].length).toBe(13)
        expect(ergoPlankLayoutModel.thirtyKeyMapping[4].length).toBe(12)

    })

    it('thumb30KeyMapping row length', () => {
        expect(ergoPlankLayoutModel.thumb30KeyMapping[0].length).toBe(14)
        expect(ergoPlankLayoutModel.thumb30KeyMapping[1].length).toBe(14)
        expect(ergoPlankLayoutModel.thumb30KeyMapping[2].length).toBe(15)
        expect(ergoPlankLayoutModel.thumb30KeyMapping[3].length).toBe(13)
        expect(ergoPlankLayoutModel.thumb30KeyMapping[4].length).toBe(12)
    })

    it('mainFingerAssignment row length', () => {
        expect(ergoPlankLayoutModel.mainFingerAssignment[0].length).toBe(14)
        expect(ergoPlankLayoutModel.mainFingerAssignment[1].length).toBe(14)
        expect(ergoPlankLayoutModel.mainFingerAssignment[2].length).toBe(15)
        expect(ergoPlankLayoutModel.mainFingerAssignment[3].length).toBe(13)
        expect(ergoPlankLayoutModel.mainFingerAssignment[4].length).toBe(12)
    })

    it('singleKeyEffort row length', () => {
        expect(ergoPlankLayoutModel.singleKeyEffort[0].length).toBe(14)
        expect(ergoPlankLayoutModel.singleKeyEffort[1].length).toBe(14)
        expect(ergoPlankLayoutModel.singleKeyEffort[2].length).toBe(15)
        expect(ergoPlankLayoutModel.singleKeyEffort[3].length).toBe(13)
        expect(ergoPlankLayoutModel.singleKeyEffort[4].length).toBe(12)
    })
})

//
// describe('ergoPlankLayoutModel fullMapping row length', () => {
//         expect(ergoPlankLayoutModel.fullMapping[0]).toBe(14)
//         expect(ergoPlankLayoutModel.fullMapping[0]).toBe(14)
//         expect(ergoPlankLayoutModel.fullMapping[0]).toBe(15)
//         expect(ergoPlankLayoutModel.fullMapping[0]).toBe(13)
// })
