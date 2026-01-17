import type {ReadonlySignal, Signal} from "@preact/signals";
import type {BigramMovement, FlexMapping, LayoutModel, MappingChange } from "./base-model.ts";
import {LayoutType, type VisualizationType} from "./base-model.ts";

export enum AnsiVariant {
    IBM,
    APPLE,
    HHKB,
    ERGO_KB,
    AHKB,
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
    H13_MidShift, // narrow home row, home row shift.
    H12, // wide home row, lower row shift.
    // The H12 has no nickname, since an H12 narrow doesn't have enough keys to be practical.
}


export enum PlankVariant {
    /*
       60% layout means 15 key units wide
    */
    // the original as published by RominRonin.
    KATANA_60,

    // ErgoMob(ile) 13/3
    EM13,

    // 15 keys in home row for widest possible hand distance.
    // The "include arrows" flag only applies to this one.
    EP60,

    /*
       65% means 16 key units wide so that arrow keys can fit in the classic inverted-T shape!
    */

    // The "big Enter" variant only applies to this one.
    EB65_LOW_SHIFT,

    // Placing Shift in the home row allows for an "angle-mod" and a little gap towards the arrow keys.
    EB65_MID_SHIFT,
}

export enum EB65_LowShift_Variant {
    WIDE_HANDS,
    LESS_GAPS,
    BIG_ENTER,
}

export enum EB65_MidShift_Variant {
    EXTRA_WIDE, // Same key sizes as low shift "wide hands", but keymap changed for wider home position.
    NICELY_WIDE, // Same key sizes as low shift "less gaps", but keymap changed for wider home position.
    RIGHT_ENTER, // Similar key sizes  as low shift "less gaps", same hand position, lower row 0.25 stagger.
    CENTRAL_ENTER, // Same as RIGHT_ENTER, but 1.5u key in upper row gap.
    VERTICAL_ENTER, // Like "right enter", only Enter, Backspace, right Shift change.
}

export interface LayoutOptions {
    type: LayoutType;
    ansiSplit: boolean;
    // This is more of a mapping transformer than an actual layout,
    // but fits here, since the ansiWideLayout is an actual LayoutModel instance.
    ansiWide: boolean;
    ansiVariant: AnsiVariant;
    angleMod: boolean;
    harmonicVariant: HarmonicVariant;
    plankVariant: PlankVariant;
    bottomArrows: boolean;
    esNumberless: boolean;
    eb65LowshiftVariant: EB65_LowShift_Variant;
    eb65MidshiftVariant: EB65_MidShift_Variant;
    flipRetRub: boolean;
}

export function isSplit(opts: LayoutOptions) {
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
}
