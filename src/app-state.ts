import {FlexMapping, LayoutType, RowBasedLayoutModel, VisualizationType} from "./base-model.ts";
import {computed, effect, signal, Signal} from "@preact/signals";
import {
    AppState,
    EB65_LowShift_Variant,
    EB65_MidShift_Variant,
    HarmonicVariant,
    LayoutOptions,
    PlankVariant
} from "./app-model.ts";
import {diffToBase, fillMapping, getKeyPositions, hasMatchingMapping} from "./layout/layout-functions.ts";
import {getLayoutModel} from "./layout-selection.ts";
import {allMappings, colemakMapping, qwertyMapping} from "./mapping/mappings.ts";
import {getBigramMovements} from "./bigrams.ts";

function modifyWide(mapping: FlexMapping, ansiWide: boolean): boolean {
    if (mapping.mapping30 && mapping.mappingAnsi) {
        return ansiWide;
    }
    if (mapping.mappingAnsiWide || mapping.mappingThumb30) {
        return true;
    }
    return ansiWide;
}

// Function needed, because doing the same in an effect() would already run all the computed() functions
// with inconsistent data that might crash them.
function setLayout(
    opts: LayoutOptions,
    layoutOptionsState: Signal<LayoutOptions>,
    mapping: Signal<FlexMapping>,
) {
    const newLayoutOptions = (opts.type == LayoutType.ANSI)
        ? {...opts, ansiWide: modifyWide(mapping.value, opts.ansiWide)}
        : opts;
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
            layoutOptionsState.value = {...layoutOptionsState.value, ansiWide: false};
            mappingState.value = newMapping;
            return;
        }
        if (newMapping.mappingAnsiWide || newMapping.mappingThumb30) {
            layoutOptionsState.value = {...layoutOptionsState.value, ansiWide: true};
            mappingState.value = newMapping;
            return;
        }
    }
    // By this point, the current LayoutType does not work.
    // todo: we could iterate through layouts, but we'd need to consider options as well
    layoutOptionsState.value = {...layoutOptionsState.value, type: LayoutType.Ergosplit};
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

    switch (layout.type) {
        case LayoutType.ANSI:
            params.set("split", layout.ansiSplit ? "1" : "0");
            params.set("wide", layout.ansiWide ? "1" : "0");
            params.set("apple", layout.ansiApple ? "1" : "0");
            break;
        case LayoutType.Harmonic:
            params.set("harmonic", layout.harmonicVariant.toString());
            break;
        case LayoutType.Ergoplank:
            params.set("plank", layout.plankVariant.toString());
            params.set("ep60arrows", layout.ep60Arrows ? "1" : "0")
            params.set("ep60ansi", layout.ep60angleMod ? "1" : "0")
            params.set("eb65ls", layout.eb65LowshiftVariant.toString())
            params.set("eb65ms", layout.eb65MidshiftVariant.toString())
            break;
    }
    window.history.pushState(null, "", "#" + params.toString());
}

// let's just have one.
export function createAppState(): AppState {
    const params = new URLSearchParams(window.location.hash.slice(1));
    // important to use ?? because (the falsy) 0 is a proper value that should not trigger the default.
    const layoutOptionsState: Signal = signal<LayoutOptions>({
        type: s2i(params.get("layout")) ?? LayoutType.ANSI,
        ansiApple: s2b(params.get("apple")) ?? true,
        ansiSplit: s2b(params.get("split")) ?? false,
        ansiWide: s2b(params.get("wide")) ?? false,
        harmonicVariant: s2i(params.get("harmonic")) ?? HarmonicVariant.H13_Wide,
        plankVariant: s2i(params.get("plank")) ?? PlankVariant.EP60,
        ep60Arrows: s2b(params.get("ep60arrows")) ?? false,
        ep60angleMod: s2b(params.get("ep60ansi")) ?? false,
        eb65LowshiftVariant: s2i(params.get("eb65ls")) ?? EB65_LowShift_Variant.LESS_GAPS,
        eb65MidshiftVariant: s2i(params.get("eb65ms")) ?? EB65_MidShift_Variant.EXTRA_WIDE,
        // todo: this is weird for the Ergoplank. Let's change all the Ergoboard keymaps, so this can be 'false' again.
        flipRetRub: true,
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
            getKeyPositions(layoutModel.value, layoutOptionsState.value.ansiSplit, charMap!),
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
