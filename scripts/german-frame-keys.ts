/*
    The frame-mapping half of the "fix some of the German keymaps" work item in docs/key-levels.md:
    a German key map draws its punctuation from the 32-key frame mapping of the layout model, so
    that is where the keys standard German has no pairing for come from.

    For every layout model this compares the character keys of its `ansi32` and `thumb32` frame
    mappings against the base-level keys the standard German Shift pairings name. `,` `.` `-` are
    left out: they come from the flex map, where the layout tests already assert them.

    Run it with:
        npx tsx scripts/german-frame-keys.ts
 */
import {allLayoutModels} from "../src/all-layout-models.ts";
import {type FrameMapping, KeymapTypeId, type LayoutModel} from "../src/base-model.ts";
import {germanShiftPairs, hasNumberRow} from "../src/mapping/key-levels.ts";
import {isKeyboardSymbol, isKeyName} from "../src/mapping/mapping-functions.ts";

// The keymap types a German flex map uses; every German mapping defines one or both of them.
const germanKeymapTypes = [KeymapTypeId.Ansi32, KeymapTypeId.Thumb32];

// The base characters the pairings name, minus the three the flex map contributes.
const germanBaseKeys = [...new Set(Object.values(germanShiftPairs).map((pair) => pair[0]))]
    .filter((char) => !",.-".includes(char)).sort();

// A frame mapping cell is a literal key label, or a number / [row, col] pointing into the flex map.
const frameLabels = (frame: FrameMapping): string[] =>
    [...new Set(frame.flat().filter((cell) => typeof cell === "string" && cell !== ""))] as string[];

// Only the character keys are up for a Shift pairing; Escape, Return and their like are not.
const isCharacterKey = (label: string) => !isKeyName(label) && !isKeyboardSymbol(label);

/*
    How one frame mapping deviates from the German pairings:
     - unpaired: keys the pairings don't know at all, so they show no Shift character;
     - relabelled: keys the pairings read as another one, whose base character then replaces the
       drawn label (`` `~ `` is the `^°` key, `'` is the `#` key);
     - absent: pairing keys the frame places nowhere, counting a relabelled key for the one it
       stands in for.
 */
function germanDiff(frame: FrameMapping): string {
    const drawn = frameLabels(frame).filter(isCharacterKey).sort();
    const paired = drawn.filter((label) => germanShiftPairs[label] !== undefined);
    const placed = new Set(paired.map((label) => germanShiftPairs[label][0]));
    const parts = [
        ["unpaired", drawn.filter((label) => germanShiftPairs[label] === undefined)],
        ["relabelled", paired.filter((label) => germanShiftPairs[label][0] !== label)
            .map((label) => `${label}→${germanShiftPairs[label]}`)],
        ["absent", germanBaseKeys.filter((char) => !placed.has(char))],
    ] as const;
    const shown = parts.filter(([, keys]) => keys.length > 0)
        .map(([name, keys]) => `${name}: ${keys.join(" ")}`);
    return shown.length > 0 ? shown.join("   ") : "as the pairings have it";
}

// The two frame mappings usually deviate in the same way, and then they share a line.
function diffLines(model: LayoutModel): [string, string][] {
    const byDiff = new Map<string, KeymapTypeId[]>();
    for (const type of germanKeymapTypes) {
        const frame = model.frameMappings[type];
        if (!frame) continue;
        const diff = germanDiff(frame);
        byDiff.set(diff, [...(byDiff.get(diff) ?? []), type]);
    }
    return [...byDiff].map(([diff, types]) => [types.join(", "), diff]);
}

const pad = (text: string, width: number) => text + " ".repeat(Math.max(0, width - text.length));

console.log("\n32-key frame mappings against the standard German Shift pairings");
console.log("===============================================================\n");
console.log(`  The pairings' base-level keys, without the flex map's \`,.-\`: ${germanBaseKeys.join(" ")}\n`);

const skipped: string[] = [];
let clean = 0;
for (const model of allLayoutModels) {
    const lines = diffLines(model);
    if (lines.length === 0) {
        skipped.push(model.name);
        continue;
    }
    const numberRow = hasNumberRow(model) ? "" : "  (no number row, so the digits are absent by design)";
    console.log(`  ${model.name}${numberRow}`);
    for (const [types, diff] of lines) {
        if (diff.startsWith("as the")) clean++;
        console.log(`    ${pad(types, 16)}${diff}`);
    }
}

console.log(`\n  ${clean} frame mappings match the pairings; `
    + `${skipped.length} layout models define no 32-key frame mapping:`);
console.log(`    ${skipped.join(", ")}\n`);
