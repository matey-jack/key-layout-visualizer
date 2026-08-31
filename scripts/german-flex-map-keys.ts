/*
    Which non-letter keys the German model-specific flex maps have in common, and which ones only
    some of them carry. A model-specific keymap is the one place where a mapping places keys of its
    own, so this is where the German maps can drift apart from each other.

    Every flex map holding an `ä` is a German one. Of their keys this drops `a`-`z` and the digits
    (the umlauts and `ß` are none of those, and so stay), then prints one line per flex map, all of
    them on the same columns: the union of the remaining keys, most widely shared first, each map
    showing a blank where it does not have that key.

    The frame-mapping side of the German maps – the punctuation a layout model hands them – is in
    scripts/german-frame-keys.ts.

    Run it with:
        npx tsx scripts/german-flex-map-keys.ts
 */
import {type FlexMapping, KeymapTypeId} from "../src/base-model.ts";
import {allMappings} from "../src/mapping/mappings.ts";

// The keymap types every layout model can take; each of the others belongs to one model family.
const genericKeymapTypes: KeymapTypeId[] = [
    KeymapTypeId.Ansi30, KeymapTypeId.Ansi32, KeymapTypeId.Thumb30, KeymapTypeId.Thumb32,
];

// The keys this comparison is about: neither a Latin letter of the base alphabet nor a digit.
const isCompared = (char: string) => !/[a-z0-9]/i.test(char);

const keysOf = (rows: string[]) => new Set([...rows.join("")].filter(isCompared));

const pad = (text: string, width: number) => text + " ".repeat(Math.max(0, width - text.length));

// One entry per model-specific keymap of a German flex map – two keymaps of the same mapping are
// two lines here, since each of them places its own keys.
const germanMaps = allMappings.flatMap((mapping: FlexMapping) =>
    (Object.entries(mapping.mappings) as [KeymapTypeId, string[]][])
        .filter(([type, rows]) => !genericKeymapTypes.includes(type) && rows.join("").includes("ä"))
        .map(([type, rows]) => ({name: `${mapping.name} / ${type}`, keys: keysOf(rows)})));

const count = (char: string) => germanMaps.filter(({keys}) => keys.has(char)).length;

// Most widely shared first; among equally shared keys, Unicode order.
const union = [...new Set(germanMaps.flatMap(({keys}) => [...keys]))]
    .sort((a, b) => count(b) - count(a) || a.codePointAt(0)! - b.codePointAt(0)!);

const nameWidth = Math.max(...germanMaps.map(({name}) => name.length)) + 2;

console.log("\nNon-letter keys of the German model-specific flex maps");
console.log("=====================================================\n");
for (const {name, keys} of germanMaps) {
    console.log(`  ${pad(name, nameWidth)}${union.map((char) => keys.has(char) ? char : " ").join("")}`);
}
console.log(`\n  ${pad("shared by all " + germanMaps.length, nameWidth)}`
    + `${union.map((char) => count(char) === germanMaps.length ? char : " ").join("")}`);
console.log(`\n  ${germanMaps.length} flex maps, ${union.length} keys.\n`);
