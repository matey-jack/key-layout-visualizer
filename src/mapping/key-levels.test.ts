import {describe, expect, it} from "vitest";
import {Hand, KeyboardRows, type KeyPosition, type LayoutModel} from "../base-model.ts";
import {ansiIBMLayoutModel, ansiWideLayoutModel} from "../layout/ansiLayoutModel.ts";
import {makeErgoslatNumberless, majorErgoslatLayoutModel} from "../layout/ergoslatLayoutModel.ts";
import {fillMapping, getKeyPositions, hasMatchingMapping} from "../layout/layout-functions.ts";
import {allMappings} from "./mappings.ts";
import {allLayoutModels} from "../all-layout-models.ts";
import {
    altGrLeft,
    altGrRight,
    getBaseLevel,
    getShiftLevel,
    getThirdLevel,
    navLeft,
    navRight,
    resolveSlot,
    shiftPairFor,
} from "./key-levels.ts";

function positionsOf(model: LayoutModel): KeyPosition[] {
    const mapping = allMappings.find((m) => hasMatchingMapping(model, m))!;
    return getKeyPositions(model, false, fillMapping(model, mapping)!);
}

// The third level as a plain label -> character map, which is how the diagrams read.
function thirdLevelByLabel(model: LayoutModel, navSide: Hand): Record<string, string> {
    const positions = positionsOf(model);
    const level = getThirdLevel(model, positions, navSide);
    const result: Record<string, string> = {};
    positions.forEach((p) => {
        const char = level[p.row][p.col];
        if (char) result[p.label] = char;
    });
    return result;
}

describe("shift pairings", () => {
    it("finds a pairing by its base character", () => {
        expect(shiftPairFor(",")).toBe(",<");
        expect(shiftPairFor("9")).toBe("9(");
    });

    it("finds a pairing by its shifted character, so a `+` key is the ANSI `=+` key", () => {
        expect(shiftPairFor("+")).toBe("=+");
    });

    it("finds a pairing by the combined label the frame mappings use", () => {
        expect(shiftPairFor("`~")).toBe("`~");
    });

    it("has no pairing for letters and non-character keys", () => {
        expect(shiftPairFor("a")).toBeUndefined();
        expect(shiftPairFor("⏎")).toBeUndefined();
        expect(shiftPairFor("AltGr")).toBeUndefined();
        expect(shiftPairFor("")).toBeUndefined();
    });

    it("puts the shifted character on digit and punctuation keys only", () => {
        expect(getShiftLevel([["a", "1", "+", "⌫", "`~"]])).toEqual([[null, "!", "+", null, "~"]]);
    });

    it("only overrides the base label where the key map draws something else", () => {
        expect(getBaseLevel([["a", "1", "+", "⌫", "`~"]])).toEqual([[null, null, "=", null, "`"]]);
    });
});

describe("AltGr character block", () => {
    it("sits on the right hand's finger columns", () => {
        const level = thirdLevelByLabel(ansiIBMLayoutModel, Hand.Left);
        expect(level["7"]).toBe("|");
        expect(level["8"]).toBe("[");
        expect(level["9"]).toBe("]");
        expect(level["u"]).toBe("\\");
        expect(level["i"]).toBe("{");
        expect(level["o"]).toBe("}");
        expect(level["h"]).toBe("~");
        expect(level["j"]).toBe("`");
        expect(level["k"]).toBe("(");
        expect(level["l"]).toBe(")");
        expect(level["m"]).toBe("=");
        expect(level[","]).toBe("<");
        expect(level["."]).toBe(">");
    });

    it("mirrors onto the left hand, keeping the fingers and swapping the bracket pairs", () => {
        const level = thirdLevelByLabel(ansiIBMLayoutModel, Hand.Right);
        expect(level["4"]).toBe("|");
        expect(level["3"]).toBe("]");
        expect(level["2"]).toBe("[");
        expect(level["r"]).toBe("\\");
        expect(level["e"]).toBe("}");
        expect(level["w"]).toBe("{");
        expect(level["g"]).toBe("~");
        expect(level["f"]).toBe("`");
        expect(level["d"]).toBe(")");
        expect(level["s"]).toBe("(");
        expect(level["v"]).toBe("=");
        expect(level["c"]).toBe(">");
        expect(level["x"]).toBe("<");
    });

    it("is left out on a layout without a number row", () => {
        const numberless = makeErgoslatNumberless(majorErgoslatLayoutModel(false));
        const level = thirdLevelByLabel(numberless, Hand.Left);
        const chars = Object.values(level);
        expect(chars).not.toContain("(");
        expect(chars).not.toContain("<");
        // but the navigation block is still there.
        expect(chars).toContain("↓");
        expect(chars).toContain("⇤");
    });
});

