import {
    type Finger,
    type FlexMapping,
    hand,
    KEY_COLOR,
    KeyboardRows,
    type KeyColor,
    KEYMAP_TYPES,
    KeymapTypeId,
    type KeyMovement,
    type KeyPosition,
    type LayoutMapping,
    type LayoutModel,
    MappingChange,
} from "../base-model.ts";
import {sum} from "../library/math.ts";
import {qwertyMapping} from "../mapping/baseMappings.ts";
import {isCommandKey} from "../mapping/mapping-functions.ts";

export function isHomeKey(layoutModel: LayoutModel, row: number, col: number): boolean {
    if (row !== KeyboardRows.Home) return false;
    if (col <= layoutModel.leftHomeIndex && col > layoutModel.leftHomeIndex - 4) return true;
    if (col >= layoutModel.rightHomeIndex && col < layoutModel.rightHomeIndex + 4) return true;
    return false;
}

export function defaultKeyColor(label: string, _row: number, _col: number): KeyColor {
    if (isCommandKey(label)) return KEY_COLOR.EDGE;
    return "";
}

export const keyColorHighlightsClass = (label: string, row: KeyboardRows, col: number) => {
    if (label && "⏎↑↓←→".includes(label) || label === "Esc") return KEY_COLOR.HIGHLIGHT;
    return defaultKeyColor(label, row, col);
};

export const ergoFamilyKeyColorClass = <T>(shape: T[][]) =>
    (label: string, row: KeyboardRows, col: number)=> {
    if (label && "⏎↑↓←→".includes(label) || label === "Esc") return KEY_COLOR.HIGHLIGHT;
    if (row === KeyboardRows.Bottom) return KEY_COLOR.EDGE;
    const len = shape[row].length - 1;
    const c = col > len / 2 ? len - col : col;
    if (row === KeyboardRows.Lower) {
        if (c < 5) return KEY_COLOR.BORING;
    } else {
        if (c === 0) return KEY_COLOR.EDGE;
        if (c < 6) return KEY_COLOR.BORING;
    }
    return KEY_COLOR.EDGE;
};

export const keyCapWidth = (lm: LayoutModel, r: KeyboardRows, c: number) =>
    lm.keyCapWidth?.(r, c) ? lm.keyCapWidth(r, c)! : lm.keyWidths[r][c];

export const keyCapHeight = (lm: LayoutModel, r: KeyboardRows, c: number) =>
    lm.keyCapHeight ? lm.keyCapHeight(r, c) : 1;

// This is needed in this form somewhere, and I don't want to refactor that 🤷‍♀️
export const keyCapSize = (lm: LayoutModel) =>
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

export function onlySupportsWide(mapping: FlexMapping) {
    return !mapping.mappings[KeymapTypeId.Ansi30] && !mapping.mappings[KeymapTypeId.Ansi];
}

// --- NEW: Functions using the new keymap type system ---

/**
 * Find the first matching keymap type between a layout and a flex mapping.
 * Returns the matched keymap type ID and the flex mapping data, or undefined if no match.
 */
export function findMatchingKeymapType(
    layout: LayoutModel,
    flexMapping: FlexMapping
): { typeId: KeymapTypeId; frameMapping: LayoutMapping; flexData: string[] } | undefined {
    if (!layout.frameMappings || !flexMapping.mappings) {
        return undefined;
    }
    for (const typeId of Object.keys(layout.frameMappings) as KeymapTypeId[]) {
        const flexData = flexMapping.mappings[typeId];
        if (flexData) {
            const frameMapping = layout.frameMappings[typeId];
            if (frameMapping) {
                return { typeId, frameMapping, flexData };
            }
        }
    }
    return undefined;
}

/**
 * Fill mapping using the new keymap type system.
 */
