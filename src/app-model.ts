import {ReadonlySignal, Signal} from "@preact/signals";
import {MappingChange, RowBasedLayoutModel, FlexMapping, BigramMovement} from "./base-model.ts";
import {LayoutType, VisualizationType} from "./base-model.ts";

export enum AnsiVariant {
    ANSI_IBM,
    ANSI_APPLE,
    ANSI_HHKB,
    ANSI_AHKB,
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
    KATANA_60, // the original as published by RominRonin.

    // vv the "include arrows" flag only applies to this one.
    EP60, // 15 keys in home row for widest possible hand distance

    /*
       65% means 16 key units wide and Nav keys in right-most column
       Main reason for this is to arrange the arrow keys in inverted T shape!
    */
    // vv the "big Enter" variant only applies to this one.
    EB65_LOW_SHIFT, // 16 columns (65%) to make arrow cluster fit in bottom right

    EB65_MID_SHIFT, // placing Shift in the home row allows for an "angle-mod" and a little gap towards the arrow keys.
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
    ansiApple: boolean; // todo: replace by ansiVariant
    // ansiVariant: AnsiVariant;
    harmonicVariant: HarmonicVariant;
    plankVariant: PlankVariant;
    ep60Arrows: boolean;
    ep60angleMod: boolean;
    eb65LowshiftVariant: EB65_LowShift_Variant;
    eb65MidshiftVariant: EB65_MidShift_Variant;
    flipRetRub: boolean;
}

export interface AppState {
    // Getter/Setter to do validations on the state.
    layout: ReadonlySignal<LayoutOptions>;
    layoutModel: ReadonlySignal<RowBasedLayoutModel>;
    setLayout: (layoutOptions: LayoutOptions) => void;

    mapping: Signal<FlexMapping>;
    setMapping: (m: FlexMapping) => void;
    mappingDiff: ReadonlySignal<Record<string, MappingChange>>;
    bigramMovements: ReadonlySignal<BigramMovement[]>;

    vizType: Signal<VisualizationType>;
}
