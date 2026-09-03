import {
    Hand,
    KeyboardRows,
    type KeyPosition,
    type KeymapTypeId,
    type LayoutModel,
} from "../base-model.ts";
import {permute} from "../layout/permutation-functions.ts";
import {
    type Block,
    byAnyMember,
    draws,
    emptyLevelMap,
    getBaseLevel,
    getShiftLevel,
    hasNumberRow,
    is32KeyType,
    type KeyLevels,
    type LevelMap,
    movedTowardsCentre,
    placeBlock,
    resolveSlot,
    type ShiftPairs,
} from "./key-level-functions.ts";
import {getNumberlessKeyLevels, numberlessShiftPairs} from "./numberless-key-levels.ts";

/*
    The three character levels of a key – base, Shift, and AltGr – on a numbered board, that is one
    whose digits have a row of their own. mapping/numberless-key-levels.ts has the tables for the
    boards that have none, and mapping/key-level-functions.ts the mechanics both build on. This
    file also holds what the two have in common towards the app: the ShiftPairing a board and key
    map take, and the getKeyLevels that picks the right set of tables for a board.
    docs/key-levels.md is the canonical description of what the tables below contain and why.
 */

/*
    The colloquial level is defined for the ANSI character set, and the `;:` key is what marks one:
    most European keyboards do not have `;` as a base label. The colloquial rearrangement dissolves
    that very key, so its own `(` stands in for it there – no other key map draws one on the base
    level.
 */
export const isAnsiCharMap = (charMap: string[][]): boolean =>
    charMap.some((row) => row.includes(";") || row.includes("("));

export const ansiShiftPairs: ShiftPairs = byAnyMember([
    "1!", "2@", "3#", "4$", "5%", "6^", "7&", "8*", "9(", "0)",
    "`~", "-_", "=+", "[{", "]}", "\\|", ";:", "'\"", ",<", ".>", "/?",
]);

/*
    The standard German pairings, for the keys an ANSI-shaped board has – the ISO `<>|` key is on
    none of our boards. Two of these keys are drawn by another character than their base one:
    `'` for the `#` key and the frame mapping's `` `~ `` for the `^°` key (see "Showing the Shift
    and AltGr level characters" in the doc), so those labels pair to the same key.
 */
export const germanShiftPairs: ShiftPairs = {
    "1": "1!", "2": "2\"", "3": "3§", "4": "4$", "5": "5%",
    "6": "6&", "7": "7/", "8": "8(", "9": "9)", "0": "0=",
    "°": "^°", "`~": "^°", "`": "^°", "~": "^°",
    "ß": "ß?", "´": "´`", "+": "+*", "#": "#'", "'": "#'",
    ",": ",;", ".": ".:", "-": "-_",
};

/*
    The colloquial 30-key pairings, keyed by the label the colloquial frame mapping draws. The
    rearrangement below has already moved the five kept punctuation characters onto their keys,
    so here every label simply pairs with its own Shift character.
 */
export const colloquialShiftPairs: ShiftPairs = {
    "1": "1!", "2": "2@", "3": "3#", "4": "4$", "5": "5%",
    "6": "6^", "7": "7&", "8": "8*", "9": "9/", "0": "0?",
    ",": ",;", ".": ".:", "'": "'\"", "=": "=+", "-": "-_",
    // The two redundant keys the colloquialisation frees, and the ones the AltGr level
    // covers anyway.
    "(": "(<", ")": ")>",
    "`": "`~", "`~": "`~", "[": "[{", "]": "]}", "\\": "\\|",
};

/*
    The generic international pairings, which every 32-key flex map takes whatever alphabet it
    maps. They are the colloquial ones plus the punctuation keys a 32-key frame mapping may draw:
    `+` is the alternative label of the `=+` key, and `/?` is redundant with the number row's `9/`
    and `0?` – the roomier frame mappings carry it anyway. (`#` is not among them: it stands in
    for a key only on the standard German pairings, where it is the `#'` key.)
 */
export const internationalShiftPairs: ShiftPairs = {
    ...colloquialShiftPairs,
    "+": "=+", "/": "/?",
};

