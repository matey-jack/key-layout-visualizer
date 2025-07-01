import {describe, expect, it} from 'vitest';

import {harmonicLayoutModel} from "./harmonicLayoutModel.ts";
import {characterToFinger, diffToQwerty, fillMapping, Finger, Hand, hand} from "./layout-model.ts";
import {cozyMapping, qwertyMapping} from "../mapping/mappings.ts"
import {harmonicComparisonBaseline} from "../mapping/harmonic-mappings.ts";
import {ansiLayoutModel, ansiWideLayoutModel} from "./ansiLayoutModel.ts";
import {orthoLayoutModel, splitOrthoLayoutModel} from "./orthoLayoutModel.ts";
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

const allLayoutModels = {
    'ANSI': ansiLayoutModel,
    'Harmonic': harmonicLayoutModel,
    'Ortho': orthoLayoutModel,
    'Split Ortho': splitOrthoLayoutModel,
};

describe('finger assignment consistency', () => {
    Object.entries(allLayoutModels).forEach(([name, model]) => {
        it(name, () => {
            model.fullMapping!!.forEach((mappingRow, r) => {
                expect(mappingRow.length, `${KeyboardRows[r]}Row`).toBe(model.mainFingerAssignment[r].length)
            });
        });
    });
});

describe('key effort consistency', () => {
    Object.entries(allLayoutModels).forEach(([name, model]) => {
        it(name, () => {
            model.fullMapping!!.forEach((mappingRow, r) => {
                expect(model.singleKeyEffort[r].length, `${KeyboardRows[r]}Row`).toBe(mappingRow.length)
            });
        });
    });
});

describe('hand function', () => {
    it('works', () => {
        expect(hand(Finger.LPinky)).toBe(Hand.Left)
        expect(hand(Finger.LThumb)).toBe(Hand.Left)
        expect(hand(Finger.RThumb)).toBe(Hand.Right)
        expect(hand(Finger.RPinky)).toBe(Hand.Right)
    });
});

describe('diffToQwerty', () => {
    const cozyDiff = diffToQwerty(ansiWideLayoutModel, cozyMapping)
});

describe('characterToFinger for ANSI Qwerty', () => {
    const layoutMapping = fillMapping(ansiLayoutModel, qwertyMapping);
    const fingering = ansiLayoutModel.mainFingerAssignment;
    const actual = characterToFinger(fingering, layoutMapping);

    it('maps number row characters to correct fingers', () => {
        expect(actual['`~']).toBe(Finger.LRing);
        expect(actual['1']).toBe(Finger.LRing);
        expect(actual['2']).toBe(Finger.LRing);
        expect(actual['3']).toBe(Finger.LMiddle);
        expect(actual['4']).toBe(Finger.LMiddle);
        expect(actual['5']).toBe(Finger.LIndex);
        expect(actual['6']).toBe(Finger.LIndex);
        expect(actual['7']).toBe(Finger.RIndex);
        expect(actual['8']).toBe(Finger.RIndex);
        expect(actual['9']).toBe(Finger.RMiddle);
        expect(actual['0']).toBe(Finger.RRing);
        expect(actual['-']).toBe(Finger.RRing);
        expect(actual['=']).toBe(Finger.RRing);
    });

    it('maps upper letter row characters to correct fingers', () => {
        expect(actual['q']).toBe(Finger.LPinky);
        expect(actual['w']).toBe(Finger.LRing);
        expect(actual['e']).toBe(Finger.LMiddle);
        expect(actual['r']).toBe(Finger.LIndex);
        expect(actual['t']).toBe(Finger.LIndex);
        expect(actual['y']).toBe(Finger.RIndex);
        expect(actual['u']).toBe(Finger.RIndex);
        expect(actual['i']).toBe(Finger.RMiddle);
        expect(actual['o']).toBe(Finger.RRing);
        expect(actual['p']).toBe(Finger.RPinky);
        expect(actual['[']).toBe(Finger.RPinky);
        expect(actual[']']).toBe(Finger.RRing);
    });

    it('maps home row characters to correct fingers', () => {
        expect(actual['a']).toBe(Finger.LPinky);
        expect(actual['s']).toBe(Finger.LRing);
        expect(actual['d']).toBe(Finger.LMiddle);
        expect(actual['f']).toBe(Finger.LIndex);
        expect(actual['g']).toBe(Finger.LIndex);
        expect(actual['h']).toBe(Finger.RIndex);
        expect(actual['j']).toBe(Finger.RIndex);
        expect(actual['k']).toBe(Finger.RMiddle);
        expect(actual['l']).toBe(Finger.RRing);
        expect(actual[';']).toBe(Finger.RPinky);
        expect(actual['\'']).toBe(Finger.RPinky);
    });

    it('maps lower letter row characters to correct fingers', () => {
        expect(actual['z']).toBe(Finger.LRing);
        expect(actual['x']).toBe(Finger.LMiddle);
        expect(actual['c']).toBe(Finger.LIndex);
        expect(actual['v']).toBe(Finger.LIndex);
        expect(actual['b']).toBe(Finger.LIndex);
        expect(actual['m']).toBe(Finger.RIndex);
        expect(actual['j']).toBe(Finger.RIndex);
        expect(actual[',']).toBe(Finger.RMiddle);
        expect(actual['.']).toBe(Finger.RRing);
        expect(actual['/']).toBe(Finger.RPinky);
    });
});