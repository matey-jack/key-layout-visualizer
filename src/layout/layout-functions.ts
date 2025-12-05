import {
    Finger,
    FlexMapping,
    hand,
    KEY_COLOR,
    KeyboardRows,
    KeyColor,
    KEYMAP_TYPES,
    KeymapTypeId,
    KeyPosition,
    LayoutMapping,
    MappingChange,
    RowBasedLayoutModel,
    SupportedKeymapType
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

export const keyCapWidth = (lm: RowBasedLayoutModel, r: KeyboardRows, c: number) =>
    lm.keyCapWidth && lm.keyCapWidth(r, c) ? lm.keyCapWidth(r, c)! : lm.keyWidths[r][c];

export const keyCapHeight = (lm: RowBasedLayoutModel, r: KeyboardRows, c: number) =>
    lm.keyCapHeight ? lm.keyCapHeight(r, c) : 1;

// This is needed in this form somewhere, and I don't want to refactor that 🤷‍♀️
export const keyCapSize = (lm: RowBasedLayoutModel) =>
    ((r: KeyboardRows, c: number) => Math.max(keyCapHeight(lm, r, c), keyCapWidth(lm, r, c)));

export function getKeySizeClass(keyCapSize: number) {
    if (keyCapSize === 1) return "key-size-square";
    const keySizeThresholds = [1.25, 1.5, 1.75, 2.0, 2.25, 2.75, 4, 6];
    for (let i = 0; i < keySizeThresholds.length; i++) {
        if (keyCapSize <= keySizeThresholds[i]) {
            return "key-size-" + i;
        }
    }
}

export const keyColorHighlightsClass = (label: string, row: KeyboardRows, col: number) => {
    if (label && "⏎↑↓←→".includes(label) || label === "Esc") return KEY_COLOR.HIGHLIGHT;
    return defaultKeyColor(label, row, col);
};

export function onlySupportsWide(mapping: FlexMapping) {
    return !mapping.mappings[KeymapTypeId.Ansi30] && !mapping.mappings[KeymapTypeId.Ansi30];
}

export function getFrameMapping(model: RowBasedLayoutModel, type: KeymapTypeId): (LayoutMapping | undefined) {
    return model.supportedKeymapTypes.filter(
        (t) => t.typeId === type
    )[0]?.frameMapping;
}

export function getAnsi30mapping(model: RowBasedLayoutModel): (LayoutMapping | undefined) {
    return getFrameMapping(model, KeymapTypeId.Ansi30);
}

export function getThumb30mapping(model: RowBasedLayoutModel): (LayoutMapping | undefined) {
    return getFrameMapping(model, KeymapTypeId.Thumb30);
}

// --- NEW: Functions using the new keymap type system ---

/**
 * Find the first matching keymap type between a layout and a flex mapping.
 * Returns the matched SupportedKeymapType entry and the flex mapping data, or undefined if no match.
 */
export function findMatchingKeymapType(
    layout: RowBasedLayoutModel,
    flexMapping: FlexMapping
): { supported: SupportedKeymapType; flexData: string[] } | undefined {
    if (!layout.supportedKeymapTypes || !flexMapping.mappings) {
        return undefined;
    }
    for (const supported of layout.supportedKeymapTypes) {
        const flexData = flexMapping.mappings[supported.typeId];
        if (flexData) {
            return {supported, flexData};
        }
    }
    return undefined;
}

/**
 * Fill mapping using the new keymap type system.
 */
export function fillMapping(layoutModel: RowBasedLayoutModel, flexMapping: FlexMapping): string[][] | undefined {
    const match = findMatchingKeymapType(layoutModel, flexMapping);
    if (match) {
        const fallbackMapping = layoutModel.supportedKeymapTypes
            ?.find(s => s.typeId === KeymapTypeId.Ansi30)
            ?.frameMapping;
        const keymapType = match.supported.typeId;
        const flexData = (KEYMAP_TYPES[keymapType].keysPerRow[0] === 0)
            ? ["", ...match.flexData]
            : match.flexData;
        try {
            return mergeMapping(match.supported.frameMapping, flexData, fallbackMapping);
        } catch (e) {
            console.error(`Failed to fill ${flexMapping.name}/${keymapType} into ${layoutModel.name}.`)
            console.error(e);
            return undefined;
        }
    }
    return undefined;
}

/**
 * Check if layout and mapping have a match using the new keymap type system.
 */
export function hasMatchingMapping(layout: RowBasedLayoutModel, flexMapping: FlexMapping): boolean {
    return !!findMatchingKeymapType(layout, flexMapping);
}

/**
 * Get all keymap type IDs supported by a layout (new system only).
 */
export function getLayoutKeymapTypes(layout: RowBasedLayoutModel): KeymapTypeId[] {
    return layout.supportedKeymapTypes?.map(s => s.typeId) ?? [];
}

/**
 * Get all keymap type IDs defined by a flex mapping (new system only).
 */
export function getMappingKeymapTypes(flexMapping: FlexMapping): KeymapTypeId[] {
    return flexMapping.mappings ? Object.keys(flexMapping.mappings) as KeymapTypeId[] : [];
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
                try {
                    const v = Array.isArray(layoutValue) ? flexMapping[r + layoutValue[0]][layoutValue[1]]
                        : (typeof layoutValue === 'number') ? flexMapping[r][layoutValue]
                            : layoutValue as string;
                    if (v === leaveEmpty) return "";
                    if (v === useFallback) return (fallbackMapping ? fallbackMapping[r][c] as string : "");
                    return keyLabelShortcuts[v] ?? v;
                } catch (e) {
                    console.error(`Row ${r}, Col ${c}, Frame value: ${layoutValue}`, e);
                    throw e;
                }
            }
        )
    )