/*
    The German exception among the 32-key maps: `ß` claims a Shift spot in the number row, and `&`
    and `/` move to the digits that carry them on a German keyboard. (`8*` already agrees.) `2@`
    stays, so these maps have `@` on the Shift level and need none on AltGr.
 */
export const germanInternationalShiftPairs: ShiftPairs = {
    ...internationalShiftPairs,
    "6": "6&", "7": "7/", "9": "9ß",
};

// The colloquial Shift level is defined for the English character set only.
export const hasColloquialLevel = (charMap: string[][], hasNumberRow: boolean): boolean =>
    hasNumberRow && isAnsiCharMap(charMap);

// The pairing tables, and thus the rules that pick one, are described in the doc's
// "[App] Shift level" and "A generic international Shift pairing for punctuation" sections.
export enum ShiftPairing {
    Numberless = "numberless",
    Ansi = "ansi",
    German = "german",
    Colloquial = "colloquial",
    International = "international",
    GermanInternational = "germanInternational",
}

export function shiftPairingFor(
    charMap: string[][], hasNumberRow: boolean, keymapType: KeymapTypeId, colloquial: boolean
): ShiftPairing {
    if (!hasNumberRow) return ShiftPairing.Numberless;
    // The `ä` of a German 32-key map is what the international exception keys on; the other
    // alphabets, English included, share the generic table.
    if (is32KeyType(keymapType)) {
        return draws(charMap, "ä") ? ShiftPairing.GermanInternational : ShiftPairing.International;
    }
    if (colloquial && hasColloquialLevel(charMap, hasNumberRow)) return ShiftPairing.Colloquial;
    // Of the two standard pairings, only the German one has a `ß?` key, so its letter decides.
    // There is room for it on layout-model-specific flex maps only.
    return draws(charMap, "ß") ? ShiftPairing.German : ShiftPairing.Ansi;
}

const shiftPairsByPairing: Record<ShiftPairing, ShiftPairs> = {
    [ShiftPairing.Numberless]: numberlessShiftPairs,
    [ShiftPairing.Ansi]: ansiShiftPairs,
    [ShiftPairing.German]: germanShiftPairs,
    [ShiftPairing.Colloquial]: colloquialShiftPairs,
    [ShiftPairing.International]: internationalShiftPairs,
    [ShiftPairing.GermanInternational]: germanInternationalShiftPairs,
};

export const shiftPairsFor = (
    charMap: string[][], hasNumberRow: boolean, keymapType: KeymapTypeId, colloquial: boolean
): ShiftPairs =>
    shiftPairsByPairing[shiftPairingFor(charMap, hasNumberRow, keymapType, colloquial)];

/*
    Some layout models label the `=+` key with its shifted character (see "Showing the Shift and
    AltGr level characters" in the doc), and the cycles below name `=`. Normalise that away first,
    so that every board takes the same path through them.
 */
const normaliseEqualsKey = (charMap: string[][]): string[][] =>
    charMap.map((row) => row.map((label) => (label === "+" ? "=" : label)));

// The colloquial Shift level introduces `(` and `)`, removes `;` and `/`,
// and moves three other keys to better positions. (Rationale in the doc.)
const genericColloquialCycles = [")=';", "(-/"];

/**
 * The board as the colloquial Shift level shows it: the generic rearrangement above, followed by
 * the layout model's own cycles where it defines any. Returns the char map unchanged when the
 * model has no colloquial level at all.
 */
export function colloquialiseCharMap(
    charMap: string[][], model: LayoutModel, keymapType: KeymapTypeId
): string[][] {
    if (!hasColloquialLevel(charMap, hasNumberRow(model))) return charMap;
    const generic = permute(normaliseEqualsKey(charMap), ...genericColloquialCycles) as string[][];
    const cycles = model.colloquialCycles?.[keymapType] ?? [];
    // A separate pass: permute resolves every cycle against the map it is given, so the layout
    // model's own cycles can only name `(` and `)` once the generic ones have placed them.
    return permute(generic, ...cycles) as string[][];
}

const _ = null;

