import {type FlexMapping, KeymapTypeId} from "../src/base-model.ts";
import {allMappings} from "../src/mapping/mappings.ts";
import {type KeyMap, printKeyTable} from "./key-columns.ts";

// The keymap types every layout model can take; each of the others belongs to one model family.
const genericKeymapTypes: KeymapTypeId[] = [
    KeymapTypeId.Ansi30, KeymapTypeId.Ansi32, KeymapTypeId.Thumb30, KeymapTypeId.Thumb32,
];

const isCharacterKey = (char: string) => !/[a-z0-9]/i.test(char);

const keysOf = (rows: string[]) => new Set([...rows.join("")].filter(isCharacterKey));

const germanMaps: KeyMap[] = allMappings.flatMap((mapping: FlexMapping) =>
    (Object.entries(mapping.mappings) as [KeymapTypeId, string[]][])
        .filter(([type, rows]) => !genericKeymapTypes.includes(type) && rows.join("").includes("ä"))
        .map(([type, rows]) => ({name: mapping.name, type, keys: keysOf(rows)})));

const union = printKeyTable("Non-letter keys of the German model-specific flex maps", germanMaps);
console.log(`\n  ${germanMaps.length} flex maps, ${union.length} keys.\n`);
