import type {ReadonlySignal, Signal} from "@preact/signals";
import type {BigramMovement, FlexMapping, Hand, KeymapTypeId, LayoutModel, MappingChange} from "./base-model.ts";
import {LayoutType, type VisualizationType} from "./base-model.ts";
import type {ShiftPairing} from "./mapping/key-levels.ts";

export enum AnsiVariant {
    IBM,
    APPLE,
    HHKB,
    XHKB,
    AN65,
}

/*
    The Thumbs Up variants, named (as everywhere else) by total width in key units
    and the number of keys between the two index-finger home keys.
 */
export enum ThumbsUpVariant {
    TU13,  // 13/2, without any central keys.
    TU15,  // 15/4, the original.
    TU16,  // 16/5, with the central arrow cluster.
    // Listed after the wider boards so that the numeric values the `thumbsUp` URL parameter
    // stores keep pointing at the same variant. The buttons order themselves by width.
    TU14,  // 14/3, with a single central column.
}

/*
    Just for the sake of disambiguating, I classify all Harmonic variants by their total width in key units first,
    and then by the number of keys in the home row. A "wide Harmonic" has as many keys in the home row as the width of the board.
    A narrow variant has the home row staggered and thus one less key in it.
 */
export enum HarmonicVariant {
    H14_Wide,  // wide home row, lower row shift.
    H14_Traditional,  // narrow home row, lower row 2u shift.
    H13_Wide, // narrow home row, lower row shift.
    H13_Mid_shift, // narrow home row, home row shift.
    H12, // wide home row, lower row shift.
    // The H12 has no nickname, since an H12 narrow doesn't have enough keys to be practical.
}


export enum PlankVariant {
    // the original as published by RominRonin. 60% layout means 15 key units wide.
    KATANA_60,

    // Ergoslat 13/3
    ERGOSLAT,

    // 15 keys in home row for widest possible hand distance.
    // The "include arrows" flag only applies to this one.
    ERGOPLANK,
    ERGOBOARD_CENTRAL,

    // 16 keys width for all variants, different hand distance for each.
    ERGOBOARD_LOW_SHIFT,
    ERGOBOARD_LEGACY,
}

export enum ErgoboardLowshiftVariant {
    WIDE_HANDS,
    LESS_GAPS,
    BIG_ENTER,
}

export enum ErgoboardVariant {
    EXTRA_WIDE, // Same key sizes as Low-shift "wide hands", but keymap changed for wider home position.
    COMFY_WIDE, // Same key sizes as Low-shift "less gaps", but keymap changed for wider home position.
    SEMI_WIDE, // Same key sizes as Low-shift wide hands; even same hand position; only Shift assignment moves. (This is the widest possible hand position that still fits the traditional Return key position.
    RIGHT_ENTER, // Similar key sizes as Low-shift "less gaps", same hand position, lower row 0.25 stagger.
    VERTICAL_ENTER, // Like "right enter", only Enter, Backspace, right Shift change.
    CENTRAL_ENTER, // Same as RIGHT_ENTER, but 1.5u key in upper row gap.
}

export enum ErgoplankArrows {
    None,
    Inline,
    Center,
}

export interface LayoutOptions {
    type: LayoutType;
    // The only option which applies to keyboards within all families (although not all keyboards).
    midShift: boolean;

    // options for the ANSI family.
    ansiVariant: AnsiVariant;
    ansiSplit: boolean;
    // This is more of a mapping transformer than an actual layout,
    // but fits here, since the ansiWideLayout is an actual LayoutModel instance.
    ansiWide: boolean;
    thumbsUpVariant: ThumbsUpVariant;

    // only one for the Harmonic family
    harmonicVariant: HarmonicVariant;
    harmonicHexagons: boolean;

    // and a lot of options for the ErgoPlank family
    plankVariant: PlankVariant;
    flipRetRub: boolean;

    // ErgoSlat
    esNumberless: boolean;
    esSmallerThumbs: boolean;

    // ErgoPlank
    epArrows: ErgoplankArrows;
    epRightReturn: boolean;

    // Ergoboards
    ergoboardLowshiftVariant: ErgoboardLowshiftVariant;
    angleMod: boolean; // used for EbLowshiftWide only
    ergoboardVariant: ErgoboardVariant;

    // ErgoSplit aka SplitOrtho
    soThumbShift: boolean;
}

export function isSplit(opts: Partial<LayoutOptions>) {
    return opts.ansiSplit || opts.type === LayoutType.Ergosplit;
}

export interface AppState {
    // Getter/Setter to do validations on the state.
    layout: ReadonlySignal<LayoutOptions>;
    setLayout: (layoutOptions: Partial<LayoutOptions>) => void;
    layoutModel: ReadonlySignal<LayoutModel>;
    prevLayoutModel: ReadonlySignal<LayoutModel>;

    mapping: Signal<FlexMapping>;
    setMapping: (m: FlexMapping) => void;
    prevMapping: ReadonlySignal<FlexMapping>;
    mappingDiff: ReadonlySignal<Record<string, MappingChange>>;
    bigramMovements: ReadonlySignal<BigramMovement[]>;

    vizType: Signal<VisualizationType>;
    // Which hand carries the "hands down" navigation block in the key levels visualization.
    // The AltGr characters go to the other hand.
    navSide: Signal<Hand>;
    // Whether the key levels visualization shows the colloquial Shift pairings.
    shiftColloquial: Signal<boolean>;
    resolvedKeyLevels: ReadonlySignal<ResolvedKeyLevels>;
}

/*
    What the key level rules make of the current board, key map and switches. The keyboard, the
    switches above it and the details text next to it all need parts of this, and deriving it once
    is what keeps the three from drifting apart.
 */
export interface ResolvedKeyLevels {
    keymapType: KeymapTypeId;
    hasNumberRow: boolean;
    // How many keys the board has for characters, which is what decides how much of a pairing's
    // budget it uses up and how much it maps twice.
    characterKeys: number;
    // Whether the colloquial switch has anything to offer, which is what decides whether it shows.
    hasColloquialLevel: boolean;
    // Whether the board is actually drawn colloquialised: the switch, but only where the key map
    // has a colloquial level for it to select, and only in the visualization that shows one.
    colloquial: boolean;
    pairing: ShiftPairing;
}
