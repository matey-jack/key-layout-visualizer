import {describe, expect, it} from 'vitest';
import {ergoPlank60LayoutModel} from "./ergoPlank60LayoutModel.ts";
import {fillMapping, getKeyPositions} from "./layout-functions.ts";
import {qwertyMapping} from "../mapping/baseMappings.ts";

describe('ergoPlank60LayoutModel', () => {
    it('has a gap in the merged mapping', () => {
        const charMap = fillMapping(ergoPlank60LayoutModel, qwertyMapping)!;
        expect(charMap[1]).toEqual(['↹', 'q', 'w', 'e', 'r', 't', '-', null, '=', 'y', 'u', 'i', 'o', 'p', '\\']);
        const keyPositions = getKeyPositions(ergoPlank60LayoutModel, false, charMap);
        // console.log(keyPositions.slice(14 + 5, 14 + 8));
        // the key after the gap
        expect(keyPositions[21].colPos).toEqual(9.25);
    });
});
