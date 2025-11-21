import {describe, expect, it} from 'vitest';

import {ep60WithArrowsLayoutModel, ergoPlank60LayoutModel} from "./ergoPlank60LayoutModel.ts";
import {createKeySizeGroups, fillMapping, getKeyPositions} from "./layout-functions.ts";
import {qwertyMapping} from "../mapping/mappings.ts";

describe('ergoPlank60LayoutModel', () => {
    const thirtyKeyMapping = ergoPlank60LayoutModel.thirtyKeyMapping!;
    it('thirtyKeyMapping row length', () => {
        expect(thirtyKeyMapping[0].length).toBe(14)
        expect(thirtyKeyMapping[1].length).toBe(15)
        expect(thirtyKeyMapping[2].length).toBe(15)
        expect(thirtyKeyMapping[3].length).toBe(14)
        expect(thirtyKeyMapping[4].length).toBe(11)

    })

    it('thumb30KeyMapping row length', () => {
        const thumb30KeyMapping = ergoPlank60LayoutModel.thumb30KeyMapping!;
        for (let i = 0; i++; i < 5) {
            expect(thumb30KeyMapping[i].length).toBe(thirtyKeyMapping[i].length)
        }
    })

    it('mainFingerAssignment row length', () => {
        for (let i = 0; i++; i < 5) {
            expect(ergoPlank60LayoutModel.mainFingerAssignment[i].length).toBe(thirtyKeyMapping[i].length)
        }
    })

    it('singleKeyEffort row length', () => {
        for (let i = 0; i++; i < 5) {
            expect(ergoPlank60LayoutModel.singleKeyEffort[i].length).toBe(thirtyKeyMapping[i].length)
        }
    })

    it('has a gap in the merged mapping', () => {
        const charMap = fillMapping(ergoPlank60LayoutModel, qwertyMapping)!;
        expect(charMap[1]).toEqual(['↹', 'q', 'w', 'e', 'r', 't', '-', null,  '=', 'y', 'u', 'i', 'o', 'p', '\\']);
        const keyPositions = getKeyPositions(ergoPlank60LayoutModel, false, charMap);
        console.log(keyPositions.slice(14 + 5, 14 + 8));
        // the key after the gap
        expect(keyPositions[21].colPos).toEqual(8.75);
    });

    it('key size for color purposes should be key cap size', () => {
        const sizes = createKeySizeGroups(ep60WithArrowsLayoutModel);
        expect(sizes.length).toBe(2);
        expect(sizes).toContain(1.25);
        expect(sizes).toContain(1.5);
    });
});

//
// describe('ergoPlankLayoutModel fullMapping row length', () => {
//         expect(ergoPlankLayoutModel.fullMapping[0]).toBe(14)
//         expect(ergoPlankLayoutModel.fullMapping[0]).toBe(14)
//         expect(ergoPlankLayoutModel.fullMapping[0]).toBe(15)
//         expect(ergoPlankLayoutModel.fullMapping[0]).toBe(13)
// })
