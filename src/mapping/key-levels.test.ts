import {describe, expect, it} from "vitest";
import {Hand, KeyboardRows, type KeyPosition, type LayoutModel} from "../base-model.ts";
import {ansiIBMLayoutModel, ansiWideLayoutModel} from "../layout/ansiLayoutModel.ts";
import {makeErgoslatNumberless, majorErgoslatLayoutModel} from "../layout/ergoslatLayoutModel.ts";
import {
    fillMapping,
    findMatchingKeymapType,
    getKeyPositions,
    hasMatchingMapping,
} from "../layout/layout-functions.ts";
import {xhkb13LayoutModel, xhkb16LayoutModel} from "../layout/xhkbLayoutModel.ts";
import {allMappings} from "./mappings.ts";
import {allLayoutModels} from "../all-layout-models.ts";
import {
    altGrDigits,
    altGrLeft,
    altGrRight,
    getBaseLevel,
    getKeyLevels,
    getShiftLevel,
    getThirdLevel,
    navLeft,
    navRight,
    resolveSlot,
    shiftPairFor,
} from "./key-levels.ts";

// Without a name, the first mapping the model accepts – which is a 30-key one everywhere.
const mappingFor = (model: LayoutModel, name?: string) =>
    allMappings.find((m) => hasMatchingMapping(model, m) && (!name || m.name === name))!;

function positionsOf(model: LayoutModel, mappingName?: string): KeyPosition[] {
    return getKeyPositions(model, false, fillMapping(model, mappingFor(model, mappingName))!);
}

// The third level as a plain label -> character map, which is how the diagrams read.
function thirdLevelByLabel(model: LayoutModel, navSide: Hand, mappingName?: string): Record<string, string> {
    const mapping = mappingFor(model, mappingName);
    const positions = getKeyPositions(model, false, fillMapping(model, mapping)!);
    const keymapType = findMatchingKeymapType(model, mapping)!.typeId;
    const level = getThirdLevel(model, positions, navSide, keymapType);
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

describe("AltGr number row", () => {
    it("pairs with the digits, brackets on 8 and 9", () => {
        const level = thirdLevelByLabel(ansiIBMLayoutModel, Hand.Left);
        expect(level["1"]).toBe("¡");
        expect(level["2"]).toBe("¢");
        expect(level["3"]).toBe("£");
        expect(level["4"]).toBe("€");
        expect(level["5"]).toBe("‰");
        expect(level["6"]).toBe("^");
        expect(level["7"]).toBe("|");
        expect(level["8"]).toBe("[");
        expect(level["9"]).toBe("]");
        expect(level["0"]).toBe("¿");
    });

    it("stays put when the characters change hands", () => {
        const digitsOf = (navSide: Hand) => {
            const level = thirdLevelByLabel(ansiIBMLayoutModel, navSide);
            // spelled out because an object's integer-like keys come back in numeric order
            return "1234567890".split("").map((digit) => level[digit]).join(" ");
        };
        expect(digitsOf(Hand.Right)).toBe(digitsOf(Hand.Left));
        expect(digitsOf(Hand.Left)).toBe("¡ ¢ £ € ‰ ^ | [ ] ¿");
    });

    it("follows the digits, not the fingers, when the number row is shifted", () => {
        // On the 13/2 the index finger's number row key is `6`, not `7`.
        const level = thirdLevelByLabel(xhkb13LayoutModel, Hand.Left);
        expect(level["6"]).toBe("^");
        expect(level["7"]).toBe("|");
        expect(level["8"]).toBe("[");
        expect(level["9"]).toBe("]");
    });

    it("repeats a bracket the number row already carries on its base level", () => {
        // The 16/5 has `[` and `]` keys in the centre of its number row, which does not stop
        // the digits from carrying them too.
        const level = thirdLevelByLabel(xhkb16LayoutModel, Hand.Left);
        expect(level["8"]).toBe("[");
        expect(level["9"]).toBe("]");
    });
});

describe("the 32-key `@`", () => {
    const german = "Qwertz – German Standard";

    it("comes with no Shift level, since we have no German pairings yet", () => {
        const model = majorErgoslatLayoutModel(false);
        const mapping = mappingFor(model, german);
        const charMap = fillMapping(model, mapping)!;
        const positions = getKeyPositions(model, false, charMap);
        const keymapType = findMatchingKeymapType(model, mapping)!.typeId;
        const levels = getKeyLevels(model, positions, charMap, Hand.Left, keymapType);
        expect(levels.shift.flat().filter((c) => c)).toEqual([]);
        // and no base override either: the ANSI pairs are what would drive it
        expect(levels.base.flat().filter((c) => c)).toEqual([]);
        // the AltGr level is unaffected
        expect(levels.third.flat()).toContain("@");
    });

    it("sits on the flex map's first upper row key", () => {
        const level = thirdLevelByLabel(majorErgoslatLayoutModel(false), Hand.Left, german);
        expect(level["q"]).toBe("@");
    });

    it("stays there when the nav keys change hands", () => {
        const level = thirdLevelByLabel(majorErgoslatLayoutModel(false), Hand.Right, german);
        expect(level["q"]).toBe("@");
    });

    it("is not on the 30-key maps", () => {
        const level = thirdLevelByLabel(majorErgoslatLayoutModel(false), Hand.Left);
        expect(Object.values(level)).not.toContain("@");
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
        const missing: string[] = [];
        blocks.forEach(([blockName, hand, block]) => {
            block.forEach((blockRow, row) => {
                blockRow.forEach((char, slot) => {
                    if (!char) return;
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

/*
    The number row is placed by digit, so the guard is a different one: every digit the layout
    carries has to receive its character.
 */
describe("every digit gets its AltGr character on every layout model", () => {
    const withNumberRow = allLayoutModels
        .filter((m) => positionsOf(m).some((p) => p.row === KeyboardRows.Number))
        .map((m) => [m.name, m] as const);

    it.each(withNumberRow)("%s", (_name, model) => {
        const positions = positionsOf(model);
        const baseLabels = new Set(positions.filter((p) => p.row === KeyboardRows.Number).map((p) => p.label));
        [Hand.Left, Hand.Right].forEach((navSide) => {
            const level = thirdLevelByLabel(model, navSide);
            const missing = Object.entries(altGrDigits)
                .filter(([digit, char]) => baseLabels.has(digit) && level[digit] !== char)
                .map(([digit, char]) => `${digit} -> ${char}`);
            expect(missing, `nav on the ${Hand[navSide]} hand`).toEqual([]);
        });
    });
});
