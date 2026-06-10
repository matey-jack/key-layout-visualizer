import type {ReadonlySignal, Signal} from '@preact/signals';
import  type {KeyboardRows, KeyColor, KeyPosition} from '../base-model.ts';

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
    // Those are just default values to make sure that the value is compatible with the stagger.
    // (Relevant when switching between Trifecta, Harmonic, and Others.)
    [NamedTypes.Harmonic]: 0,
    [NamedTypes.Triplex]: 0,
    [NamedTypes.Typewriter]: 0.5,
    [NamedTypes.Other]: 0,
};

export const permittedHomeRowIndent = (typ: NamedTypes) =>
    typ === NamedTypes.Triplex ? [0, 0.33, 0.66] : [0, 0.25, 0.5, 0.75];

export const permittedKeyboardWidths = (typ: NamedTypes) =>
    typ === NamedTypes.Triplex ? [14, 15, 16] : [13.5, 14, 14.5, 15, 15.5, 16];

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

// Reduced version of LayoutModel which can only be used for the key-size viz in KeyboardSvg and nothing else.
export interface MinimalLayoutModel {
    // actually, only those are accessed by the RowBasedKeyboard SVG maker.
    leftHomeIndex: number;
    rightHomeIndex: number;

    keyColorClass: (label: string, row: KeyboardRows, col: number) => KeyColor;
    // extra field not used by SVG, but coming from the same source.
    keyPositions: KeyPosition[];
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
    layoutModel: ReadonlySignal<MinimalLayoutModel>;
    previousModel: ReadonlySignal<MinimalLayoutModel>;
}

export const qwertyKeymap = [
    "12345" + "67890",
    "qwert" + "yuiop",
    "asdfg" + "hjkl;",
    "zxcvb" + "nm,./",
];
