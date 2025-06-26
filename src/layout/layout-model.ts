import {KeyboardRows, LayoutType} from "../model.ts";

export const LayoutNames: Record<LayoutType, string> = {
    [LayoutType.ANSI]: "ANSI / Typewriter",
    [LayoutType.Ortho]: "Ortholinear",
    [LayoutType.Harmonic]: "Harmonic Rows",
}

export const LayoutDescriptions: Record<LayoutType, string> = {
    [LayoutType.ANSI]: "The ANSI keyboard layout is based on a typewriter keyboard from the 19th century which gradually evolved " +
        "to add some computer-specific keys like Ctrl, Alt, and most importantly the @ sign. " +
        "This layout has keys of widely varying withs and an awkward stagger of 0.5, 0.25, and again 0.25 between the rows. " +
        "This curiosity still dates back to old typewriter days when each key's middle needed to have a non-intersecting lever underneath to operate its type element. " +
        "To make this ancient layout a bit more user-friendly, we have moved the right hand's home position by one key to the right. " +
        "Most keys move together with this hand position so that muscle memory is strongly preserved. " +
        "While it might look very unusual, it actually is very easy to get used to. " +
        "And this setup makes it easier to switch between a laptop and an ergonomic split keyboard. ",
    [LayoutType.Ortho]: "Ortholinear keyboards remove the weird row stagger and usually also use uniform key sizes. " +
        "Those are just as easy to use, but save a lot of space and also allow for easy changing of the key mapping. " +
        "The layout shown here corresponds to the Iris CE, a split keyboard which is incidentally the one that I used for coding this app. ",
    [LayoutType.Harmonic]: "The Harmonic keyboard layout has a fully symmetric keyboard with only two key sizes to allow for flexible changes to the key mapping. " +
        "Its regular row stagger allows for many keys to be comfortably typed by two fingers, " +
        "which let's you intuitively avoid the awkward same-finger bigrams that make new key mappings feel so awkward. " +
        "Smaller keys make the board slightly narrower than an ANSI-based 60% keyboard, " +
        "yet the hand home position is one key further apart, allowing for arms to relax and shoulders to open. " +
        "This also puts a bit of typing load on the index fingers and less on the pinkies. " +
        "The layout intentionally removes CapsLock and three \"programmer punctuation\" characters from the main layer and maps them onto the AltGr layer. " +
        "Users are encouraged to map the remaining keys to something personally useful for them. (Even the \"programmer punctuation\", if so desired.) ",
}

export type LayoutMapping = (string | number)[][];

export interface RowBasedLayoutModel {
    // 1 unit = width of the smallest key.
    rowStart: (row: KeyboardRows) => number;
    keyWidth: (row: KeyboardRows, col: number) => number;

    // How many columns are to the left of the split line for each row?
    // (Space bar splits just at the column of the row above.)
    splitColumns: number[];

    // Column number counted from 0.
    leftHomeIndex: number;
    rightHomeIndex: number;

    // this one is standardized to take a flex Mapping of exactly 3 by 10 keys
    mapping30keys: LayoutMapping;

    // this one takes a flex mapping depending on the layout
    fullMapping?: LayoutMapping;
}

export function isHomeKey(layoutModel: RowBasedLayoutModel, row: KeyboardRows, col: number): boolean {
    if (row != KeyboardRows.Home) return false;
    if (col <= layoutModel.leftHomeIndex && col > layoutModel.leftHomeIndex - 4) return true;
    if (col >= layoutModel.rightHomeIndex && col < layoutModel.rightHomeIndex + 4) return true;
    return false;
}

export function fillMapping(layoutModel: RowBasedLayoutModel, flexMapping: string[]): string[][] {
        if (flexMapping.length == 3) return mergeMapping(layoutModel.mapping30keys, ["", ...flexMapping]);
        return mergeMapping(layoutModel.fullMapping, flexMapping);
}

export const mergeMapping = (layoutMapping: LayoutMapping, flexMapping: string[]): string[][] =>
    layoutMapping.map((layoutRow, r) =>
        layoutRow.map((layoutValue) =>
            (typeof layoutValue === 'number') ? flexMapping[r][layoutValue] : layoutValue
        )
    )

