import {
    bigramEffort,
    type BigramList,
    type BigramMovement,
    BigramType,
    Finger,
    type FlexMapping,
    hand,
    isThumb,
    type KeyPosition,
    type LayoutModel,
} from "./base-model.ts";
import * as bigrams from "./frequencies/english-character-pairs.json";
import {fillMapping, getKeyPositions, getKeyPositionsByLabel} from "./layout/layout-functions.ts";
import {sum} from "./library/math.ts";

export function getBigramType(a: KeyPosition, b: KeyPosition): BigramType {
    try {
        if (isThumb(a.finger) || isThumb(b.finger)) return BigramType.InvolvesThumb;
        if (hand(a.finger) !== hand(b.finger)) return BigramType.OtherHand;
/*
    For [[piano-fingering]], it's more complicated, as my own typing experience shows: since the index-finger is shorter
    and the hand can more easily turn inwards, it's easier to type bigrams where the key further to the center is on a lower row
    then the opposite. Classical qwerty UN allows my to move the hand a bit so that both fingers are stretched and not bend much.
    But UM stretches the index finger while curling the middle finger at the same time. So the first is a nice piano bigram,
    the second is a pianoScissor, even though technically both a scissor moves.
    And then there is something like YH which cannot be done nicely with two fingers, because one is too close under the other.
    (Same reason why alt-fingering only works for a stagger of 0.5, not less.)
    But YN is like UM: not comfy, but possible. It's just a question of how much a person tends to stick to the prescribed typing
    style... and also how far they lift the hands over the keyboard: farther up means a lot more flexibility and piano-ing.

    let's break it down:
     - if the keys are placed on the same row (qwerty RT and UY) then it's always pianoAltFingerable.
     - if the keys are placed on neighboring rows
       * with the key on the lower row further to the center, then piano (qwerty RG and UH)
       * with the key on the lower row at least 0.5 further from the center, then pianoScissor (FC, HN)
       * Note that the 0.25 case in one direction is not possible (YH, UJ), while in the other direction it's even quite nice
         (piano, no scissor, examples on qwerty exists only on the left hand: RF, TG). Those latter wouldn't even work
         with normal alt-fingering rules, but the specific lengths of the middle and index finger, combined with stretching,
         not curling the fingers, makes it possible.

     - if the keys are placed on the upper and lower row
       * with the key on the lower row further to the center, then piano (qwerty UN, even EC although that's just an ordinary
         alt-fingering).
       * with the key on the lower row at least 0.5 further from the center, pianoScissor: this is why YN and UM works,
       but TV and RC don't. And this despite RC being considered an ordinary different-finger scissor bigram!
       There should actually be a specific category for those crazy undercutting scissor bigrams that occur only on the
       left hand of an ANSI keyboard with no angle mod!

    Thus, we see: the rules are actually the same for all rows: even with both keys on the same row, the normal condition
    for piano with distance of at least 0.5u is always fulfilled.

    We don't consider piano-fingering for other than the index finger. (People might do it for {} on qwerty, but not letters on the pinky.)

    TODO: there should probably also be an CrossScissor entry in the bigram types, because pairs like qwerty EX
      are especially hard to type. Typewriter staggering on the left is especially vicious!
      On the right side, MI is a neighbour-scissor (delta colPos only 0.25), but with fingers moving nicely in parallel.
      And the alt-fingered MU has a larger delta colPos of 0.75 which makes the crossing of fingers less awkward.
      At least, the left side is similar with that, for example with EC.
*/
        if (a.finger === b.finger) {
            if (a.hasAltFinger || b.hasAltFinger) return BigramType.AltFinger
            if (a.finger === Finger.LIndex || a.finger === Finger.RIndex) {
                // piano cases, see above.
                if (a.row === b.row) return BigramType.PianoAltFinger;
                const [lower, upper] = a.row > b.row ? [a, b] : [b, a];
                const centerDir = a.finger === Finger.LIndex ? 1 : -1;
                const diff = (lower.colPos - upper.colPos) * centerDir;
                if (diff >= 0.25) return BigramType.PianoAltFinger;
                if (diff <= -0.5) return BigramType.PianoScissor;
            }
            return BigramType.SameFinger;
        }
        // NOTE: our current definition column-difference between keys > 4 does not apply to any bigram,
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

export function bigramFrequencyByType(layout: LayoutModel, mapping: FlexMapping): Record<BigramType, number> {
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

export function sumBigramScores(layout: LayoutModel, fullMapping: string[][], mappingName: string): number | undefined {
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