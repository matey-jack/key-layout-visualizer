import {describe, expect, it} from "vitest";
import {Hand, KeyboardRows, type KeyPosition, KeymapTypeId, type LayoutModel} from "../base-model.ts";
import {ansiIBMLayoutModel, ansiWideLayoutModel} from "../layout/ansiLayoutModel.ts";
import {majorErgoslatLayoutModel} from "../layout/ergoslatLayoutModel.ts";
import {
    fillMapping,
    findMatchingKeymapType,
    getKeyPositions,
    hasMatchingMapping,
} from "../layout/layout-functions.ts";
import {ergoboardCentralLayoutModel} from "../layout/ergoboardCentralLayoutModel.ts";
import {ergoplankLayoutModel} from "../layout/ergoplankLayoutModel.ts";
import {xhkb13LayoutModel, xhkb14LayoutModel, xhkb16LayoutModel} from "../layout/xhkbLayoutModel.ts";
import {allMappings} from "./mappings.ts";
import {allLayoutModels} from "../all-layout-models.ts";
import {isKeyboardSymbol, isKeyName} from "./mapping-functions.ts";
import {
    getBaseLevel,
    getShiftLevel,
    hasNumberRow,
    is32KeyType,
    resolveSlot,
} from "./key-level-functions.ts";
import {
    altGrDigits,
    altGrLeft,
    altGrRight,
    ansiShiftPairs,
    colloquialiseCharMap,
    colloquialShiftPairs,
    germanShiftPairs,
    getAltGrLevel,
    getKeyLevels,
    hasColloquialLevel,
    hasStandardLevel,
    isAnsiCharMap,
    navLeft,
    navRight,
    ShiftPairing,
    shiftPairingFor,
    shiftPairsByPairing,
} from "./key-levels.ts";

// A base label of one letter, in any of the alphabets our flex maps carry.
const isLetter = (label: string) => label.length === 1 && label.toLowerCase() !== label.toUpperCase();

// Without a name, the first mapping the model accepts – which is a 30-key one everywhere.
const mappingFor = (model: LayoutModel, name?: string) =>
    allMappings.find((m) => hasMatchingMapping(model, m) && (!name || m.name === name))!;

const keymapTypeFor = (model: LayoutModel, mappingName?: string) =>
    findMatchingKeymapType(model, mappingFor(model, mappingName))!.typeId;

// The pairing of a board and key map, read off the plain char map exactly as the app state does.
const pairingFor = (model: LayoutModel, mappingName?: string, colloquial = false) =>
    shiftPairingFor(fillMapping(model, mappingFor(model, mappingName))!, hasNumberRow(model), colloquial);

// The two gates the app reads off a board and key map, one per button of the Shift switch.
const hasColloquial = (model: LayoutModel, mappingName?: string) =>
    hasColloquialLevel(fillMapping(model, mappingFor(model, mappingName))!, hasNumberRow(model));

const hasStandard = (model: LayoutModel, mappingName?: string) =>
    hasStandardLevel(fillMapping(model, mappingFor(model, mappingName))!, hasNumberRow(model));

function positionsOf(model: LayoutModel, mappingName?: string): KeyPosition[] {
    return getKeyPositions(model, false, fillMapping(model, mappingFor(model, mappingName))!);
}

