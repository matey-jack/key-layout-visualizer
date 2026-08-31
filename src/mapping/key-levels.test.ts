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
    colloquialiseCharMap,
    colloquialShiftPairs,
    germanShiftPairs,
    getBaseLevel,
    getKeyLevels,
    getShiftLevel,
    getThirdLevel,
    hasColloquialLevel,
    hasNumberRow,
    isAnsiCharMap,
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

// The base and Shift levels as a label -> "base+Shift" map, which is how the pairings read.
function shiftLevelByLabel(model: LayoutModel, mappingName?: string): Record<string, string> {
    const mapping = mappingFor(model, mappingName);
    const charMap = fillMapping(model, mapping)!;
    const positions = getKeyPositions(model, false, charMap);
    const levels = getKeyLevels(model, positions, charMap, Hand.Left);
    const result: Record<string, string> = {};
    positions.forEach((p) => {
        const shift = levels.shift[p.row][p.col];
        if (shift) result[p.label] = (levels.base[p.row][p.col] ?? p.label) + shift;
    });
    return result;
}

/*
    The same for the colloquial level, which rearranges the keys themselves – so the char map
    goes through colloquialiseCharMap before the positions are computed, exactly as the app does it.
    The keys of the result are the labels the colloquial board draws.
 */
function colloquialKeys(model: LayoutModel, mappingName?: string) {
    const mapping = mappingFor(model, mappingName);
    const keymapType = findMatchingKeymapType(model, mapping)!.typeId;
    const charMap = colloquialiseCharMap(fillMapping(model, mapping)!, model, keymapType);
    const positions = getKeyPositions(model, false, charMap);
    const levels = getKeyLevels(model, positions, charMap, Hand.Left, true);
    return positions
        .filter((p) => levels.shift[p.row][p.col])
        .map((p) => ({
            position: p,
            pair: (levels.base[p.row][p.col] ?? p.label) + levels.shift[p.row][p.col],
        }));
}

function colloquialLevelByLabel(model: LayoutModel, mappingName?: string): Record<string, string> {
    const result: Record<string, string> = {};
    colloquialKeys(model, mappingName).forEach(({position, pair}) => {
        result[position.label] = pair;
    });
    return result;
}

