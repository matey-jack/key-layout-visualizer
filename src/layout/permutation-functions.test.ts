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

    it("references a specific grid cell with (r,c) to disambiguate duplicate labels", () => {
        const base: LayoutMapping = [["⇧", "a", "⇧"]];
        // move only the right ⇧ (grid (0,2)) into a's place; a takes that ⇧'s old place.
        expect(permute(base, "(0,2)a")).toEqual([["⇧", "⇧", "a"]]);
    });

    it("moves a placeholder referenced by grid cell, re-encoding it for the new row", () => {
        // grid (0,1) holds FlexMapping [0,7]; moved down into z's cell it becomes row-relative.
        const base: LayoutMapping = [["x", 7], ["y", "z"]];
        expect(permute(base, "(0,1)z")).toEqual([["x", "z"], ["y", [-1, 7]]]);
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

// Full-matrix lock for the Ergoslat MidShift frames, now derived from their LowShift frames by
// permutation. Read back from the Major Ergoslat MidShift model.
describe("Ergoslat MidShift frames (derived by permutation)", () => {
    const mid = majorErgoslatLayoutModel(true);

    it("Ansi30 MidShift matches the expected full matrix", () => {
        expect(mid.frameMappings[KeymapTypeId.Ansi30]).toEqual([
            ["Esc", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "⌫"],
            ["↹", 0, 1, 2, 3, 4, null, 5, 6, 7, 8, 9, "'"],
            ["⇧", 0, 1, 2, 3, 4, "⌦", 5, 6, 7, 8, 9, "⇧"],
            [0, 1, 2, 3, 4, "+", "-", 5, 6, 7, 8, 9],
            ["Ctrl", "Cmd", null, "Alt", "⏎", "⍽", "AltGr", null, "Fn", "Ctrl"],
        ]);
    });

    it("Ansi32 MidShift matches the expected full matrix", () => {
        expect(mid.frameMappings[KeymapTypeId.Ansi32]).toEqual([
            ["Esc", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "⌫"],
            ["↹", 0, 1, 2, 3, 4, null, 5, 6, 7, 8, 9, 10],
            ["⇧", 0, 1, 2, 3, 4, "⌦", 5, 6, 7, 8, 9, "⇧"],
            [0, 1, 2, 3, 4, [-1, 10], "+", 5, 6, 7, 8, 9],
            ["Ctrl", "Cmd", null, "Alt", "⏎", "⍽", "AltGr", null, "Fn", "Ctrl"],
        ]);
    });

    it("Thumb30 MidShift matches the expected full matrix", () => {
        expect(mid.frameMappings[KeymapTypeId.Thumb30]).toEqual([
            ["Esc", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "⌫"],
            ["↹", 0, 1, 2, 3, 4, null, 5, 6, 7, 8, 9, "⏎"],
            ["⇧", 0, 1, 2, 3, 4, "⌦", 5, 6, 7, 8, 9, "⇧"],
            [0, 1, 2, 3, 4, "+", "'", 5, 6, 7, 8, "/"],
            ["Ctrl", "Cmd", null, "Alt", 0, "⍽", "AltGr", null, "Fn", "Ctrl"],
        ]);
    });

    it("Thumb32 MidShift matches the expected full matrix", () => {
        expect(mid.frameMappings[KeymapTypeId.Thumb32]).toEqual([
            ["Esc", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "⌫"],
            ["↹", 0, 1, 2, 3, 4, null, 5, 6, 7, 8, 9, "⏎"],
            ["⇧", 0, 1, 2, 3, 4, "⌦", 5, 6, 7, 8, 9, "⇧"],
            [0, 1, 2, 3, 4, "+", 9, 5, 6, 7, 8, [-2, 10]],
            ["Ctrl", "Cmd", null, "Alt", 0, "⍽", "AltGr", null, "Fn", "Ctrl"],
        ]);
    });
});

// The two ways to build the thumb MidShift frames produce identical matrices. This lets us decide
// purely on readability which derivation to keep (see ergoslatLayoutModel.ts).
describe("thumb MidShift: permute-from-lowshift == patchThumb-from-ansi-midshift", () => {
    const low = majorErgoslatLayoutModel(false);
    const mid = majorErgoslatLayoutModel(true);
    const ANGLE_MOD_LEFT = "[3,0](3,0)⌦+[3,4][3,3][3,2][3,1]";

    it("thumb30", () => {
        const viaThumb = permute(low.frameMappings[KeymapTypeId.Thumb30]!, ANGLE_MOD_LEFT, "/(3,11)'");
        const viaAnsi = patchThumb30(mid.frameMappings[KeymapTypeId.Ansi30]!, "[4,0]⏎'-", "/[3,9]");
        expect(viaThumb).toEqual(viaAnsi);
        expect(viaThumb).toEqual(mid.frameMappings[KeymapTypeId.Thumb30]);
    });

    it("thumb32", () => {
        const viaThumb = permute(low.frameMappings[KeymapTypeId.Thumb32]!, ANGLE_MOD_LEFT, "(3,11)[1,10]");
        const viaAnsi = patchThumb32(mid.frameMappings[KeymapTypeId.Ansi32]!, "[4,0]⏎[1,10][3,9]+[2,10]");
        expect(viaThumb).toEqual(viaAnsi);
        expect(viaThumb).toEqual(mid.frameMappings[KeymapTypeId.Thumb32]);
    });
});
