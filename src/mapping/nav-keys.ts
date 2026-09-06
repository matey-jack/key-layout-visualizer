import {permute} from "../layout/permutation-functions.ts";
import {draws} from "./key-level-functions.ts";

/*
    The spare punctuation keys and what else they could be. A board with a number row maps every
    one of `[{ ]} \| `~ =+` on the AltGr level as well, so those keys are redundant as characters
    and free for navigation and editing instead - and they sit right next to the letter area, where
    a nav cluster never does. docs/key-levels.md, "Using the redundant keys as navigation keys
    instead", is the canonical description of the idea and of the rules below.

    Everything here reads the char map as the board draws it, which is why the colloquial
    rearrangement has to run first: it is what puts `(` and `)` on the board.
 */

// In button order, which is also the order in which each picks its keys.
export enum NavReplacement {
    HomeEnd,
    PageUpDown,
    Delete,
    Insert,
}

export const allNavReplacements: NavReplacement[] = [
    NavReplacement.HomeEnd, NavReplacement.PageUpDown, NavReplacement.Delete, NavReplacement.Insert,
];

/*
    The symbols each replacement places. A two-symbol one needs a bracket pair and keeps the
    reading order of the brackets: the opening one goes up and back, the closing one down and
    forward. (Which glyph stands for which key: docs/key-symbols.md.)
 */
const navSymbols: Record<NavReplacement, string[]> = {
    [NavReplacement.HomeEnd]: ["⇤", "⇥"],
    [NavReplacement.PageUpDown]: ["⇞", "⇟"],
    [NavReplacement.Delete]: ["⌦"],
    [NavReplacement.Insert]: ["⎀"],
};

export const isKeyPair = (replacement: NavReplacement): boolean =>
    navSymbols[replacement].length === 2;

export const navSymbolsOf = (replacement: NavReplacement): string[] => navSymbols[replacement];

/*
    A spare key, as the labels a board may draw it by, best first: the `=+` key shows as either
    character (see "Showing the Shift and AltGr level characters" in the doc), and the backtick key
    carries its Shift character in the label on the boards whose frame mapping spells it out.
 */
type SpareKey = string[];

const bracketPairs: [SpareKey, SpareKey][] = [[["["], ["]"]], [["("], [")"]]];

/*
    The `/?` key is not among them, although its characters do move to the number row in the
    colloquial mode: the rearrangement that moves them is the very one that spends the key, so no
    board ever draws a `/` that is redundant.
 */
const singleKeys: SpareKey[] = [["\\"], ["`~", "`"], ["=", "+"]];

const drawnAs = (charMap: string[][], key: SpareKey): string | undefined =>
    key.find((label) => draws(charMap, label));

export interface SpareKeys {
    // Both members of each pair, in the brackets' own order.
    pairs: [string, string][];
    singles: string[];
}

/**
 * The spare keys of one board, in the order the replacements take them. Numberless boards have
 * none: their third level drops the technical punctuation rather than mapping it redundantly, so
 * the punctuation keys they do have are the only home their characters get.
 */
export function spareKeys(charMap: string[][], numberRow: boolean): SpareKeys {
    if (!numberRow) return {pairs: [], singles: []};
    const pairs = bracketPairs
        .map(([opening, closing]) => [drawnAs(charMap, opening), drawnAs(charMap, closing)])
        .filter((pair): pair is [string, string] => !!pair[0] && !!pair[1]);
    const singles = singleKeys
        .map((key) => drawnAs(charMap, key))
        .filter((label): label is string => !!label);
    return {pairs, singles};
}

/**
 * The replacements to offer for one board: one whose key the board already has needs no button,
 * and the paired ones need a bracket pair to go on.
 */
export function navReplacementsOnOffer(charMap: string[][], numberRow: boolean): NavReplacement[] {
    const {pairs, singles} = spareKeys(charMap, numberRow);
    if (!pairs.length && !singles.length) return [];
    return allNavReplacements.filter((replacement) =>
        !navSymbols[replacement].some((symbol) => draws(charMap, symbol))
        && (pairs.length > 0 || !isKeyPair(replacement)));
}

export interface NavKeyAssignment {
    // The key labels to replace, each with the symbol that takes its place.
    labels: Map<string, string>;
    // The replacements that found a key, which is all of them unless the board ran out.
    placed: NavReplacement[];
}

/**
 * Which key each wanted replacement gets. Pairs are served before singles, so that a single can
 * never take the bracket pair a paired replacement still needs; within each kind the button order
 * decides. A single may take a key from a pair, but only once the pure singles are spent.
 */
export function assignNavKeys(
    charMap: string[][], numberRow: boolean, wanted: NavReplacement[]
): NavKeyAssignment {
    const {pairs, singles} = spareKeys(charMap, numberRow);
    const offered = navReplacementsOnOffer(charMap, numberRow).filter((r) => wanted.includes(r));
    const freePairs = [...pairs];
    const freeSingles = [...singles];
    const labels = new Map<string, string>();
    const placed: NavReplacement[] = [];

    for (const replacement of offered.filter(isKeyPair)) {
        const pair = freePairs.shift();
        if (!pair) continue;
        pair.forEach((label, i) => {
            labels.set(label, navSymbols[replacement][i]);
        });
        placed.push(replacement);
    }
    for (const replacement of offered.filter((r) => !isKeyPair(r))) {
        // Past the last single, the next unused pair is broken up into two of them.
        if (!freeSingles.length) freeSingles.push(...(freePairs.shift() ?? []));
        const label = freeSingles.shift();
        if (!label) continue;
        labels.set(label, navSymbols[replacement][0]);
        placed.push(replacement);
    }
    return {labels, placed};
}

const fits = (charMap: string[][], numberRow: boolean, wanted: NavReplacement[]): boolean =>
    assignNavKeys(charMap, numberRow, wanted).placed.length
    === navReplacementsOnOffer(charMap, numberRow).filter((r) => wanted.includes(r)).length;

/**
 * The selection after one button click, kept in the order the buttons were switched on. A click
 * that finds no key left unassigns the oldest selection to make room, preferring one of the same
 * kind - so a pair gives way to a pair - and reaching for the other kind only when there is none.
 */
export function toggleNavKey(
    charMap: string[][], numberRow: boolean, wanted: NavReplacement[], clicked: NavReplacement
): NavReplacement[] {
    if (wanted.includes(clicked)) return wanted.filter((r) => r !== clicked);
    let selection = [...wanted, clicked];
    while (!fits(charMap, numberRow, selection)) {
        const others = selection.filter((r) => r !== clicked);
        const victim = others.find((r) => isKeyPair(r) === isKeyPair(clicked)) ?? others[0];
        if (victim === undefined) return selection;
        selection = selection.filter((r) => r !== victim);
    }
    return selection;
}

/**
 * The board with the wanted replacements drawn on it. Each one is a permutation of the plainest
 * kind: the nav key enters where the spare key sat, and the spare key leaves.
 */
export function placeNavKeys(
    charMap: string[][], numberRow: boolean, wanted: NavReplacement[]
): string[][] {
    const {labels} = assignNavKeys(charMap, numberRow, wanted);
    if (!labels.size) return charMap;
    // A cycle token is one character, and permute resolves it to the two-character label where the
    // board draws one (`` ` `` to `` `~ ``).
    const cycles = [...labels].map(([label, symbol]) => symbol + label[0]);
    return permute(charMap, ...cycles) as string[][];
}
