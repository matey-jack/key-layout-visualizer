import {allLayoutModels} from "../src/all-layout-models.ts";
import {type FrameMapping, KeymapTypeId, type LayoutModel} from "../src/base-model.ts";
import {isTableKey, type KeyMap, printKeyTable} from "./lib/key-columns.ts";
import {isCharacterKey} from "../src/mapping/mapping-functions.ts";

// The keymap types a 32-key alphabet uses; a layout model may define either or both of them.
const frameKeymapTypes = [KeymapTypeId.Ansi32, KeymapTypeId.Thumb32];

const keysOf = (frame: FrameMapping): Set<string> =>
    new Set(frame.flat().filter((cell) => typeof cell === "string" && isTableKey(cell) && isCharacterKey(cell)) as string[]);

const frames: KeyMap[] = allLayoutModels.flatMap((model: LayoutModel) =>
    frameKeymapTypes
        .filter((type) => model.frameMappings[type])
        .map((type) => ({name: model.name, type, keys: keysOf(model.frameMappings[type] as FrameMapping)})));

// The two keymap types of a model mostly carry the same keys, and then they share a line.
const rows: KeyMap[] = [...new Set(frames.map(({name}) => name))].flatMap((name) => {
    const byKeys = new Map<string, KeyMap[]>();
    for (const frame of frames.filter((f) => f.name === name)) {
        const id = [...frame.keys].sort().join("");
        byKeys.set(id, [...(byKeys.get(id) ?? []), frame]);
    }
    return [...byKeys.values()].map((group) => ({
        name, type: group.map(({type}) => type).join(", "), keys: group[0].keys,
    }));
});

const union = printKeyTable("Character keys of the 32-key frame mappings", frames, rows);
console.log(`\n  ${frames.length} frame mappings of ${rows.length} lines, ${union.length} keys.\n`);
