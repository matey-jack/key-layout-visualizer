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
import {harmonic12LayoutModel} from "../layout/harmonic12LayoutModel.ts";
import {xhkb13LayoutModel, xhkb16LayoutModel} from "../layout/xhkbLayoutModel.ts";
import {allMappings} from "./mappings.ts";
import {allLayoutModels} from "../all-layout-models.ts";
import {
    altGrDigits,
    altGrLeft,
    altGrRight,
    compressedAnsi30ShiftPairs,
    compressedThumb30ShiftPairs,
    getBaseLevel,
    getKeyLevels,
    getShiftLevel,
    getThirdLevel,
    hasCompressedLevel,
    hasNumberRow,
    navLeft,
    navRight,
    numberless32ShiftPairs,
    numberlessShiftPairs,
    resolveSlot,
    shiftPairFor,
} from "./key-levels.ts";
import {isKeyboardSymbol, isKeyName} from "./mapping-functions.ts";

// Without a name, the first mapping the model accepts – which is a 30-key one everywhere.
const mappingFor = (model: LayoutModel, name?: string) =>
    allMappings.find((m) => hasMatchingMapping(model, m) && (!name || m.name === name))!;

function positionsOf(model: LayoutModel, mappingName?: string): KeyPosition[] {
    return getKeyPositions(model, false, fillMapping(model, mappingFor(model, mappingName))!);
}

// The base and Shift levels as a label -> "base+Shift" map, which is how the pairings read.
function shiftLevelByLabel(model: LayoutModel, mappingName?: string): Record<string, string> {
    const mapping = mappingFor(model, mappingName);
    const charMap = fillMapping(model, mapping)!;
    const positions = getKeyPositions(model, false, charMap);
    const keymapType = findMatchingKeymapType(model, mapping)!.typeId;
    const levels = getKeyLevels(model, positions, charMap, Hand.Left, keymapType);
    const result: Record<string, string> = {};
    positions.forEach((p) => {
        const shift = levels.shift[p.row][p.col];
        if (shift) result[p.label] = (levels.base[p.row][p.col] ?? p.label) + shift;
    });
    return result;
}

