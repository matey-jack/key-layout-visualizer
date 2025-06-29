import {describe, it, expect} from 'vitest';

import {harmonicLayoutModel} from "./harmonicLayoutModel.ts";
import {fillMapping, Finger, Hand, hand} from "./layout-model.ts";
import {qwertyMapping} from "../mapping/mappings.ts"
import {harmonicComparisonBaseline} from "../mapping/harmonic-mappings.ts";
import {ansiLayoutModel} from "./ansiLayoutModel.ts";
import {orthoLayoutModel} from "./orthoLayoutModel.ts";
import {KeyboardRows} from "../model.ts";

describe('fillMapping', () => {
    it('Harmonic layout 30-key qwerty', () => {
        const actual = fillMapping(harmonicLayoutModel, qwertyMapping);
        expect(actual[0]).toStrictEqual(["Esc", "1", "2", "3", "4", "5", "6", "-", "7", "8", "9", "0", "="]);
        expect(actual[1]).toStrictEqual(["↹", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "⌫",]);
        expect(actual[2]).toStrictEqual(["`", "a", "s", "d", "f", "g", "\\", "h", "j", "k", "l", ";", "'"]);
        expect(actual[3]).toStrictEqual(["⇧", "z", "x", "c", "v", "b", "/", "n", "m", ",", ".", "⇧",]);
        expect(actual[4]).toStrictEqual(["Ctrl", "Cmd", "Alt", "[", "⍽", "⏎", "]", "AltGr", "Fn", "Ctrl",]);
    });

    it('Harmonic layout full qwerty', () => {
        const with30 = fillMapping(harmonicLayoutModel, qwertyMapping);
        const full = fillMapping(harmonicLayoutModel, harmonicComparisonBaseline);
        with30.forEach((row30, r) => {
            expect(row30).toStrictEqual(full[r])
        })
    });
});

describe('finger assignment consistency', () => {
    it('Harmonic', () => {
        harmonicLayoutModel.fullMapping!!.forEach((mappingRow, r) => {
            expect(mappingRow.length, `${KeyboardRows[r]}Row`).toBe(harmonicLayoutModel.mainFingerAssignment[r].length)
        })
    });

    it('ANSI', () => {
        ansiLayoutModel.thirtyKeyMapping.forEach((mappingRow, r) => {
            expect(mappingRow.length, `${KeyboardRows[r]}Row`).toBe(ansiLayoutModel.mainFingerAssignment[r].length)
        })
    });

    it('Ortho', () => {
        orthoLayoutModel.thirtyKeyMapping.forEach((mappingRow, r) => {
            expect(mappingRow.length, `${KeyboardRows[r]}Row`).toBe(orthoLayoutModel.mainFingerAssignment[r].length)
        })
    });
})

describe('hand function', () => {
    it('works', () => {
        expect(hand(Finger.LPinky)).toBe(Hand.Left)
        expect(hand(Finger.LThumb)).toBe(Hand.Left)
        expect(hand(Finger.RThumb)).toBe(Hand.Right)
        expect(hand(Finger.RPinky)).toBe(Hand.Right)
    });
});
