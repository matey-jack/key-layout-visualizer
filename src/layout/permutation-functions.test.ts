import {describe, expect, it} from "vitest";
import {KeymapTypeId, type FrameMapping} from "../base-model.ts";
import {majorErgoslatLayoutModel} from "./ergoslatLayoutModel.ts";
import {patchThumb30, patchThumb32, permute} from "./permutation-functions.ts";

describe("permute", () => {
    it("swaps two labels (a 2-cycle)", () => {
        const base: FrameMapping = [["a", "b", "c"]];
        expect(permute(base, "ab")).toEqual([["b", "a", "c"]]);
    });

    it("rotates a 3-cycle: 'abc' means a->b's place, b->c's place, c->a's place", () => {
        const base: FrameMapping = [["a", "b", "c"]];
        expect(permute(base, "abc")).toEqual([["c", "a", "b"]]);
    });

    it("applies several cycles left to right", () => {
        const base: FrameMapping = [["a", "b", "c", "d"]];
        expect(permute(base, "ab", "cd")).toEqual([["b", "a", "d", "c"]]);
    });

    it("references placeholder cells by [flexRow:col]", () => {
        const base: FrameMapping = [
            ["A", 10],
            ["B", 20],
        ];
        expect(permute(base, "[0:10][1:20]")).toEqual([
            ["A", [1, 20]],
            ["B", [0, 10]],
        ]);
    });

    it("expands [flexRow:c1,c2,...] to one reference per column, in cycle order", () => {
        const base: FrameMapping = [[0, 1, 2, 3]];
        // [0:0,1,2,3] is shorthand for [0:0][0:1][0:2][0:3]: each cell takes the next one's place,
        // and the last wraps into the first, so every value shifts one column to the right.
        expect(permute(base, "[0:0,1,2,3]")).toEqual([[3, 0, 1, 2]]);
        expect(permute(base, "[0:0,1,2,3]")).toEqual(permute(base, "[0:0][0:1][0:2][0:3]"));
    });

    it("handles an entering key (first) and a leaving key (last) as an open chain", () => {
        // ⏎ moves onto -'s cell, the new letter [1:7] enters where ⏎ was, and - leaves.
        const base: FrameMapping = [["⏎", "-"]];
        expect(permute(base, "[1:7]⏎-")).toEqual([[[1, 7], "⏎"]]);
    });

    it("picks the right-most copy of a duplicated label with '>'", () => {
        const base: FrameMapping = [["⇧", "a", "⇧"]];
        // >⇧ is the larger-column ⇧; swap it with a.
        expect(permute(base, ">⇧a")).toEqual([["⇧", "⇧", "a"]]);
    });

    it("picks the left-most copy of a duplicated label with '<'", () => {
        const base: FrameMapping = [["⇧", "a", "⇧"]];
        // <⇧ is the smaller-column ⇧; swap it with a.
        expect(permute(base, "<⇧a")).toEqual([["a", "⇧", "⇧"]]);
    });

    it("compares column index across rows, ignoring row", () => {
        const base: FrameMapping = [["x", "⇧"], ["⇧", "y"]];
        // <⇧ is the column-0 copy (in row 1), not the column-1 copy in row 0; swap it with x.
        expect(permute(base, "<⇧x")).toEqual([["⇧", "⇧"], ["x", "y"]]);
    });

    it("throws when two copies tie for the selected extreme column", () => {
        const base: FrameMapping = [["⇧", "a"], ["⇧", "b"]];
        // both ⇧ are in column 0, so '<' can't choose.
        expect(() => permute(base, "<⇧a")).toThrow(/ambiguous|column/);
    });

    it("throws on a dangling edge prefix", () => {
        expect(() => permute([["⇧"]], "a<")).toThrow(/Dangling/);
    });

    it("does not mutate the base mapping", () => {
        const base: FrameMapping = [["a", "b"]];
        permute(base, "ab");
        expect(base).toEqual([["a", "b"]]);
    });

    it("throws when an entering key is not the first token", () => {
        const base: FrameMapping = [["a", "b"]];
        expect(() => permute(base, "a[9:9]")).toThrow(/must be the first token/);
    });

    it("lets a single-char token stand in for a 2-char label by its first character", () => {
        const base: FrameMapping = [["`~", "a"]];
        // ` has no exact match but uniquely starts the 2-char label `~, so it resolves to it.
        expect(permute(base, "`a")).toEqual([["a", "`~"]]);
    });

    it("prefers an exact single-char match over a 2-char label resolution", () => {
        const base: FrameMapping = [["`", "`~", "a"]];
        // The literal ` exists, so the token binds to it, leaving `~ untouched.
        expect(permute(base, "`a")).toEqual([["a", "`~", "`"]]);
    });

    it("throws when a token matches more than one cell", () => {
        const base: FrameMapping = [["x", "x"]];
        expect(() => permute(base, "xy")).toThrow(/must be unique/);
    });

    it("throws on a malformed coordinate token", () => {
        const base: FrameMapping = [["a", 1]];
        expect(() => permute(base, "[1:2")).toThrow(/Unclosed/);
        expect(() => permute(base, "[1]")).toThrow(/Bad coordinate/);       // missing ':col'
        expect(() => permute(base, "[1,2]")).toThrow(/Bad coordinate/);     // old comma form is rejected
        expect(() => permute(base, "[1:]")).toThrow(/Bad coordinate/);      // empty column
        expect(() => permute(base, "[1:2,]")).toThrow(/Bad coordinate/);    // trailing empty column
    });

    it("resolves easy-to-type abbreviations correctly", () => {
        const base: FrameMapping = [
            ["Ctrl", "Alt", "Cmd", "Shift", "Fn", "CAPS", "☰"]
        ];
        // ^ -> Ctrl, A -> Alt, C -> Cmd, S -> Shift, F -> Fn, P -> CAPS, M -> Menu
        expect(permute(base, "^A", "CS", "FP")).toEqual([
            ["Alt", "Ctrl", "Shift", "Cmd", "CAPS", "Fn", "☰"]
        ]);
    });

    it("resolves multi-target abbreviations like A and S based on presence", () => {
        const base: FrameMapping = [
            ["AltGr", "⇧"]
        ];
        // A should resolve to AltGr, S should resolve to ⇧
        expect(permute(base, "AS")).toEqual([
            ["⇧", "AltGr"]
        ]);
    });

    it("disambiguates multi-target abbreviations using edge indicators", () => {
        const base: FrameMapping = [
            ["Alt", "a", "AltGr"]
        ];
        // <A is Alt, >A is AltGr. Swap them.
        expect(permute(base, "<A>A")).toEqual([
            ["AltGr", "a", "Alt"]
        ]);
    });

    it("falls back to the first candidate if none are present in base", () => {
        const base: FrameMapping = [
            ["a", "b"]
        ];
        // Since no Alt or AltGr exists, A resolves to Alt.
        // As it doesn't exist, we can use it as an entering key.
        expect(permute(base, "Ab")).toEqual([
            ["a", "Alt"]
        ]);
    });
});

describe("patchThumb30 / patchThumb32 invariant checks", () => {
    it("patchThumb30 throws when no letter lands on the thumb", () => {
        // a plain swap adds/removes nothing, so the thumb-letter invariant fails.
        const base: FrameMapping = [["-", "x"]];
        expect(() => patchThumb30(base, "x-")).toThrow(/patchThumb30/);
    });

    it("patchThumb32 throws when a frame key is added", () => {
        // [4:0] enters (thumb letter) but '-' also leaves -> a label change patchThumb32 forbids.
        const base: FrameMapping = [["-", 0]];
        expect(() => patchThumb32(base, "[4:0]-")).toThrow(/patchThumb32/);
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
            ["⌦", 0, 1, 2, 3, 4, "+", 5, 6, 7, 8, 9, [1, 10]],
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
            [0, 1, 2, 3, 4, "+", 9, 5, 6, 7, 8, [2, 10]],
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
            [0, 1, 2, 3, 4, "+", 9, 5, 6, 7, 8, [1, 10]],
            ["Ctrl", "Cmd", null, "Alt", 0, "⍽", "AltGr", null, "Fn", "Ctrl"],
        ]);
    });

});

