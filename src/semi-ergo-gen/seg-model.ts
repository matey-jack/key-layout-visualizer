import type {ReadonlySignal} from '@preact/signals';
import  type {KeyPosition, RenderableLayoutModel} from '../base-model.ts';

export enum NamedTypes {
    Harmonic = "Harmonic",
    Triplex = "Triplex",
    Ergoboard = "Ergoboard",
    Typewriter = "Typewriter",
    Katana = "Katana",
    Ergoplank = "Ergoplank",
    // can't select "Other" by clicking on it; only by changing stagger manually to an unnamed set.
    Other = "Other",
}

export type StaggerDivisor = 4 | 3 | 2;
export type MixableStaggerDivisor = 4 | 2;
export type StaggerSet = [3, 3, 3] | [MixableStaggerDivisor, MixableStaggerDivisor, MixableStaggerDivisor];

// TODO: probably not need it, but I wrote it...
export function isMixedStaggerName(name: NamedTypes): boolean {
    switch (name) {
        case NamedTypes.Typewriter:
        case NamedTypes.Katana:
        case NamedTypes.Ergoplank:
        case NamedTypes.Other:
            return true;
    }
    return false;
}

export function isMixedStagger(stagger: StaggerSet): boolean {
    return stagger[0] === stagger[1] && stagger[1] === stagger[2];
}

export const namedStaggerSets: Partial<Record<NamedTypes, StaggerSet>> = {
    [NamedTypes.Harmonic]: [2, 2, 2],
    [NamedTypes.Triplex]: [3, 3, 3],
    [NamedTypes.Ergoboard]: [4, 4, 4],
    [NamedTypes.Typewriter]: [2, 4, 2],
    [NamedTypes.Katana]: [2, 4, 4],
    [NamedTypes.Ergoplank]: [4, 4, 2],
};

export const defaultHomeRowIndent: Record<NamedTypes, number> = {
    // Those actually have a default that is part of their brand.
    [NamedTypes.Katana]: 0.25,
    [NamedTypes.Ergoplank]: 0,
    [NamedTypes.Ergoboard]: 0.5,
    // Not exactly the brand, but at least correct for the home row left side.
    // (And the entire right side when using Apple or Thumbs Up as the standard!)
    [NamedTypes.Typewriter]: 0.75,
    // Those are just default values to make sure that the value is compatible with the stagger.
    // (Relevant when switching between Trifecta, Harmonic, and Others.)
    [NamedTypes.Harmonic]: 0,
    [NamedTypes.Triplex]: 1/3, // need at least 3 decimal digits for our rounding to work properly
    [NamedTypes.Other]: 0,
};

export type MinMaxStep = { min: number; max: number; step: number };

export const permittedHomeRowIndent = (typ: NamedTypes): MinMaxStep =>
    typ === NamedTypes.Triplex ? {min: 0, max: 0.67, step: 0.333} : {min: 0, max: 0.75, step: 0.25};

// TODO: calculate the minimum based on the first two stagger offsets?!
//      Then we'd also have to clamp the value to the new min on any change of stagger.
export const permittedKeyboardWidths = (typ: NamedTypes): MinMaxStep =>
    typ === NamedTypes.Triplex ? {min: 14, max: 16, step: 1} : {min: 13, max: 16, step: 0.5};

// Largest possible keyboard width plus half a key of padding on each side.
// This is constant so that our animations work smoothly.
export const keyboardSvgWidth = 17;

export const permittedRowStagger = (typ: NamedTypes): StaggerDivisor[] =>
    typ === NamedTypes.Triplex ? [3] : [4, 2];

/*
    Due to the inward stagger, the top row has the most wasted space.
    (Even if there is an extra 1u key next to the wider edge key, we don't want to use it,
    because the finger movement will not be aligned with the general stagger direction).
    The next two functions exist to make sure, we synchronize keyboardWidth and homeRowIndent so that
    at least 10 characters fit into the top row. (This will mean they also fit in all other rows.)
 */
export function minimalKeyboardWidth(staggerSet: StaggerSet, homeRowIndent: number) {
    const [a, b] = staggerSet;
    const topIndent = 1 + homeRowIndent + 1/a + 1/b;
    return 2*topIndent + 10;
}

export function maximalHomeRowIndent(staggerSet: StaggerSet, keyboardWidth: number) {
    const [a, b] = staggerSet;
    const topStagger = 1/a + 1/b;
    return (keyboardWidth - 12)/2 - topStagger;
}

export function getStaggerType(set: StaggerSet): NamedTypes {
    let result = NamedTypes.Other;
    Object.entries(namedStaggerSets).forEach(
        ([name, value]) => {
            if (value[0] !== set[0]) return;
            if (value[1] !== set[1]) return;
            if (value[2] !== set[2]) return;
            result = name as NamedTypes;
        });
    return result;
}

export interface DynamicLayoutModel {
    renderInfo: RenderableLayoutModel;
    keyPositions: KeyPosition[];
    // values published only for testing:
    fullMapping: (string | null)[][];
}

export interface SegState {
    // From 13 to 16 in steps of 1/2 (or whole numbers for the Triplex).
    keyboardWidth: ReadonlySignal<number>;
    setKeyboardWidth: (value: number) => void;
    // The set is settable, so all variants of "Other" can be configured.
    // Explicit setter needed to fixup homeRowIndent when switching between Triplex and the others!
    staggerSet: ReadonlySignal<StaggerSet>;
    setStaggerSet: (value: StaggerSet) => void;
    staggerType: ReadonlySignal<NamedTypes>;
    setStaggerType: (value: NamedTypes) => void;
    // Multiple of 1/3 for the Triplex and of 1/4 in all other cases. 0 <= x < 1.
    // It's called "indent", but in most cases it's added to the width of the edge key.
    homeRowIndent: ReadonlySignal<number>;
    setHomeRowIndent: (value: number) => void;
    layoutModel: ReadonlySignal<DynamicLayoutModel>;
    previousModel: ReadonlySignal<DynamicLayoutModel>;
}

export const qwertyKeymap = [
    "12345" + "67890",
    "qwert" + "yuiop",
    "asdfg" + "hjkl;",
    "zxcvb" + "nm,./",
];
