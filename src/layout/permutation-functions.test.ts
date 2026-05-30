import {describe, expect, it} from "vitest";
import {KeymapTypeId, type LayoutMapping} from "../base-model.ts";
import {majorErgoslatLayoutModel} from "./ergoslatLayoutModel.ts";
import {patchThumb30, patchThumb32, permute} from "./permutation-functions.ts";

describe("permute", () => {
    it("swaps two labels (a 2-cycle)", () => {
        const base: LayoutMapping = [["a", "b", "c"]];
        expect(permute(base, "ab")).toEqual([["b", "a", "c"]]);
    });

    it("rotates a 3-cycle: 'abc' means a->b's place, b->c's place, c->a's place", () => {
        const base: LayoutMapping = [["a", "b", "c"]];
        expect(permute(base, "abc")).toEqual([["c", "a", "b"]]);
    });

    it("applies several cycles left to right", () => {
        const base: LayoutMapping = [["a", "b", "c", "d"]];
        expect(permute(base, "ab", "cd")).toEqual([["b", "a", "d", "c"]]);
    });

    it("references placeholder cells by [flexRow,col] and stores them row-relative", () => {
        // (0,1) is FlexMapping [0,10]; (1,1) is FlexMapping [1,20].
        const base: LayoutMapping = [
            ["A", 10],
            ["B", 20],
        ];
        // Swap the two letters across rows: each must be re-encoded relative to its new row.
        expect(permute(base, "[0,10][1,20]")).toEqual([
            ["A", [1, 20]],
            ["B", [-1, 10]],
        ]);
    });

    it("handles an entering key (first) and a leaving key (last) as an open chain", () => {
        // ⏎ moves onto -'s cell, the new letter [1,7] enters where ⏎ was, and - leaves.
        const base: LayoutMapping = [["⏎", "-"]];
        expect(permute(base, "[1,7]⏎-")).toEqual([[[1, 7], "⏎"]]);
    });

    it("does not mutate the base mapping", () => {
        const base: LayoutMapping = [["a", "b"]];
        permute(base, "ab");
        expect(base).toEqual([["a", "b"]]);
    });

    it("throws when an entering key is not the first token", () => {
        const base: LayoutMapping = [["a", "b"]];
        expect(() => permute(base, "a[9,9]")).toThrow(/must be the first token/);
    });

    it("throws when a token matches more than one cell", () => {
        const base: LayoutMapping = [["x", "x"]];
        expect(() => permute(base, "xy")).toThrow(/must be unique/);
    });

    it("throws on a malformed coordinate token", () => {
        const base: LayoutMapping = [["a", 1]];
        expect(() => permute(base, "[1,2")).toThrow(/Unclosed/);
        expect(() => permute(base, "[1]")).toThrow(/Bad coordinate/);
    });
});

describe("patchThumb30 / patchThumb32 invariant checks", () => {
    it("patchThumb30 throws when no letter lands on the thumb", () => {
        // a plain swap adds/removes nothing, so the thumb-letter invariant fails.
        const base: LayoutMapping = [["-", "x"]];
        expect(() => patchThumb30(base, "x-")).toThrow(/patchThumb30/);
    });

    it("patchThumb32 throws when a frame key is added", () => {
        // [4,0] enters (thumb letter) but '-' also leaves -> a label change patchThumb32 forbids.
        const base: LayoutMapping = [["-", 0]];
        expect(() => patchThumb32(base, "[4,0]-")).toThrow(/patchThumb32/);
    });
});

// Full-matrix lock for the Ergoslat thumb frames. They are not exported, so we read them back from
// the Major Ergoslat model. Asserting the whole matrix guards both the cycles in
// ergoslatLayoutModel.ts and the permute() machinery itself. We only pin these for this one model.
describe("Ergoslat thumb frames (derived by permutation)", () => {
    const major = majorErgoslatLayoutModel(false);

    it("Thumb30 matches the expected full matrix", () => {
        expect(major.frameMappings[KeymapTypeId.Thumb30]).toEqual([
            ["Esc", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "⌫"],
            ["↹", 0, 1, 2, 3, 4, null, 5, 6, 7, 8, 9, "⏎"],
            ["⌦", 0, 1, 2, 3, 4, "+", 5, 6, 7, 8, 9, "'"],
            ["⇧", 0, 1, 2, 3, 4, "/", 5, 6, 7, 8, "⇧"],
            ["Ctrl", "Cmd", null, "Alt", 0, "⍽", "AltGr", null, "Fn", "Ctrl"],
        ]);
    });

    it("Thumb32 matches the expected full matrix", () => {
        expect(major.frameMappings[KeymapTypeId.Thumb32]).toEqual([
            ["Esc", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "⌫"],
            ["↹", 0, 1, 2, 3, 4, null, 5, 6, 7, 8, 9, "⏎"],
            ["⌦", 0, 1, 2, 3, 4, "+", 5, 6, 7, 8, 9, [-1, 10]],
            ["⇧", 0, 1, 2, 3, 4, 9, 5, 6, 7, 8, "⇧"],
            ["Ctrl", "Cmd", null, "Alt", 0, "⍽", "AltGr", null, "Fn", "Ctrl"],
        ]);
    });
});
