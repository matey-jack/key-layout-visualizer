import {deserialize, serialize} from '@kcf-hub/kle-serial';
import {describe, expect, it} from 'vitest';
import {ansiIBMLayoutModel} from './layout/ansiLayoutModel.ts';
import {ergoboardCentralLayoutModel} from './layout/ergoboardCentralLayoutModel.ts';
import {ergoboardVerticalEnterLayoutModel} from './layout/ergoboardNarrowLayoutModels.ts';
import {fillMapping, getKeyPositions} from './layout/layout-functions.ts';
import {buildKle, kleJson} from './kle-export.ts';
import {qwertyMapping} from './mapping/baseMappings.ts';
import {colemakMapping} from './mapping/colemakMappings.ts';
import {quipperThumbyMapping} from './mapping/mappings.ts';

describe('KLE export', () => {
    it('exports every key the layout draws', () => {
        const keyboard = buildKle(ergoboardCentralLayoutModel, colemakMapping, {})!;
        const positions = getKeyPositions(
            ergoboardCentralLayoutModel, false, fillMapping(ergoboardCentralLayoutModel, colemakMapping)!
        );

        expect(keyboard.keys.length).toBe(positions.length);
        expect(keyboard.keys.map((key) => key.labels[4])).toEqual(positions.map((p) => p.label));
        expect(keyboard.meta.name).toBe('Ergoboard with Central Arrows — Colemak');
    });

    it('starts the board at the origin', () => {
        const keyboard = buildKle(ergoboardCentralLayoutModel, colemakMapping, {})!;

        expect(Math.min(...keyboard.keys.map((key) => key.x))).toBe(0);
        expect(Math.min(...keyboard.keys.map((key) => key.y))).toBe(0);
    });

    it('carries the height of a key spanning two rows', () => {
        const keyboard = buildKle(ergoboardVerticalEnterLayoutModel, qwertyMapping, {})!;

        const tall = keyboard.keys.filter((key) => key.height !== 1);
        expect(tall.map((key) => [key.labels[4], key.height])).toEqual([['⏎', 2]]);
    });

    /*
        w2/h2 describe the notch of an L-shaped key. Their serialized defaults are the key's own
        width and height, so getting them wrong writes two properties onto every single key.
     */
    it('leaves the secondary rectangle out of the file', () => {
        const json = kleJson(ergoboardCentralLayoutModel, colemakMapping, {})!;

        expect(json).not.toContain('"w2"');
        expect(json).not.toContain('"h2"');
    });

    it('survives a round trip through the KLE format', () => {
        const keyboard = buildKle(ergoboardCentralLayoutModel, colemakMapping, {})!;

        const restored = deserialize(serialize(keyboard));

        expect(restored.keys.map((key) => [key.x, key.y, key.width, key.height, key.color]))
            .toEqual(keyboard.keys.map((key) => [key.x, key.y, key.width, key.height, key.color]));
        expect(restored.keys.map((key) => key.labels.find((label) => label)))
            .toEqual(keyboard.keys.map((key) => key.labels[4] || undefined));
    });

    it('has nothing to offer for a mapping the layout cannot hold', () => {
        expect(buildKle(ansiIBMLayoutModel, quipperThumbyMapping, {})).toBeNull();
        expect(kleJson(ansiIBMLayoutModel, quipperThumbyMapping, {})).toBeNull();
    });
});