// The same, with the compressed Shift pairings selected.
function compressedLevelByLabel(model: LayoutModel, mappingName?: string): Record<string, string> {
    const mapping = mappingFor(model, mappingName);
    const charMap = fillMapping(model, mapping)!;
    const positions = getKeyPositions(model, false, charMap);
    const keymapType = findMatchingKeymapType(model, mapping)!.typeId;
    const levels = getKeyLevels(model, positions, charMap, Hand.Left, keymapType, true);
    const result: Record<string, string> = {};
    positions.forEach((p) => {
        const shift = levels.shift[p.row][p.col];
        if (shift) result[p.label] = (levels.base[p.row][p.col] ?? p.label) + shift;
    });
    return result;
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

describe("compressed Shift pairings", () => {
    const digits = {
        "1": "1!", "2": "2@", "3": "3#", "4": "4$", "5": "5%",
        "6": "6^", "7": "7&", "8": "8*", "9": "9/", "0": "0?",
    };

    it("moves `/` off the base level and `;` out of the way of `'`", () => {
        expect(shiftPairFor(";", compressedAnsi30ShiftPairs)).toBe("'\"");
        expect(shiftPairFor("'", compressedAnsi30ShiftPairs)).toBe("=+");
        expect(shiftPairFor("9", compressedAnsi30ShiftPairs)).toBe("9/");
        expect(shiftPairFor("0", compressedAnsi30ShiftPairs)).toBe("0?");
        // the shifted characters are no longer lookup keys of their own
        expect(shiftPairFor(":", compressedAnsi30ShiftPairs)).toBeUndefined();
    });

    it("takes `-_` from `/` on ansi30 and from `-` on thumb30", () => {
        expect(shiftPairFor("/", compressedAnsi30ShiftPairs)).toBe("-_");
        expect(shiftPairFor("-", compressedAnsi30ShiftPairs)).toBeUndefined();
        expect(shiftPairFor("-", compressedThumb30ShiftPairs)).toBe("-_");
        expect(shiftPairFor("/", compressedThumb30ShiftPairs)).toBeUndefined();
    });

    it("reproduces the full-size punctuation map on ANSI", () => {
        expect(compressedLevelByLabel(ansiIBMLayoutModel)).toEqual({
            ...digits,
            "`~": "`~", "[": "[{", "]": "]}", "\\": "\\|",
            ";": "'\"", "'": "=+", ",": ",;", ".": ".:", "/": "-_",
            // the two freed keys
            "-": "(<", "=": ")>",
        });
    });

    it("keeps five base punctuation keys on a thumb board", () => {
        expect(compressedLevelByLabel(xhkb13LayoutModel, "Quipper with Thumb-T")).toEqual({
            ...digits,
            ";": "'\"", "'": "=+", "-": "-_", ",": ",;", ".": ".:",
            // the two freed keys, in the order the key map draws them
            "+": "(<", "/": ")>",
        });
    });

    it("orders `(` and `)` by the key map, not by which character was there before", () => {
        // The Mini draws `+` in the number row and `-` in the bottom row, so a fixed assignment
        // of `(` to the old `-` key would read backwards.
        const level = compressedLevelByLabel(harmonic12LayoutModel);
        expect(level["+"]).toBe("(<");
        expect(level["-"]).toBe(")>");
    });

    it("leaves the standard pairings alone", () => {
        const level = shiftLevelByLabel(ansiIBMLayoutModel);
        expect(level[";"]).toBe(";:");
        expect(level["9"]).toBe("9(");
        expect(level["-"]).toBe("-_");
    });
});

/*
    The compression is a permutation over the punctuation keys every 30-key board carries, so it
    has to come out complete on all of them: five base punctuation characters plus the redundant
    `(<` and `)>`, and those two in reading order.
 */
describe("the compressed level comes out complete on every 30-key board", () => {
    const combos = allLayoutModels.flatMap((model) =>
        allMappings
            .filter((m) => hasMatchingMapping(model, m))
            .filter((m) => hasCompressedLevel(findMatchingKeymapType(model, m)!.typeId, hasNumberRow(model)))
            .map((m) => [`${model.name} / ${m.name}`, model, m.name] as const));

    it("covers the 30-key flex maps", () => {
        expect(combos.length).toBeGreaterThan(1500);
    });

    it.each(combos)("%s", (_name, model, mappingName) => {
        const level = compressedLevelByLabel(model, mappingName);
        const bases = Object.values(level).map((pair) => pair[0]);
        expect(bases.filter((c) => "'=,.-".includes(c)).sort()).toEqual(["'", ",", "-", ".", "="]);
        expect(bases.filter((c) => c === "(")).toHaveLength(1);
        expect(bases.filter((c) => c === ")")).toHaveLength(1);
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

    it("leaves out the 32-key `@` there as well, so no AltGr character is left", () => {
        const numberless = makeErgoslatNumberless(majorErgoslatLayoutModel(false));
        const chars = Object.values(thirdLevelByLabel(numberless, Hand.Left, "Qwertz – German Standard"));
        expect(chars).not.toContain("@");
        expect(chars).toContain("↓");
    });
});

describe("numberless Shift pairings", () => {
    const numberless = makeErgoslatNumberless(majorErgoslatLayoutModel(false));
    const german = "Qwertz – German Standard";

    it("finds a pairing by the label the key map draws, which the base level then replaces", () => {
        expect(shiftPairFor(";", numberlessShiftPairs)).toBe("'\"");
        expect(shiftPairFor("+", numberlessShiftPairs)).toBe("&+");
        // and the ANSI meaning of that label no longer applies
        expect(shiftPairFor(":", numberlessShiftPairs)).toBeUndefined();
        expect(shiftPairFor("=", numberlessShiftPairs)).toBeUndefined();
    });

    it("replaces the ANSI set on the 30-key maps", () => {
        expect(shiftLevelByLabel(numberless)).toEqual({
            ",": ",;", ".": ".:", "/": "/?",
            ";": "'\"", "'": "-!", "-": "$%", "+": "&+",
        });
    });

    it("is the same permutation on a thumb map, which takes `-` from the other source", () => {
        expect(shiftLevelByLabel(numberless, "Quipper with Thumb-T"))
            .toEqual(shiftLevelByLabel(numberless));
    });

    it("keeps only four of the pairs on the 32-key maps", () => {
        // `/?` goes on the `+` key here, since that is the one of `+` and `/` this board draws.
        expect(shiftLevelByLabel(numberless, german)).toEqual({
            ",": ",;", ".": ".:", "-": "-!", "+": "/?",
        });
    });

    it("would put `/?` on a `/` key just as readily", () => {
        expect(shiftPairFor("/", numberless32ShiftPairs)).toBe("/?");
        expect(shiftPairFor("+", numberless32ShiftPairs)).toBe("/?");
    });

    it("leaves the ANSI pairings alone on the same board with a number row", () => {
        const numbered = shiftLevelByLabel(majorErgoslatLayoutModel(false));
        expect(numbered[";"]).toBe(";:");
        expect(numbered[","]).toBe(",<");
        expect(numbered["+"]).toBe("=+");
    });
});

/*
    The pairings are keyed by the label the key map draws, so a frame or flex mapping that moves a
    punctuation character in or out of a numberless board would silently leave a key unpaired.
 */
describe("every punctuation key on a numberless board is paired", () => {
    const numberlessModels = allLayoutModels
        .filter((m) => !positionsOf(m).some((p) => p.row === KeyboardRows.Number));

    it("is a set of two models", () => {
        expect(numberlessModels.map((m) => m.name)).toHaveLength(2);
    });

    it.each(numberlessModels.map((m) => [m.name, m] as const))("%s", (_name, model) => {
        allMappings.filter((m) => hasMatchingMapping(model, m)).forEach((mapping) => {
            const paired = shiftLevelByLabel(model, mapping.name);
            const unpaired = fillMapping(model, mapping)!.flat()
                .filter((label) => label && !isKeyName(label) && !isKeyboardSymbol(label)
                    && !/^[\p{L}0-9]$/u.test(label))
                .filter((label) => !paired[label]);
            expect(unpaired, mapping.name).toEqual([]);
        });
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
