import {describe, expect, it} from "vitest";
import {ansiLayoutModel} from "./layout/ansiLayoutModel.ts";
import {qwertyMapping} from "./mapping/mappings.ts";
import {sumBigramScores} from "./bigrams.ts";
import {fillMapping} from "./layout/layout-functions.ts";

describe("getMovements", () => {
    it("works", () => {
        const charMap = fillMapping(ansiLayoutModel, qwertyMapping);
        const actual = sumBigramScores(ansiLayoutModel, charMap!, qwertyMapping.name);
        expect(actual).toBe(467);
    })
})