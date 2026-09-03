import {describe, expect, it} from "vitest";
import {type FlexMapping, Hand, KeymapTypeId, type LayoutModel} from "../base-model.ts";
import {majorErgoslatLayoutModel, numberlessErgoslatLayoutModel} from "../layout/ergoslatLayoutModel.ts";
import {fillMapping, getKeyPositions, hasMatchingMapping} from "../layout/layout-functions.ts";
import {getKeyLevels} from "./key-levels.ts";
import {allMappings} from "./mappings.ts";
import {numberlessCharMap} from "./numberless-key-levels.ts";

const numberless = numberlessErgoslatLayoutModel(false);

const ansi30Mappings = allMappings.filter((m) => hasMatchingMapping(numberless, m));
const mappingFor = (name?: string): FlexMapping =>
    name ? ansi30Mappings.find((m) => m.name === name)! : ansi30Mappings[0];

/*
    The three levels as label -> character maps, which is how the diagrams read. The char map goes
    through numberlessCharMap before the positions are computed, exactly as the app does it.
    `pair` holds the base and Shift characters of every key that has a Shift one.
 */
function levelsByLabel(model: LayoutModel, navSide: Hand, mappingName?: string) {
    const charMap = numberlessCharMap(fillMapping(model, mappingFor(mappingName))!, model);
    const positions = getKeyPositions(model, false, charMap);
    const levels = getKeyLevels(model, positions, charMap, KeymapTypeId.Ansi30, navSide, false);
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
        ansi30Mappings.forEach((mapping) => {
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

    it("leaves the spot `!` would take free, since the `-!` key makes it redundant", () => {
        const {shaft} = levelsByLabel(numberless, Hand.Left);
        expect(shaft["z"]).toBeUndefined();
    });

    // Both hands keep their centre column – the index finger's stretch – free.
    it("spells navigation out in-line, flush on the fingers' home keys", () => {
        const left = levelsByLabel(numberless, Hand.Left).shaft;
        expect("asdf".split("").map((k) => left[k])).toEqual(["←", "↑", "↓", "→"]);
        expect(["j", "k", "l", "="].map((k) => left[k])).toEqual(["⇤", "⇞", "⇟", "⇥"]);
        expect(left["g"]).toBeUndefined();
        expect(left["h"]).toBeUndefined();
        // Delete goes on the single key between the hands.
        expect(left["'"]).toBe("⌦");
    });

    it("swaps the two nav groups with the nav side", () => {
        const right = levelsByLabel(numberless, Hand.Right).shaft;
        expect("asdf".split("").map((k) => right[k])).toEqual(["⇤", "⇞", "⇟", "⇥"]);
        expect(["j", "k", "l", "="].map((k) => right[k])).toEqual(["←", "↑", "↓", "→"]);
        expect(right["'"]).toBe("⌦");
    });

    it("carries all ten digits and all ten of their Shift characters, whatever the key map", () => {
        ansi30Mappings.forEach((mapping) => {
            const chars = Object.values(levelsByLabel(numberless, Hand.Left, mapping.name).shaft);
            [..."1234567890", ..."@#$%^&*()"].forEach((char) => {
                expect(chars, `${mapping.name}: ${char}`).toContain(char);
            });
        });
    });
});

describe("the MidShift variant", () => {
    // Only the two modifier keys swap places there, so every character level stays where it is.
    it("leaves all three levels where the LowShift board has them", () => {
        const midShift = levelsByLabel(numberlessErgoslatLayoutModel(true), Hand.Left);
        const lowShift = levelsByLabel(numberless, Hand.Left);
        expect(midShift.pair).toEqual(lowShift.pair);
        expect(midShift.shaft).toEqual(lowShift.shaft);
    });
});
