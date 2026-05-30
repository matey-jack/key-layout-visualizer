import {describe, expect, it} from "vitest";
import {enumValues} from "./enum.ts";

enum NumericEnum {
    A,
    B,
    C,
}

describe("enumValues", () => {
    it("extracts numeric values from an enum", () => {
        const values = enumValues<NumericEnum>(NumericEnum);
        expect(values).toEqual([NumericEnum.A, NumericEnum.B, NumericEnum.C]);
    });
});
