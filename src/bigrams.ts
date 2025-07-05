import * as bigrams from "./frequencies/english-character-pairs.json";
import {BigramList, BigramMovement, BigramType, hand, isThumb, KeyPosition} from "./base-model.ts";

export function getBigramType(a: KeyPosition, b: KeyPosition): BigramType {
    if (isThumb(a.finger) || isThumb(b.finger)) return BigramType.InvolvesThumb;
    if (hand(a.finger) != hand(b.finger)) return BigramType.OtherHand;
    if (a.finger == b.finger) return BigramType.SameFinger;
    if (Math.abs(a.col - b.col) > 4) return BigramType.OppositeLateral;

    if (a.row == b.row) return BigramType.SameRow;
    if (Math.abs(a.row - b.row) == 1) return BigramType.NeighboringRow;
    return BigramType.OppositeRow;
}

export function getBigramMovements(positions: Record<string, KeyPosition>): BigramMovement[] {
    const list = bigrams.data as BigramList;
    return list.map(([[a, b], count], rank) => {
        const type = getBigramType(positions[a], positions[b]);
        return {
            a: positions[a],
            b: positions[b],
            frequency: count,
            // TODO: alternatively derive the rank directly from the log or the root of the frequency
            // maybe we should even set the stroke-width directly according to a formula, not a mapping.
            rank: 1 + Math.floor(rank/30),
            type,
            draw: type != BigramType.OtherHand && type != BigramType.InvolvesThumb,
        }
    })
}
