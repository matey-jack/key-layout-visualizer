/*
    Analysis 1 of the "how to arrange the new pair of parenthesis keys symmetrically" question in
    docs/key-levels.md: the colloquial Shift level frees two keys and puts `(<` and `)>` on them,
    and we want to know how often those two land somewhere that reads as one unit.

    The classification itself is in bracket-classification.ts, which bracket-key-positions.test.ts
    reads too, so the verdicts of the focus table below are pinned against an accidental change.

    Run it, change the colloquialisation rules in key-levels.ts, and run it again to compare:
        npx tsx scripts/bracket-key-positions.ts
 */
import {allLayoutModels} from "../src/all-layout-models.ts";
import {findMatchingKeymapType} from "../src/layout/layout-functions.ts";
import {allMappings} from "../src/mapping/mappings.ts";
import {
    bracketCell,
    bracketKeys,
    classify,
    focusModels,
    mappingNames,
    otherPair,
    type Verdict,
    verdicts,
} from "./bracket-classification.ts";

const counts: Record<Verdict, string[]> = {centred: [], pair: [], stack: [], apart: []};
let skipped = 0;
for (const model of allLayoutModels) {
    for (const mappingName of mappingNames) {
        const brackets = bracketKeys(model, mappingName);
        if (!brackets) {
            skipped++;
            continue;
        }
        const keymapType = findMatchingKeymapType(model, allMappings.find((m) => m.name === mappingName)!)!.typeId;
        counts[classify(brackets)].push(`${model.name} / ${keymapType}`);
    }
}

const total = verdicts.reduce((n, verdict) => n + counts[verdict].length, 0);
console.log(`${total} layout model / keymap type combinations (${skipped} without a colloquial level)\n`);
for (const verdict of verdicts) {
    const n = counts[verdict].length;
    console.log(`${verdict.padEnd(7)} ${String(n).padStart(3)}  ${Math.round((100 * n) / total)}%`);
    for (const name of counts[verdict]) console.log(`           ${name}`);
    console.log();
}

console.log("The boards the design question focuses on:\n");
const head = ["layout model", "ansi30", "thumb30", "`[]` keys"];
const widths = [25, 31, 31, 12];
const line = (cells: string[]) => "| " + cells.map((c, i) => c.padEnd(widths[i])).join(" | ") + " |";
console.log(line(head));
console.log("|" + widths.map((w) => "-".repeat(w + 2)).join("|") + "|");
for (const [name, model] of focusModels) {
    console.log(line([
        name,
        bracketCell(model, "Qwerty", "ansi30"),
        bracketCell(model, "Quipper Thumby", "thumb30"),
        otherPair(model, "Qwerty"),
    ]));
}
console.log("\nA pair counts as centred when its middle is less than half a key away from the middle of the");
console.log("board or from the middle between the two home index keys, whichever of the two it is nearer to.");
