import {ReadonlySignal, Signal} from "@preact/signals";
import {MappingChange, RowBasedLayoutModel, FlexMapping, BigramMovement} from "./base-model.ts";
import {LayoutSplit, LayoutType, VisualizationType} from "./base-model.ts";
import {AnsiLayoutOptionsModel} from "./layout/ansiLayoutModel.ts";
import {OrthoLayoutOptionsModel} from "./layout/orthoLayoutModel.ts";

export interface AppState {
    // There's a writeable signal behind those two, but we hide it behind a setter function to preserve model integrity.
    layoutType: ReadonlySignal<LayoutType>;
    setLayoutType: (layoutType: LayoutType) => void;

    layoutOptions: LayoutOptionsState;
    layoutSplit: Signal<LayoutSplit>;
    layoutModel: ReadonlySignal<RowBasedLayoutModel>;
    mapping: Signal<FlexMapping>;

    vizType: Signal<VisualizationType>;
    mappingDiff: ReadonlySignal<Record<string, MappingChange>>;
    bigramMovements: ReadonlySignal<BigramMovement[]>;
}

/*
    Just for the sake of disambiguating, I classify all Harmonic variants by their width in key units first,
    and then by how many rows actually have that width, ignoring that the bottom will usually have less actual keys.
    Shift keys will be either on the 1.5u keys of a shorter row, or in some other arrangement of the lower row when it
    is the longer one (a /2 variant).

    I will probably find more descriptive names, once I have seen the boards and worked with them.
    Until then, names around the code might be inconsistent...
 */
export enum HarmonicVariant {
    H14_Traditional,  // 14/2, lower row 2u shift
    H13_3, // 13/3, lower row shift
    H13_MidShift, // 13/2, home row shift
    H12_3, // 12/3, lower row shift
}

export interface HarmonicLayoutOptionsModel {
    variant: HarmonicVariant;
}

export interface LayoutOptionsState {
    // TODO: life would be easier if we had signals inside those structures!
    ansiLayoutOptions: Signal<AnsiLayoutOptionsModel>;
    harmonicLayoutOptions: Signal<HarmonicLayoutOptionsModel>;
    orthoLayoutOptions: Signal<OrthoLayoutOptionsModel>;
}
