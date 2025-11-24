import {
    Finger,
    FlexMapping,
    hand,
    KEY_COLOR,
    KeyboardRows,
    KeyColor,
    KeyPosition,
    LayoutMapping,
    MappingChange,
    RowBasedLayoutModel
} from "../base-model.ts";
import {qwertyMapping} from "../mapping/mappings.ts";
import {sum} from "../library/math.ts";
import {isCommandKey} from "../mapping/mapping-functions.ts";

export function isHomeKey(layoutModel: RowBasedLayoutModel, row: number, col: number): boolean {
    if (row != KeyboardRows.Home) return false;
    if (col <= layoutModel.leftHomeIndex && col > layoutModel.leftHomeIndex - 4) return true;
    if (col >= layoutModel.rightHomeIndex && col < layoutModel.rightHomeIndex + 4) return true;
    return false;
}

export function defaultKeyColor(label: string, _row: number, _col: number): KeyColor {
    if (isCommandKey(label)) return KEY_COLOR.EDGE;
    return "";
}

export const keyCapWidth = (lm: RowBasedLayoutModel, r: KeyboardRows, c: number)=>
    lm.keyCapWidth && lm.keyCapWidth(r, c) ? lm.keyCapWidth(r, c)! : lm.keyWidths[r][c];

export const keyCapHeight = (lm: RowBasedLayoutModel, r: KeyboardRows, c: number)=>
    lm.keyCapHeight ? lm.keyCapHeight(r, c) : 1;

// This is needed in this form somewhere and I don't want to refactor that 🤷‍♀️
export const keyCapSize = (lm: RowBasedLayoutModel)=>
    ((r: KeyboardRows, c: number)=> Math.max(keyCapHeight(lm, r, c), keyCapWidth(lm, r, c)));

export function createKeySizeGroups(layoutM: RowBasedLayoutModel) {
    const keySizes: number[] = [];
    (layoutM.thirtyKeyMapping || layoutM.fullMapping)!.forEach((row, r) => {
        row.forEach((label, c) => {
            const size = keyCapSize(layoutM)(r, c);
            if (label !== null && size != 1 && !keySizes.includes(size)) {
                keySizes.push(size);
            }
        })
    });
    keySizes.sort();
    return keySizes;
}

export function getKeySizeClass(keyCapSize: number, sizeList: number[]) {
    if (keyCapSize == 1) return "key-size-square";
    return "key-size-" + sizeList.indexOf(keyCapSize);
}

export const keyColorHighlightsClass = (label: string, row: KeyboardRows, col: number) => {
    if (label && "⏎↑↓←→".includes(label) || label == "Esc") return KEY_COLOR.HIGHLIGHT;
    return defaultKeyColor(label, row, col);
};

export function onlySupportsWide(mapping: FlexMapping) {
    return !mapping.mapping30 && !mapping.mappingAnsi;
}

export function fillMapping(layoutModel: RowBasedLayoutModel, flexMapping: FlexMapping): string[][] | undefined {
    const fullFlexMapping = layoutModel.getSpecificMapping(flexMapping)
    if (fullFlexMapping) {
        return mergeMapping(layoutModel.fullMapping!, fullFlexMapping, layoutModel.thirtyKeyMapping);
    }
    if (layoutModel.thumb30KeyMapping && flexMapping.mappingThumb30) {
        return mergeMapping(layoutModel.thumb30KeyMapping, ["", ...flexMapping.mappingThumb30]);
    }
    if (layoutModel.thirtyKeyMapping && flexMapping.mapping30) {
        return mergeMapping(layoutModel.thirtyKeyMapping, ["", ...flexMapping.mapping30!]);
    }
}