// The base and Shift levels as a label -> "base+Shift" map, which is how the pairings read.
function shiftLevelByLabel(model: LayoutModel, mappingName?: string): Record<string, string> {
    const mapping = mappingFor(model, mappingName);
    const charMap = fillMapping(model, mapping)!;
    const positions = getKeyPositions(model, false, charMap);
    const levels = getKeyLevels(model, positions, charMap, Hand.Left, pairingFor(model, mappingName));
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
    const levels = getKeyLevels(model, positions, charMap, Hand.Left, pairingFor(model, mappingName, true));
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

// The AltGr level as a plain label -> character map, which is how the diagrams read.
function altGrLevelByLabel(model: LayoutModel, navSide: Hand, mappingName?: string): Record<string, string> {
    const mapping = mappingFor(model, mappingName);
    const charMap = fillMapping(model, mapping)!;
    const positions = getKeyPositions(model, false, charMap);
    const level = getAltGrLevel(model, positions, pairingFor(model, mappingName), navSide);
    const result: Record<string, string> = {};
    positions.forEach((p) => {
        const char = level[p.row][p.col];
        if (char) result[p.label] = char;
    });
    return result;
}

describe("shift pairings", () => {
    it("finds a pairing by its base character", () => {
        expect(ansiShiftPairs[","]).toBe(",<");
        expect(ansiShiftPairs["9"]).toBe("9(");
    });

    it("finds a pairing by its shifted character, so a `+` key is the ANSI `=+` key", () => {
        expect(ansiShiftPairs["+"]).toBe("=+");
    });

    it("finds a pairing by the combined label the frame mappings use", () => {
        expect(ansiShiftPairs["`~"]).toBe("`~");
    });

    it("has no pairing for letters and non-character keys", () => {
        expect(ansiShiftPairs["a"]).toBeUndefined();
        expect(ansiShiftPairs["⏎"]).toBeUndefined();
        expect(ansiShiftPairs["AltGr"]).toBeUndefined();
        expect(ansiShiftPairs[""]).toBeUndefined();
    });

    it("puts the shifted character on digit and punctuation keys only", () => {
        expect(getShiftLevel([["a", "1", "+", "⌫", "`~"]], ansiShiftPairs)).toEqual([[null, "!", "+", null, "~"]]);
    });

    it("only overrides the base label where the key map draws something else", () => {
        expect(getBaseLevel([["a", "1", "+", "⌫", "`~"]], ansiShiftPairs)).toEqual([[null, null, "=", null, "`"]]);
    });
});

describe("the ANSI marker", () => {
    it("is the `;` key, which the European keymaps do not have", () => {
        expect(isAnsiCharMap([["a", ";", "'"]])).toBe(true);
        expect(isAnsiCharMap([["a", "ö", "ä"]])).toBe(false);
    });

    it("is gone from a colloquialised board, whose `;` the rearrangement dissolves", () => {
        const mapping = mappingFor(ansiIBMLayoutModel);
        const keymapType = findMatchingKeymapType(ansiIBMLayoutModel, mapping)!.typeId;
        const charMap = colloquialiseCharMap(
            fillMapping(ansiIBMLayoutModel, mapping)!, ansiIBMLayoutModel, keymapType);
        expect(isAnsiCharMap(charMap)).toBe(false);
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
        expect(colloquialShiftPairs["'"]).toBe("'\"");
        expect(colloquialShiftPairs["-"]).toBe("-_");
        expect(colloquialShiftPairs["9"]).toBe("9/");
        expect(colloquialShiftPairs["("]).toBe("(<");
        // the keys the rearrangement removes are gone from the table
        expect(colloquialShiftPairs[";"]).toBeUndefined();
        expect(colloquialShiftPairs["/"]).toBeUndefined();
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
            .filter((m) => !is32KeyType(findMatchingKeymapType(model, m)!.typeId))
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

/*
    `colloquialiseCharMap` hands a model's cycles to one `permute` call, which resolves each of them
    against the same map rather than against the previous one's result. Two cycles naming the same
    key would therefore not compose - the later one would silently overwrite the earlier - and a
    coordinate or edge token has no meaning in a merged char map, whose cells are all plain labels.
 */
describe("the layout models' own colloquial cycles", () => {
    const cycleLists = allLayoutModels.flatMap((model) =>
        Object.entries(model.colloquialCycles ?? {})
            .map(([type, cycles]) => [`${model.name} / ${type}`, cycles as string[]] as const));

    it("are defined on more than a handful of models", () => {
        expect(cycleLists.length).toBeGreaterThan(10);
    });

    it.each(cycleLists)("%s", (_name, cycles) => {
        expect(cycles.join("")).not.toMatch(/[{}<>]/);
        const keys = [...cycles.join("")];
        expect(keys.length, "a key named by two cycles").toBe(new Set(keys).size);
    });
});

/*
    No real layout model is short of the punctuation keys the generic colloquial cycles name, so
    the boards below are made up. What the cycles do to such a board is in the doc's "How to
    actually place the keys on an arbitrary flex map".
 */
describe("colloquialising a board short of punctuation keys", () => {
    // Of the model, only the number row and the cycles that follow the generic ones matter here;
    // the char map stands in for the board itself.
    const bareModel: LayoutModel = {...ansiIBMLayoutModel, colloquialCycles: undefined};

    // The thirty flex spots of a qwerty letter map, which is where `;` and `/` sit, plus the
    // digits and whichever punctuation keys the frame mapping adds.
    const board = (...frameKeys: string[]): string[][] => [
        ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
        ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
        ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";"],
        ["z", "x", "c", "v", "b", "n", "m", ",", ".", "/"],
        frameKeys,
    ];

    const without = (charMap: string[][], key: string): string[][] =>
        charMap.map((row) => row.filter((label) => label !== key));

    const colloquialised = (charMap: string[][]): string[] =>
        colloquialiseCharMap(charMap, bareModel, KeymapTypeId.Ansi30).flat();

    it("brings `'` and `-` in from nowhere on a 40-key board", () => {
        const keys = colloquialised(board());
        expect(keys).toContain("'");
        expect(keys).toContain("-");
        expect(keys).not.toContain(";");
        expect(keys).not.toContain("/");
        expect(keys).not.toContain("(");
        expect(keys).not.toContain(")");
        expect(keys.filter((k) => "',.-".includes(k)).sort()).toEqual(["'", ",", "-", "."]);
        expect(keys).toHaveLength(40);
    });

    it("spends the bracket's spot on `=` when the board has neither `=` nor `'`", () => {
        const keys = colloquialised(board("-"));
        expect(keys).toContain("=");
        expect(keys).not.toContain("(");
        expect(keys.filter((k) => "'=,.-".includes(k)).sort()).toEqual(["'", ",", "-", ".", "="]);
    });

    it("brings `=` in through the first cycle when the board has an `'`", () => {
        const keys = colloquialised(board("'", "-"));
        expect(keys).toContain("=");
        // The board is rich enough for one bracket, and the other stays on the AltGr level.
        expect(keys).toContain("(");
        expect(keys).not.toContain(")");
    });

    it("leaves the `-_` key alone when there is no `/` for it to move onto", () => {
        const keys = colloquialised(without(board("'", "-", "="), "/"));
        expect(keys).toContain("-");
        expect(keys).toContain(")");
        expect(keys).not.toContain("(");
        expect(keys).not.toContain(";");
    });

    it("throws when a model's own cycles name a key the board never gets", () => {
        const model: LayoutModel = {
            ...ansiIBMLayoutModel,
            colloquialCycles: {[KeymapTypeId.Ansi30]: ["=)](["]},
        };
        expect(() => colloquialiseCharMap(board(), model, KeymapTypeId.Ansi30))
            .toThrow(/must be the first token/);
    });
});

describe("AltGr character block", () => {
    it("sits on the right hand's finger columns", () => {
        const level = altGrLevelByLabel(ansiIBMLayoutModel, Hand.Left);
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
        const level = altGrLevelByLabel(ansiIBMLayoutModel, Hand.Right);
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

});

describe("a board with a number row", () => {
    it("keeps the standard pairings that the numberless one of the same family replaces", () => {
        const numbered = shiftLevelByLabel(majorErgoslatLayoutModel(false));
        expect(numbered[";"]).toBe(";:");
        expect(numbered[","]).toBe(",<");
        expect(numbered["+"]).toBe("=+");
    });
});

describe("AltGr number row", () => {
    it("pairs with the digits, brackets on 8 and 9", () => {
        const level = altGrLevelByLabel(ansiIBMLayoutModel, Hand.Left);
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
            const level = altGrLevelByLabel(ansiIBMLayoutModel, navSide);
            // spelled out because an object's integer-like keys come back in numeric order
            return "1234567890".split("").map((digit) => level[digit]).join(" ");
        };
        expect(digitsOf(Hand.Right)).toBe(digitsOf(Hand.Left));
        expect(digitsOf(Hand.Left)).toBe("¡ ¢ £ € ‰ ^ | [ ] ¿");
    });

    it("follows the digits, not the fingers, when the number row is shifted", () => {
        // On the 13/2 the index finger's number row key is `6`, not `7`.
        const level = altGrLevelByLabel(xhkb13LayoutModel, Hand.Left);
        expect(level["6"]).toBe("^");
        expect(level["7"]).toBe("|");
        expect(level["8"]).toBe("[");
        expect(level["9"]).toBe("]");
    });

    it("repeats a bracket the number row already carries on its base level", () => {
        // The 16/5 has `[` and `]` keys in the centre of its number row, which does not stop
        // the digits from carrying them too.
        const level = altGrLevelByLabel(xhkb16LayoutModel, Hand.Left);
        expect(level["8"]).toBe("[");
        expect(level["9"]).toBe("]");
    });
});

/*
    Only the standard German pairings leave `@` off the Shift level, so the ANSI board with the
    qwertz map – which takes them – is where to look for it.
 */
describe("the German `@`", () => {
    const german = "Qwertz – German Standard";

    it("sits on the key map's first upper row key", () => {
        const level = altGrLevelByLabel(ansiIBMLayoutModel, Hand.Left, german);
        expect(level["q"]).toBe("@");
    });

    it("takes the mnemonic AltGr+2 when the character block claims that key", () => {
        const level = altGrLevelByLabel(ansiIBMLayoutModel, Hand.Right, german);
        expect(level["q"]).toBe("~");
        expect(level["2"]).toBe("@");
    });

    it("is not on the English maps", () => {
        const level = altGrLevelByLabel(majorErgoslatLayoutModel(false), Hand.Left);
        expect(Object.values(level)).not.toContain("@");
    });

    it("is not on a German 32-key map either, which has `2@` on the Shift level", () => {
        const level = altGrLevelByLabel(majorErgoslatLayoutModel(false), Hand.Left, german);
        expect(Object.values(level)).not.toContain("@");
        expect(shiftLevelByLabel(majorErgoslatLayoutModel(false), german)["2"]).toBe("2@");
    });
});

/*
    The 32-key maps have their own pair of Shift levels, so the board decides which keys show up:
    the digits, the three punctuation keys of the flex map, and whatever the frame mapping draws
    around them. The 16/5 has the roomiest 32-key frames of all our boards.
 */
describe("international Shift pairings", () => {
    // Everything both modes and every language agree on.
    const shared = {
        ",": ",;", ".": ".:", "-": "-_", "'": "'\"",
        "1": "1!", "2": "2@", "3": "3#", "4": "4$", "5": "5%", "8": "8*",
        "`~": "`~",
    };
    /*
        The `=+` key, which the frame mappings draw by its shifted character. The colloquial
        rearrangement normalises that label to the base character - which is what the level
        itself shows on the key either way.
     */
    const standardEqualsKey = {"+": "=+"};
    const equalsKey = {"=": "=+"};
    // The two keys the colloquial mode spends on the parentheses.
    const spent = {"/": "/?", "\\": "\\|"};

    it("keeps the ANSI number row in the standard mode", () => {
        expect(shiftLevelByLabel(xhkb16LayoutModel, "Danish Alphabet")).toEqual({
            ...shared, ...spent, ...standardEqualsKey, "6": "6^", "7": "7&", "9": "9(", "0": "0)",
        });
    });

    it("moves `/` and `?` onto the digits in the colloquial mode, freeing the two keys", () => {
        expect(colloquialLevelByLabel(xhkb16LayoutModel, "Danish Alphabet")).toEqual({
            ...shared, ...equalsKey, "6": "6^", "7": "7&", "9": "9/", "0": "0?", "(": "(<", ")": ")>",
        });
    });

    /*
        The German tweak fits `ß` into the number row and moves `&` and `/` onto their German
        digits. `9` and `0` are the only pairings the two modes disagree about, and the tweak
        settles both, so a German map has one Shift level either way.
     */
    const germanDigits = {"6": "6&", "7": "7/", "9": "9ß", "0": "0?"};

    it("takes the German digits whichever of the two 32-key types the map uses", () => {
        const german = {...shared, ...spent, ...standardEqualsKey, ...germanDigits};
        expect(shiftLevelByLabel(xhkb16LayoutModel, "German Quipper")).toEqual(german);
        expect(shiftLevelByLabel(xhkb16LayoutModel, "German Quipper Thumby")).toEqual(german);
    });

    it("leaves the German pairings alone in the colloquial mode, and only moves the two keys", () => {
        expect(colloquialLevelByLabel(xhkb16LayoutModel, "German Quipper")).toEqual({
            ...shared, ...equalsKey, ...germanDigits, "(": "(<", ")": ")>",
        });
    });
});

/*
    Which keys a 32-key board gives up to the parentheses, and what the switch offers where it
    cannot give up two. The pairings still differ on such a board - unless the map is German.
 */
describe("the 32-key colloquial rearrangement", () => {
    const labelsOf = (model: LayoutModel, mappingName: string) =>
        colloquialiseCharMap(fillMapping(model, mappingFor(model, mappingName))!, model,
            keymapTypeFor(model, mappingName)).flat();

    it("spends the `` and `/` keys where the board draws both", () => {
        const labels = labelsOf(ergoplankLayoutModel, "Danish Alphabet");
        expect(labels).toContain("(");
        expect(labels).toContain(")");
        expect(labels).not.toContain("\\");
        expect(labels).not.toContain("/");
    });

    it("falls back to the `` `~ `` key on a board that draws no ``", () => {
        const labels = labelsOf(ergoboardCentralLayoutModel, "Danish Alphabet");
        expect(labels).toContain("(");
        expect(labels).toContain(")");
        expect(labels).not.toContain("`~");
        expect(labels).not.toContain("/");
    });

    it("falls further to the `=+` key on a board that draws neither", () => {
        // The 14/3 draws a `/` in its bottom row, but no `\` and no backtick.
        const labels = labelsOf(xhkb14LayoutModel, "Danish Alphabet");
        expect(labels).toContain("(");
        expect(labels).toContain(")");
        expect(labels).not.toContain("=");
        expect(labels).not.toContain("+");
        expect(labels).not.toContain("/");
    });

    /*
        No real board is short of all three, so this one is made up: only the digits, the flex
        spots and a `/`. The `=+` key is worth more there than a lone parenthesis key would be.
     */
    it("spends the `/` spot on the `=+` key when there is nothing to pair it with", () => {
        const bare: string[][] = [
            ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
            ["q", "w", "e", "r", "t", "z", "u", "i", "o", "p", "ü"],
            ["a", "s", "d", "f", "g", "h", "j", "k", "l", "ö", "ä"],
            ["y", "x", "c", "v", "b", "n", "m", ",", ".", "-"],
            ["/"],
        ];
        const labels = colloquialiseCharMap(bare, ergoplankLayoutModel, KeymapTypeId.Ansi32).flat();
        expect(labels).toContain("=");
        expect(labels).not.toContain("/");
        expect(labels).not.toContain("(");
        expect(labels).not.toContain(")");
    });

    /*
        The rule that keeps a board from spending a key position on half a pair. It is also the
        guard against a frame mapping that draws one of the keys the cycles name twice: an
        ambiguous label token resolves to nothing, so that cycle quietly does nothing at all.
     */
    it("never leaves a board with just one of the two parentheses", () => {
        const lone: string[] = [];
        for (const model of allLayoutModels.filter((m) => hasNumberRow(m))) {
            for (const mapping of allMappings.filter((m) => hasMatchingMapping(model, m))) {
                const keymapType = findMatchingKeymapType(model, mapping)!.typeId;
                const plain = fillMapping(model, mapping)!;
                if (!is32KeyType(keymapType) || !hasColloquialLevel(plain, true)) continue;
                const labels = colloquialiseCharMap(plain, model, keymapType).flat();
                if (labels.includes("(") !== labels.includes(")")) {
                    lone.push(`${model.name} / ${mapping.name}`);
                }
            }
        }
        expect(lone).toEqual([]);
    });
    it("still offers the switch there, because the pairings differ anyway", () => {
        expect(hasColloquial(majorErgoslatLayoutModel(false), "Danish Alphabet")).toBe(true);
        expect(hasColloquial(majorErgoslatLayoutModel(false), "Qwertz – German Standard")).toBe(true);
    });
});

/*
    `'"-_;:/?` are the characters the AltGr level does not carry, so a board that draws no key for
    one of them cannot serve the standard pairing and takes the colloquial one alone.
 */
describe("whether the standard pairing can serve a board", () => {
    it("holds on every English board", () => {
        const without = allLayoutModels
            .filter((model) => hasNumberRow(model))
            .filter((model) => hasColloquial(model) && !hasStandard(model))
            .map((model) => model.name);
        expect(without).toEqual([]);
    });

    it("fails on a 32-key board without a `/` key, and holds where there is one", () => {
        expect(hasStandard(majorErgoslatLayoutModel(false), "Danish Alphabet")).toBe(false);
        expect(hasStandard(xhkb13LayoutModel, "Danish Alphabet")).toBe(false);
        expect(hasStandard(ergoplankLayoutModel, "Danish Alphabet")).toBe(true);
    });

    /*
        The German digits would carry `/` and `?` without the key, but the rule stays the plain
        one: no `/` key, no standard mode. On such a board the two modes draw the same keys
        anyway, so the forced one is the honest thing to show.
     */
    it("fails on a German 32-key map without one too", () => {
        expect(hasStandard(majorErgoslatLayoutModel(false), "Qwertz – German Standard")).toBe(false);
        expect(hasStandard(ergoplankLayoutModel, "Qwertz – German Standard")).toBe(true);
    });

    // The pure German pairing has no colloquial mode to fall back on, so it is never asked.
    it("is not asked of a keymap that has no colloquial mode", () => {
        const german = "Qwertz – German Standard";
        expect(hasColloquial(ansiIBMLayoutModel, german)).toBe(false);
        expect(hasStandard(ansiIBMLayoutModel, german)).toBe(true);
    });

    it("fails on a board short of any one of the three keys", () => {
        const board = (...frameKeys: string[]): string[][] => [
            ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
            ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
            ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";"],
            ["z", "x", "c", "v", "b", "n", "m", ",", ".", "/"],
            frameKeys,
        ];
        const without = (charMap: string[][], key: string): string[][] =>
            charMap.map((row) => row.filter((label) => label !== key));
        const full = board("'", "-");
        expect(hasStandardLevel(full, true)).toBe(true);
        for (const key of ["'", "-", "/"]) {
            expect(hasStandardLevel(without(full, key), true), key).toBe(false);
        }
        // Dropping the `;` does not: such a board is no longer an English one, and the
        // international pairings carry `;` and `:` on the `,` and `.` keys.
        expect(hasStandardLevel(without(full, ";"), true)).toBe(true);
    });
});

/*
    The pairings have to cover the punctuation of every 32-key frame mapping, or a key on some
    board silently loses its Shift character. `€` is the one character key without a partner:
    no pairing in any language puts one on it.
 */
describe("the international levels cover every 32-key board", () => {
    const combos = allLayoutModels
        .filter((model) => hasNumberRow(model))
        .flatMap((model) => allMappings
            .filter((m) => hasMatchingMapping(model, m))
            .filter((m) => is32KeyType(findMatchingKeymapType(model, m)!.typeId))
            .map((m) => [`${model.name} / ${m.name}`, model, m.name] as const));

    it("covers every 32-key map on every board with a number row", () => {
        expect(combos.length).toBeGreaterThan(100);
    });

    it.each(combos)("%s", (_name, model, mappingName) => {
        for (const colloquial of [false, true]) {
            const mapping = mappingFor(model, mappingName);
            const keymapType = findMatchingKeymapType(model, mapping)!.typeId;
            const charMap = colloquial
                ? colloquialiseCharMap(fillMapping(model, mapping)!, model, keymapType)
                : fillMapping(model, mapping)!;
            const positions = getKeyPositions(model, false, charMap);
            const levels = getKeyLevels(model, positions, charMap, Hand.Left,
                pairingFor(model, mappingName, colloquial));
            const unpaired = positions
                .filter((p) => p.label && !isKeyName(p.label) && !isKeyboardSymbol(p.label))
                .filter((p) => !isLetter(p.label))
                .filter((p) => !levels.shift[p.row][p.col])
                .map((p) => p.label);
            expect(unpaired.filter((label) => label !== "€"), `colloquial=${colloquial}`).toEqual([]);
        }
    });
});

/*
    Which of the two standard pairings a model-specific flex map takes. The German one is the one
    with a `ß?` key, so the letter itself is the discriminator.
 */
describe("the `ß` discriminator", () => {
    it("puts a map that has the letter on the standard German pairings", () => {
        expect(shiftLevelByLabel(ansiIBMLayoutModel, "Qwertz – German Standard")["2"]).toBe("2\"");
    });

    it("leaves a map without it to the international pairings, umlauts or not", () => {
        // Umlauts alone are not the German pairings' business: without the `ß?` key such a map
        // draws ANSI punctuation like `'` and `/`, which those pairings do not know at all.
        const umlautsOnly = [["q", "w", "ü", "ö", "ä", "'", "/", "2"]];
        expect(shiftPairingFor(umlautsOnly, true, false)).toBe(ShiftPairing.GermanInternational);
        expect(getShiftLevel(umlautsOnly, shiftPairsByPairing[shiftPairingFor(umlautsOnly, true, false)]))
            .toEqual([[null, null, null, null, null, "\"", "?", "@"]]);
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
        expect(germanShiftPairs["`~"]).toBe("^°");
        // and a German map that draws `'` means the `#` key
        expect(germanShiftPairs["'"]).toBe("#'");
    });

    it("leave the English maps on the same board with the ANSI pairings", () => {
        const level = shiftLevelByLabel(ansiIBMLayoutModel);
        expect(level["2"]).toBe("2@");
        expect(level["9"]).toBe("9(");
        expect(level["'"]).toBe("'\"");
    });

    it("are the one pairing with no colloquial mode", () => {
        expect(hasColloquial(ansiIBMLayoutModel, german)).toBe(false);
        expect(hasColloquial(ansiIBMLayoutModel)).toBe(true);
    });
});

describe("navigation block", () => {
    it("sits on the wer / asdfg / zxcv keys of the left hand", () => {
        const level = altGrLevelByLabel(ansiIBMLayoutModel, Hand.Left);
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
        const level = altGrLevelByLabel(ansiIBMLayoutModel, Hand.Right);
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
        const level = altGrLevelByLabel(ansiWideLayoutModel, Hand.Right);
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
                blockRow.forEach((char, i) => {
                    if (!char) return;
                    if (row === KeyboardRows.Lower && lowerRowFallbackChars.includes(char)) return;
                    const slot = i - 1;
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
            const chars = Object.values(
                getAltGrLevel(model, positions, pairingFor(model), navSide).flat().filter((c) => c));
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
            const level = altGrLevelByLabel(model, navSide);
            const missing = Object.entries(altGrDigits)
                .filter(([digit, char]) => baseLabels.has(digit) && level[digit] !== char)
                .map(([digit, char]) => `${digit} -> ${char}`);
            expect(missing, `nav on the ${Hand[navSide]} hand`).toEqual([]);
        });
    });
});
