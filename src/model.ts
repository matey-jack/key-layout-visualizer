import {computed, ReadonlySignal, signal} from "@preact/signals";
import {qwertyMapping} from "./mapping/mappings.ts";
import {defaultAnsiLayoutOptions} from "./layout/ansiLayoutModel.ts";
import {defaultHarmonicLayoutOptions} from "./layout/harmonicLayoutModel.ts";
import {defaultOrthoLayoutOptions} from "./layout/orthoLayoutModel.ts";
import {diffToQwerty, getLayoutModel, MappingChange, RowBasedLayoutModel} from "./layout/layout-model.ts";

export enum LayoutType {
    ANSI,
    Ortho,
    Harmonic,
}

export enum LayoutSplit {
    Bar,
    Cleave,
    Flex,
    TwoPiece,
}

// change this carefully, we actually use the numeric values 0..4 in calculations!
export enum KeyboardRows {
    Number,
    Upper,
    Home,
    Lower,
    Bottom,
}

export type AppState = ReturnType<typeof createAppState>;

export type LayoutOptionsState = AppState['layoutOptions'];

// Some of the state could be local the Layout or Mapping areas, but unless this global thing gets too big,
// let's just have one.
export function createAppState() {
    const layoutType = signal(LayoutType.ANSI);
    const layoutSplit = signal(LayoutSplit.Bar);
    const layoutOptions = {
        ansiLayoutOptions: signal(defaultAnsiLayoutOptions),
        harmonicLayoutOptions: signal(defaultHarmonicLayoutOptions),
        orthoLayoutOptions: signal(defaultOrthoLayoutOptions),
    };
    const layoutModel: ReadonlySignal<RowBasedLayoutModel> = computed(() =>
        getLayoutModel(layoutType.value, layoutOptions)
    )

    const mapping = signal(qwertyMapping);
    const mappingDiff: ReadonlySignal<Record<string, MappingChange>> = computed(() =>
        diffToQwerty(layoutModel.value, mapping.value)
    )
    return { layoutType, layoutOptions, layoutSplit, layoutModel, mapping, mappingDiff };
}