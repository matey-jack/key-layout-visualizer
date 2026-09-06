import {describe, expect, it} from "vitest";
import type {LayoutModel} from "../base-model.ts";
import {ansiIBMLayoutModel} from "../layout/ansiLayoutModel.ts";
import {numberlessErgoslatLayoutModel} from "../layout/ergoslatLayoutModel.ts";
import {ergoplankLayoutModel} from "../layout/ergoplankLayoutModel.ts";
import {harmonic13WideLayoutModel} from "../layout/harmonic13WideLayoutModel.ts";
import {fillMapping, findMatchingKeymapType, hasMatchingMapping} from "../layout/layout-functions.ts";
import {xhkb14LayoutModel} from "../layout/xhkbLayoutModel.ts";
import {hasNumberRow} from "./key-level-functions.ts";
import {colloquialiseCharMap} from "./key-levels.ts";
import {allMappings} from "./mappings.ts";
import {
    assignNavKeys,
    NavReplacement,
    navReplacementsOnOffer,
    placeNavKeys,
    spareKeys,
    toggleNavKey,
} from "./nav-keys.ts";
import {numberlessCharMap} from "./numberless-key-levels.ts";

const mappingFor = (model: LayoutModel) => allMappings.find((m) => hasMatchingMapping(model, m))!;

/*
    The board as the keyboard draws it, which is what every rule here reads: the two rearrangements
    that change which characters are where, exactly as LayoutArea and the app state do them.
 */
function board(model: LayoutModel, colloquial: boolean): [string[][], boolean] {
    const mapping = mappingFor(model);
    const charMap = numberlessCharMap(fillMapping(model, mapping)!, model);
    const keymapType = findMatchingKeymapType(model, mapping)!.typeId;
    return [
        colloquial ? colloquialiseCharMap(charMap, model, keymapType) : charMap,
        hasNumberRow(model),
    ];
}

// The keys that changed, as "old label -> new label", which is what a replacement is.
function replacements(model: LayoutModel, colloquial: boolean, wanted: NavReplacement[]) {
    const [charMap, numberRow] = board(model, colloquial);
    const placed = placeNavKeys(charMap, numberRow, wanted);
    const changes: Record<string, string> = {};
    charMap.forEach((row, r) => {
        row.forEach((label, c) => {
            if (placed[r][c] !== label) changes[label] = placed[r][c];
        });
    });
    return changes;
}

const numberlessErgoslat = numberlessErgoslatLayoutModel(false);

describe("spareKeys", () => {
    it("takes the brackets as a pair and the rest one by one", () => {
        expect(spareKeys(...board(ansiIBMLayoutModel, true))).toEqual({
            pairs: [["[", "]"], ["(", ")"]],
            singles: ["\\", "`~", "="],
        });
    });

    it("has no parenthesis pair before the colloquial rearrangement makes one", () => {
        expect(spareKeys(...board(ansiIBMLayoutModel, false)).pairs).toEqual([["[", "]"]]);
    });

    it("finds the `=+` key by whichever of its two characters the board draws", () => {
        // The Harmonic frame mapping labels that key `+`, and the backtick key without its tilde.
        expect(spareKeys(...board(harmonic13WideLayoutModel, false)).singles)
            .toEqual(["\\", "`", "+"]);
    });

    it("leaves a numberless board alone, since its third level maps no punctuation twice", () => {
        expect(spareKeys(...board(numberlessErgoslat, false))).toEqual({pairs: [], singles: []});
    });
});

describe("navReplacementsOnOffer", () => {
    it("offers all four where the board has keys to spare", () => {
        expect(navReplacementsOnOffer(...board(ansiIBMLayoutModel, true))).toEqual([
            NavReplacement.HomeEnd, NavReplacement.PageUpDown,
            NavReplacement.Delete, NavReplacement.Insert,
        ]);
    });

    it("offers nothing for a key the board already has", () => {
        // The Thumbs Up boards carry a Delete key in the number row.
        expect(navReplacementsOnOffer(...board(xhkb14LayoutModel, true)))
            .not.toContain(NavReplacement.Delete);
    });

    it("offers nothing at all for a board that has every one of them", () => {
        expect(navReplacementsOnOffer(...board(ergoplankLayoutModel, true))).toEqual([]);
    });

    it("offers nothing for a board with no spare key", () => {
        expect(navReplacementsOnOffer(...board(numberlessErgoslat, false))).toEqual([]);
    });
});

