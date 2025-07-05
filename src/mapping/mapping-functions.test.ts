import {describe, it, expect} from "vitest";
import {ansiLayoutModel} from "../layout/ansiLayoutModel.ts";
import {qwertyMapping} from "./mappings.ts";
import {sumKeyFrequenciesByEffort} from "./mapping-functions.ts";

describe("sumKeyFrequenciesByEffort", () => {
    it("works", () => {
        const actual = sumKeyFrequenciesByEffort(ansiLayoutModel, qwertyMapping);
        const numCategories = Object.entries(actual).length;
        expect(numCategories).toBe(5);
    })
});