// The third level as a plain label -> character map, which is how the diagrams read.
function thirdLevelByLabel(model: LayoutModel, navSide: Hand, mappingName?: string): Record<string, string> {
    const mapping = mappingFor(model, mappingName);
    const charMap = fillMapping(model, mapping)!;
    const positions = getKeyPositions(model, false, charMap);
    const level = getThirdLevel(model, positions, charMap, navSide);
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

describe("the ANSI marker", () => {
    it("is the `;` key, which the European keymaps do not have", () => {
        expect(isAnsiCharMap([["a", ";", "'"]])).toBe(true);
        expect(isAnsiCharMap([["a", "ö", "ä"]])).toBe(false);
    });

    it("falls to the `(` that the colloquial board puts in place of the `;`", () => {
        const mapping = mappingFor(ansiIBMLayoutModel);
        const keymapType = findMatchingKeymapType(ansiIBMLayoutModel, mapping)!.typeId;
        const charMap = colloquialiseCharMap(
            fillMapping(ansiIBMLayoutModel, mapping)!, ansiIBMLayoutModel, keymapType);
        expect(charMap.some((row) => row.includes(";"))).toBe(false);
        expect(isAnsiCharMap(charMap)).toBe(true);
    });
});

describe("colloquial Shift pairings", () => {
    const digits = {
        "1": "1!", "2": "2@", "3": "3#", "4": "4$", "5": "5%",
        "6": "6^", "7": "7&", "8": "8*", "9": "9/", "0": "0?",
    };
    // Every kept punctuation key now pairs with its own Shift character.
    const punctuation = {
        ",": ",;", ".": ".:", "'": "'\"", "=": "=+", "-": "-_", "(": "(<", ")": ")>",
    };

    it("pairs each colloquial label with its own Shift character", () => {
        expect(shiftPairFor("'", colloquialShiftPairs)).toBe("'\"");
        expect(shiftPairFor("-", colloquialShiftPairs)).toBe("-_");
        expect(shiftPairFor("9", colloquialShiftPairs)).toBe("9/");
        expect(shiftPairFor("(", colloquialShiftPairs)).toBe("(<");
        // the keys the rearrangement removes are gone from the table
        expect(shiftPairFor(";", colloquialShiftPairs)).toBeUndefined();
        expect(shiftPairFor("/", colloquialShiftPairs)).toBeUndefined();
    });

    it("hands `;` to `'`, `'` to `=` and `-` to `/`, and fixes `(` on `-` and `)` on `=`/`+`", () => {
        // whichever of `=` and `+` the board draws ends up carrying `)`
        expect(colloquialLevelByLabel(ansiIBMLayoutModel)["("]).toBe("(<");
        expect(colloquialLevelByLabel(ansiIBMLayoutModel)[")"]).toBe(")>");
        const onEquals = colloquialKeys(ansiIBMLayoutModel);
        const onPlus = colloquialKeys(xhkb13LayoutModel, "Quipper with Thumb-T");
        for (const keys of [onEquals, onPlus]) {
            const labels = keys.map(({position}) => position.label);
            expect(labels).toContain("(");
            expect(labels).toContain(")");
            expect(labels).toContain("=");
            // the keys the rearrangement consumes are gone
            expect(labels).not.toContain(";");
            expect(labels).not.toContain("/");
            expect(labels).not.toContain("+");
        }
    });

    it("reproduces the full-size punctuation map on ANSI", () => {
        expect(colloquialLevelByLabel(ansiIBMLayoutModel)).toEqual({
            ...digits, ...punctuation,
            "`~": "`~", "[": "[{", "]": "]}", "\\": "\\|",
        });
    });

    it("keeps five base punctuation keys on a thumb board", () => {
        expect(colloquialLevelByLabel(xhkb13LayoutModel, "Quipper with Thumb-T"))
            .toEqual({...digits, ...punctuation});
    });

    it("applies the layout model's own cycles on top, where it has any", () => {
        // The wide mod swaps its two freed keys onto the centre columns that `[` and `]` hold.
        // the brackets are not removed, they swap out to the number-row edges
        const level = colloquialLevelByLabel(ansiWideLayoutModel);
        expect(level).toEqual({
            ...digits, ...punctuation, "`~": "`~", "[": "[{", "]": "]}", "\\": "\\|",
        });
        const keys = colloquialKeys(ansiWideLayoutModel);
        const at = (label: string) => keys.find(({position}) => position.label === label)!.position;
        expect(at("(").row).toBe(KeyboardRows.Upper);
        expect(at(")").row).toBe(KeyboardRows.Home);
    });

    it("leaves them where the generic rearrangement put them without cycles", () => {
        const keys = colloquialKeys(ansiIBMLayoutModel);
        const at = (label: string) => keys.find(({position}) => position.label === label)!.position;
        expect(at("(").row).toBe(KeyboardRows.Number);
        expect(at(")").row).toBe(KeyboardRows.Number);
    });

    it("leaves the standard pairings alone", () => {
        const level = shiftLevelByLabel(ansiIBMLayoutModel);
        expect(level[";"]).toBe(";:");
        expect(level["9"]).toBe("9(");
        expect(level["-"]).toBe("-_");
    });
});

/*
    The colloquialisation is a permutation over the punctuation keys every English board
    carries, so it has to come out complete on all of them: five base punctuation characters
    plus the redundant `(` and `)`.
 */
describe("the colloquial level comes out complete on every English board", () => {
    const combos = allLayoutModels.flatMap((model) =>
        allMappings
            .filter((m) => hasMatchingMapping(model, m))
            .filter((m) => hasColloquialLevel(fillMapping(model, m)!, hasNumberRow(model)))
            .map((m) => [`${model.name} / ${m.name}`, model, m.name] as const));

    it("covers every English key map with a number row", () => {
        expect(combos.length).toBeGreaterThan(1500);
    });

    it.each(combos)("%s", (_name, model, mappingName) => {
        const keys = colloquialKeys(model, mappingName);
        const bases = keys.map(({pair}) => pair[0]);
        expect(bases.filter((c) => "'=,.-".includes(c)).sort()).toEqual(["'", ",", "-", ".", "="]);
        expect(keys.filter(({pair}) => pair[0] === "(")).toHaveLength(1);
        expect(keys.filter(({pair}) => pair[0] === ")")).toHaveLength(1);
    });
});

describe("AltGr character block", () => {
    it("sits on the right hand's finger columns", () => {
        const level = thirdLevelByLabel(ansiIBMLayoutModel, Hand.Left);
        expect(level["u"]).toBe("\\");
        expect(level["i"]).toBe("{");
        expect(level["o"]).toBe("}");
        expect(level["p"]).toBe("~");
        expect(level["j"]).toBe("+");
        expect(level["k"]).toBe("(");
        expect(level["l"]).toBe(")");
        expect(level[";"]).toBe("`");
        expect(level["m"]).toBe("=");
        expect(level[","]).toBe("<");
        expect(level["."]).toBe(">");
    });

    it("mirrors onto the left hand, keeping the fingers and swapping the bracket pairs", () => {
        const level = thirdLevelByLabel(ansiIBMLayoutModel, Hand.Right);
        expect(level["r"]).toBe("\\");
        expect(level["e"]).toBe("}");
        expect(level["w"]).toBe("{");
        expect(level["q"]).toBe("~");
        expect(level["f"]).toBe("+");
        expect(level["d"]).toBe(")");
        expect(level["s"]).toBe("(");
        expect(level["a"]).toBe("`");
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

describe("a board without a number row", () => {
    const numberless = makeErgoslatNumberless(majorErgoslatLayoutModel(false));

    it("shows no Shift and no base characters, whatever the key map", () => {
        [undefined, "Quipper with Thumb-T", "Qwertz – German Standard"].forEach((name) => {
            const charMap = fillMapping(numberless, mappingFor(numberless, name))!;
            const positions = getKeyPositions(numberless, false, charMap);
            const levels = getKeyLevels(numberless, positions, charMap, Hand.Left);
            expect(levels.shift.flat().filter(Boolean), name).toEqual([]);
            expect(levels.base.flat().filter(Boolean), name).toEqual([]);
        });
    });

    it("leaves the pairings alone on the same board with a number row", () => {
        const numbered = shiftLevelByLabel(majorErgoslatLayoutModel(false));
        expect(numbered[";"]).toBe(";:");
        expect(numbered[","]).toBe(",<");
        expect(numbered["+"]).toBe("=+");
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

describe("the German `@`", () => {
    const german = "Qwertz – German Standard";

    it("sits on the key map's first upper row key", () => {
        const level = thirdLevelByLabel(majorErgoslatLayoutModel(false), Hand.Left, german);
        expect(level["q"]).toBe("@");
    });

    it("takes the mnemonic AltGr+2 when the character block claims that key", () => {
        const level = thirdLevelByLabel(majorErgoslatLayoutModel(false), Hand.Right, german);
        expect(level["q"]).toBe("~");
        expect(level["2"]).toBe("@");
    });

    it("is not on the English maps", () => {
        const level = thirdLevelByLabel(majorErgoslatLayoutModel(false), Hand.Left);
        expect(Object.values(level)).not.toContain("@");
    });
});

describe("standard German Shift pairings", () => {
    const german = "Qwertz – German Standard";

    /*
        The ANSI board with the qwertz map is the combination that really is a German keyboard:
        the other boards keep frame punctuation keys that standard German does not have, and those
        stay unpaired until the German maps are reworked.
     */
    it("cover every punctuation key of the German ANSI board", () => {
        expect(shiftLevelByLabel(ansiIBMLayoutModel, german)).toEqual({
            "1": "1!", "2": "2\"", "3": "3§", "4": "4$", "5": "5%",
            "6": "6&", "7": "7/", "8": "8(", "9": "9)", "0": "0=",
            "`~": "^°", "ß": "ß?", "´": "´`", "+": "+*", "#": "#'",
            ",": ",;", ".": ".:", "-": "-_",
        });
    });

    it("replace the base label where the key map draws another character of the key", () => {
        // the frame mapping's `` `~ `` key is the German `^°` key
        expect(shiftPairFor("`~", germanShiftPairs)).toBe("^°");
        // and a German map that draws `'` means the `#` key
        expect(shiftPairFor("'", germanShiftPairs)).toBe("#'");
    });

    it("leave the English maps on the same board with the ANSI pairings", () => {
        const level = shiftLevelByLabel(ansiIBMLayoutModel);
        expect(level["2"]).toBe("2@");
        expect(level["9"]).toBe("9(");
        expect(level["'"]).toBe("'\"");
    });

    it("come with no colloquial level, which is defined for English only", () => {
        const model = ansiIBMLayoutModel;
        expect(hasColloquialLevel(fillMapping(model, mappingFor(model, german))!, true)).toBe(false);
        expect(hasColloquialLevel(fillMapping(model, mappingFor(model))!, true)).toBe(true);
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

    it("moves the lower row towards the centre when its pinky column is taken", () => {
        // The wide hand position has no `/` key: its lower row ends in the right Shift.
        const level = thirdLevelByLabel(ansiWideLayoutModel, Hand.Right);
        expect(level["n"]).toBe("⇞");
        expect(level["m"]).toBe("↟");
        expect(level[","]).toBe("↡");
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
    // The lower row's pinky column is the one slot a layout may take; the row then moves one key
    // towards the centre, which the separate lower-row test below covers.
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

    it.each(allLayoutModels.map((m) => [m.name, m] as const))("%s places the whole lower row", (_name, model) => {
        const positions = positionsOf(model);
        for (const navSide of [Hand.Left, Hand.Right]) {
            const charMap = fillMapping(model, mappingFor(model))!;
            const chars = Object.values(getThirdLevel(model, positions, charMap, navSide).flat().filter((c) => c));
            for (const char of lowerRowFallbackChars) {
                expect(chars, `nav on the ${Hand[navSide]} hand`).toContain(char);
            }
        }
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
