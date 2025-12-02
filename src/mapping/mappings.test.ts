import {describe, expect, it} from "vitest";
import {allMappings, colemakMapping, qwertyMapping} from "./mappings.ts";
import {KEYMAP_TYPES, KeymapTypeId} from "../base-model.ts";

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
            it(`${mapping.name} – ${typeId} – row count matches KEYMAP_TYPES`, () => {
                const keymapType = KEYMAP_TYPES[typeId as KeymapTypeId];
                expect(keymapType, `Unknown keymap type: ${typeId}`).toBeDefined();
                expect(rows!.length, "number of rows").toBe(keymapType.keysPerRow.length);
            });

            it(`${mapping.name} – ${typeId} – keys per row match KEYMAP_TYPES`, () => {
                const keymapType = KEYMAP_TYPES[typeId as KeymapTypeId];
                keymapType.keysPerRow.forEach((expected, rowIndex) => {
                    expect(rows![rowIndex].length, `row ${rowIndex}`).toBe(expected);
                });
            });
        });
    });
});