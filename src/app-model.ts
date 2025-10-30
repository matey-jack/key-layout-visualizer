import {ReadonlySignal, Signal} from "@preact/signals";
import {MappingChange, RowBasedLayoutModel, FlexMapping, BigramMovement} from "./base-model.ts";
import {LayoutType, VisualizationType} from "./base-model.ts";

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
    MAX_WIDTH, // 15 keys in home row for widest possible hand distance
    KATANA_60, // the original as published by RominRonin.
}

export interface LayoutOptions {
    type: LayoutType;
    split: boolean;
    // This is more of a mapping transformer than an actual layout,
    // but fits here, since the ansiWideLayout is an actual LayoutModel instance.
    wideAnsi: boolean;
    harmonicVariant: HarmonicVariant;
    plankVariant: PlankVariant;
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
