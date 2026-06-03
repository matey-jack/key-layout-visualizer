import {type KleKey, type KleKeyboardMetadata, KleKeyboard, serialize} from '@kcf-hub/kle-serial';
import type {FlexMapping, LayoutModel} from './base-model.ts';
import  {isSplit, type LayoutOptions} from './app-model.ts';
import {fillMapping, getKeyPositions} from './layout/layout-functions.ts';
import {ergoboardCentralLayoutModel} from './layout/ergoboardCentralLayoutModel.ts';
import {colemakMapping} from './mapping/colemakMappings.ts';
import { writeFileSync } from 'node:fs';

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

export function buildKle(layout: LayoutModel, mapping: FlexMapping, options: Partial<LayoutOptions>): KleKeyboard {
    const charMap = fillMapping(layout, mapping);
    const positions = getKeyPositions(layout, isSplit(options), charMap!);
    const leftEdge = Math.min(...positions.map( p => p.colPos));
    const keys: KleKey[] = positions.map( (pos) => ({
        x: pos.colPos - leftEdge,
        y: pos.row,
        width: pos.keyCapWidth,
        // TODO: get height from wherever it's stored
        height: 1,
        labels: [
            // it's a 3×3 matrix, but we fill only enough to reach the center
            "", "", "",
            "", pos.label
        ],
        // TODO: get from layout.keyColorClass plus the CSS
        color: "",
        textColor: [],
        textSize: [],
        default: {
            textColor: "",
            textSize: 0,
        },
        x2: 0,
        y2: 0,
        width2: 0,
        height2: 0,
        rotation_x: 0,
        rotation_y: 0,
        rotation_angle: 0,
        decal: false,
        ghost: false,
        stepped: false,
        nub: false,
        profile: "",
        sm: "",
        sb: "",
        st: "",
        f2: undefined,
        align: undefined,
    }))
    const keyboard = new KleKeyboard();
    keyboard.meta = basicMetadata;
    keyboard.keys = keys;
    return keyboard;
}

const prepared = buildKle(ergoboardCentralLayoutModel, colemakMapping, {})
const kleData = serialize(prepared);

writeFileSync('kle.json', JSON.stringify(kleData, null, 2), 'utf-8');