export function fillMapping(layoutModel: LayoutModel, flexMapping: FlexMapping): string[][] | undefined {
    const match = findMatchingKeymapType(layoutModel, flexMapping);
    if (match) {
        const fallbackMapping = layoutModel.frameMappings[KeymapTypeId.Ansi30];
        const keymapType = match.typeId;
        const flexData = (KEYMAP_TYPES[keymapType].keysPerRow[0] === 0)
            ? ["", ...match.flexData]
            : match.flexData;
        try {
            return mergeMapping(match.frameMapping, flexData, fallbackMapping);
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
export function hasMatchingMapping(layout: LayoutModel, flexMapping: FlexMapping): boolean {
    return !!findMatchingKeymapType(layout, flexMapping);
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
export function diffMappings(model: LayoutModel, a: string[][], b: string[][]): Record<string, MappingChange> {
    const bFingers = characterToFinger(model.mainFingerAssignment, b);
    const result: Record<string, MappingChange> = {};
    a.forEach((aRow, r) => {
        aRow.forEach((aKey, c) => {
            if (!aKey || aKey === b[r][c]) {
                result[aKey] = MappingChange.SamePosition;
            } else {
                const f = model.mainFingerAssignment[r][c] as Finger;
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

export function diffToBase(layoutModel: LayoutModel, flexMapping: FlexMapping): Record<string, MappingChange> {
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
export const totalWidth = 18;
// in key units
const horizontalPadding = 0.5;

export function getKeyPositions(layoutModel: LayoutModel, split: boolean, fullMapping: string[][]): KeyPosition[] {
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

            // 'null' is a legit value, signifying a gap, not a key, while undefined is a bug.
            //  We put ?? to alert developers to fix the keymap (instead of crashing here).
            const label = fullMapping[row]?.[col] !== undefined ? fullMapping[row][col] : "??";
            if (label != null) {
                const finger = layoutModel.mainFingerAssignment[row][col] as Finger;
                result.push({
                    label,
                    row,
                    col,
                    colPos,
                    keyCapWidth: keyCapWidth(layoutModel, row as KeyboardRows, col),
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

function groupPositionsByLabel(positions: KeyPosition[]): Map<string, KeyPosition[]> {
    const grouped = new Map<string, KeyPosition[]>();
    positions.forEach((pos) => {
        const list = grouped.get(pos.label) ?? [];
        list.push(pos);
        grouped.set(pos.label, list);
    });
    return grouped;
}

/**
 * Merges key positions from previous and current states to create key movements for animation.
 * Groups keys by label, then pairs them according to these rules:
 * - For empty string labels (""), add as entering/exiting without pairing.
 * - For other labels with one key in each prev and next, pair them up.
 * - When one side is empty, create enter/exit movements.
 * - When there are multiple keys on either side, sort by colPos and pair in order.
 */
export function getKeyMovements(prevPositions: KeyPosition[], nextPositions: KeyPosition[]): KeyMovement[] {
    const prevByLabel = groupPositionsByLabel(prevPositions);
    const nextByLabel = groupPositionsByLabel(nextPositions);

    const movements: KeyMovement[] = [];
    const allLabels = new Set([...prevByLabel.keys(), ...nextByLabel.keys()]);
    for (const label of allLabels) {
        const prevKeys = prevByLabel.get(label) || [];
        const nextKeys = nextByLabel.get(label) || [];

        if (label === "") {
            // For empty labels, add as entering/exiting without pairing
            prevKeys.forEach(prev => {
                movements.push({prev, next: undefined})
            });
            nextKeys.forEach(next => {
                movements.push({prev: undefined, next})
            });
        } else {
            // Both sides have keys: sort by colPos and pair in order
            const sortedPrev = [...prevKeys].sort((a, b) => a.colPos - b.colPos);
            const sortedNext = [...nextKeys].sort((a, b) => a.colPos - b.colPos);

            const minLength = Math.min(sortedPrev.length, sortedNext.length);

            // Pair the first minLength keys from each side
            for (let i = 0; i < minLength; i++) {
                movements.push({ prev: sortedPrev[i], next: sortedNext[i] });
            }

            // Add any remaining prev keys as exiting
            for (let i = minLength; i < sortedPrev.length; i++) {
                movements.push({ prev: sortedPrev[i], next: undefined });
            }

            // Add any remaining next keys as entering
            for (let i = minLength; i < sortedNext.length; i++) {
                movements.push({ prev: undefined, next: sortedNext[i] });
            }
        }
    }
    return movements;
}

export function copyAndModifyKeymap<T>(mapping: T[][], f: (m: T[][]) => T[][]): T[][] {
    const newMapping = mapping.map((row) => [...row]);
    return f(newMapping);
}
