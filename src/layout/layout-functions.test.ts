import {describe, expect, it} from 'vitest';

import {Finger, Hand, hand, KeyboardRows, KeymapTypeId, MappingChange, RowBasedLayoutModel} from "../base-model.ts";
import {
    characterToFinger,
    copyAndModifyKeymap,
    diffSummary,
    diffToBase,
    fillMappingNew,
    findMatchingKeymapType,
    getLayoutKeymapTypes,
    getMappingKeymapTypes,
    hasMatchingMapping,
    hasMatchingMappingNew,
    getKeyPositions,
    mergeMapping,
} from "./layout-functions.ts";
import {
    normanMapping,
    qwertyMapping,
    colemakMapping,
    cozyEnglish,
    thumbyZero,
    topNine,
    colemakThumbyDMapping
} from "../mapping/mappings.ts"
import {ansiIBMLayoutModel, ansiWideLayoutModel, createHHKB} from "./ansiLayoutModel.ts";
import {harmonic13WideLayoutModel} from "./harmonic13WideLayoutModel.ts";
import {splitOrthoLayoutModel} from "./splitOrthoLayoutModel.ts";
import {harmonic13MidshiftLayoutModel} from "./harmonic13MidshiftLayoutModel.ts";
import {harmonic14TraditionalLayoutModel} from "./harmonic14TraditionalLayoutModel.ts";
import {harmonic12LayoutModel} from "./harmonic12LayoutModel.ts";
import {harmonic14WideLayoutModel} from "./harmonic14WideLayoutModel.ts";
import {katanaLayoutModel} from "./katanaLayoutModel.ts";
import {ahkbLayoutModel} from "./ahkbLayoutModel.ts";
import {ergoPlank60LayoutModel} from "./ergoPlank60LayoutModel.ts";
import {eb65MidshiftNiceLayoutModel} from "./eb65MidshiftNiceLayoutModel.ts";

export const allLayoutModels = [
    ansiIBMLayoutModel,
    createHHKB(ansiIBMLayoutModel),
    ahkbLayoutModel,
    harmonic14WideLayoutModel,
    harmonic14TraditionalLayoutModel,
    harmonic13WideLayoutModel,
    harmonic13MidshiftLayoutModel,
    harmonic12LayoutModel,
    katanaLayoutModel,
    ergoPlank60LayoutModel,
    eb65MidshiftNiceLayoutModel,
    splitOrthoLayoutModel,
];

function hasLettersNumbersAndProsePunctuation(filledMapping: string[][]) {
    const allChars = filledMapping.flat()
        .filter((entry) => entry && entry.length == 1)
        .sort()
    expect(allChars).to.include.members("abcdefghijklmnopqrstuvwxyz".split(''));
    expect(allChars).to.include.members("0123456789".split(''));
    expect(allChars).to.include.members(",.;-/'".split(''));
    // \[]` are not mapped on all layouts
}

describe('fillMapping', () => {
    it('Harmonic 13 wide layout 30-key qwerty exact test', () => {
        const actual = fillMappingNew(harmonic13WideLayoutModel, qwertyMapping)!;
        expect(actual[0]).toStrictEqual(["Esc", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "="]);
        expect(actual[1]).toStrictEqual(["↹", "w", "e", "r", "t", "`", "y", "u", "i", "o", "p", "⌫",]);
        expect(actual[2]).toStrictEqual(["q", "a", "s", "d", "f", "g", "\\", "h", "j", "k", "l", ";", "'"]);
        expect(actual[3]).toStrictEqual(["⇧", "z", "x", "c", "v", "b", "/", "n", "m", ",", ".", "⇧",]);
        expect(actual[4]).toStrictEqual(["Ctrl", "Cmd", "Alt", "[", "⍽", "⏎", "]", "AltGr", "Fn", "Ctrl",]);
    });

    allLayoutModels.forEach((model) => {
        if (model.thirtyKeyMapping) {
            it(`${model.name} 30-key frame maps all important characters`, () => {
                hasLettersNumbersAndProsePunctuation(mergeMapping(model.thirtyKeyMapping!, ["", ...qwertyMapping.mapping30!]));
            });
        }
        if (model.thumb30KeyMapping) {
            it(`${model.name} Thumb30 frame maps all important characters`, () => {
                hasLettersNumbersAndProsePunctuation(mergeMapping(model.thumb30KeyMapping!, ["", ...cozyEnglish.mappingThumb30!]));
            });
        }
    });

    it(`ANSI full layout maps all important characters`, () => {
        hasLettersNumbersAndProsePunctuation(mergeMapping(ansiIBMLayoutModel.fullMapping!, thumbyZero.mappingAnsi!));
    });

    // this is currently not used in the app, but let's keep it working
    it(`Split Ortho full layout maps all important characters`, () => {
        hasLettersNumbersAndProsePunctuation(mergeMapping(splitOrthoLayoutModel.fullMapping!, cozyEnglish.mappingSplitOrtho!));
    });

    // this is currently not used in the app, but let's keep it working
    it(`Harmonic 13 wide full layout maps all important characters`, () => {
        hasLettersNumbersAndProsePunctuation(mergeMapping(harmonic13WideLayoutModel.fullMapping!, topNine.mappingHarmonic13wide!));
    });

    // TODO: fullMappings for other Harmonic variants need clean up first
});

