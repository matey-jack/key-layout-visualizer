import {describe, expect, it} from "vitest";
import {mapValues} from "./records";

describe("mapValues", () => {
    it("transforms values using the provided function", () => {
        // given
        const obj = { a: 1, b: 2, c: 3 };
        // when
        const result = mapValues(obj, (_, value) => value * 2);
        // then
        expect(result).toEqual({ a: 2, b: 4, c: 6 });
    });

    it("has access to both key and value in the function", () => {
        // given
        const obj = { x: 10, y: 20 };
        // when
        const result = mapValues(obj, (key, value) => `${key}:${value}`);
        // then
        expect(result).toEqual({ x: "x:10", y: "y:20" });
    });

    it("handles empty objects", () => {
        // given
        const obj = {};
        // when
        const result = mapValues(obj, (_, value) => value);
        // then
        expect(result).toEqual({});
    });

    it("handles single entry objects", () => {
        // given
        const obj = { key: "value" };
        // when
        const result = mapValues(obj, (_, value) => value.toUpperCase());
        // then
        expect(result).toEqual({ key: "VALUE" });
    });

});
