import {ReadonlySignal, Signal} from "@preact/signals";
import {MappingChange, RowBasedLayoutModel, FlexMapping} from "./base-model.ts";
import {LayoutSplit, LayoutType, VisualizationType} from "./base-model.ts";
import {AnsiLayoutOptionsModel} from "./layout/ansiLayoutModel.ts";
import {HarmonicLayoutOptionsModel} from "./layout/harmonicLayoutModel.ts";
import {OrthoLayoutOptionsModel} from "./layout/orthoLayoutModel.ts";

export interface AppState {
    layoutType: Signal<LayoutType>;
    layoutOptions: LayoutOptionsState;
    layoutSplit: Signal<LayoutSplit>;
    layoutModel: ReadonlySignal<RowBasedLayoutModel>;

    vizType: Signal<VisualizationType>;
    mapping: Signal<FlexMapping>;
    mappingDiff: ReadonlySignal<Record<string, MappingChange>>;
}

export interface LayoutOptionsState {
    ansiLayoutOptions: Signal<AnsiLayoutOptionsModel>;
    harmonicLayoutOptions: Signal<HarmonicLayoutOptionsModel>;
    orthoLayoutOptions: Signal<OrthoLayoutOptionsModel>;
}
