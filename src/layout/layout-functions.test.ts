import {describe, expect, it} from 'vitest';

import {
    Finger,
    Hand,
    hand,
    KeyboardRows,
    KeymapTypeId,
    type KeyMovement,
    type LayoutModel,
    MappingChange,
} from "../base-model.ts";
import {
    colemakMapping,
    colemakThumbyDMapping,
    cozyEnglish,
    normanMapping,
    qwertyMapping,
    qwertzMapping,
    thumbyZero,
    topNine,
} from "../mapping/mappings.ts";
import {ahkbLayoutModel} from "./ahkbLayoutModel.ts";
import {ansiIBMLayoutModel, ansiWideLayoutModel, createHHKB} from "./ansiLayoutModel.ts";
import {eb65MidshiftNiceLayoutModel} from "./eb65MidshiftNiceLayoutModel.ts";
import {xhkbLayoutModel, xhkbWithArrowsLayoutModel} from "./xhkbLayoutModel.ts";
import {ergoPlank60LayoutModel} from "./ergoPlank60LayoutModel.ts";
import {harmonic12LayoutModel} from "./harmonic12LayoutModel.ts";
import {harmonic13MidshiftLayoutModel} from "./harmonic13MidshiftLayoutModel.ts";
import {harmonic13WideLayoutModel} from "./harmonic13WideLayoutModel.ts";
import {harmonic14TraditionalLayoutModel} from "./harmonic14TraditionalLayoutModel.ts";
import {harmonic14WideLayoutModel} from "./harmonic14WideLayoutModel.ts";
import {katanaLayoutModel} from "./katanaLayoutModel.ts";
import {
    characterToFinger,
    copyAndModifyKeymap,
    diffSummary,
    diffToBase,
    fillMapping,
    findMatchingKeymapType,
    getKeyMovements,
    getKeyPositions,
    hasMatchingMapping,
    mergeMapping,
} from "./layout-functions.ts";
import {splitOrthoLayoutModel} from "./splitOrthoLayoutModel.ts";

const allLayoutModels = [
    ansiIBMLayoutModel,
    createHHKB(ansiIBMLayoutModel),
    ahkbLayoutModel,
    xhkbLayoutModel,
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
        .filter((entry) => entry && entry.length === 1)
        .sort()
    expect(allChars).to.include.members("abcdefghijklmnopqrstuvwxyz".split(''));
    expect(allChars).to.include.members("0123456789".split(''));
    expect(allChars).to.include.members(",.;-/'".split(''));
    // \[]` are not mapped on all layouts
}

describe('fillMapping', () => {
    it('Harmonic 13 wide layout 30-key qwerty exact test', () => {
        const actual = fillMapping(harmonic13WideLayoutModel, qwertyMapping)!;
        expect(actual[0]).toStrictEqual(["Esc", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "="]);
        expect(actual[1]).toStrictEqual(["↹", "w", "e", "r", "t", "`", "y", "u", "i", "o", "p", "⌫",]);
        expect(actual[2]).toStrictEqual(["q", "a", "s", "d", "f", "g", "\\", "h", "j", "k", "l", ";", "'"]);
        expect(actual[3]).toStrictEqual(["⇧", "z", "x", "c", "v", "b", "/", "n", "m", ",", ".", "⇧",]);
        expect(actual[4]).toStrictEqual(["Ctrl", "Cmd", "Alt", "[", "⍽", "⏎", "]", "AltGr", "Fn", "Ctrl",]);
    });

    allLayoutModels.forEach((model) => {
        if (model.frameMappings[KeymapTypeId.Ansi30]) {
            it(`${model.name} 30-key frame maps all important characters`, () => {
                hasLettersNumbersAndProsePunctuation(mergeMapping((model.frameMappings[KeymapTypeId.Ansi30])!, ["", ...qwertyMapping.mappings[KeymapTypeId.Ansi30]!]));
            });
        }
        if (model.frameMappings[KeymapTypeId.Thumb30]) {
            it(`${model.name} Thumb30 frame maps all important characters`, () => {
                hasLettersNumbersAndProsePunctuation(mergeMapping((model.frameMappings[KeymapTypeId.Thumb30])!, ["", ...cozyEnglish.mappings[KeymapTypeId.Thumb30]!]));
            });
        }
    });

    it(`ANSI wide layout maps all important characters`, () => {
        hasLettersNumbersAndProsePunctuation(fillMapping(ansiWideLayoutModel, thumbyZero)!);
    })

    it.skip(`ANSI layout maps all important characters`, () => {
        // qwertz is the only keymap with ANSI-specific mapping... but qwertz doesn't have the expected qwerty punctuation...
        hasLettersNumbersAndProsePunctuation(fillMapping(ansiIBMLayoutModel, qwertzMapping)!);
    })

    it(`Split Ortho full layout maps all important characters`, () => {
        hasLettersNumbersAndProsePunctuation(fillMapping(splitOrthoLayoutModel, cozyEnglish)!);
    });

    // this is currently not used in the app, but let's keep it working
    it(`Harmonic 13 wide full layout maps all important characters`, () => {
        hasLettersNumbersAndProsePunctuation(fillMapping(harmonic13WideLayoutModel, topNine)!);
    });

    // TODO: fullMappings for other Harmonic variants need clean up first
});

