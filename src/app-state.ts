import {FlexMapping, KeymapTypeId, LayoutType, RowBasedLayoutModel, VisualizationType} from "./base-model.ts";
import {computed, effect, signal, Signal} from "@preact/signals";
import {
    AnsiVariant,
    AppState,
    EB65_LowShift_Variant,
    EB65_MidShift_Variant,
    HarmonicVariant,
    LayoutOptions,
    PlankVariant
} from "./app-model.ts";
import {diffToBase, fillMapping, getKeyPositions, hasMatchingMapping} from "./layout/layout-functions.ts";
import {getLayoutModel} from "./layout-selection.ts";
import {allMappings, qwertyMapping} from "./mapping/mappings.ts";
import {getBigramMovements} from "./bigrams.ts";

function modifyWide(mapping: FlexMapping, opts: LayoutOptions): boolean {
    switch (opts.ansiVariant) {
        case AnsiVariant.AHKB:
        case AnsiVariant.XHKB:
            // Flag is not used for AHKB, but we flip for transparency in the UI and also to stay on "wide" mode when
            // switching to another variant.
            return true;
    }
    // ANSI_IBM: force wide mode when there is no non-wide keymap, but there is a wide keymap available.
    if (mapping.mappings[KeymapTypeId.Ansi30] || mapping.mappings[KeymapTypeId.Ansi]) {
        return opts.ansiWide;
    }
    if (mapping.mappings[KeymapTypeId.AnsiWide] || mapping.mappings[KeymapTypeId.Thumb30]) {
        return true;
    }
    return opts.ansiWide;
}

function modifySplit(opts: LayoutOptions) {
    if (opts.ansiVariant === AnsiVariant.HHKB) {
        return false;
    }
    return opts.ansiSplit;
}

/**
 * This function sets the keyboard layout model and options.
 * It also changes the FlexMapping, if the current one does not fit on the new layout.
 * (This is why we need a setter function and don't expose the raw signal in the app state!)
 */
function setLayout(
    opts: LayoutOptions,
    layoutOptionsState: Signal<LayoutOptions>,
    mapping: Signal<FlexMapping>,
) {
    // Wide and split are not available for all ANSI variants, so adapt them to the current variant.
    const newLayoutOptions = (opts.type == LayoutType.ANSI)
        ? {
            ...opts,
            ansiWide: modifyWide(mapping.value, opts),
            ansiSplit: modifySplit(opts),
        }
        : opts;
    const newLayoutModel = getLayoutModel(newLayoutOptions);
    if (!hasMatchingMapping(newLayoutModel, mapping.value)) {
        // We go through a fallback chain to find a matching mapping that is not too far from the previous one.
        const seen = new Set<string>();
        let candidate = mapping.value.fallback;
        while (candidate && !seen.has(candidate.name) && !hasMatchingMapping(newLayoutModel, candidate)) {
            seen.add(candidate.name);
            candidate = candidate.fallback;
        }
        if (candidate && hasMatchingMapping(newLayoutModel, candidate)) {
            mapping.value = candidate;
        } else if (hasMatchingMapping(newLayoutModel, qwertyMapping)) {
            mapping.value = qwertyMapping;
        } else {
            // Search all mappings for the first one that matches
            const match = allMappings.find(m => hasMatchingMapping(newLayoutModel, m));
            if (match) {
                mapping.value = match;
            }
        }
    }
    // end of code to be changed
    layoutOptionsState.value = newLayoutOptions;
}

/**
 * This function sets the FlexMapping and changes the layout model if the current one doesn't support the new mapping.
 * We try to change the layout as little as possible: first try to switch options (such as ANSI wide) only,
 * then try another layout variant, only as fallback use an entirely different layout type.
 * (This is why we need a setter function and don't expose the raw signal in the app state!)
 */
export function setMapping(newMapping: FlexMapping, layoutOptionsState: Signal<LayoutOptions>, layoutModel: RowBasedLayoutModel, mappingState: Signal<FlexMapping>) {
    if (hasMatchingMapping(layoutModel, newMapping)) {
        mappingState.value = newMapping;
        return;
    }
    /*
    Tweaking the layout option to find a layout model that can serve the selected mapping has two steps:
     - if the new mapping needs a thumb key and we are on ANSI, then switch on the 'wide' flag. (And switch off HHKB.)
     - in all other cases, we probably have a mapping that needs a specific layout and we do a general search.
     */
    // For ANSI we can change the 'wide' flag or pick another variant to find a layout model for the selected mapping.
    if (layoutOptionsState.value.type === LayoutType.ANSI) {
        // TODO: can't test this, because no such FlexMappings exist yet.
        if (newMapping.mappings[KeymapTypeId.Ansi] ) {
            // ANSI keymap fits any
            layoutOptionsState.value = {...layoutOptionsState.value, ansiWide: false};
            mappingState.value = newMapping;
            return;
        }
        if ((newMapping.mappings[KeymapTypeId.AnsiWide] || newMapping.mappings[KeymapTypeId.Thumb30])) {
            if (layoutOptionsState.value.ansiVariant === AnsiVariant.HHKB) {
                layoutOptionsState.value = {...layoutOptionsState.value, ansiVariant: AnsiVariant.IBM};
            }
            layoutOptionsState.value = {...layoutOptionsState.value, ansiWide: true};
            mappingState.value = newMapping;
            return;
        }
    }
    const fallbackLayouts = []
    // Currently, Maltron is the only keyMap that doesn't have a generic 30-key map, thus we know that Ergosplit covers every keymap.
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
            params.set("ansi", layout.ansiVariant.toString());
            break;
        case LayoutType.Harmonic:
            params.set("harmonic", layout.harmonicVariant.toString());
            break;
        case LayoutType.Ergoplank:
            params.set("plank", layout.plankVariant.toString());
            params.set("ep60arrows", layout.ep60Arrows ? "1" : "0")
            params.set("eb65ls", layout.eb65LowshiftVariant.toString())
            params.set("eb65ms", layout.eb65MidshiftVariant.toString())
            break;
    }
    params.set("angle", layout.angleMod ? "1" : "0");
    window.history.pushState(null, "", "#" + params.toString());
}

// let's just have one.
export function createAppState(): AppState {
    const params = new URLSearchParams(window.location.hash.slice(1));
    const ansiVariant = s2i(params.get("ansi")) ?? AnsiVariant.APPLE;
    // important to use ?? because (the falsy) 0 is a proper value that should not trigger the default.
    const layoutOptionsState: Signal<LayoutOptions> = signal<LayoutOptions>({
        type: s2i(params.get("layout")) ?? LayoutType.ANSI,
        ansiVariant,
        ansiSplit: s2b(params.get("split")) ?? false,
        ansiWide: ansiVariant === AnsiVariant.AHKB ? true : s2b(params.get("wide")) ?? false,
        angleMod: s2b(params.get("angle")) ?? false,
        harmonicVariant: s2i(params.get("harmonic")) ?? HarmonicVariant.H13_Wide,
        plankVariant: s2i(params.get("plank")) ?? PlankVariant.EP60,
        ep60Arrows: s2b(params.get("ep60arrows")) ?? false,
        eb65LowshiftVariant: s2i(params.get("eb65ls")) ?? EB65_LowShift_Variant.LESS_GAPS,
        eb65MidshiftVariant: s2i(params.get("eb65ms")) ?? EB65_MidShift_Variant.EXTRA_WIDE,
        flipRetRub: false,
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
