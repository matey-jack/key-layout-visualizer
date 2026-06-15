import type {FrameMapping, LayoutModel} from '../base-model.ts';
import {mapValues} from '../library/records.ts';

function insertGaps(_id, mapping: FrameMapping): FrameMapping {
    const oldBottom = mapping[4];
    const pattern = [0, 1, 2, null, 3, 4, 5, 6, null, 7, 8, 9];
    return [
        ...mapping.slice(0, 4),
        pattern.map(x => x === null ? null : oldBottom[x]),
    ]
}
export function alignForHex(lm: LayoutModel): LayoutModel {
    const keyWidths = lm.keyWidths.map(row => row.map(_x => 1));
    return {
        ...lm,
        rowIndent: lm.keyWidths[0][0] > 1 ? [0.5, 0, 0.5, 0, 0.5] : [0, 0.5, 0, 0.5, 0],
        keyWidths: [...keyWidths.slice(0, 4), keyWidths[2]],
        frameMappings: mapValues(lm.frameMappings, insertGaps)
    };
}
