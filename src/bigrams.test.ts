import {describe, expect, it} from "vitest";
import {ansiIBMLayoutModel} from "./layout/ansiLayoutModel.ts";
import {qwertyMapping} from "./mapping/mappings.ts";
import {sumBigramScores} from "./bigrams.ts";
import {fillMapping} from "./layout/layout-functions.ts";

describe("getMovements", () => {
    it("works", () => {
        const charMap = fillMapping(ansiIBMLayoutModel, qwertyMapping);
        const actual = sumBigramScores(ansiIBMLayoutModel, charMap!, qwertyMapping.name);
        expect(actual).toBe(467);
    })
})