export function hasMatchingMapping(layout: RowBasedLayoutModel, flexMapping: FlexMapping): boolean {
    if (flexMapping.mapping30 && layout.thirtyKeyMapping) return true;
    if (flexMapping.mappingThumb30 && layout.thumb30KeyMapping) return true;
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
                if (v == leaveEmpty) return "";
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
                let f = model.mainFingerAssignment[r][c] as Finger;
                // console.log(`[${r},${c}] '${aKey}' on finger ${f}, in base mapping finger ${bFingers[aKey]}.'`)
                result[aKey] = diffFinger(f, bFingers[aKey])
            }
        })
    })
    return result;
}

// exported only for unit tests
export function characterToFinger(fingerAssignment: (Finger | null)[][], mapping: string[][]): Record<string, Finger> {
    const result: Record<string, Finger> = {};
    fingerAssignment.forEach((fingerRow, r) => {
        fingerRow.forEach((finger, c) => {
            const key = mapping[r][c];
            if (finger != null && key) result[key] = finger;
        })
    })
    return result;
}

// remember that the literal `-` can only be mentioned at the end of a [...]
export const lettersAndVIP = RegExp("^[a-z,.'/]$");

export function diffSummary(diff: Record<string, MappingChange>): Record<MappingChange, number> {
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

export function diffToBase(layoutModel: RowBasedLayoutModel, flexMapping: FlexMapping): Record<string, MappingChange> {
    const a = fillMapping(layoutModel, flexMapping);
    const b = fillMapping(layoutModel, flexMapping.comparisonBase ?? qwertyMapping);
    return diffMappings(layoutModel, a!, b!);
}

export function compatibilityScore(diffSummy: Record<MappingChange, number>): number {
    return diffSummy[MappingChange.SameFinger] * 0.5 +
        diffSummy[MappingChange.SameHand] * 1.0 +
        diffSummy[MappingChange.SwapHands] * 2.0;
}

// keep in sync with KeyboardSvg.viewBox
const totalWidth = 17;
// in key units
const horizontalPadding = 0.5;

export function getKeyPositions(layoutModel: RowBasedLayoutModel, split: boolean, fullMapping: string[][]): KeyPosition[] {
    const rowWidth = fullMapping.map((row, r) =>
        2 * (horizontalPadding + layoutModel.rowIndent[r]) + sum(row.map((_, c) => layoutModel.keyWidths[r][c] ?? 1))
    );
    // console.log("Row widths: ", rowWidth);
    // todo: remove this again and replace with Microgaps from keyWidth.ts
    const maxWidth = Math.max(...rowWidth);
    let result: KeyPosition[] = [];
    for (let row = 0; row < 5; row++) {
        let colPos = horizontalPadding + layoutModel.rowIndent[row];
        // Counting the rowStart padding, all rows should be the same width. If our row is narrower than the max,
        // then we distribute the difference between all the keys.
        // This doesn't apply to the split keyboards, because the thumb cluster row is meant to stick out from the rest.
        const microGap = split ? 0 : (maxWidth - rowWidth[row]) / (fullMapping[row].length - 1);
        // for non-split boards, apply some white space on the left to make them centered.
        if (!split) colPos += (totalWidth - maxWidth) / 2;
        fullMapping[row].forEach((label, col) => {
            // to show the board as split, add some extra space after the split column.
            if (split && layoutModel.splitColumns && (col == layoutModel.splitColumns[row])) {
                colPos += totalWidth - rowWidth[row];
            }

            const finger = layoutModel.mainFingerAssignment[row][col] as Finger;
            if (fullMapping[row][col] != null) {
                result.push({
                    label,
                    row,
                    col,
                    colPos,
                    finger,
                    hasAltFinger: layoutModel.hasAltFinger(row, col),
                });
            }
            colPos += layoutModel.keyWidths[row][col] + microGap;
        });
    }
    return result;
}

export const getKeyPositionsByLabel = (positions: KeyPosition[]): Record<string, KeyPosition> =>
    Object.fromEntries(positions.map(p => [p.label, p]));

export function copyAndModifyKeymap<T>(mapping: T[][], f: (m: T[][]) => T[][]): T[][] {
    const newMapping = mapping.map((row) => [...row]);
    return f(newMapping);
}
