import {KeyboardRows, LayoutOptionsState, LayoutType} from "../model.ts";
import {ansiLayoutModel, ansiWideLayoutModel} from "./ansiLayoutModel.ts";
import {harmonicLayoutModel, harmonicLayoutModelWithNavKeys} from "./harmonicLayoutModel.ts";
import {orthoLayoutModel} from "./orthoLayoutModel.ts";
import {KeyMapping} from "../mapping/mapping-model.ts";
import {qwertyMapping} from "../mapping/mappings-30-keys.ts";

export enum Finger {
    LPinky = 0,
    LRing,
    LMiddle,
    LIndex,
    LThumb,
    RThumb,
    RIndex,
    RMiddle,
    RRing,
    RPinky,
}

export enum Hand {
    Left,
    Right,
}

export const hand = (finger: Finger) => Math.floor(finger / 5)

export enum MappingChange {
    SamePosition,
    SameFinger,
    SameHand,
    SwapHands,
}

export function getLayoutModel(layoutType: LayoutType, layoutOptions: LayoutOptionsState) {
    switch (layoutType) {
        case LayoutType.ANSI:
            return layoutOptions.ansiLayoutOptions.value.wide ? ansiWideLayoutModel : ansiLayoutModel;
        case LayoutType.Ortho:
            return orthoLayoutModel;
        case LayoutType.Harmonic:
            return layoutOptions.harmonicLayoutOptions.value.navKeys ? harmonicLayoutModelWithNavKeys : harmonicLayoutModel;
    }
}

export type LayoutMapping = (string | number)[][];

export interface RowBasedLayoutModel {
    name: string;
    description: string;

    // 1 unit = width of the smallest key.
    rowStart: (row: KeyboardRows) => number;
    keyWidth: (row: KeyboardRows, col: number) => number;

    // How many columns are to the left of the split line for each row?
    // (Space bar splits just at the column of the row above.)
    splitColumns: number[];

    // Column number counted from 0.
    leftHomeIndex: number;
    rightHomeIndex: number;

    // this one is standardized to take a flex Mapping of exactly 3 by 10 keys
    thirtyKeyMapping: LayoutMapping;

    // this one takes a flex mapping depending on the layout
    fullMapping?: LayoutMapping;

    //
    mainFingerAssignment: Finger[][];
}

export function isHomeKey(layoutModel: RowBasedLayoutModel, row: KeyboardRows, col: number): boolean {
    if (row != KeyboardRows.Home) return false;
    if (col <= layoutModel.leftHomeIndex && col > layoutModel.leftHomeIndex - 4) return true;
    if (col >= layoutModel.rightHomeIndex && col < layoutModel.rightHomeIndex + 4) return true;
    return false;
}

export function fillMapping(layoutModel: RowBasedLayoutModel, flexMapping: string[]): string[][] {
    if (flexMapping.length == 3) return mergeMapping(layoutModel.thirtyKeyMapping, ["", ...flexMapping]);
    return mergeMapping(layoutModel.fullMapping!!, flexMapping);
}

export const mergeMapping = (layoutMapping: LayoutMapping, flexMapping: string[]): string[][] =>
    layoutMapping.map((layoutRow, r) =>
        layoutRow.map((layoutValue) =>
            (typeof layoutValue === 'number') ? flexMapping[r][layoutValue] : layoutValue
        )
    )

const diffFinger = (a: Finger, b: Finger) =>
    (a == b) ? MappingChange.SameFinger
        : (hand(a) == hand(b)) ? MappingChange.SameHand
            : MappingChange.SwapHands;

// We report the result by assigned (logical) key. Maybe that makes it easier to compute stats later.
export function diffMappings(model: RowBasedLayoutModel, a: LayoutMapping, b: LayoutMapping): Record<string, MappingChange> {
    const bFingers = characterToFinger(model, b);
    const result: Record<string, MappingChange> = {};
    a.forEach((aRow, r) => {
        aRow.forEach((aKey, c) => {
            if (aKey == b[r][c]) {
                result[aKey] = MappingChange.SamePosition;
            } else {
                result[aKey] = diffFinger(model.mainFingerAssignment[r][c], bFingers[aKey])
            }
        })
    })
    return result;
}

function characterToFinger(model: RowBasedLayoutModel, mapping: LayoutMapping): Record<string, Finger> {
    const result: Record<string, Finger> = {};
    model.mainFingerAssignment.forEach((fingerRow, r) => {
        fingerRow.forEach((finger, c) => {
            const key = mapping[r][c];
            result[key] = finger;
        })
    })
    return result;
}

export function diffSummary(diff: Record<string, MappingChange>): Record<MappingChange, number> {
    const result = {
        [MappingChange.SamePosition]: 0,
        [MappingChange.SameFinger]: 0,
        [MappingChange.SameHand]: 0,
        [MappingChange.SwapHands]: 0,
    };
    Object.values(diff).forEach((change) => {
        result[change]++;
    });
    return result;
}

export function diffToQwerty(layoutModel: RowBasedLayoutModel, flexMapping: KeyMapping): Record<string, MappingChange>  {
    const a = fillMapping(layoutModel, flexMapping.mapping);
    const b = fillMapping(layoutModel, qwertyMapping.mapping);
    return diffMappings(layoutModel, a, b);
}