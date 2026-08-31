/*
    Analysis 1 of the "how to arrange the new pair of parenthesis keys symmetrically" question in
    docs/key-levels.md: the colloquial Shift level frees two keys and puts `(<` and `)>` on them,
    and we want to know how often those two land somewhere that reads as one unit.

    Run it, change the colloquialisation rules in key-levels.ts, and run it again to compare:
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
import {colloquialiseCharMap, hasColloquialLevel, hasNumberRow} from "../src/mapping/key-levels.ts";
import {allMappings} from "../src/mapping/mappings.ts";

// One 30-key mapping per keymap type, as the analysis question asks for.
const mappingNames = ["Qwerty", "Quipper Thumby"];

// The two parenthesis keys, together with the lines they may sit on to count as centred.
interface Brackets {
    open: KeyPosition;
    close: KeyPosition;
    centres: number[];
}

type Relation = "pair" | "stack" | "apart";
type Verdict = "centred" | Relation;

/**
 * How the two keys sit relative to each other:
 *  - "pair" – side by side in the same row, which is the arrangement we would like;
 *  - "stack" – neighbouring rows with overlapping columns;
 *  - "apart" – anything else.
 */
function relation(a: KeyPosition, b: KeyPosition): Relation {
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

const keyMiddle = (k: KeyPosition) => k.colPos + k.keyCapWidth / 2;

/*
    Every row is centred in the same total width, so the middle of the board is one line a pair can
    sit on. The other is the middle between the two home index keys: where the halves of a board
    are not mirror images of each other, it is the hands and not the frame that decide what reads
    as the middle. Both lines are measured in rendered units, so the widths of the keys left of the
    index keys are already part of the answer.
 */
function centreLines(model: LayoutModel, positions: KeyPosition[]): number[] {
    const homeKey = (col: number) => positions.find((p) => p.row === KeyboardRows.Home && p.col === col);
    const [left, right] = [homeKey(model.leftHomeIndex), homeKey(model.rightHomeIndex)];
    return left && right
        ? [defaultTotalWidth / 2, (keyMiddle(left) + keyMiddle(right)) / 2]
        : [defaultTotalWidth / 2];
}

// Half a key of slack: any closer to a centre line and the pair still reads as symmetric.
const isCentred = (a: KeyPosition, b: KeyPosition, centres: number[]) =>
    centres.some((c) => Math.abs((keyMiddle(a) + keyMiddle(b)) / 2 - c) < 0.5);

// Centred outranks the three shapes: a symmetric pair reads as one unit even with a key in between.
const classify = ({open, close, centres}: Brackets): Verdict =>
    isCentred(open, close, centres) ? "centred" : relation(open, close);

// "centred pair (num)" when both keys share a row, "apart (upper, bottom)" when they do not.
function describe(brackets: Brackets): string {
    const {open, close} = brackets;
    const where = open.row === close.row
        ? rowNames[open.row] : `${rowNames[open.row]}, ${rowNames[close.row]}`;
    const verdict = classify(brackets);
    return `${verdict}${verdict === "centred" ? ` ${relation(open, close)}` : ""} (${where})`;
}

// The bracket keys the colloquialisation leaves alone, which we would like to stay centred.
function otherPair(model: LayoutModel, mappingName: string): string {
    const mapping = allMappings.find((m) => m.name === mappingName);
    if (!mapping || !hasMatchingMapping(model, mapping)) return "n/a";
    const charMap = fillMapping(model, mapping);
    if (!charMap) return "n/a";
    const positions = getKeyPositions(model, false, charMap, defaultTotalWidth);
    const open = positions.find((p) => p.label === "[");
    const close = positions.find((p) => p.label === "]");
    if (!open || !close) return "no `[]` keys";
    return isCentred(open, close, centreLines(model, positions)) ? "centred" : "off centre";
}

function bracketKeys(model: LayoutModel, mappingName: string, expectedType?: string): Brackets | undefined {
    const mapping = allMappings.find((m) => m.name === mappingName);
    if (!mapping || !hasMatchingMapping(model, mapping)) return undefined;
    const keymapType = findMatchingKeymapType(model, mapping)!.typeId;
    if (expectedType && keymapType !== expectedType) return undefined;
    const filled = fillMapping(model, mapping);
    if (!filled) return undefined;
    if (!hasColloquialLevel(filled, hasNumberRow(model))) return undefined;
    const charMap = colloquialiseCharMap(filled, model, keymapType);
    const positions = getKeyPositions(model, false, charMap, defaultTotalWidth);
    const open = positions.find((p) => p.label === "(");
    const close = positions.find((p) => p.label === ")");
    return open && close ? {open, close, centres: centreLines(model, positions)} : undefined;
}

const verdicts = ["centred", "pair", "stack", "apart"] as const;
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
    const cell = (mappingName: string, expected: string) => {
        const brackets = bracketKeys(model, mappingName, expected);
        return brackets ? describe(brackets) : "–";
    };
    console.log(line([
        name, cell("Qwerty", "ansi30"), cell("Quipper Thumby", "thumb30"), otherPair(model, "Qwerty"),
    ]));
}
console.log("\nA pair counts as centred when its middle is less than half a key away from the middle of the");
console.log("board or from the middle between the two home index keys, whichever of the two it is nearer to.");