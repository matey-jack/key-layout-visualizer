import {type FlexMapping, GENERIC_KEYMAP_TYPES, type KeymapTypeId} from "../src/base-model.ts";
import {allMappings} from "../src/mapping/mappings.ts";
import {isTableKey, type KeyMap, printKeyTable} from "./key-columns.ts";

const keysOf = (rows: string[]) => new Set([...rows.join("")].filter(isTableKey));

const germanMaps: KeyMap[] = allMappings.flatMap((mapping: FlexMapping) =>
    (Object.entries(mapping.mappings) as [KeymapTypeId, string[]][])
        .filter(([type, rows]) => !GENERIC_KEYMAP_TYPES.includes(type) && rows.join("").includes("ä"))
        .map(([type, rows]) => ({name: mapping.name, type, keys: keysOf(rows)})));

const union = printKeyTable("Non-letter keys of the German model-specific flex maps", germanMaps);
console.log(`\n  ${germanMaps.length} flex maps, ${union.length} keys.\n`);
