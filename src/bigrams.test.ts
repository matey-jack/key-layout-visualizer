import {describe, expect, it} from "vitest";
import {ansiLayoutModel} from "./layout/ansiLayoutModel.ts";
import {qwertyMapping} from "./mapping/mappings.ts";
import {sumBigramScores} from "./bigrams.ts";

describe("getMovements", () => {
    it("works", () => {
        const actual = sumBigramScores(ansiLayoutModel, qwertyMapping);
        expect(actual).toBe(467);
    })
})