/*
    Analysis 1 of the "how to arrange the new pair of parenthesis keys symmetrically" question in
    docs/key-levels.md: the compressed Shift level frees two keys and puts `(<` and `)>` on them,
    and we want to know how often those two land somewhere that reads as one unit.

    Run it, change the compression rules in key-levels.ts, and run it again to compare:
        npx tsx scripts/bracket-key-positions.ts
 */
import {allLayoutModels} from "../src/all-layout-models.ts";
import {KeyboardRows, type KeyPosition, type LayoutModel} from "../src/base-model.ts";
import {ansiIBMLayoutModel, ansiWideLayoutModel} from "../src/layout/ansiLayoutModel.ts";
import {ergoboardCentralLayoutModel} from "../src/layout/ergoboardCentralLayoutModel.ts";
import {ergoboardComfyLayoutModel} from "../src/layout/ergoboardComfyLayoutModel.ts";
import {ergoplankLayoutModel} from "../src/layout/ergoplankLayoutModel.ts";
import {splitOrthoLayoutModel} from "../src/layout/splitOrthoLayoutModel.ts";
import {xhkb13LayoutModel, xhkb15LayoutModel, xhkb16LayoutModel} from "../src/layout/xhkbLayoutModel.ts";
import {
    fillMapping,
    findMatchingKeymapType,
    defaultTotalWidth,
    getKeyPositions,
    hasMatchingMapping,
} from "../src/layout/layout-functions.ts";
import {compressCharMap, hasCompressedLevel, hasNumberRow} from "../src/mapping/key-levels.ts";
import {allMappings} from "../src/mapping/mappings.ts";

// One 30-key mapping per keymap type, as the analysis question asks for.
const mappingNames = ["Qwerty", "Quipper Thumby"];

type Verdict = "pair" | "stack" | "apart";

/**
 * How the two keys sit relative to each other:
 *  - "pair" – side by side in the same row, which is the arrangement we would like;
 *  - "stack" – neighbouring rows with overlapping columns;
 *  - "apart" – anything else.
 */
function classify(a: KeyPosition, b: KeyPosition): Verdict {
    const [first, second] = a.colPos <= b.colPos ? [a, b] : [b, a];
    const gap = second.colPos - (first.colPos + first.keyCapWidth);
    if (a.row === b.row) return gap < 0.01 ? "pair" : "apart";
    return Math.abs(a.row - b.row) === 1 && gap < -0.01 ? "stack" : "apart";
}

/*
    The boards the design question focuses on: everything the layout options mark with a heart,
    plus the ANSI wide mod and the Split Ortho.
 */
const focusModels: [string, LayoutModel][] = [
    ["ANSI", ansiIBMLayoutModel],
    ["ANSI wide", ansiWideLayoutModel],
    ["Thumbs Up 13/2", xhkb13LayoutModel],
    ["Thumbs Up 15/4", xhkb15LayoutModel],
    ["Thumbs Up 16/5", xhkb16LayoutModel],
    ["Ergoplank 15/5", ergoplankLayoutModel],
    ["Ergoboard 16/5 Central", ergoboardCentralLayoutModel],
    ["Ergoboard 16/5 Comfy Wide", ergoboardComfyLayoutModel],
    ["Split Ortho", splitOrthoLayoutModel(false)],
    ["Split Ortho, Thumb Shift", splitOrthoLayoutModel(true)],
];

const rowNames = {
    [KeyboardRows.Number]: "num", [KeyboardRows.Upper]: "upper", [KeyboardRows.Home]: "home",
    [KeyboardRows.Lower]: "lower", [KeyboardRows.Bottom]: "bottom",
};

/*
    Every row is centred in the same total width, so the middle of the board is always the same
    line. Two keys are centred on it when their midpoint sits on that line – which for a pair
    means the two mirror each other, and for a stack means the column itself is the centre one.
 */
const keyMiddle = (k: KeyPosition) => k.colPos + k.keyCapWidth / 2;

const isCentred = (a: KeyPosition, b: KeyPosition) =>
    Math.abs((keyMiddle(a) + keyMiddle(b)) / 2 - defaultTotalWidth / 2) < 0.13;

