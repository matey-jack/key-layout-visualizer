/*
    Which character keys the 32-key frame mappings put on the board, and how much the layout models
    agree about them. The frame mapping holds everything a flex map does not: the punctuation, the
    number row, and the keys around the letter block.

    Of a frame mapping this counts only the character keys – it drops the cells that point into the
    flex map, and the labels that command something instead of inserting a character: the keyboard
    symbols and the modifier and other named keys. What remains is printed as one line per layout
    model, all on the same columns: the union of the keys, most widely shared first, with a blank
    where a model does not have that key.

    Every line names its keymap type. A model whose two frames carry the same keys has them on one
    line under both type names; the column order counts each of the two frames on its own either way.

    What those keys mean for the German Shift pairings is in scripts/german-frame-keys.ts.

    Run it with:
        npx tsx scripts/frame-map-keys.ts
 */
import {allLayoutModels} from "../src/all-layout-models.ts";
import {type FrameMapping, KeymapTypeId, type LayoutModel} from "../src/base-model.ts";
import {isKeyboardSymbol, isKeyName} from "../src/mapping/mapping-functions.ts";

// The keymap types a 32-key alphabet uses; a layout model may define either or both of them.
const frameKeymapTypes = [KeymapTypeId.Ansi32, KeymapTypeId.Thumb32];

// Only the character keys are of interest; Escape, Shift, Return and their like are not.
// A cell that is not a string points into the flex map or is a gap, and is no key of the frame.
const isCharacterKey = (label: string) =>
    label !== "" && !isKeyName(label) && !isKeyboardSymbol(label);

const keysOf = (frame: FrameMapping): Set<string> =>
    new Set(frame.flat().filter((cell) => typeof cell === "string" && isCharacterKey(cell)) as string[]);

const pad = (text: string, width: number) => text + " ".repeat(Math.max(0, width - text.length));

// One entry per frame mapping, which is what the column order counts.
const frames = allLayoutModels.flatMap((model: LayoutModel) =>
    frameKeymapTypes
        .filter((type) => model.frameMappings[type])
        .map((type) => ({model: model.name, type, keys: keysOf(model.frameMappings[type] as FrameMapping)})));

const count = (key: string) => frames.filter(({keys}) => keys.has(key)).length;

// Most widely shared first; among equally shared keys, Unicode order.
const union = [...new Set(frames.flatMap(({keys}) => [...keys]))]
    .sort((a, b) => count(b) - count(a) || a.codePointAt(0)! - b.codePointAt(0)!);

// A key label is usually one character, but `` `~ `` names its key by both of its levels, so each
// column is as wide as the label it stands for and a missing key blanks out that same width.
const line = (keys: Set<string>) => union.map((key) => keys.has(key) ? key : " ".repeat(key.length)).join("");

// The two keymap types of a model mostly carry the same keys, and then they share a line.
const linesOf = (model: string) => {
    const byKeys = new Map<string, KeymapTypeId[]>();
    for (const frame of frames.filter((f) => f.model === model)) {
        const key = line(frame.keys);
        byKeys.set(key, [...(byKeys.get(key) ?? []), frame.type]);
    }
    return [...byKeys].map(([keys, types]) => [types.join(", "), keys]);
};

const models = [...new Set(frames.map(({model}) => model))];
const nameWidth = Math.max(...models.map((name) => name.length)) + 2;
const typeWidth = frameKeymapTypes.join(", ").length + 2;

const shared = union.filter((key) => count(key) === frames.length);

console.log("\nCharacter keys of the 32-key frame mappings");
console.log("==========================================\n");
console.log(`  ${pad("every key, in column order", nameWidth + typeWidth)}${line(new Set(union))}`);
for (const model of models) {
    for (const [types, keys] of linesOf(model)) {
        console.log(`  ${pad(model, nameWidth)}${pad(types, typeWidth)}${keys}`);
    }
}
console.log(shared.length > 0
    ? `\n  ${pad(`on all ${frames.length} of them`, nameWidth + typeWidth)}${line(new Set(shared))}`
    : `\n  No key is on every one of them.`);
console.log(`\n  ${frames.length} frame mappings of ${models.length} layout models, ${union.length} keys.\n`);
