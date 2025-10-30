import {RowBasedLayoutModel} from "../base-model.ts";

// We don't use Unicode ranges, because we might later map some other Unicode symbols, that are actually characters to insert.
// Examples: × or ¢ or the "per mille" sign
const keyboardSymbols = "⌦↹⌫⇧⍽⏎¤⌥⇞⇟⇤⇥←↑↓→";

export const isKeyboardSymbol = (label: string) => keyboardSymbols.includes(label);

// Let's just both allow names and symbols for some key, since this is currently only for formatting the label nicely.
const keyboardNames = [
    "Esc", "Tab", "Backspace", "CAPS", "Delete", "Enter", "Space", "Shift", "Ctrl", "Alt", "Fn", "Cmd", "AltGr", "Menu",
];

export const isKeyName = (label: string) => keyboardNames.includes(label);

export const isCommandKey = (label: string) =>
    (isKeyboardSymbol(label) || isKeyName(label)) && label !== "⍽" && label !== "⏎" && label !== "";

export function weighSingleKeyEffort(layoutModel: RowBasedLayoutModel, charMap: string[][], freqs: Record<string, number>): number {
    const efforts = getSingleKeyEffort(layoutModel, charMap, freqs);
    let totalEffort = 0;
    Object.entries(efforts).forEach(([char, effort]) => {
        totalEffort += effort * freqs[char.toUpperCase()];
    });
    return Math.round(totalEffort);
}

export function sumKeyFrequenciesByEffort(layoutModel: RowBasedLayoutModel, charMap: string[][], freqs: Record<string, number>): Record<number, number> {
    const efforts = getSingleKeyEffort(layoutModel, charMap, freqs);
    const result: Record<number, number> = {};
    Object.entries(efforts).forEach(([char, effort]) => {
        result[effort] = (result[effort] || 0) + freqs[char.toUpperCase()];
    });
    Object.entries(result).forEach(([effort, weight]) => {
        result[effort as unknown as number] = Math.round(weight);
    });
    return result;
}

export function getSingleKeyEffort(layoutModel: RowBasedLayoutModel, charMap: string[][], freqs: Record<string, number>): Record<string, number> {
    const result: Record<string, number> = {};
    charMap.forEach((charMapRow, row) => {
        charMapRow.forEach((char, col) => {
            if (char && freqs[char.toUpperCase()]) {
                result[char] = layoutModel.singleKeyEffort[row][col];
            }
        })
    })
    return result;
}
