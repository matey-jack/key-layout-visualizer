import {describe, expect, it} from "vitest";
import {frac, sum} from "./math.ts";

describe("sum", () => {
    it("returns the sum of an array of numbers", () => {
        expect(sum([1, 2, 3])).toBe(6);
    });
});

describe("frac", () => {
    it("returns the fractional part of a number", () => {
        expect(frac(3.75)).toBeCloseTo(0.75);
    });
});