describe("navigation block", () => {
    it("sits on the wer / asdfg / zxcv keys of the left hand", () => {
        const level = thirdLevelByLabel(ansiIBMLayoutModel, Hand.Left);
        expect(level["w"]).toBe("↞");
        expect(level["e"]).toBe("↑");
        expect(level["r"]).toBe("↠");
        expect(level["a"]).toBe("⇤");
        expect(level["s"]).toBe("←");
        expect(level["d"]).toBe("↓");
        expect(level["f"]).toBe("→");
        expect(level["g"]).toBe("⇥");
        expect(level["z"]).toBe("⇞");
        expect(level["x"]).toBe("↟");
        expect(level["c"]).toBe("↡");
        expect(level["v"]).toBe("⇟");
    });

    it("looks the same on the right hand", () => {
        const level = thirdLevelByLabel(ansiIBMLayoutModel, Hand.Right);
        expect(level["u"]).toBe("↞");
        expect(level["i"]).toBe("↑");
        expect(level["o"]).toBe("↠");
        expect(level["h"]).toBe("⇤");
        expect(level["j"]).toBe("←");
        expect(level["k"]).toBe("↓");
        expect(level["l"]).toBe("→");
        expect(level[";"]).toBe("⇥");
        expect(level["m"]).toBe("⇞");
        expect(level[","]).toBe("↟");
        expect(level["."]).toBe("↡");
        expect(level["/"]).toBe("⇟");
    });

    it("drops the mouse scrolls when the lower row's pinky column is taken", () => {
        // The wide hand position has no `/` key: its lower row ends in the right Shift.
        const level = thirdLevelByLabel(ansiWideLayoutModel, Hand.Right);
        const chars = Object.values(level);
        expect(chars).not.toContain("↟");
        expect(chars).not.toContain("↡");
        expect(level[","]).toBe("⇞");
        expect(level["."]).toBe("⇟");
    });
});

/*
    The blocks are placed by finger position, so a layout model that moves a column – or gives it
    to a Shift key – can silently lose a character. This test is the guard against that: every
    block entry has to land on a key on every layout model, on either hand.
 */
describe("every block entry is placed on every layout model", () => {
    const blocks: [string, Hand, (string | null)[][]][] = [
        ["AltGr characters", Hand.Right, altGrRight],
        ["AltGr characters", Hand.Left, altGrLeft],
        ["navigation", Hand.Right, navRight],
        ["navigation", Hand.Left, navLeft],
    ];
    // The one documented exception is the lower row's pinky column; the separate PageUp/PageDown
    // test below covers what survives it.
    const lowerRowFallbackChars = ["⇞", "⇟", "↟", "↡"];

    it.each(allLayoutModels.map((m) => [m.name, m] as const))("%s", (_name, model) => {
        const positions = positionsOf(model);
        const hasNumberRow = positions.some((p) => p.row === KeyboardRows.Number);
        const missing: string[] = [];
        blocks.forEach(([blockName, hand, block]) => {
            block.forEach((blockRow, row) => {
                blockRow.forEach((char, slot) => {
                    if (!char) return;
                    if (row === KeyboardRows.Number && !hasNumberRow) return;
                    if (row === KeyboardRows.Lower && lowerRowFallbackChars.includes(char)) return;
                    if (!resolveSlot(model, positions, hand, row, slot)) {
                        missing.push(`${blockName} on the ${Hand[hand]} hand: '${char}' (row ${row}, slot ${slot})`);
                    }
                });
            });
        });
        expect(missing).toEqual([]);
    });

    it.each(allLayoutModels.map((m) => [m.name, m] as const))("%s places PageUp/PageDown", (_name, model) => {
        const positions = positionsOf(model);
        [Hand.Left, Hand.Right].forEach((navSide) => {
            const chars = Object.values(getThirdLevel(model, positions, navSide).flat().filter((c) => c));
            expect(chars, `nav on the ${Hand[navSide]} hand`).toContain("⇞");
            expect(chars, `nav on the ${Hand[navSide]} hand`).toContain("⇟");
        });
    });
});
