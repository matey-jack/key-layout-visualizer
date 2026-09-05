import {describe, expect, it} from "vitest";
import {type FlexMapping, Hand, KeyboardRows, type LayoutModel} from "../base-model.ts";
import {majorErgoslatLayoutModel, numberlessErgoslatLayoutModel} from "../layout/ergoslatLayoutModel.ts";
import {
    fillMapping,
    findMatchingKeymapType,
    getKeyPositions,
    hasMatchingMapping,
} from "../layout/layout-functions.ts";
import {is32KeyType, isGermanAlphabet} from "./key-level-functions.ts";
import {getKeyLevels, shiftPairingFor} from "./key-levels.ts";
import {allMappings} from "./mappings.ts";
import {numberlessCharMap} from "./numberless-key-levels.ts";

const numberless = numberlessErgoslatLayoutModel(false);

// The board takes both the 30-key flex maps and the 32-key ones, and the two get different
// levels: the thirty-key maps the English blend, the others the international one.
const numberlessMappings = allMappings.filter((m) => hasMatchingMapping(numberless, m));
const is32Key = (m: FlexMapping) => is32KeyType(findMatchingKeymapType(numberless, m)!.typeId);
const thirtyKeyMappings = numberlessMappings.filter((m) => !is32Key(m));
const internationalMappings = numberlessMappings.filter(is32Key);
const mappingFor = (name?: string): FlexMapping =>
    name ? numberlessMappings.find((m) => m.name === name)! : thirtyKeyMappings[0];

const GERMAN = "Qwertz – German Standard";
const DANISH = "Danish Alphabet";

/*
    The three levels as label -> character maps, which is how the diagrams read. The char map goes
    through numberlessCharMap before the positions are computed, exactly as the app does it.
    `pair` holds the base and Shift characters of every key that has a Shift one.
 */
function levelsByLabel(model: LayoutModel, navSide: Hand, mappingName?: string) {
    const charMap = numberlessCharMap(fillMapping(model, mappingFor(mappingName))!, model);
    const positions = getKeyPositions(model, false, charMap);
    const levels = getKeyLevels(model, positions, charMap, navSide,
        shiftPairingFor(charMap, false, false));
    const pair: Record<string, string> = {};
    const shaft: Record<string, string> = {};
    positions.forEach((p) => {
        const shift = levels.shift[p.row][p.col];
        if (shift) pair[p.label] = (levels.base[p.row][p.col] ?? p.label) + shift;
        const altGr = levels.altGr[p.row][p.col];
        if (altGr) shaft[p.label] = altGr;
    });
    return {charMap, pair, shaft};
}

describe("the numberless base and Shift levels", () => {
    it("keeps everyday punctuation, and `!` with it", () => {
        const {pair} = levelsByLabel(numberless, Hand.Left);
        expect(pair[","]).toBe(",;");
        expect(pair["."]).toBe(".:");
        expect(pair["/"]).toBe("/?");
        expect(pair["'"]).toBe("'\"");
        expect(pair["-"]).toBe("-!");
    });

    it("dissolves the `;` key and spends the spot it frees on `=+`", () => {
        thirtyKeyMappings.forEach((mapping) => {
            const {charMap, pair} = levelsByLabel(numberless, Hand.Left, mapping.name);
            expect(charMap.flat(), mapping.name).not.toContain(";");
            expect(pair["="], mapping.name).toBe("=+");
        });
    });

    it("leaves a board that has a number row alone", () => {
        const numbered = majorErgoslatLayoutModel(false);
        const charMap = fillMapping(numbered, mappingFor())!;
        expect(numberlessCharMap(charMap, numbered)).toBe(charMap);
    });
});

