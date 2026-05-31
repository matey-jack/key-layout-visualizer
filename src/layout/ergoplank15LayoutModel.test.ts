import {describe, expect, it} from 'vitest';
import {qwertyMapping} from "../mapping/baseMappings.ts";
import {ergoplank15LayoutModel} from "./ergoplank15LayoutModel.ts";
import {fillMapping, getKeyPositions} from "./layout-functions.ts";

describe('ergoPlank60LayoutModel', () => {
    it('has a gap in the merged mapping', () => {
        const charMap = fillMapping(ergoplank15LayoutModel, qwertyMapping)!;
        expect(charMap[1]).toEqual(['↹', 'q', 'w', 'e', 'r', 't', '-', null, '+', 'y', 'u', 'i', 'o', 'p', '\\']);
        const keyPositions = getKeyPositions(ergoplank15LayoutModel, false, charMap);
        // console.log(keyPositions.slice(14 + 5, 14 + 8));
        // the key after the gap
        expect(keyPositions[21].colPos).toEqual(9.25);
    });
});
