import * as bigrams from "./frequencies/english-character-pairs.json";
import {
    bigramEffort,
    BigramList,
    BigramMovement,
    BigramType,
    Finger,
    FlexMapping,
    hand,
    isThumb,
    KeyPosition,
    RowBasedLayoutModel
} from "./base-model.ts";
import {sum} from "./library/math.ts";
import {fillMapping, getKeyPositions, getKeyPositionsByLabel} from "./layout/layout-functions.ts";

export function getBigramType(a: KeyPosition, b: KeyPosition): BigramType {
    try {
        if (isThumb(a.finger) || isThumb(b.finger)) return BigramType.InvolvesThumb;
        if (hand(a.finger) !== hand(b.finger)) return BigramType.OtherHand;
        if (a.finger === b.finger) {
            if (a.hasAltFinger || b.hasAltFinger) return BigramType.AltFinger
            // When the center column is involved, the other index finger column can be typed with the middle finger.
            if ((a.finger === Finger.LIndex || a.finger === Finger.RIndex) && a.col !== b.col) return BigramType.AltFinger
            return BigramType.SameFinger;
        }
        // TODO: our current definition column-difference between keys > 4 does not apply to any bigram,
        //  because pinkies have no lateral movement to letters and even on wide layouts, there are no letters in the central column.
        if (Math.abs(a.col - b.col) > 4) return BigramType.OppositeLateral;

        if (a.row === b.row) return BigramType.SameRow;
        if (Math.abs(a.row - b.row) === 1) return BigramType.NeighboringRow;
        return BigramType.OppositeRow;
    } catch (e) {
        console.log(`Error in getBigramType: ${e}. a: ${a}, b: ${b}`);
        throw e;
    }
}

export const bigramRankSize = 40;

export function getBigramMovements(positionsList: KeyPosition[], logContext: string): BigramMovement[] {
    const list = bigrams.data as BigramList;
    const positions = getKeyPositionsByLabel(positionsList);
    return list.map(([[a, b], count], rank) => {
        if (!positions[a]) {
            console.log(`character ${a} not mapped for ${logContext}.`);
            return null;
        }
        if (!positions[b]) {
            console.log(`character ${b} not mapped for ${logContext}.`);
            return null;
        }
        const type = getBigramType(positions[a], positions[b]);
        return {
            a: positions[a],
            b: positions[b],
            frequency: count,
            // TODO: alternatively derive the rank directly from the log or the root of the frequency
            // maybe we should even set the stroke-width directly according to a formula, not a mapping.
            rank: 1 + Math.floor(rank / bigramRankSize),
            type,
            draw: type !== BigramType.OtherHand && type !== BigramType.InvolvesThumb,
        }
    }).filter((m) => !!m);
}

export function bigramFrequencyByType(layout: RowBasedLayoutModel, mapping: FlexMapping): Record<BigramType, number> {
    const charMap = fillMapping(layout, mapping);
    const movements = getBigramMovements(
        getKeyPositions(layout, false, charMap!),
        `bigramFrequencyByType for ${mapping.name} on ${layout.name}`,
    );
    const frequencyTotal = sum(movements.map((m) => m.frequency));
    const frequencyByType: Record<number, number> = {};
    movements.forEach((m) => {
        frequencyByType[m.type] = (frequencyByType[m.type] || 0) + (m.frequency * 1000 / frequencyTotal);
    });
    return frequencyByType;
}

export function weighBigramTypes(movements: BigramMovement[], types: BigramType[]) {
    const sfbs = movements.filter((m) => types.includes(m.type));
    const frequencyTotal = sum(movements.map((m) => m.frequency));
    return Math.round(sum(sfbs.map((m) => m.frequency)) * 1000  / frequencyTotal);
}

export function sumBigramScores(layout: RowBasedLayoutModel, fullMapping: string[][], mappingName: string): number | undefined {
    try {
        // We don't need to pass a "split" value, because we don't use the colPos values in the result.
        // And the very important difference between split/bar ortho layout is already included in the model.
        const movements = getBigramMovements(
            getKeyPositions(layout, false, fullMapping),
            `sumBigramScores for ${mappingName} on ${layout.name}`,
        );
        const frequencyTotal = sum(movements.map((m) => m.frequency));
        const scores = movements.map((m) =>
            m.frequency * bigramEffort[m.type] * 1000 / frequencyTotal
        );
        return Math.round(sum(scores));
    } catch (e) {
        console.log(`Error in sumBigramScores: ${e} for mapping ${mappingName} on layout ${layout.name}`);
        return undefined;
    }
}