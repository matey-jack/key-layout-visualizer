import {
    FlexMapping,
    Finger,
    RowBasedLayoutModel,
    LayoutMapping,
    MappingChange,
    LayoutType, LayoutSplit, KeyboardRows, hand
} from "../base-model.ts";
import {qwertyMapping} from "../mapping/mappings.ts";
import {LayoutOptionsState} from "../app-model.ts";
import {Signal} from "@preact/signals";
import {ansiLayoutModel, ansiWideLayoutModel, customAnsiWideLayoutModel, splitSpaceBar} from "./ansiLayoutModel.ts";
import {orthoLayoutModel, splitOrthoLayoutModel} from "./orthoLayoutModel.ts";
import {harmonicLayoutModel, harmonicLayoutModelWithNavKeys} from "./harmonicLayoutModel.ts";

export function isHomeKey(layoutModel: RowBasedLayoutModel, row: number, col: number): boolean {
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

export function compatibilityScore(diffSummy: Record<MappingChange, number>): number {
    return diffSummy[MappingChange.SameFinger] * 0.5 +
        diffSummy[MappingChange.SameHand] * 1.0 +
        diffSummy[MappingChange.SwapHands] * 2.0;
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