// The number row is not part of the blocks: it pairs with the digits instead, see below.
export const altGrRight: Block = [
    [_, _, _, _, _],
    [_, "\\", "{", "}", "~"],
    [_, "+", "(", ")", "`"],
    [_, "=", "<", ">", _],
    [_, _, _, _, _],
];

export const altGrLeft: Block = [
    [_, _, _, _, _],
    [_, "\\", "}", "{", "~"],
    [_, "+", ")", "(", "`"],
    [_, "=", ">", "<", _],
    [_, _, _, _, _],
];

/*
    The AltGr number row, keyed by the digit the key carries rather than by finger, so that the
    mnemonic pairings survive on the boards that shift their number row around. It is the same
    row on both hands, and thus the one part of the AltGr level that the "Nav keys" switch
    leaves alone.
 */
export const altGrDigits: Record<string, string> =
    {"1": "¡", "2": "¢", "3": "£", "4": "€", "5": "‰", "6": "^", "7": "|", "8": "[", "9": "]", "0": "¿"};

export const navLeft: Block = [
    [_, _, _, _, _],
    [_, "↠", "↑", "↞", _],
    ["⇥", "→", "↓", "←", "⇤"],
    [_, "⇟", "↡", "↟", "⇞"],
    [_, _, _, _, _],
];

export const navRight: Block = [
    [_, _, _, _, _],
    [_, "↞", "↑", "↠", _],
    ["⇤", "←", "↓", "→", "⇥"],
    [_, "⇞", "↟", "↡", "⇟"],
    [_, _, _, _, _],
];

// The number row, placed by digit.
function placeDigits(result: LevelMap, positions: KeyPosition[]) {
    positions.forEach((p) => {
        if (p.row !== KeyboardRows.Number) return;
        const char = altGrDigits[p.label];
        if (char) result[p.row][p.col] = char;
    });
}

// The AltGr level: navigation on `navSide` and the AltGr characters on the other hand.
export function getAltGrLevel(
    model: LayoutModel, positions: KeyPosition[], charMap: string[][],
    keymapType: KeymapTypeId, navSide: Hand
): LevelMap {
    const result = emptyLevelMap(model);
    const charSide = navSide === Hand.Left ? Hand.Right : Hand.Left;

    const navBlock = navSide === Hand.Left ? navLeft : navRight;
    const hasLowerPinky = !!resolveSlot(model, positions, navSide, KeyboardRows.Lower, 4);
    const nav = hasLowerPinky ? navBlock
        : navBlock.map((row, i) => i === KeyboardRows.Lower ? movedTowardsCentre(row) : row);
    placeBlock(result, model, positions, navSide, nav);

    placeBlock(result, model, positions, charSide, charSide === Hand.Right ? altGrRight : altGrLeft);
    placeDigits(result, positions);
    // The standard German pairings are the only ones without a `2@` key, so they are the only
    // ones that need the character here. The colloquial switch cannot change that: it applies
    // to English maps, which have `2@` either way.
    if (shiftPairingFor(charMap, true, keymapType, false) === ShiftPairing.German) {
        // `@` on the key the German standard has it, the key map position [Upper, 0] – `q` in
        // qwertz. That is where the character block puts `~`, so when the block is on that
        // hand, `@` takes the mnemonic AltGr+2 instead, off the `¢` the digits placed there.
        const key = charSide === Hand.Left
            ? positions.find((p) => p.row === KeyboardRows.Number && p.label === "2")
            : resolveSlot(model, positions, Hand.Left, KeyboardRows.Upper, 4);
        if (key) result[key.row][key.col] = "@";
    }
    return result;
}

export const getKeyLevels = (
    model: LayoutModel, positions: KeyPosition[], charMap: string[][],
    keymapType: KeymapTypeId, navSide: Hand, colloquial: boolean
): KeyLevels => {
    if (!hasNumberRow(model)) return getNumberlessKeyLevels(model, positions, charMap, navSide);
    const pairs = shiftPairsFor(charMap, true, keymapType, colloquial);
    return {
        base: getBaseLevel(charMap, pairs),
        shift: getShiftLevel(charMap, pairs),
        altGr: getAltGrLevel(model, positions, charMap, keymapType, navSide),
    };
};