describe("assignNavKeys", () => {
    it("gives the first pair to Home/End and the second to PageUp/PageDown", () => {
        expect(replacements(ansiIBMLayoutModel, true,
            [NavReplacement.HomeEnd, NavReplacement.PageUpDown]))
            .toEqual({"[": "⇤", "]": "⇥", "(": "⇞", ")": "⇟"});
    });

    it("gives the first pair to whichever paired button is on alone", () => {
        expect(replacements(ansiIBMLayoutModel, true, [NavReplacement.PageUpDown]))
            .toEqual({"[": "⇞", "]": "⇟"});
    });

    it("spends the singles in order, and only then breaks up a pair", () => {
        const [charMap, numberRow] = board(ansiIBMLayoutModel, true);
        const singleOnly = [NavReplacement.Delete, NavReplacement.Insert];
        expect(assignNavKeys(charMap, numberRow, singleOnly).labels)
            .toEqual(new Map([["\\", "⌦"], ["`~", "⎀"]]));
        // With both pairs spent and only `=` left as a single, Insert has to take a bracket.
        const all = [NavReplacement.HomeEnd, NavReplacement.PageUpDown, ...singleOnly];
        expect(replacements(harmonic13WideLayoutModel, true, all))
            .toEqual({"[": "⇤", "]": "⇥", "(": "⇞", ")": "⇟", "\\": "⌦", "`": "⎀"});
    });

    it("serves the pairs first, so that a single cannot take the last bracket pair", () => {
        // The standard ANSI board has one pair and three singles.
        const wanted = [NavReplacement.Delete, NavReplacement.Insert, NavReplacement.HomeEnd];
        expect(replacements(ansiIBMLayoutModel, false, wanted))
            .toEqual({"[": "⇤", "]": "⇥", "\\": "⌦", "`~": "⎀"});
    });

    it("places nothing on a board that has no spare key", () => {
        const [charMap, numberRow] = board(numberlessErgoslat, false);
        expect(placeNavKeys(charMap, numberRow, [NavReplacement.Delete])).toBe(charMap);
    });
});

describe("toggleNavKey", () => {
    // One bracket pair and three singles, so the two paired buttons have to share.
    const [ansi, numberRow] = board(ansiIBMLayoutModel, false);
    const toggle = (wanted: NavReplacement[], clicked: NavReplacement) =>
        toggleNavKey(ansi, numberRow, wanted, clicked);

    it("switches a replacement off again", () => {
        expect(toggle([NavReplacement.HomeEnd, NavReplacement.Delete], NavReplacement.HomeEnd))
            .toEqual([NavReplacement.Delete]);
    });

    it("appends while there is room", () => {
        expect(toggle([NavReplacement.HomeEnd], NavReplacement.Delete))
            .toEqual([NavReplacement.HomeEnd, NavReplacement.Delete]);
    });

    it("takes the only pair from the paired replacement that had it, leaving the singles alone", () => {
        const full = [NavReplacement.HomeEnd, NavReplacement.Delete, NavReplacement.Insert];
        expect(toggle(full, NavReplacement.PageUpDown))
            .toEqual([NavReplacement.Delete, NavReplacement.Insert, NavReplacement.PageUpDown]);
    });

    /*
        A board with one bracket pair and not a single spare key beside it, which none of our
        models is - the only way to make a single click evict a pair.
     */
    it("reaches for the other kind only when there is none of its own", () => {
        const onePairOnly = [["a", "[", "]"]];
        expect(toggleNavKey(onePairOnly, true, [NavReplacement.HomeEnd], NavReplacement.Delete))
            .toEqual([NavReplacement.Delete]);
    });

    it("unassigns as many as the new one needs", () => {
        const onePairOnly = [["a", "[", "]"]];
        // Both singles fit, one on each bracket - and a paired replacement needs both of them back.
        const both = [NavReplacement.Delete, NavReplacement.Insert];
        expect(toggleNavKey(onePairOnly, true, both, NavReplacement.HomeEnd))
            .toEqual([NavReplacement.HomeEnd]);
    });
});
