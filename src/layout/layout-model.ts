import {KeyboardRows, LayoutOptionsState, LayoutSplit, LayoutType} from "../model.ts";
import {ansiLayoutModel, ansiWideLayoutModel, customAnsiWideLayoutModel, splitSpaceBar} from "./ansiLayoutModel.ts";
import {harmonicLayoutModel, harmonicLayoutModelWithNavKeys} from "./harmonicLayoutModel.ts";
import {orthoLayoutModel, splitOrthoLayoutModel} from "./orthoLayoutModel.ts";
import {FlexMapping} from "../mapping/mapping-model.ts";
import {qwertyMapping} from "../mapping/mappings.ts";
import {Signal} from "@preact/signals";

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

export function getLayoutModel(layoutType: LayoutType,
                               layoutOptions: LayoutOptionsState,
                               flexMapping?: FlexMapping,
                               layoutSplit?: Signal<LayoutSplit>,
): RowBasedLayoutModel {
    const twoPiece = layoutSplit?.value == LayoutSplit.TwoPiece;
    switch (layoutType) {
        case LayoutType.ANSI:
            const base = !layoutOptions.ansiLayoutOptions.value.wide ? ansiLayoutModel
                : !flexMapping?.ansiMovedColumns ? ansiWideLayoutModel
                    : customAnsiWideLayoutModel(flexMapping.ansiMovedColumns);
            return twoPiece ? splitSpaceBar(base) : base;
        case LayoutType.Ortho:
            return layoutSplit?.value == LayoutSplit.TwoPiece ? splitOrthoLayoutModel : orthoLayoutModel;
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
    fullMapping: LayoutMapping;

    // finger assignment and key effort arrays have the same shape (number of entries in each row) as the LayoutMappings.
    mainFingerAssignment: Finger[][];

    /*
        I don't know why I want to be different from other people who define home keys as "effort 1",
        but I think a typically medium-easy to type key should be "1" and home keys some number lower than that.
        0.2 for Home Keys (incl. thumb, if present) – 8 or 9 keys, since I don't have any layout proposal with two thumbs hitting letters.
        1   for long finger upper letter row keys – 4 keys
        1.5 for index finger straight and diagonal up (F T U) and pinky lateral (only ') – 4 keys
        1.5 for right lower letter row (J to /) because they have well-aligned stagger – 5 keys
        2   for pinky straight or half-diagonal up – 3 keys
        2   for left lower letter row (Z to V) because of misaligned stagger – 4 keys
        2   for index lateral movement – 2 keys in total
        2   for "long diagonal up" (only Y) and long fingers straight to number row (hits 230-, but only - is relevant as VIP) – 1 key
        2.5 for the 1! key (which I hit with a short-diagonal long finger) – only relevant if actually count ! as VIP – 1 optional key
        3   for long diagonal down (only B) – 1 key
        Just to check, that's 8+4+4+5+3+4+2+1+1 key (32 keys) in the three letter rows, which is (11+11+10) per row. ✅
     */
    singleKeyEffort: number[][];

    getSpecificMapping(flexMapping: FlexMapping): string[] | undefined;
}

export function isHomeKey(layoutModel: RowBasedLayoutModel, row: KeyboardRows, col: number): boolean {
    if (row != KeyboardRows.Home) return false;
    if (col <= layoutModel.leftHomeIndex && col > layoutModel.leftHomeIndex - 4) return true;
    if (col >= layoutModel.rightHomeIndex && col < layoutModel.rightHomeIndex + 4) return true;
    return false;
}

export function fillMapping(layoutModel: RowBasedLayoutModel, flexMapping: FlexMapping): string[][] {
    const fullFlexMapping = layoutModel.getSpecificMapping(flexMapping)
    if (fullFlexMapping) {
        return mergeMapping(layoutModel.fullMapping!!, fullFlexMapping);
    }
    return mergeMapping(layoutModel.thirtyKeyMapping, ["", ...flexMapping.mapping30!!]);
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
    const bFingers = characterToFinger(model.mainFingerAssignment, b);
    const result: Record<string, MappingChange> = {};
    a.forEach((aRow, r) => {
        aRow.forEach((aKey, c) => {
            if (!aKey || aKey == b[r][c]) {
                result[aKey] = MappingChange.SamePosition;
            } else {
                let f = model.mainFingerAssignment[r][c];
                // console.log(`[${r},${c}] '${aKey}' on finger ${f}, in base mapping finger ${bFingers[aKey]}.'`)
                result[aKey] = diffFinger(f, bFingers[aKey])
            }
        })
    })
    return result;
}

// exported only for unit tests
export function characterToFinger(fingerAssignment: Finger[][], mapping: LayoutMapping): Record<string, Finger> {
    const result: Record<string, Finger> = {};
    fingerAssignment.forEach((fingerRow, r) => {
        fingerRow.forEach((finger, c) => {
            const key = mapping[r][c];
            result[key] = finger;
        })
    })
    return result;
}

export const lettersAndVIP = RegExp("^[a-z,.'/;-]$");

export function diffSummary(diff: Record<string, MappingChange>): Record<MappingChange, number> {
    // remember that the literal `-` can only be mentioned at the end of a [...]
    const result = {
        [MappingChange.SamePosition]: 0,
        [MappingChange.SameFinger]: 0,
        [MappingChange.SameHand]: 0,
        [MappingChange.SwapHands]: 0,
    };
    const relevantDiff = Object.entries(diff).filter(
        ([char, _change]) => lettersAndVIP.test(char)
    ).map((
        [_char, change]) => change
    );
    relevantDiff.forEach((change) => {
        result[change]++;
    });
    return result;
}

export function diffToQwerty(layoutModel: RowBasedLayoutModel, flexMapping: FlexMapping): Record<string, MappingChange> {
    // console.log(`=== diffToQwerty: ${flexMapping.name} on ${layoutModel.name} ===`);
    // neither using this condition nor omitting it, reflects the actual experienced learning delta for wide models.
    // let's just accept that this is imperfect and move on.
    const baseLayoutModel = // (layoutModel.name.includes("wide")) ? ansiLayoutModel :
        layoutModel;
    const a = fillMapping(layoutModel, flexMapping);
    const b = fillMapping(baseLayoutModel, qwertyMapping);
    return diffMappings(layoutModel, a, b);
}