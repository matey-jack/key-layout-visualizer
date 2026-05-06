import {describe, expect, it} from "vitest";
import {singleCharacterFrequencies as englishFreqs} from "../frequencies/english-single-character-frequencies.ts";
import {ansiIBMLayoutModel} from "../layout/ansiLayoutModel.ts";
import {fillMapping} from "../layout/layout-functions.ts";
import {qwertyMapping} from "./baseMappings.ts";
import {offHomeRowFrequency, sumKeyFrequenciesByEffort} from "./mapping-functions.ts";

describe("sumKeyFrequenciesByEffort", () => {
    it("works", () => {
        const charMap = fillMapping(ansiIBMLayoutModel, qwertyMapping);
        const actual = sumKeyFrequenciesByEffort(ansiIBMLayoutModel, charMap!, englishFreqs);
        const numCategories = Object.entries(actual).length;
        expect(numCategories).toBe(5);
    })
});

describe("offHomeRowFrequency", () => {
    it("works", () => {
        const charMap = fillMapping(ansiIBMLayoutModel, qwertyMapping);
        const freq = offHomeRowFrequency(ansiIBMLayoutModel, charMap!, englishFreqs);
        expect(freq).toBe(769);
    })
});