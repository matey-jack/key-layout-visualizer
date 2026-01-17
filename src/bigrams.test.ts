import {describe, expect, it} from "vitest";
import {sumBigramScores} from "./bigrams.ts";
import {ansiIBMLayoutModel} from "./layout/ansiLayoutModel.ts";
import {fillMapping} from "./layout/layout-functions.ts";
import {qwertyMapping} from "./mapping/mappings.ts";

describe("getMovements", () => {
    it("works", () => {
        const charMap = fillMapping(ansiIBMLayoutModel, qwertyMapping);
        const actual = sumBigramScores(ansiIBMLayoutModel, charMap!, qwertyMapping.name);
        expect(actual).toBe(467);
    })
})