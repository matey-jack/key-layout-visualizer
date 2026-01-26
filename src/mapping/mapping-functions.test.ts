import {describe, it, expect} from "vitest";
import {ansiIBMLayoutModel} from "../layout/ansiLayoutModel.ts";
import {qwertyMapping} from "./baseMappings.ts";
import {sumKeyFrequenciesByEffort} from "./mapping-functions.ts";
import {fillMapping} from "../layout/layout-functions.ts";
import {singleCharacterFrequencies as englishFreqs} from "../frequencies/english-single-character-frequencies.ts";

describe("sumKeyFrequenciesByEffort", () => {
    it("works", () => {
        const charMap = fillMapping(ansiIBMLayoutModel, qwertyMapping);
        const actual = sumKeyFrequenciesByEffort(ansiIBMLayoutModel, charMap!, englishFreqs);
        const numCategories = Object.entries(actual).length;
        expect(numCategories).toBe(5);
    })
});