import {describe, expect, it} from "vitest";
import {KEYMAP_TYPES, KeymapTypeId} from "../base-model.ts";
import {qwertyMapping} from "./baseMappings.ts";
import {colemakMapping} from './colemakMappings.ts';
import {allMappings} from "./mappings.ts";

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
    allMappings.forEach((mapping) => {
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

    /*
        A 32-key map holds the 26 Latin letters, the three punctuation characters that no frame
        mapping carries, and three letters of its own language – äöü for German, æøå for Danish,
        and so on. Which three those are is the map's choice, so we only count them and check that
        they are letters. Counting occurrences also catches a map that repeats a required character
        instead of spending the spot on a letter of its own.
     */
    const requiredChars32 = allLetters + ',.-';

    [KeymapTypeId.Ansi32, KeymapTypeId.Thumb32].forEach((typeId) => {
        describe(`${typeId} mappings have all letters, ",.-", and three language-specific letters`, () => {
            allMappings.filter(m => m.mappings?.[typeId]).forEach((mapping) => {
                it(`${mapping.name}`, () => {
                    const chars = [...mapping.mappings[typeId]!.join('')];
                    const missing = requiredChars32.split('').filter(c => !chars.includes(c));
                    expect(missing, 'missing required characters').toEqual([]);
                    const ownLetters = chars.filter(c => !requiredChars32.includes(c));
                    expect(ownLetters.filter(c => !/\p{L}/u.test(c)), 'not a letter').toEqual([]);
                    expect(ownLetters.length, 'language-specific letters').toBe(3);
                });
            });
        });
    });

    describe('Thumb30 mappings have all letters and ",.;-"', () => {
        const thumb30Mappings = allMappings.filter(m => m.mappings?.[KeymapTypeId.Thumb30]);
        
        thumb30Mappings.forEach((mapping) => {
            it.skipIf(mapping.name === 'Qweerty')(`${mapping.name}`, () => {
                const thumb30String = mapping.mappings[KeymapTypeId.Thumb30]!.join('');
                const missingChars = requiredCharsThumb30.split('').filter(char => !thumb30String.includes(char));
                expect(missingChars).toEqual([]);
            });
        });
    });
});

