import {describe, expect, it} from "vitest";
import {SKE_AWAY, SKE_HOME, SKE_INCONV_NEIGHBOR, SKE_LF_UP, SKE_NEIGHBOR} from '../base-model.ts';
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
        expect(actual[SKE_HOME]).toBe(259);
        expect(actual[SKE_LF_UP]).toBe(320);
        expect(actual[SKE_NEIGHBOR]).toBe(326);
        expect(actual[SKE_INCONV_NEIGHBOR]).toBe(103);
        expect(actual[SKE_AWAY]).toBe(20);
    })
});

describe("offHomeRowFrequency", () => {
    it("works", () => {
        const charMap = fillMapping(ansiIBMLayoutModel, qwertyMapping);
        const freq = offHomeRowFrequency(ansiIBMLayoutModel, charMap!, englishFreqs);
        expect(freq).toBe(769);
    })
});