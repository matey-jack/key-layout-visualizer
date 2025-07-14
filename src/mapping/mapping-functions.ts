import {FlexMapping, RowBasedLayoutModel} from "../base-model.ts";
import {singleCharacterFrequencies} from "../frequencies/english-single-character-frequencies.ts";
import {fillMapping} from "../layout/layout-functions.ts";

// We don't use Unicode ranges, because we might later map some other Unicode symbols, that are actually charaters to insert.
// Examples: × or ¢ or the "per mille" sign
const keyboardSymbols = "↹⌫⇧⍽⏎¤⌥";

export const isKeyboardSymbol = (label: string) => keyboardSymbols.includes(label);

// Let's just both allow names and symbols for some key, since this is currently only for formatting the label nicely.
const keyboardNames = [
    "Esc", "Tab", "Backspace", "CAPS", "Delete", "Enter", "Space", "Shift", "Ctrl", "Alt", "Fn", "Cmd", "AltGr", "Menu",
];

export const isKeyName = (label: string) => keyboardNames.includes(label);

export const isCommandKey = (label: string) =>
    (isKeyboardSymbol(label) || isKeyName(label)) && label !== "⍽" && label !== "⏎" && label !== "";

export function weighSingleKeyEffort(layoutModel: RowBasedLayoutModel, mapping: FlexMapping): number {
    const efforts = getSingleKeyEffort(layoutModel, mapping);
    let totalEffort = 0;
    Object.entries(efforts).forEach(([char, effort]) => {
        totalEffort += effort * singleCharacterFrequencies[char.toUpperCase()];
    });
    return Math.round(totalEffort);
}

export function sumKeyFrequenciesByEffort(layoutModel: RowBasedLayoutModel, mapping: FlexMapping): Record<number, number> {
    const efforts = getSingleKeyEffort(layoutModel, mapping);
    const result: Record<number, number> = {};
    Object.entries(efforts).forEach(([char, effort]) => {
        result[effort] = (result[effort] || 0) + singleCharacterFrequencies[char.toUpperCase()];
    });
    return result;
}

export function getSingleKeyEffort(layoutModel: RowBasedLayoutModel, mapping: FlexMapping): Record<string, number> {
    const charMap = fillMapping(layoutModel, mapping);
    const result: Record<string, number> = {};
    charMap.forEach((charMapRow, row) => {
        charMapRow.forEach((char, col) => {
            if (char && singleCharacterFrequencies[char.toUpperCase()]) {
                result[char] = layoutModel.singleKeyEffort[row][col];
            }
        })
    })
    return result;
}