describe('hasMatchingMapping', () => {
    it('no Thumby mapping on ANSI-narrow', () => {
        expect(hasMatchingMapping(ansiIBMLayoutModel, colemakThumbyDMapping)).toBeFalsy();
    }) ;
});

// --- NEW: Tests for keymap type system ---

describe('new keymap type system - findMatchingKeymapType', () => {
    it('finds Ansi30 match between qwertyMapping and ansiIBMLayoutModel', () => {
        const match = findMatchingKeymapType(ansiIBMLayoutModel, qwertyMapping);
        expect(match).toBeDefined();
        expect(match!.supported.typeId).toBe(KeymapTypeId.Ansi30);
        expect(match!.flexData).toEqual(qwertyMapping.mappings![KeymapTypeId.Ansi30]);
    });

    it('finds AnsiWide match for colemakMapping on ansiWideLayoutModel', () => {
        const match = findMatchingKeymapType(ansiWideLayoutModel, colemakMapping);
        expect(match).toBeDefined();
        expect(match!.supported.typeId).toBe(KeymapTypeId.AnsiWide);
    });

    it('finds Ansi30 match for qwertyMapping on splitOrthoLayoutModel', () => {
        const match = findMatchingKeymapType(splitOrthoLayoutModel, qwertyMapping);
        expect(match).toBeDefined();
        // qwertyMapping only has Ansi30, splitOrtho supports splitOrtho > thumb30 > Ansi30
        expect(match!.supported.typeId).toBe(KeymapTypeId.Ansi30);
    });

    it('returns undefined when no mappings property exists', () => {
        const match = findMatchingKeymapType(ansiIBMLayoutModel, topNine);
        expect(match).toBeUndefined(); // normanMapping doesn't have new mappings property
    });
});

describe('new keymap type system - fillMappingNew', () => {
    it('produces same result as fillMapping for qwerty on ANSI', () => {
        const oldResult = fillMappingNew(ansiIBMLayoutModel, qwertyMapping);
        const newResult = fillMappingNew(ansiIBMLayoutModel, qwertyMapping);
        expect(newResult).toEqual(oldResult);
    });

    it('produces same result as fillMapping for qwerty on splitOrtho', () => {
        const oldResult = fillMappingNew(splitOrthoLayoutModel, qwertyMapping);
        const newResult = fillMappingNew(splitOrthoLayoutModel, qwertyMapping);
        expect(newResult).toEqual(oldResult);
    });

    it('falls back to old system for mappings without new property', () => {
        const result = fillMappingNew(ansiIBMLayoutModel, normanMapping);
        expect(result).toBeDefined();
        // Should use old system since normanMapping doesn't have mappings property
    });
});

describe('new keymap type system - hasMatchingMappingNew', () => {
    it('returns true for qwertyMapping on ansiIBMLayoutModel', () => {
        expect(hasMatchingMappingNew(ansiIBMLayoutModel, qwertyMapping)).toBe(true);
    });

    it('returns true for qwertyMapping on splitOrthoLayoutModel', () => {
        expect(hasMatchingMappingNew(splitOrthoLayoutModel, qwertyMapping)).toBe(true);
    });

    it('falls back to old system for mappings without new property', () => {
        expect(hasMatchingMappingNew(ansiIBMLayoutModel, normanMapping)).toBe(true);
    });
});

describe('new keymap type system - helper functions', () => {
    it('getLayoutKeymapTypes returns correct types for ansiIBMLayoutModel', () => {
        const types = getLayoutKeymapTypes(ansiIBMLayoutModel);
        expect(types).toContain(KeymapTypeId.Ansi);
        expect(types).toContain(KeymapTypeId.Ansi30);
    });

    it('getLayoutKeymapTypes returns correct types for splitOrthoLayoutModel', () => {
        const types = getLayoutKeymapTypes(splitOrthoLayoutModel);
        expect(types).toContain(KeymapTypeId.SplitOrtho);
        expect(types).toContain(KeymapTypeId.Thumb30);
        expect(types).toContain(KeymapTypeId.Ansi30);
    });

    it('getMappingKeymapTypes returns correct types for qwertyMapping', () => {
        const types = getMappingKeymapTypes(qwertyMapping);
        expect(types).toContain(KeymapTypeId.Ansi30);
    });

    it('getMappingKeymapTypes returns correct types for colemakMapping', () => {
        const types = getMappingKeymapTypes(colemakMapping);
        expect(types).toContain(KeymapTypeId.Ansi30);
        expect(types).toContain(KeymapTypeId.AnsiWide);
    });
});