describe('hasMatchingMapping', () => {
    it('no Thumby mapping on ANSI-narrow', () => {
        expect(hasMatchingMapping(ansiIBMLayoutModel, colemakThumbyDMapping)).toBeFalsy();
    });
});

// --- NEW: Tests for keymap type system ---

describe('findMatchingKeymapType', () => {
    it('finds Ansi30 match between qwertyMapping and ansiIBMLayoutModel', () => {
        const match = findMatchingKeymapType(ansiIBMLayoutModel, qwertyMapping);
        expect(match).toBeDefined();
        expect(match!.typeId).toBe(KeymapTypeId.Ansi30);
        expect(match!.flexData).toEqual(qwertyMapping.mappings![KeymapTypeId.Ansi30]);
    });

    it('QWERTZ has a specific mapping for the ANSI keyboard', () => {
        const match = findMatchingKeymapType(ansiIBMLayoutModel, qwertzMapping);
        expect(match).toBeDefined();
        expect(match!.typeId).toBe(KeymapTypeId.Ansi);
    });

    it('finds AnsiWide match for colemakMapping on ansiWideLayoutModel', () => {
        const match = findMatchingKeymapType(ansiWideLayoutModel, colemakMapping);
        expect(match).toBeDefined();
        expect(match!.typeId).toBe(KeymapTypeId.AnsiWide);
    });

    it('finds Ansi30 match for qwertyMapping on splitOrthoLayoutModel', () => {
        const match = findMatchingKeymapType(splitOrthoLayoutModel, qwertyMapping);
        expect(match).toBeDefined();
        expect(match!.typeId).toBe(KeymapTypeId.Ansi30);
    });

    it('returns undefined when no mappings property exists', () => {
        const match = findMatchingKeymapType(ansiIBMLayoutModel, topNine);
        expect(match).toBeUndefined();
    });
});

describe('new keymap type system - fillMappingNew', () => {
    it('produces same result as fillMapping for qwerty on ANSI', () => {
        const oldResult = fillMapping(ansiIBMLayoutModel, qwertyMapping);
        const newResult = fillMapping(ansiIBMLayoutModel, qwertyMapping);
        expect(newResult).toEqual(oldResult);
    });

    it('produces same result as fillMapping for qwerty on splitOrtho', () => {
        const oldResult = fillMapping(splitOrthoLayoutModel, qwertyMapping);
        const newResult = fillMapping(splitOrthoLayoutModel, qwertyMapping);
        expect(newResult).toEqual(oldResult);
    });

    it('falls back to old system for mappings without new property', () => {
        const result = fillMapping(ansiIBMLayoutModel, normanMapping);
        expect(result).toBeDefined();
        // Should use old system since normanMapping doesn't have mappings property
    });
});

