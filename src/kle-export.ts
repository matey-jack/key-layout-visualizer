import {type KleKey, type KleKeyboardMetadata, serialize} from '@kcf-hub/kle-serial';
import type {FlexMapping, LayoutModel} from './base-model.ts';
import  {isSplit, type LayoutOptions} from './app-model.ts';
import {fillMapping, getKeyPositions} from './layout/layout-functions.ts';
import {ergoboardCentralLayoutModel} from './layout/ergoboardCentralLayoutModel.ts';
import {colemakMapping} from './mapping/colemakMappings.ts';

const basicMetadata: KleKeyboardMetadata = {
    author: "Robert Jack Will",
    notes: "https://matey-jack.github.io/key-layout-visualizer",
    radii: "20px",
    name: "Ergoplank",
    backcolor: "black",
    background: null,
    switchBrand: "Kailh",
    switchMount: "hotswap or solder?",
    switchType: "Choc v1",

}

export function buildKle(layout: LayoutModel, mapping: FlexMapping, options: Partial<LayoutOptions>) {
    const charMap = fillMapping(layout, mapping);
    const positions = getKeyPositions(layout, isSplit(options), charMap!);
    const keys: KleKey[] = positions.map( (pos) => ({
        labels: [pos.label],
        x: pos.colPos,
        y: pos.row,
    }))
    return {
        meta: basicMetadata,
        keys,
    }
}

const prepared = buildKle(ergoboardCentralLayoutModel, colemakMapping, {})
const kleData = serialize(prepared as any);

import { writeFileSync } from 'fs';

writeFileSync('kle.json', JSON.stringify(kleData, null, 2), 'utf-8');
