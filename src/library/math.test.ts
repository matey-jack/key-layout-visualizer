import {describe, expect, it} from "vitest";
import {formatDecimal, frac, sum} from "./math.ts";

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

describe("formatDecimal", () => {
    it("should format layout fractions to clean decimals", () => {
        expect(formatDecimal(1/3)).toBe('0.33');
        expect(formatDecimal(1/4)).toBe('0.25');
        expect(formatDecimal(1/2)).toBe('0.5');
    });
});
