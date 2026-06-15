import {describe, expect, it} from 'vitest';
import {KeymapTypeId} from '../base-model.ts';
import {harmonic12LayoutModel} from './harmonic12LayoutModel.ts';
import {harmonic13MidshiftLayoutModel} from './harmonic13MidshiftLayoutModel.ts';
import {harmonic13WideLayoutModel} from './harmonic13WideLayoutModel.ts';
import {alignForHex} from './harmonic-layout-functions.ts';

describe('alignForHex', () => {
    it('alignForHex correctly transforms harmonic12LayoutModel (H12)', () => {
        const result = alignForHex(harmonic12LayoutModel);

        // Verify keyWidths: all rows should have key widths normalized to 1
        result.keyWidths.forEach((row) => {
            row.forEach((width) => {
                expect(width).toBe(1);
            });
        });

        // Verify keyWidths lengths: rows 0 to 3 should match original lengths
        expect(result.keyWidths[0].length).toBe(harmonic12LayoutModel.keyWidths[0].length);
        expect(result.keyWidths[1].length).toBe(harmonic12LayoutModel.keyWidths[1].length);
        expect(result.keyWidths[2].length).toBe(harmonic12LayoutModel.keyWidths[2].length);
        expect(result.keyWidths[3].length).toBe(harmonic12LayoutModel.keyWidths[3].length);

        // Verify that row 4 (bottom row) is replaced by row 2 (home row)
        expect(result.keyWidths[4].length).toBe(result.keyWidths[2].length);
        expect(result.keyWidths[4].length).toBe(12);

        // Verify rowIndent: first element of first row is 1 (not > 1) -> [0, 0.5, 0, 0.5, 0]
        expect(result.rowIndent).toStrictEqual([0, 0.5, 0, 0.5, 0]);

        // Verify frameMappings bottom row gap insertion
        const originalHarmonic12Bottom = harmonic12LayoutModel.frameMappings[KeymapTypeId.Harmonic12]![4];
        const resultHarmonic12Bottom = result.frameMappings[KeymapTypeId.Harmonic12]![4];
        expect(originalHarmonic12Bottom).toStrictEqual(["Ctrl", "Cmd", "Alt", 0, "⍽", "⏎", 1, "AltGr", "Fn", "Ctrl"]);
        expect(resultHarmonic12Bottom).toStrictEqual(["Ctrl", "Cmd", "Alt", null, 0, "⍽", "⏎", 1, null, "AltGr", "Fn", "Ctrl"]);

        const originalAnsi30Bottom = harmonic12LayoutModel.frameMappings[KeymapTypeId.Ansi30]![4];
        const resultAnsi30Bottom = result.frameMappings[KeymapTypeId.Ansi30]![4];
        expect(originalAnsi30Bottom).toStrictEqual(["Ctrl", "Cmd", "Alt", "-", "⍽", "⏎", [3, 9], "AltGr", "Fn", "Ctrl"]);
        expect(resultAnsi30Bottom).toStrictEqual(["Ctrl", "Cmd", "Alt", null, "-", "⍽", "⏎", [3, 9], null, "AltGr", "Fn", "Ctrl"]);
    });

    it('alignForHex correctly transforms harmonic13MidshiftLayoutModel (H13 Midshift)', () => {
        const result = alignForHex(harmonic13MidshiftLayoutModel);

        // Verify keyWidths: all rows should have key widths normalized to 1
        result.keyWidths.forEach((row) => {
            row.forEach((width) => {
                expect(width).toBe(1);
            });
        });

        // Verify keyWidths lengths: rows 0 to 3 should match original lengths
        expect(result.keyWidths[0].length).toBe(harmonic13MidshiftLayoutModel.keyWidths[0].length);
        expect(result.keyWidths[1].length).toBe(harmonic13MidshiftLayoutModel.keyWidths[1].length);
        expect(result.keyWidths[2].length).toBe(harmonic13MidshiftLayoutModel.keyWidths[2].length);
        expect(result.keyWidths[3].length).toBe(harmonic13MidshiftLayoutModel.keyWidths[3].length);

        // Verify that row 4 (bottom row) is replaced by row 2 (home row)
        expect(result.keyWidths[4].length).toBe(result.keyWidths[2].length);
        expect(result.keyWidths[4].length).toBe(12);

        // Verify rowIndent: first element of first row is 1.5 (> 1) -> [0.5, 0, 0.5, 0, 0.5]
        expect(result.rowIndent).toStrictEqual([0.5, 0, 0.5, 0, 0.5]);

        // Verify frameMappings bottom row gap insertion
        const originalHarmonic13MSBottom = harmonic13MidshiftLayoutModel.frameMappings[KeymapTypeId.Harmonic13MS]![4];
        const resultHarmonic13MSBottom = result.frameMappings[KeymapTypeId.Harmonic13MS]![4];
        expect(originalHarmonic13MSBottom).toStrictEqual(["Ctrl", "Cmd", "Alt", 0, "⍽", "⏎", 1, "AltGr", "Fn", "Ctrl"]);
        expect(resultHarmonic13MSBottom).toStrictEqual(["Ctrl", "Cmd", "Alt", null, 0, "⍽", "⏎", 1, null, "AltGr", "Fn", "Ctrl"]);
    });

    it('alignForHex correctly transforms harmonic13WideLayoutModel (H13 Wide)', () => {
        const result = alignForHex(harmonic13WideLayoutModel);

        // Verify keyWidths: all rows should have key widths normalized to 1
        result.keyWidths.forEach((row) => {
            row.forEach((width) => {
                expect(width).toBe(1);
            });
        });

        // Verify keyWidths lengths: rows 0 to 3 should match original lengths
        expect(result.keyWidths[0].length).toBe(harmonic13WideLayoutModel.keyWidths[0].length);
        expect(result.keyWidths[1].length).toBe(harmonic13WideLayoutModel.keyWidths[1].length);
        expect(result.keyWidths[2].length).toBe(harmonic13WideLayoutModel.keyWidths[2].length);
        expect(result.keyWidths[3].length).toBe(harmonic13WideLayoutModel.keyWidths[3].length);

        // Verify that row 4 (bottom row) is replaced by row 2 (home row)
        expect(result.keyWidths[4].length).toBe(result.keyWidths[2].length);
        expect(result.keyWidths[4].length).toBe(13);

        // Verify rowIndent: first element of first row is 1 (not > 1) -> [0, 0.5, 0, 0.5, 0]
        expect(result.rowIndent).toStrictEqual([0, 0.5, 0, 0.5, 0]);

        // Verify frameMappings bottom row gap insertion
        const originalHarmonic13WideBottom = harmonic13WideLayoutModel.frameMappings[KeymapTypeId.Harmonic13Wide]![4];
        const resultHarmonic13WideBottom = result.frameMappings[KeymapTypeId.Harmonic13Wide]![4];
        expect(originalHarmonic13WideBottom).toStrictEqual(["Ctrl", "Cmd", "Alt", 0, "⍽", "⏎", 1, "AltGr", "Fn", "Ctrl"]);
        expect(resultHarmonic13WideBottom).toStrictEqual(["Ctrl", "Cmd", "Alt", null, 0, "⍽", null, "⏎", 1, null, "AltGr", "Fn", "Ctrl"]);
    });
});
