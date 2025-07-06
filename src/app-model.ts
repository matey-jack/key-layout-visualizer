import {ReadonlySignal, Signal} from "@preact/signals";
import {MappingChange, RowBasedLayoutModel, FlexMapping, BigramMovement} from "./base-model.ts";
import {LayoutSplit, LayoutType, VisualizationType} from "./base-model.ts";
import {AnsiLayoutOptionsModel} from "./layout/ansiLayoutModel.ts";
import {HarmonicLayoutOptionsModel} from "./layout/harmonic13cLayoutModel.ts";
import {OrthoLayoutOptionsModel} from "./layout/orthoLayoutModel.ts";

export interface AppState {
    layoutType: Signal<LayoutType>;
    layoutOptions: LayoutOptionsState;
    layoutSplit: Signal<LayoutSplit>;
    layoutModel: ReadonlySignal<RowBasedLayoutModel>;
    mapping: Signal<FlexMapping>;

    vizType: Signal<VisualizationType>;
    mappingDiff: ReadonlySignal<Record<string, MappingChange>>;
    bigramMovements: ReadonlySignal<BigramMovement[]>;
}

export interface LayoutOptionsState {
    ansiLayoutOptions: Signal<AnsiLayoutOptionsModel>;
    harmonicLayoutOptions: Signal<HarmonicLayoutOptionsModel>;
    orthoLayoutOptions: Signal<OrthoLayoutOptionsModel>;
}
