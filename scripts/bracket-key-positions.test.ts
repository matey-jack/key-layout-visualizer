/*
    The regression lock on the `colloquialCycles` of the layout models. Those cycles are hand-tuned
    per board, and bracket-key-positions.ts is what they were tuned against - but a script's output
    scrolls past and is gone, so the verdicts it reaches for the boards the design question is about
    are pinned here. A cycle edit that moves one of them has to say so by updating this table.

    The table below is the "boards the design question focuses on" table the script prints.
 */
import {describe, expect, it} from "vitest";
import {bracketCell, focusModels, otherPair} from "./bracket-classification.ts";

// layout model -> [ansi30, thumb30, `[]` keys], exactly the cells the script prints.
const expected: Record<string, [string, string, string]> = {
    "ANSI": ["pair (num)", "–", "off centre"],
    "ANSI wide": ["centred stack (upper, home)", "centred stack (upper, home)", "centred"],
    "Thumbs Up 13/2": ["pair (bottom)", "pair (bottom)", "no `[]` keys"],
    "Thumbs Up 15/4": ["centred pair (upper)", "centred pair (upper)", "centred"],
    "Thumbs Up 16/5": ["centred apart (upper)", "centred apart (upper)", "centred"],
    "Ergoplank 15/5": ["centred apart (upper)", "centred apart (upper)", "centred"],
    "Ergoboard 16/5 Central": ["centred apart (upper)", "centred apart (home)", "centred"],
    "Ergoboard 16/5 Comfy Wide": ["centred apart (lower)", "centred apart (lower)", "centred"],
    "Split Ortho": ["pair (bottom)", "pair (bottom)", "no `[]` keys"],
    "Split Ortho, Thumb Shift": ["pair (bottom)", "pair (bottom)", "no `[]` keys"],
};

describe("where the colloquialisation leaves the parenthesis keys", () => {
    it("has an expectation for every board of the focus table", () => {
        expect(focusModels.map(([name]) => name).sort()).toEqual(Object.keys(expected).sort());
    });

    it.each(focusModels)("%s", (name, model) => {
        expect([
            bracketCell(model, "Qwerty", "ansi30"),
            bracketCell(model, "Quipper Thumby", "thumb30"),
            otherPair(model, "Qwerty"),
        ]).toEqual(expected[name]);
    });
});
