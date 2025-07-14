import {
    Finger,
    FlexMapping,
    hand,
    KeyboardRows,
    KeyPosition,
    LayoutMapping,
    LayoutType,
    MappingChange,
    RowBasedLayoutModel
} from "../base-model.ts";
import {qwertyMapping} from "../mapping/mappings.ts";
import {HarmonicVariant, LayoutOptionsState} from "../app-model.ts";
import {Signal} from "@preact/signals";
import {ansiLayoutModel, ansiWideLayoutModel, splitSpaceBar} from "./ansiLayoutModel.ts";
import {orthoLayoutModel, splitOrthoLayoutModel} from "./orthoLayoutModel.ts";
import {harmonic13WideLayoutModel} from "./harmonic13WideLayoutModel.ts";
import {sum} from "../library/math.ts";
import {harmonic14LayoutModel} from "./harmonic14LayoutModel.ts";
import {harmonic13MidShiftLayoutModel} from "./harmonic13MidshiftLayoutModel.ts";
import {harmonic12LayoutModel} from "./harmonic12LayoutModel.ts";

export function isHomeKey(layoutModel: RowBasedLayoutModel, row: number, col: number): boolean {
    if (row != KeyboardRows.Home) return false;
    if (col <= layoutModel.leftHomeIndex && col > layoutModel.leftHomeIndex - 4) return true;
    if (col >= layoutModel.rightHomeIndex && col < layoutModel.rightHomeIndex + 4) return true;
    return false;
}

export function fillMapping(layoutModel: RowBasedLayoutModel, flexMapping: FlexMapping): string[][] {
    const fullFlexMapping = layoutModel.getSpecificMapping(flexMapping)
    if (fullFlexMapping) {
        return mergeMapping(layoutModel.fullMapping!!, fullFlexMapping, layoutModel.thirtyKeyMapping);
    }
    if (flexMapping.mappingThumb30 && layoutModel.thumb30KeyMapping) {
        return mergeMapping(layoutModel.thumb30KeyMapping, ["", ...flexMapping.mappingThumb30]);
    }
    return mergeMapping(layoutModel.thirtyKeyMapping, ["", ...flexMapping.mapping30!!]);
}

export function hasMatchingMapping(layout: RowBasedLayoutModel, flexMapping: FlexMapping): boolean {
    if (flexMapping.mapping30 || flexMapping.mappingThumb30) return true;
    if (layout.name.includes("ANSI")) {
        // we require both because data will be inconsistent when the user flips between narrow and wide
        return !!(flexMapping.mappingAnsiWide && flexMapping.mappingAnsi);
    }
    return !!layout.getSpecificMapping(flexMapping);
}

// Thanks to those, we can keep the flex mappings as simple strings. (Which I think is more readable.)
const keyLabelShortcuts: Record<string, string> = {
    "⌥": "AltGr",
    "⇪": "CAPS",
    "≡": "Menu",
    "ƒ": "Fn",
};

// In the layoutModel's mappings, only the empty string has a special meaning (no label = greyed out key).
// But in the FlexMappings, there are two special ones:
const useFallback = "?";
const leaveEmpty = "_";

export const mergeMapping = (
    layoutMapping: LayoutMapping, flexMapping: string[], fallbackMapping?: LayoutMapping
): string[][] =>
    layoutMapping.map((layoutRow, r) =>
        layoutRow.map((layoutValue, c) => {
                const v = Array.isArray(layoutValue) ? flexMapping[r + layoutValue[0]][layoutValue[1]]
                    : (typeof layoutValue === 'number') ? flexMapping[r][layoutValue]
                        : layoutValue as string;
                if (!v || v == leaveEmpty) return "";
                if (v == useFallback) return (fallbackMapping ? fallbackMapping[r][c] as string : "");
                return keyLabelShortcuts[v] ?? v;
            }
        )
    )

const diffFinger = (a: Finger, b: Finger) =>
    (a == b) ? MappingChange.SameFinger
        : (hand(a) == hand(b)) ? MappingChange.SameHand
            : MappingChange.SwapHands;

// We report the result by assigned (logical) key. Maybe that makes it easier to compute stats later.
export function diffMappings(model: RowBasedLayoutModel, a: string[][], b: string[][]): Record<string, MappingChange> {
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
export function characterToFinger(fingerAssignment: Finger[][], mapping: string[][]): Record<string, Finger> {
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

// TODO: will we need "flexMapping" parameter at a later point?
//  Because if no, the architecture of mapping list could simplify and not get a fresh layout for every mapping in the list!
export function getLayoutModel(layoutType: LayoutType,
                               layoutOptions: LayoutOptionsState,
                               _flexMapping?: FlexMapping,
                               layoutSplit?: Signal<boolean>,
): RowBasedLayoutModel {
    switch (layoutType) {
        case LayoutType.ANSI:
            const base = layoutOptions.ansiLayoutOptions.value.wide ? ansiWideLayoutModel : ansiLayoutModel;
            return layoutSplit?.value ? splitSpaceBar(base) : base;
        case LayoutType.Ortho:
            return layoutSplit?.value ? splitOrthoLayoutModel : orthoLayoutModel;
        case LayoutType.Harmonic:
            switch (layoutOptions.harmonicLayoutOptions.value.variant) {
                case HarmonicVariant.H14_Traditional:
                    return harmonic14LayoutModel;
                case HarmonicVariant.H13_3:
                    return harmonic13WideLayoutModel;
                case HarmonicVariant.H13_MidShift:
                    return harmonic13MidShiftLayoutModel;
                case HarmonicVariant.H12_3:
                    return harmonic12LayoutModel;
            }
    }
}

// keep in sync with KeyboardSvg.viewBox
const totalWidth = 17;
// in key units
const horizontalPadding = 0.5;

export function getKeyPositions(layoutModel: RowBasedLayoutModel, split: boolean, flexMapping: FlexMapping): KeyPosition[] {
    const fullMapping = fillMapping(layoutModel, flexMapping);
    const rowWidth = fullMapping.map((row, r) =>
        2 * (horizontalPadding + layoutModel.rowStart(r)) + sum(row.map((_, c) => layoutModel.keyWidth(r, c)))
    );
    let result: KeyPosition[] = [];
    for (let row = 0; row < 5; row++) {
        let colPos = horizontalPadding + layoutModel.rowStart(row);
        // for non-split boards, apply some white space on the left to make them centered.
        if (!split) colPos += (totalWidth - rowWidth[row]) / 2;
        fullMapping[row].forEach((label, col) => {
            // to show the board as split, add some extra space after the split column.
            if (split && (col == layoutModel.splitColumns[row])) colPos += totalWidth - rowWidth[row];
            result.push({
                label,
                row,
                col,
                colPos,
                finger: layoutModel.mainFingerAssignment[row][col],
                hasAltFinger: layoutModel.hasAltFinger(row, col)
            });
            colPos += layoutModel.keyWidth(row, col);
        });
    }
    return result;
}

export const getKeyPositionsByLabel = (positions: KeyPosition[]): Record<string, KeyPosition> =>
    Object.fromEntries(positions.map(p => [p.label, p]));