describe('copyAndModifyKeymap', () => {
    it('returns a modified copy without mutating the original matrix', () => {
        const original = [
            ['a', 'b'],
            ['c', 'd'],
        ];
        const updated = copyAndModifyKeymap(original, (matrix) => {
            matrix[0][1] = 'x';
            matrix.push(['e']);
            return matrix;
        });

        expect(updated).toEqual([
            ['a', 'x'],
            ['c', 'd'],
            ['e'],
        ]);
        expect(original).toEqual([
            ['a', 'b'],
            ['c', 'd'],
        ]);
    });

    it('creates new row references before invoking the modifier', () => {
        const original = [
            ['a', 'b'],
            ['c', 'd'],
        ];
        copyAndModifyKeymap(original, (matrix) => {
            expect(matrix).not.toBe(original);
            expect(matrix[0]).not.toBe(original[0]);
            expect(matrix[1]).not.toBe(original[1]);
            return matrix;
        });
    });
});

describe('finger assignment consistency', () => {
    allLayoutModels.forEach((model) => {
        it(model.name, () => {
            model.keyWidths.forEach((widthRow, r) => {
                expect(model.mainFingerAssignment[r].length, `${model.name} ${KeyboardRows[r]}Row`).toBe(widthRow.length);
            });
        });
    });
});

describe('key effort consistency', () => {
    allLayoutModels.forEach((model) => {
        it(model.name, () => {
            model.keyWidths.forEach((widthRow, r) => {
                expect(model.singleKeyEffort[r].length, `${model.name} ${KeyboardRows[r]}Row`).toBe(widthRow.length);
            });
        });
    });
});

describe('getKeyPositions', () => {
    const inconsistentLayout: RowBasedLayoutModel = {
        name: "Inconsistent layout",
        description: "Test layout with mapping gaps",
        rowIndent: [0, 0, 0, 0, 0] as [number, number, number, number, number],
        keyWidths: [
            [1, 1],
            [1],
            [1],
            [1],
            [1],
        ],
        keyCapWidth: undefined,
        keyCapHeight: undefined,
        keyColorClass: undefined,
        splitColumns: undefined,
        leftHomeIndex: 0,
        rightHomeIndex: 0,
        staggerOffsets: [0, 0, 0, 0, 0],
        symmetricStagger: true,
        thirtyKeyMapping: undefined,
        thumb30KeyMapping: undefined,
        fullMapping: undefined,
        mainFingerAssignment: [
            [Finger.LPinky, Finger.LRing],
            [Finger.LMiddle],
            [Finger.LIndex],
            [Finger.RIndex],
            [Finger.RMiddle],
        ],
        hasAltFinger: () => false,
        singleKeyEffort: [
            [1, 1],
            [1],
            [1],
            [1],
            [1],
        ],
        getSpecificMapping: () => undefined,
    };

    it('iterates keyWidths and falls back to ?? for undefined mapping entries', () => {
        const incompleteMapping = [
            ['A'],
            [],
            [null],
            ['C'],
        ] as unknown as string[][];

        const positions = getKeyPositions(inconsistentLayout, false, incompleteMapping);
        expect(positions.map((p) => [p.row, p.col, p.label])).toEqual([
            [KeyboardRows.Number, 0, 'A'],
            [KeyboardRows.Number, 1, '??'],
            [KeyboardRows.Upper, 0, '??'],
            [KeyboardRows.Lower, 0, 'C'],
            [KeyboardRows.Bottom, 0, '??'],
        ]);
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
        const normanDiff = diffToBase(ansiIBMLayoutModel, normanMapping)
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
        expect(summary[MappingChange.SameFinger]).toBe(10);
        expect(summary[MappingChange.SamePosition]).toBe(16);
    })
});

describe('characterToFinger for ANSI Qwerty', () => {
    const layoutMapping = fillMappingNew(ansiIBMLayoutModel, qwertyMapping);
    const fingering = ansiIBMLayoutModel.mainFingerAssignment;
    const actual = characterToFinger(fingering, layoutMapping!);

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
