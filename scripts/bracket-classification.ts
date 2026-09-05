/*
    Where the colloquialisation put the `(` and `)` keys of a board, and how well the two read as
    one unit. Shared by bracket-key-positions.ts, which prints it for every layout model, and by
    bracket-key-positions.test.ts, which pins the verdicts of the boards the design question is
    about so that a change to `colloquialCycles` cannot move them unnoticed.
 */
import {KeyboardRows, type KeyPosition, type LayoutModel} from "../src/base-model.ts";
import {ansiIBMLayoutModel, ansiWideLayoutModel} from "../src/layout/ansiLayoutModel.ts";
import {ergoboardCentralLayoutModel} from "../src/layout/ergoboardCentralLayoutModel.ts";
import {ergoboardComfyLayoutModel} from "../src/layout/ergoboardComfyLayoutModel.ts";
import {ergoplankLayoutModel} from "../src/layout/ergoplankLayoutModel.ts";
import {splitOrthoLayoutModel} from "../src/layout/splitOrthoLayoutModel.ts";
import {xhkb13LayoutModel, xhkb14LayoutModel, xhkb15LayoutModel, xhkb16LayoutModel} from "../src/layout/xhkbLayoutModel.ts";
import {
    defaultTotalWidth,
    fillMapping,
    findMatchingKeymapType,
    getKeyPositions,
    hasMatchingMapping,
} from "../src/layout/layout-functions.ts";
import {hasNumberRow} from "../src/mapping/key-level-functions.ts";
import {colloquialiseCharMap, hasColloquialLevel} from "../src/mapping/key-levels.ts";
import {allMappings} from "../src/mapping/mappings.ts";

// The two parenthesis keys, together with the lines they may sit on to count as centred.
export interface Brackets {
    open: KeyPosition;
    close: KeyPosition;
    centres: number[];
}

export type Relation = "pair" | "stack" | "apart";
export type Verdict = "centred" | Relation;

export const verdicts: Verdict[] = ["centred", "pair", "stack", "apart"];

/**
 * How the two keys sit relative to each other:
 *  - "pair" – side by side in the same row, which is the arrangement we would like;
 *  - "stack" – neighbouring rows with overlapping columns;
 *  - "apart" – anything else.
 */
export function relation(a: KeyPosition, b: KeyPosition): Relation {
    const [first, second] = a.colPos <= b.colPos ? [a, b] : [b, a];
    const gap = second.colPos - (first.colPos + first.keyCapWidth);
    if (a.row === b.row) return gap < 0.01 ? "pair" : "apart";
    return Math.abs(a.row - b.row) === 1 && gap < -0.01 ? "stack" : "apart";
}

const keyMiddle = (k: KeyPosition) => k.colPos + k.keyCapWidth / 2;

/*
    Every row is centred in the same total width, so the middle of the board is one line a pair can
    sit on. The other is the middle between the two home index keys: where the halves of a board
    are not mirror images of each other, it is the hands and not the frame that decide what reads
    as the middle. Both lines are measured in rendered units, so the widths of the keys left of the
    index keys are already part of the answer.
 */
export function centreLines(model: LayoutModel, positions: KeyPosition[]): number[] {
    const homeKey = (col: number) => positions.find((p) => p.row === KeyboardRows.Home && p.col === col);
    const [left, right] = [homeKey(model.leftHomeIndex), homeKey(model.rightHomeIndex)];
    return left && right
        ? [defaultTotalWidth / 2, (keyMiddle(left) + keyMiddle(right)) / 2]
        : [defaultTotalWidth / 2];
}

// Half a key of slack: any closer to a centre line and the pair still reads as symmetric.
export const isCentred = (a: KeyPosition, b: KeyPosition, centres: number[]) =>
    centres.some((c) => Math.abs((keyMiddle(a) + keyMiddle(b)) / 2 - c) < 0.5);

// Centred outranks the three shapes: a symmetric pair reads as one unit even with a key in between.
export const classify = ({open, close, centres}: Brackets): Verdict =>
    isCentred(open, close, centres) ? "centred" : relation(open, close);

/**
 * The colloquialised `(` and `)` of one layout model and mapping, or undefined when the
 * combination has no colloquial level (a German or Danish map, or a board without a number row).
 * `expectedType` restricts the answer to one keymap type, so a caller can ask for the ansi30 and
 * the thumb30 arrangement separately.
 */
export function bracketKeys(
    model: LayoutModel, mappingName: string, expectedType?: string
): Brackets | undefined {
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

// The bracket keys the colloquialisation leaves alone, which we would like to stay centred.
export function otherPair(model: LayoutModel, mappingName: string): string {
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

// One mapping per keymap type, as the analysis question asks for. The 32-key maps have their
// own pairings, but their colloquial mode spends two keys on the parentheses just the same.
export const mappingNames = ["Qwerty", "Quipper Thumby", "Danish Alphabet"];

/*
    The boards the design question focuses on: everything the layout options mark with a heart,
    plus the ANSI wide mod and the Split Ortho.
 */
export const focusModels: [string, LayoutModel][] = [
    ["ANSI", ansiIBMLayoutModel],
    ["ANSI wide", ansiWideLayoutModel],
    ["Thumbs Up 13/2", xhkb13LayoutModel],
    ["Thumbs Up 14/3", xhkb14LayoutModel],
    ["Thumbs Up 15/4", xhkb15LayoutModel],
    ["Thumbs Up 16/5", xhkb16LayoutModel],
    ["Ergoplank 15/5", ergoplankLayoutModel],
    ["Ergoboard 16/5 Central", ergoboardCentralLayoutModel],
    ["Ergoboard 16/5 Comfy Wide", ergoboardComfyLayoutModel],
    ["Split Ortho", splitOrthoLayoutModel(false)],
    ["Split Ortho, Thumb Shift", splitOrthoLayoutModel(true)],
];

// Keyed by number, because that is how a KeyPosition carries its row.
const rowNames: Record<number, string> = {
    [KeyboardRows.Number]: "num", [KeyboardRows.Upper]: "upper", [KeyboardRows.Home]: "home",
    [KeyboardRows.Lower]: "lower", [KeyboardRows.Bottom]: "bottom",
};

// "centred pair (num)" when both keys share a row, "apart (upper, bottom)" when they do not.
export function describeBrackets(brackets: Brackets): string {
    const {open, close} = brackets;
    const where = open.row === close.row
        ? rowNames[open.row] : `${rowNames[open.row]}, ${rowNames[close.row]}`;
    const verdict = classify(brackets);
    return `${verdict}${verdict === "centred" ? ` ${relation(open, close)}` : ""} (${where})`;
}

// One cell of the focus table: how the pair of a board and keymap type reads, or "–" when that
// combination does not exist.
export const bracketCell = (model: LayoutModel, mappingName: string, expectedType: string): string => {
    const brackets = bracketKeys(model, mappingName, expectedType);
    return brackets ? describeBrackets(brackets) : "–";
};
