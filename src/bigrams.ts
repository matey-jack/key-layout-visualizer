import * as bigrams from "./frequencies/english-character-pairs.json";
import {
    bigramEffort,
    BigramList,
    BigramMovement,
    BigramType,
    FlexMapping,
    hand,
    isThumb,
    KeyPosition,
    RowBasedLayoutModel
} from "./base-model.ts";
import {sum} from "./library/math.ts";
import {getKeyPositions, getKeyPositionsByLabel} from "./layout/layout-functions.ts";

export function getBigramType(a: KeyPosition, b: KeyPosition): BigramType {
    if (isThumb(a.finger) || isThumb(b.finger)) return BigramType.InvolvesThumb;
    if (hand(a.finger) != hand(b.finger)) return BigramType.OtherHand;
    if (a.finger == b.finger) {
        if (a.hasAltFinger || b.hasAltFinger) return BigramType.AltFinger
        else return BigramType.SameFinger;
    }
    if (Math.abs(a.col - b.col) > 4) return BigramType.OppositeLateral;

    if (a.row == b.row) return BigramType.SameRow;
    if (Math.abs(a.row - b.row) == 1) return BigramType.NeighboringRow;
    return BigramType.OppositeRow;
}

export const bigramRankSize = 40;

export function getBigramMovements(positionsList: KeyPosition[]): BigramMovement[] {
    const list = bigrams.data as BigramList;
    const positions = getKeyPositionsByLabel(positionsList);
    return list.map(([[a, b], count], rank) => {
        const type = getBigramType(positions[a], positions[b]);
        return {
            a: positions[a],
            b: positions[b],
            frequency: count,
            // TODO: alternatively derive the rank directly from the log or the root of the frequency
            // maybe we should even set the stroke-width directly according to a formula, not a mapping.
            rank: 1 + Math.floor(rank / bigramRankSize),
            type,
            draw: type != BigramType.OtherHand && type != BigramType.InvolvesThumb,
        }
    })
}

export function bigramFrequencyByType(layout: RowBasedLayoutModel, mapping: FlexMapping): Record<BigramType, number> {
    const movements = getBigramMovements(getKeyPositions(layout, false, mapping));
    const frequencyTotal = sum(movements.map((m) => m.frequency));
    const frequencyByType: Record<BigramType, number> = {};
    movements.forEach((m) => {
        frequencyByType[m.type] = (frequencyByType[m.type] || 0) + (m.frequency * 1000 / frequencyTotal);
    });
    return frequencyByType;
}

export function sumBigramScores(layout: RowBasedLayoutModel, mapping: FlexMapping): number {
    // We don't need to pass a "split" value, because we don't use the colPos values in the result.
    // And the very important difference between split/bar ortho layout is already included in the model.
    const movements = getBigramMovements(getKeyPositions(layout, false, mapping));
    const frequencyTotal = sum(movements.map((m) => m.frequency));
    const scores = movements.map((m) =>
        m.frequency * bigramEffort[m.type] * 1000 / frequencyTotal
    );
    return Math.round(sum(scores));
}