/*
    Which flex maps carry a keymap for a specific layout model, next to (or instead of) the generic
    30- and 32-key ones – the English ones, since a model-specific keymap is where a mapping can
    place punctuation of its own.

    The German counterpart of this question – how the keys a board offers a German map differ from
    the standard German Shift pairings – is in scripts/german-frame-keys.ts.

    Run it with:
        npx tsx scripts/flex-map-inventory.ts
 */
import {type FlexMapping, KeymapTypeId} from "../src/base-model.ts";
import {isAnsiCharMap} from "../src/mapping/key-levels.ts";
import {allMappings} from "../src/mapping/mappings.ts";

// The keymap types every layout model can take; each of the others belongs to one model family.
const genericKeymapTypes: KeymapTypeId[] = [
    KeymapTypeId.Ansi30, KeymapTypeId.Ansi32, KeymapTypeId.Thumb30, KeymapTypeId.Thumb32,
];

// A flex map row holds one character per key, which is the char map shape isAnsiCharMap reads.
const isGerman = (mapping: FlexMapping): boolean =>
    !Object.values(mapping.mappings).every((rows) => isAnsiCharMap(rows.map((row) => [...row])));

const pad = (text: string, width: number) => text + " ".repeat(Math.max(0, width - text.length));

const english = allMappings.filter((mapping) => !isGerman(mapping));
const modelSpecific = english
    .map((mapping) => [
        mapping,
        (Object.keys(mapping.mappings) as KeymapTypeId[]).filter((type) => !genericKeymapTypes.includes(type)),
    ] as const)
    .filter(([, types]) => types.length > 0);

console.log("\nEnglish flex maps with a keymap for a specific layout model");
console.log("==========================================================\n");
for (const [mapping, types] of modelSpecific) {
    console.log(`  ${pad(mapping.name, 32)}${types.join(", ")}`);
}
console.log(`\n  ${modelSpecific.length} of ${english.length} English flex maps.\n`);