// "pair (num)" when both keys share a row, "apart (upper, bottom)" when they do not.
function describe(a: KeyPosition, b: KeyPosition): string {
    const where = a.row === b.row ? rowNames[a.row] : `${rowNames[a.row]}, ${rowNames[b.row]}`;
    return `${classify(a, b)} (${where})` + (isCentred(a, b) ? ", centred" : "");
}

// The bracket keys the compression leaves alone, which we would like to stay centred.
function otherPair(model: LayoutModel, mappingName: string): string {
    const mapping = allMappings.find((m) => m.name === mappingName);
    if (!mapping || !hasMatchingMapping(model, mapping)) return "n/a";
    const charMap = fillMapping(model, mapping);
    if (!charMap) return "n/a";
    const positions = getKeyPositions(model, false, charMap, defaultTotalWidth);
    const open = positions.find((p) => p.label === "[");
    const close = positions.find((p) => p.label === "]");
    if (!open || !close) return "no `[]` keys";
    return isCentred(open, close) ? "centred" : "off centre";
}

function bracketKeys(
    model: LayoutModel, mappingName: string, expectedType?: string
): [KeyPosition, KeyPosition] | undefined {
    const mapping = allMappings.find((m) => m.name === mappingName);
    if (!mapping || !hasMatchingMapping(model, mapping)) return undefined;
    const keymapType = findMatchingKeymapType(model, mapping)!.typeId;
    if (expectedType && keymapType !== expectedType) return undefined;
    if (!hasCompressedLevel(keymapType, hasNumberRow(model))) return undefined;
    const filled = fillMapping(model, mapping);
    if (!filled) return undefined;
    const charMap = compressCharMap(filled, model, keymapType);
    const positions = getKeyPositions(model, false, charMap, defaultTotalWidth);
    const open = positions.find((p) => p.label === "(");
    const close = positions.find((p) => p.label === ")");
    return open && close ? [open, close] : undefined;
}

const counts: Record<Verdict, string[]> = {pair: [], stack: [], apart: []};
let skipped = 0;
for (const model of allLayoutModels) {
    for (const mappingName of mappingNames) {
        const keys = bracketKeys(model, mappingName);
        if (!keys) {
            skipped++;
            continue;
        }
        const keymapType = findMatchingKeymapType(model, allMappings.find((m) => m.name === mappingName)!)!.typeId;
        counts[classify(...keys)].push(`${model.name} / ${keymapType}`);
    }
}

const total = counts.pair.length + counts.stack.length + counts.apart.length;
console.log(`${total} layout model / keymap type combinations (${skipped} without a compressed level)\n`);
for (const verdict of ["pair", "stack", "apart"] as const) {
    const n = counts[verdict].length;
    console.log(`${verdict.padEnd(6)} ${String(n).padStart(3)}  ${Math.round((100 * n) / total)}%`);
    for (const name of counts[verdict]) console.log(`          ${name}`);
    console.log();
}

console.log("The boards the design question focuses on:\n");
const head = ["layout model", "ansi30", "thumb30", "`[]` keys"];
const widths = [25, 31, 31, 12];
const line = (cells: string[]) => "| " + cells.map((c, i) => c.padEnd(widths[i])).join(" | ") + " |";
console.log(line(head));
console.log("|" + widths.map((w) => "-".repeat(w + 2)).join("|") + "|");
for (const [name, model] of focusModels) {
    const cell = (mappingName: string, expected: string) => {
        const keys = bracketKeys(model, mappingName, expected);
        return keys ? describe(...keys) : "–";
    };
    console.log(line([
        name, cell("Qwerty", "ansi30"), cell("Quipper Thumby", "thumb30"), otherPair(model, "Qwerty"),
    ]));
}
console.log("\nNote that 'apart (...), centered' is also a pair, just with one key in-between, which happens on larger boards.")
console.log("And the Thumbs Up 16/5 is included in this, too, only that the keyboard is not 100% symmetric, which is why it doesn't show as centered.")