import {describe, expect, it} from "vitest";
import {allMappings} from "./mappings.ts";
import {qwertyMapping} from "./baseMappings.ts";
import {KEYMAP_TYPES, KeymapTypeId} from "../base-model.ts";
import {colemakMapping} from './colemakMappings.ts';

describe('new mappings property structure', () => {
    it('qwertyMapping has mappings property with Ansi30', () => {
        expect(qwertyMapping.mappings).toBeDefined();
        expect(qwertyMapping.mappings![KeymapTypeId.Ansi30]).toBeDefined();
    });

    it('colemakMapping has mappings property with Ansi30 and AnsiWide', () => {
        expect(colemakMapping.mappings).toBeDefined();
        expect(colemakMapping.mappings![KeymapTypeId.Ansi30]).toBeDefined();
        expect(colemakMapping.mappings![KeymapTypeId.AnsiWide]).toBeDefined();
    });
});

describe('mappings property validates against KEYMAP_TYPES', () => {
    const mappingsWithNewProperty = allMappings.filter(m => m.mappings);

    mappingsWithNewProperty.forEach((mapping) => {
        Object.entries(mapping.mappings!).forEach(([typeId, rows]) => {
            const keymapType = KEYMAP_TYPES[typeId as KeymapTypeId];
            const expectedKeysPerRow = keymapType.keysPerRow.filter((count) => count > 0);
            it(`${mapping.name} – ${typeId} – row count matches KEYMAP_TYPES`, () => {
                expect(keymapType, `Unknown keymap type: ${typeId}`).toBeDefined();
                expect(rows!.length, "number of rows").toBe(expectedKeysPerRow.length);
            });

            it(`${mapping.name} – ${typeId} – keys per row match KEYMAP_TYPES`, () => {
                expectedKeysPerRow.forEach((expected, rowIndex) => {
                    expect(rows![rowIndex].length, `row ${rowIndex}`).toBe(expected);
                });
            });
        });
    });
});

describe('character coverage for core mappings', () => {
    const allLetters = 'abcdefghijklmnopqrstuvwxyz';
    const requiredCharsAnsi30 = allLetters + ',.;/';
    const requiredCharsThumb30 = allLetters + ',.;-' ;
    
    describe('Ansi30 mappings have all letters and ",.;/"', () => {
        const ansi30Mappings = allMappings.filter(m => m.mappings?.[KeymapTypeId.Ansi30]);
        
        ansi30Mappings.forEach((mapping) => {
            it(`${mapping.name}`, () => {
                const ansi30String = mapping.mappings[KeymapTypeId.Ansi30]!.join('');
                const missingChars = requiredCharsAnsi30.split('').filter(char => !ansi30String.includes(char));
                expect(missingChars).toEqual([]);
            });
        });
    });

    describe('Thumb30 mappings have all letters and ",.;-"', () => {
        const thumb30Mappings = allMappings.filter(m => m.mappings?.[KeymapTypeId.Thumb30]);
        
        thumb30Mappings.forEach((mapping) => {
            it(`${mapping.name}`, () => {
                const thumb30String = mapping.mappings[KeymapTypeId.Thumb30]!.join('');
                const missingChars = requiredCharsThumb30.split('').filter(char => !thumb30String.includes(char));
                expect(missingChars).toEqual([]);
            }, { skip: mapping.name === 'Qweerty' });
        });
    });
});

