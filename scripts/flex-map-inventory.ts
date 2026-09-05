import {type FlexMapping, GENERIC_KEYMAP_TYPES, type KeymapTypeId} from "../src/base-model.ts";
import {isAnsiCharMap} from "../src/mapping/key-levels.ts";
import {allMappings} from "../src/mapping/mappings.ts";
import {pad} from "./key-columns.ts";

/*
    A map is English when every keymap it defines draws the ANSI character set. `isAnsiCharMap` is
    not the other alphabets' negation – a Danish or German 32-key map is neither – but that does not
    matter here: those maps have no ANSI keymap at all, so they never pass this test.
    A flex map row holds one character per key, which is the char map shape isAnsiCharMap reads.
 */
const isEnglish = (mapping: FlexMapping): boolean =>
    Object.values(mapping.mappings).every((rows) => isAnsiCharMap(rows.map((row) => [...row])));

const english = allMappings.filter(isEnglish);
const modelSpecific = english
    .map((mapping) => [
        mapping,
        (Object.keys(mapping.mappings) as KeymapTypeId[]).filter((type) => !GENERIC_KEYMAP_TYPES.includes(type)),
    ] as const)
    .filter(([, types]) => types.length > 0);

console.log("\nEnglish flex maps with a keymap for a specific layout model");
console.log("==========================================================\n");
for (const [mapping, types] of modelSpecific) {
    console.log(`  ${pad(mapping.name, 32)}${types.join(", ")}`);
}
console.log(`\n  ${modelSpecific.length} of ${english.length} English flex maps.\n`);