const diffFinger = (a: Finger, b: Finger) =>
    (a === b) ? MappingChange.SameFinger
        : (hand(a) === hand(b)) ? MappingChange.SameHand
            : MappingChange.SwapHands;

// We report the result by assigned (logical) key. Maybe that makes it easier to compute stats later.
export function diffMappings(model: RowBasedLayoutModel, a: string[][], b: string[][]): Record<string, MappingChange> {
    const bFingers = characterToFinger(model.mainFingerAssignment, b);
    const result: Record<string, MappingChange> = {};
    a.forEach((aRow, r) => {
        aRow.forEach((aKey, c) => {
            if (!aKey || aKey === b[r][c]) {
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
    ).map(
        ([_char, change]) => change
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
    const getLabel = (row: number, col: number) => {
        const mappingRow = fullMapping[row];
        const label = mappingRow ? mappingRow[col] : undefined;
        return label === undefined ? "??" : label;
    };

    const rowWidth = layoutModel.keyWidths.map((widthRow, r) =>
        2 * (horizontalPadding + layoutModel.rowIndent[r]) + sum(widthRow.map((w) => w ?? 1))
    );

    const result: KeyPosition[] = [];
    layoutModel.keyWidths.forEach((widthRow, row) => {
        let colPos = horizontalPadding + layoutModel.rowIndent[row];
        if (!split) colPos += (totalWidth - rowWidth[row]) / 2;

        widthRow.forEach((keyWidth, col) => {
            if (split && layoutModel.splitColumns && col === layoutModel.splitColumns[row]) {
                colPos += totalWidth - rowWidth[row];
            }

            const label = getLabel(row, col);
            const finger = layoutModel.mainFingerAssignment[row][col] as Finger;
            if (label != null) {
                result.push({
                    label,
                    row,
                    col,
                    colPos,
                    finger,
                    hasAltFinger: layoutModel.hasAltFinger(row, col),
                });
            }
            colPos += keyWidth ?? 1;
        });
    });
    return result;
}

export const getKeyPositionsByLabel = (positions: KeyPosition[]): Record<string, KeyPosition> =>
    Object.fromEntries(positions.map(p => [p.label, p]));

export function copyAndModifyKeymap<T>(mapping: T[][], f: (m: T[][]) => T[][]): T[][] {
    const newMapping = mapping.map((row) => [...row]);
    return f(newMapping);
}