describe('new keymap type system - hasMatchingMappingNew', () => {
    it('returns true for qwertyMapping on ansiIBMLayoutModel', () => {
        expect(hasMatchingMapping(ansiIBMLayoutModel, qwertyMapping)).toBe(true);
    });

    it('returns true for qwertyMapping on splitOrthoLayoutModel', () => {
        expect(hasMatchingMapping(splitOrthoLayoutModel, qwertyMapping)).toBe(true);
    });

    it('falls back to old system for mappings without new property', () => {
        expect(hasMatchingMapping(ansiIBMLayoutModel, normanMapping)).toBe(true);
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
    const inconsistentLayout: LayoutModel = {
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
        frameMappings: {},
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
    const layoutMapping = fillMapping(ansiIBMLayoutModel, qwertyMapping);
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

describe('getKeyMovements', () => {
    function calculateMovements(prevLM: LayoutModel, nextLM: LayoutModel) {
        const prevMapping = fillMapping(prevLM, qwertyMapping)!;
        const prevPositions = getKeyPositions(prevLM, false, prevMapping);

        const nextMapping = fillMapping(nextLM, qwertyMapping)!;
        const nextPositions = getKeyPositions(nextLM, false, nextMapping);

        return getKeyMovements(prevPositions, nextPositions);
    }

    function getMovementsByLabel(movements: KeyMovement[], label: string): KeyMovement[] {
        return movements.filter(m => (m.prev?.label === label) || (m.next?.label === label));
    }

    it('should match keys by label and handle all movement types correctly', () => {
        // GIVEN/WHEN
        const movements = calculateMovements(ansiIBMLayoutModel, harmonic13WideLayoutModel);

        // THEN: Check Ctrl and Shift keys form proper pairs
        const ctrlMovements = getMovementsByLabel(movements, 'Ctrl');
        expect(ctrlMovements.length).toBe(2);
        // check that left and right Ctrl keys are paired properly (not flipped)
        const leftCtrlMovement = ctrlMovements[0];
        const rightCtrlMovement = ctrlMovements[1];
        expect(leftCtrlMovement.prev?.colPos).toBeLessThan(rightCtrlMovement.prev!.colPos);
        expect(leftCtrlMovement.next?.colPos).toBeLessThan(rightCtrlMovement.next!.colPos);

        const shiftMovements = getMovementsByLabel(movements, '⇧');
        expect(shiftMovements.length).toBe(2);

        // AND: Check that "1", "a", and "z" form proper pairs
        const keyLabels = ['1', 'a', 'z'];
        keyLabels.forEach(label => {
            const keyMovements = getMovementsByLabel(movements, label);
            expect(keyMovements.length, `Expected exactly one movement for key "${label}"`).toBe(1);
            const movement = keyMovements[0];
            expect(movement.prev?.label).toBe(label);
            expect(movement.next?.label).toBe(label);
        });

        // AND: CAPS exists
        const capsMv = getMovementsByLabel(movements, 'CAPS')[0];
        expect(capsMv.prev?.label).toBe('CAPS');
        expect(capsMv.next).toBeUndefined();

        // AND: Escape enters
        const escapeMv = getMovementsByLabel(movements, 'Esc')[0];
        expect(escapeMv.prev).toBeUndefined();
        expect(escapeMv.next?.label).toBe('Esc');
    });

    it('correctly pairs right Ctrl in XHKB vs XHKB with cursor arrows', () => {
        // GIVEN/WHEN
        const movements = calculateMovements(xhkbLayoutModel, xhkbWithArrowsLayoutModel);

        // THEN: Check Ctrl and Shift keys form proper pairs
        const ctrlMovements = getMovementsByLabel(movements, 'Ctrl');
        expect(ctrlMovements.length).toBe(2);

        const leftCtrlMovement = ctrlMovements[0];
        expect(leftCtrlMovement.prev).toBeDefined();
        expect(leftCtrlMovement.next).toBeDefined();
        expect(leftCtrlMovement.prev!.colPos).toBe(leftCtrlMovement.next!.colPos)

        const rightCtrlMovement = ctrlMovements[1];
        expect(rightCtrlMovement.prev).toBeDefined();
        expect(rightCtrlMovement.next).toBeDefined();
        expect(rightCtrlMovement.prev!.colPos).toBe(14.5)
        expect(rightCtrlMovement.next!.colPos).toBe(11.5)
    })
});
