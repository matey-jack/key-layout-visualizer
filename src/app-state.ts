import {FlexMapping, LayoutType, RowBasedLayoutModel, VisualizationType} from "./base-model.ts";
import {computed, effect, signal, Signal} from "@preact/signals";
import {AppState, HarmonicVariant, LayoutOptions, PlankVariant} from "./app-model.ts";
import {
    diffToBase,
    fillMapping,
    getKeyPositions,
    getLayoutModel,
    hasMatchingMapping
} from "./layout/layout-functions.ts";
import {allMappings, colemakMapping, qwertyMapping} from "./mapping/mappings.ts";
import {getBigramMovements} from "./bigrams.ts";

// returns new split value, if the layout only supports one
function modifySplit(opts: LayoutOptions): boolean {
    switch (opts.type) {
        case LayoutType.Harmonic:
        case LayoutType.ErgoPlank:
            return false;
        case LayoutType.Ortho:
            return true;
    }
    return opts.split;
}

function modifyWide(opts: LayoutOptions, mapping: FlexMapping): boolean {
   if (opts.type == LayoutType.ANSI) {
       if (!mapping.mapping30 && !mapping.mappingAnsi && (mapping.mappingAnsiWide || mapping.mappingThumb30)) {
           return true;
       }
   }
   return opts.wideAnsi;
}

// Function needed, because doing the same in an effect() would already run all the computed() functions
// with inconsistent data that might crash them.
function setLayout(
    opts: LayoutOptions,
    layoutOptionsState: Signal<LayoutOptions>,
    mapping: Signal<FlexMapping>,
) {
    const newLayoutOptions = {...opts, split: modifySplit(opts), ansiWide: modifyWide(opts, mapping.value)};
    const newLayoutModel = getLayoutModel(newLayoutOptions);
    if (!hasMatchingMapping(newLayoutModel, mapping.value)) {
        const mappingName = mapping.value.name.toLowerCase();
        if (mappingName.includes("colemak")) {
            mapping.value = colemakMapping;
        } else {
            mapping.value = qwertyMapping;
        }
    }
    layoutOptionsState.value = newLayoutOptions;
}

export function setMapping(newMapping: FlexMapping, layoutOptionsState: Signal<LayoutOptions>, layoutModel: RowBasedLayoutModel, mappingState: Signal<FlexMapping>) {
    if (hasMatchingMapping(layoutModel, newMapping)) {
        mappingState.value = newMapping;
        return;
    }
    // we don't have a generic 30-key mapping and no specific mapping for this layout plus options.
    // so, first check if there is a matching mapping by just changing the options.
    if (layoutModel.name.includes("ANSI")) {
        // TODO: can't test this, because no such FlexMappings exist yet.
        if (newMapping.mappingAnsi) {
            layoutOptionsState.value = {...layoutOptionsState.value, wideAnsi: false};
            mappingState.value = newMapping;
            return;
        }
        if (newMapping.mappingAnsiWide || newMapping.mappingThumb30) {
            layoutOptionsState.value = {...layoutOptionsState.value, wideAnsi: true};
            mappingState.value = newMapping;
            return;
        }
    }
    if (layoutModel.name.includes("Ortho")) {
        if (newMapping.mappingSplitOrtho) {
            layoutOptionsState.value = {...layoutOptionsState.value, split: true};
            mappingState.value = newMapping;
            return;
        }
        // there is no specific mapping for un-split Ortho...
    }
    // By this point, the current LayoutType does not work.
    // todo: we could iterate through layouts, but we'd need to consider options as well
    layoutOptionsState.value = {...layoutOptionsState.value, type: LayoutType.Ortho, split: true};
    mappingState.value = newMapping;
}

// We need to do careful conversion to preserve the null value (and other invalid values),
// so that we can later apply the situation-dependent default.
function s2b(value: string | null): boolean | null {
    if (value === "0") return false;
    if (value === "1") return true;
    return null;
}

function s2i(value: string | null): number | null {
    if (!value) return null;
    const i = Number(value);
    if (!Number.isFinite(i)) return null;
    return i;
}

function getMappingByName(name: string | null): FlexMapping {
    if (name) {
        const found = allMappings.find(
            (m) => m.name == name || m.techName == name
        );
        if (found) return found;
    }
    return qwertyMapping;
}

// Some of the state could be local the Layout or Mapping areas, but unless this global thing gets too big,
function updateUrlParams(layout: LayoutOptions, mapping: Signal<FlexMapping>, vizType: Signal<number>) {
    const params = new URLSearchParams();
    params.set("layout", layout.type.toString());
    params.set("mapping", mapping.value.techName || mapping.value.name);
    params.set("viz", vizType.value.toString());
    params.set("split", layout.split ? "1" : "0");
    params.set("wide", layout.wideAnsi ? "1" : "0");
    params.set("apple", layout.appleAnsi ? "1" : "0");
    params.set("harmonic", layout.harmonicVariant.toString());
    params.set("plank", layout.plankVariant.toString());
    params.set("ep60arrows", layout.ep60Arrows ? "1" : "0")
    window.history.pushState(null, "", "#" + params.toString());
}

// let's just have one.
export function createAppState(): AppState {
    const params = new URLSearchParams(window.location.hash.slice(1));
    // important to use ?? because (the falsy) 0 is a proper value that should not trigger the default.
    const layoutOptionsState: Signal<LayoutOptions> = signal({
        type: s2i(params.get("layout")) ?? LayoutType.ANSI,
        split: s2b(params.get("split")) ?? false,
        wideAnsi: s2b(params.get("wide")) ?? false,
        appleAnsi: s2b(params.get("apple")) ?? true,
        harmonicVariant: s2i(params.get("harmonic")) ?? HarmonicVariant.H13_Wide,
        plankVariant: s2i(params.get("plank")) ?? PlankVariant.KATANA_60,
        ep60Arrows: s2b(params.get("ep60arrows")) ?? false,
    });
    const layoutModel = computed(() => getLayoutModel(layoutOptionsState.value))

    const mappingState = signal(getMappingByName(params.get("mapping")));
    const vizType = signal(s2i(params.get("viz")) ?? VisualizationType.LayoutFingering)

    const mappingDiff = computed(() =>
        diffToBase(layoutModel.value, mappingState.value)
    )
    const bigramMovements = computed(() => {
        const charMap = fillMapping(layoutModel.value, mappingState.value);
        return getBigramMovements(
            getKeyPositions(layoutModel.value, layoutOptionsState.value.split, charMap!),
            `get bigrams for visualization of ${mappingState.value.name} on ${layoutModel.value.name}`);
    });
    effect(() => updateUrlParams(layoutOptionsState.value, mappingState, vizType));
    return {
        layout: computed(() => layoutOptionsState.value),
        setLayout: (layoutOptions: LayoutOptions) => setLayout(layoutOptions, layoutOptionsState, mappingState),
        layoutModel,
        mapping: computed(() => mappingState.value),
        setMapping: (m: FlexMapping) => setMapping(m, layoutOptionsState, layoutModel.value, mappingState),
        vizType,
        mappingDiff,
        bigramMovements
    };
}
