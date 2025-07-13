import {describe, expect, it} from 'vitest';

import {Finger, Hand, hand, KeyboardRows, MappingChange} from "../base-model.ts";
import {characterToFinger, diffSummary, diffToQwerty, fillMapping, mergeMapping,} from "./layout-functions.ts";
import {normanMapping, qwertyMapping, thumbyNine} from "../mapping/mappings.ts"
import {ansiLayoutModel, ansiWideLayoutModel} from "./ansiLayoutModel.ts";
import {harmonic13WideLayoutModel} from "./harmonic13WideLayoutModel.ts";
import {orthoLayoutModel, splitOrthoLayoutModel} from "./orthoLayoutModel.ts";
import {harmonic13MidShiftLayoutModel} from "./harmonic13MidshiftLayoutModel.ts";
import {harmonic14LayoutModel} from "./harmonic14LayoutModel.ts";
import {harmonic12LayoutModel} from "./harmonic12LayoutModel.ts";

export const allLayoutModels = [
    ansiLayoutModel,
    harmonic14LayoutModel,
    harmonic13WideLayoutModel,
    harmonic13MidShiftLayoutModel,
    harmonic12LayoutModel,
    orthoLayoutModel,
    splitOrthoLayoutModel
];

function hasLettersNumbersAndProsePunctuation(filledMapping: string[][]) {
    const allChars = filledMapping.flat()
        .filter((entry) => entry.length == 1)
    expect(allChars).to.include.members("abcdefghijklmnopqrstuvwxyz".split(''));
    expect(allChars).to.include.members("0123456789".split(''));
    expect(allChars).to.include.members(",.;-/'".split(''));
    // \[]` are not mapped on all layouts
}

describe('fillMapping', () => {
    it('Harmonic 13 wide layout 30-key qwerty exact test', () => {
        const actual = fillMapping(harmonic13WideLayoutModel, qwertyMapping);
        expect(actual[0]).toStrictEqual(["Esc", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "="]);
        expect(actual[1]).toStrictEqual(["↹", "w", "e", "r", "t", "`", "y", "u", "i", "o", "p", "⌫",]);
        expect(actual[2]).toStrictEqual(["q", "a", "s", "d", "f", "g", "\\", "h", "j", "k", "l", ";", "'"]);
        expect(actual[3]).toStrictEqual(["⇧", "z", "x", "c", "v", "b", "/", "n", "m", ",", ".", "⇧",]);
        expect(actual[4]).toStrictEqual(["Ctrl", "Cmd", "Alt", "[", "⍽", "⏎", "]", "AltGr", "Fn", "Ctrl",]);
    });

    allLayoutModels.forEach((model) => {
        if (model.thirtyKeyMapping) {
            it(`${model.name} 30-key frame maps all important characters`, () => {
                hasLettersNumbersAndProsePunctuation(mergeMapping(model.thirtyKeyMapping, ["", ...qwertyMapping.mapping30!!]));
            });
        }
        if (model.thumb30KeyMapping) {
            it(`${model.name} Thumb30 frame maps all important characters`, () => {
                hasLettersNumbersAndProsePunctuation(mergeMapping(model.thumb30KeyMapping!!, ["", ...thumbyNine.mappingThumb30!!]));
            });
        }
    });

    it(`ANSI full layout maps all important characters`, () => {
        hasLettersNumbersAndProsePunctuation(mergeMapping(ansiLayoutModel.fullMapping, thumbyNine.mappingAnsi));
    });

    // this is currently not used in the app, but let's keep it working
    it(`Split Ortho full layout maps all important characters`, () => {
        hasLettersNumbersAndProsePunctuation(mergeMapping(splitOrthoLayoutModel.fullMapping, thumbyNine.mappingSplitOrtho));
    });

    // this is currently not used in the app, but let's keep it working
    it(`Harmonic 13 wide full layout maps all important characters`, () => {
        hasLettersNumbersAndProsePunctuation(mergeMapping(harmonic13WideLayoutModel.fullMapping, thumbyNine.mappingHarmonic13wide));
    });

    // TODO: fullMappings for other Harmonic variants need clean up first
});

describe('finger assignment consistency', () => {
    allLayoutModels.forEach((model) => {
        it(model.name, () => {
            model.fullMapping!!.forEach((mappingRow, r) => {
                expect(mappingRow.length, `${model.name} ${KeyboardRows[r]}Row`).toBe(model.mainFingerAssignment[r].length)
            });
        });
    });
});

describe('key effort consistency', () => {
    allLayoutModels.forEach((model) => {
        it(model.name, () => {
            model.fullMapping!!.forEach((mappingRow, r) => {
                expect(model.singleKeyEffort[r].length, `${model.name} ${KeyboardRows[r]}Row`).toBe(mappingRow.length)
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
    it('works for Norman', () => {
        const normanDiff = diffToQwerty(ansiWideLayoutModel, normanMapping)
        expect(normanDiff['k']).toBe(MappingChange.SwapHands);
        expect(normanDiff['r']).toBe(MappingChange.SwapHands);
        expect(normanDiff['p']).toBe(MappingChange.SameHand);
        expect(normanDiff['h']).toBe(MappingChange.SameHand);
        expect(normanDiff['e']).toBe(MappingChange.SameFinger);
        expect(normanDiff['t']).toBe(MappingChange.SameFinger);
        expect(normanDiff['d']).toBe(MappingChange.SameFinger);
        expect(normanDiff['j']).toBe(MappingChange.SameFinger);
        const summary = diffSummary(normanDiff);
        expect(summary[MappingChange.SwapHands]).toBe(2);
        expect(summary[MappingChange.SameHand]).toBe(2);
        expect(summary[MappingChange.SameFinger]).toBe(11);
        expect(summary[MappingChange.SamePosition]).toBe(17);
    })
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
        expect(actual['z']).toBe(Finger.LPinky);
        expect(actual['x']).toBe(Finger.LRing);
        expect(actual['c']).toBe(Finger.LMiddle);
        expect(actual['v']).toBe(Finger.LIndex);
        expect(actual['b']).toBe(Finger.LIndex);
        expect(actual['m']).toBe(Finger.RIndex);
        expect(actual['j']).toBe(Finger.RIndex);
        expect(actual[',']).toBe(Finger.RMiddle);
        expect(actual['.']).toBe(Finger.RRing);
        expect(actual['/']).toBe(Finger.RPinky);
    });
});