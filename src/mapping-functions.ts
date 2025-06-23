export type LayoutMapping = (string | number)[][];

export function getLabel(layoutValue: (string | number), flexibleMapping: string): string {
    if (typeof layoutValue === 'number') return flexibleMapping[layoutValue];
    return layoutValue;
}

// We don't use Unicode ranges, because we might later map some other Unicode symbols, that are actually charaters to insert.
// Examples: × or ¢ or the "per mille" sign
const keyboardSymbols = "↹⌫⇧⍽⏎";

export const isKeyboardSymbol = (label: string) => keyboardSymbols.includes(label);

// Let's just both allow names and symbols for some key, since this is currently only for formatting the label nicely.
const keyboardNames = [
    "Esc", "Tab", "Backspace", "CAPS", "Delete", "Enter", "Space", "Shift", "Ctrl", "Alt", "Fn", "Cmd", "AltGr", "Menu",
];

export const isKeyName = (label: string) => keyboardNames.includes(label);

export const isCommandKey = (label: string) =>
    (isKeyboardSymbol(label) || isKeyName(label)) && label !== "⍽" && label !== "⏎";