describe("the numberless Shaft level", () => {
    it("puts the digits where the number row would be", () => {
        const {shaft} = levelsByLabel(numberless, Hand.Left);
        expect("qwert".split("").map((k) => shaft[k])).toEqual(["1", "2", "3", "4", "5"]);
        expect("yuiop".split("").map((k) => shaft[k])).toEqual(["6", "7", "8", "9", "0"]);
    });

    /*
        The lower letter row shares its key columns with the number row exactly, so its Shift
        characters land on the very keys their digits sit above – `(` and `)` between the others.
     */
    it("puts the number row's Shift characters on the lower letter row", () => {
        const {shaft} = levelsByLabel(numberless, Hand.Left);
        expect("xcvb".split("").map((k) => shaft[k])).toEqual(["@", "#", "$", "%"]);
        expect(["/", "n", "m", ",", "."].map((k) => shaft[k])).toEqual(["^", "&", "*", "(", ")"]);
    });

    // The nav groups take the eight home keys and nothing else: both hands keep their centre
    // column – the index finger's stretch – free, and so does the key between the hands.
    it("spells navigation out in-line, flush on the fingers' home keys", () => {
        const left = levelsByLabel(numberless, Hand.Left).shaft;
        expect("asdf".split("").map((k) => left[k])).toEqual(["←", "↑", "↓", "→"]);
        expect(["j", "k", "l", "="].map((k) => left[k])).toEqual(["⇤", "⇞", "⇟", "⇥"]);
        expect(left["g"]).toBeUndefined();
        expect(left["h"]).toBeUndefined();
        expect(left["'"]).toBeUndefined();
    });

    it("swaps the two nav groups with the nav side", () => {
        const right = levelsByLabel(numberless, Hand.Right).shaft;
        expect("asdf".split("").map((k) => right[k])).toEqual(["⇤", "⇞", "⇟", "⇥"]);
        expect(["j", "k", "l", "="].map((k) => right[k])).toEqual(["←", "↑", "↓", "→"]);
    });

    it("carries all ten digits and all ten of their Shift characters, whatever the key map", () => {
        thirtyKeyMappings.forEach((mapping) => {
            const chars = Object.values(levelsByLabel(numberless, Hand.Left, mapping.name).shaft);
            [..."1234567890", ..."@#$%^&*()"].forEach((char) => {
                expect(chars, `${mapping.name}: ${char}`).toContain(char);
            });
        });
    });
});

/*
    A 32-key flex map spends one of its four punctuation spots on a letter, which takes `/?` off
    the board and leaves `-` free to pair with its own `_` again. The Shaft level picks both up.
 */
describe("the numberless levels of a 32-key flex map", () => {
    it("keeps the three punctuation keys such a map has, and nothing else", () => {
        const {pair} = levelsByLabel(numberless, Hand.Left, DANISH);
        expect(pair[","]).toBe(",;");
        expect(pair["."]).toBe(".:");
        expect(pair["-"]).toBe("-_");
        expect(Object.keys(pair).toSorted()).toEqual([",", "-", "."]);
    });

    it("gives `!`, `/` and `?` back to the digits they belong to", () => {
        const {shaft} = levelsByLabel(numberless, Hand.Left, DANISH);
        expect("zxcvb".split("").map((k) => shaft[k])).toEqual(["!", "@", "#", "$", "%"]);
        expect(["-", "n", "m", ",", "."].map((k) => shaft[k])).toEqual(["^", "&", "*", "/", "?"]);
    });

    it("moves `&` and `/` and fits `ß` in on a German key map, at the cost of `^`", () => {
        const {shaft} = levelsByLabel(numberless, Hand.Left, GERMAN);
        expect("yxcvb".split("").map((k) => shaft[k])).toEqual(["!", "@", "#", "$", "%"]);
        expect(["-", "n", "m", ",", "."].map((k) => shaft[k])).toEqual(["&", "/", "*", "ß", "?"]);
    });

    it("carries all ten digits and all ten of their Shift characters, whatever the key map", () => {
        internationalMappings.forEach((mapping) => {
            const {charMap, shaft} = levelsByLabel(numberless, Hand.Left, mapping.name);
            const shifts = isGermanAlphabet(charMap) ? "!@#$%&/*ß?" : "!@#$%^&*/?";
            [..."1234567890", ...shifts].forEach((char) => {
                expect(Object.values(shaft), `${mapping.name}: ${char}`).toContain(char);
            });
        });
    });

    // The two spots the 32-key map has beyond a 30-key one take the places of the `'` and `-`
    // keys, which puts the home row's own eleventh letter at the end of the row.
    it("spends the frame's two punctuation keys on the map's extra letters", () => {
        const {charMap} = levelsByLabel(numberless, Hand.Left, GERMAN);
        expect(charMap[KeyboardRows.Home].join("")).toBe("↹asdfgühjklöä");
    });

    it("takes Return up to the end of the home row on the thumb frame", () => {
        const {charMap} = levelsByLabel(numberless, Hand.Left, "German Quipper Thumby");
        expect(charMap[KeyboardRows.Home].at(-1)).toBe("⏎");
        expect(charMap[KeyboardRows.Bottom][4]).toBe("t");
    });
});

describe("the MidShift variant", () => {
    // Only the two modifier keys swap places there, so every character level stays where it is.
    // On the 32-key frame a letter moves along with them, but it carries no level of its own.
    it.each([undefined, GERMAN])("leaves all three levels where the LowShift board has them", (name) => {
        const midShift = levelsByLabel(numberlessErgoslatLayoutModel(true), Hand.Left, name);
        const lowShift = levelsByLabel(numberless, Hand.Left, name);
        expect(midShift.pair).toEqual(lowShift.pair);
        expect(midShift.shaft).toEqual(lowShift.shaft);
    });
});
