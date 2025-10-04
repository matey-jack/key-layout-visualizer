import {describe, it, expect} from "vitest";
import {ansiLayoutModel} from "../layout/ansiLayoutModel.ts";
import {qwertyMapping} from "./mappings.ts";
import {sumKeyFrequenciesByEffort} from "./mapping-functions.ts";
import {fillMapping} from "../layout/layout-functions.ts";

describe("sumKeyFrequenciesByEffort", () => {
    it("works", () => {
        const charMap = fillMapping(ansiLayoutModel, qwertyMapping);
        const actual = sumKeyFrequenciesByEffort(ansiLayoutModel, charMap!);
        const numCategories = Object.entries(actual).length;
        expect(numCategories).toBe(5);
    })
});