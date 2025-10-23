import {describe, it, expect} from "vitest";
import {ansiLayoutModel} from "../layout/ansiLayoutModel.ts";
import {qwertyMapping} from "./mappings.ts";
import {sumKeyFrequenciesByEffort} from "./mapping-functions.ts";
import {fillMapping} from "../layout/layout-functions.ts";
import {singleCharacterFrequencies as englishFreqs} from "../frequencies/english-single-character-frequencies.ts";

describe("sumKeyFrequenciesByEffort", () => {
    it("works", () => {
        const charMap = fillMapping(ansiLayoutModel, qwertyMapping);
        const actual = sumKeyFrequenciesByEffort(ansiLayoutModel, charMap!, englishFreqs);
        const numCategories = Object.entries(actual).length;
        expect(numCategories).toBe(5);
    })
});