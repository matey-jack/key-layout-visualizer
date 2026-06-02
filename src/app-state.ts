import {computed, effect, type Signal, signal} from "@preact/signals";
import posthog from 'posthog-js';
import {
    AnsiVariant,
    type AppState,
    ErgoboardLowshiftVariant,
    ErgoboardVariant,
    ErgoplankArrows,
    HarmonicVariant,
    isSplit,
    type LayoutOptions,
    PlankVariant,
} from "./app-model.ts";
import {type FlexMapping, KeymapTypeId, type LayoutModel, LayoutType, VisualizationType} from "./base-model.ts";
import {getBigramMovements} from "./bigrams.ts";
import {diffToBase, fillMapping, getKeyPositions, hasMatchingMapping} from "./layout/layout-functions.ts";
import {getLayoutModel} from "./layout-selection.ts";
import {enumValues} from "./library/enum.ts";
import {qwertyMapping} from "./mapping/baseMappings.ts";
import {allMappings} from "./mapping/mappings.ts";


function modifyWide(mapping: FlexMapping, opts: LayoutOptions): boolean {
    switch (opts.ansiVariant) {
        case AnsiVariant.XHKB:
        case AnsiVariant.AHKB:
            // Those variants always use wide mode, because they were designed for it.
            return true;
    }
    // No change to the flag when the FlexMapping has at least one keymap type that works both ways.
    if (mapping.mappings[KeymapTypeId.Ansi32] || mapping.mappings[KeymapTypeId.Ansi30] || mapping.mappings[KeymapTypeId.Ansi]) {
        return opts.ansiWide;
    }
    // In other cases, force wide mode when the keymap needs it.
    if (mapping.mappings[KeymapTypeId.AnsiWide] || mapping.mappings[KeymapTypeId.Thumb30] || mapping.mappings[KeymapTypeId.Thumb32]) {
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
 *
 * Note that settings for layout variants and subvariants and options are kept even when the layout type is
 * currently not selected. When coming back to a layout type, we could have a mapping active which doesn't support
 * this previously selected subtype (variant). In this case, the variant is changed to one that supports it.
 * (If none exists, we change the mapping as described above.)
 *
 * When changing explicitly to a variant or subvariant this does not apply, in this case the mapping is the only thing
 * that can be changed to achieve a fit.
 */
function setLayout(
    layoutOptions: Partial<LayoutOptions>,
    layoutOptionsState: Signal<LayoutOptions>,
    mapping: Signal<FlexMapping>,
) {
    const opts = {...layoutOptionsState.value, ...layoutOptions};
    // Wide and split are not available for all ANSI variants, so adapt them to the current variant.
    let newLayoutOptions = (opts.type === LayoutType.ANSI)
        ? {
            ...opts,
            ansiWide: modifyWide(mapping.value, opts),
            ansiSplit: modifySplit(opts),
        }
        : opts;
    let newLayoutModel = getLayoutModel(newLayoutOptions);
    if (!hasMatchingMapping(newLayoutModel, mapping.value)) {
        const fallbackSubvariants = getFallbackLayouts(newLayoutOptions);
        const explicitOptions = { ...layoutOptions };
        if ("ergoboardLowshiftVariant" in layoutOptions) {
            explicitOptions.plankVariant = PlankVariant.ERGOBOARD_LOW_SHIFT;
        }
        if ("ergoboardMidshiftVariant" in layoutOptions) {
            explicitOptions.plankVariant = PlankVariant.ERGOBOARD_MID_SHIFT;
        }
        const filteredFallbackSubvariants = fallbackSubvariants.filter(mods => {
            for (const key of Object.keys(explicitOptions) as (keyof LayoutOptions)[]) {
                if (key in mods && mods[key] !== explicitOptions[key]) {
                    return false;
                }
            }
            return true;
        });
        const matchingOpts = findMatchingLayout(mapping.value, newLayoutOptions, filteredFallbackSubvariants);
        if (matchingOpts) {
            newLayoutOptions = matchingOpts;
            newLayoutModel = getLayoutModel(newLayoutOptions);
        }
    }
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
    layoutOptionsState.value = newLayoutOptions;
}

function findMatchingLayout(
    newMapping: FlexMapping, opts: LayoutOptions, fallbackLayouts: Partial<LayoutOptions>[]
): LayoutOptions | undefined {
    for (const mods of fallbackLayouts) {
        const newOpts = {...opts, ...mods};
        // console.log(`trying ${JSON.stringify(mods)}`)
        const model = getLayoutModel(newOpts);
        if (hasMatchingMapping(model, newMapping)) {
            return newOpts;
        }
    }
}

const allErgoboardMidshiftVariants = enumValues<ErgoboardVariant>(ErgoboardVariant).map(
    (val) => ({plankVariant: PlankVariant.ERGOBOARD_MID_SHIFT, ergoboardMidshiftVariant: val})
);

const allErgoboardLowShiftVariants = enumValues<ErgoboardLowshiftVariant>(ErgoboardLowshiftVariant).map(
    (val) => ({plankVariant: PlankVariant.ERGOBOARD_LOW_SHIFT, ergoboardLowshiftVariant: val})
);

function getFallbackLayouts(opts: LayoutOptions): Partial<LayoutOptions>[] {
    const fallbackLayouts: Partial<LayoutOptions>[] = [];
    switch (opts.type) {
        case LayoutType.Harmonic:
            fallbackLayouts.push(...enumValues<HarmonicVariant>(HarmonicVariant).map(
                (val) => ({harmonicVariant: val})
            ));
            break;
        case LayoutType.Ergoplank:
            switch (opts.plankVariant) {
                case PlankVariant.ERGOBOARD_LOW_SHIFT:
                    fallbackLayouts.push(...allErgoboardLowShiftVariants);
                    break;
                case PlankVariant.ERGOBOARD_MID_SHIFT:
                    fallbackLayouts.push(...allErgoboardMidshiftVariants);
                    break;
            }
            // This relies on Ergoslat and Ergoplank subvariants all supporting the same set of mappings,
            // so the fallback is to the sub-variant that was last selected.
            // Similarly, for Ergoboard MidShift and LowShift, we first try the variant last selected.
            fallbackLayouts.push(...enumValues<PlankVariant>(PlankVariant).map(
                (val) => ({plankVariant: val})
            ));
            // And then try all the subvariants. (This duplicates entries from above,
            // but it's a fair price for not having to complicate the code even more.)
            fallbackLayouts.push(...allErgoboardLowShiftVariants);
            fallbackLayouts.push(...allErgoboardMidshiftVariants);
            break;
    }
    return fallbackLayouts;
}

/**
 * This function sets the FlexMapping and changes the layout model if the current one doesn't support the new mapping.
 * We try to change the layout as little as possible: first try to switch options (such as ANSI wide) only,
 * then try another layout variant, only as fallback use an entirely different layout type.
 * (This is why we need a setter function and don't expose the raw signal in the app state!)
 */
export function setMapping(newMapping: FlexMapping, layoutOptionsState: Signal<LayoutOptions>, layoutModel: LayoutModel, mappingState: Signal<FlexMapping>) {
    if (hasMatchingMapping(layoutModel, newMapping)) {
        mappingState.value = newMapping;
        return;
    }
    /*
    Tweaking the layout option to find a layout model that can serve the selected mapping has two steps:
     - if the new mapping needs a thumb key, and we are on ANSI, then switch on the 'wide' flag. (And switch off HHKB.)
     - in all other cases, we probably have a mapping that needs a specific layout; thus we do a general search.
     */
    if (layoutOptionsState.value.type === LayoutType.ANSI) {
        if (newMapping.mappings[KeymapTypeId.Thumb30] || newMapping.mappings[KeymapTypeId.Thumb32]) {
            if (layoutOptionsState.value.ansiVariant === AnsiVariant.HHKB) {
                layoutOptionsState.value = {...layoutOptionsState.value, ansiVariant: AnsiVariant.IBM};
            }
            layoutOptionsState.value = {...layoutOptionsState.value, ansiWide: true};
            mappingState.value = newMapping;
            return;
        }
    }
    /*
        For layout types other than ANSI we systematically widen the options by first searching for alternatives
        inside the same group.
     */
    // console.log(`current Layout: ${JSON.stringify(layoutOptionsState.value)}`)
    // console.log(`switching Mapping to: ${newMapping.name}`)
    const fallbackLayouts = getFallbackLayouts(layoutOptionsState.value);
    // Final fallbacks: all layouts that have some mappings exclusive to them.
    fallbackLayouts.push(...[
        {type: LayoutType.ANSI, ansiVariant: AnsiVariant.IBM},
        {type: LayoutType.ANSI, ansiVariant: AnsiVariant.IBM, ansiWide: true},
        {type: LayoutType.Ergosplit},
        {type: LayoutType.Ergoplank, plankVariant: PlankVariant.ERGOPLANK15},
        {type: LayoutType.Ergoplank, plankVariant: PlankVariant.ERGOBOARD_MID_SHIFT, ergoboardMidshiftVariant: ErgoboardVariant.COMFY_WIDE},
        {type: LayoutType.Harmonic, harmonicVariant: HarmonicVariant.H13_Wide},
        {type: LayoutType.Harmonic, harmonicVariant: HarmonicVariant.H14_Traditional},
    ]);
    const newOpts = findMatchingLayout(newMapping, layoutOptionsState.value, fallbackLayouts);
    if (newOpts) {
        mappingState.value = newMapping;
        layoutOptionsState.value = newOpts;
    }
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
            (m) => m.name === name || m.techName === name
        );
        if (found) return found;
    }
    return qwertyMapping;
}

// Some of the state could be local the Layout or Mapping areas, but unless this global thing gets too big,
function updateUrlParams(layout: LayoutOptions, mapping: Signal<FlexMapping>, vizType: Signal<VisualizationType>) {
    const params = new URLSearchParams();
    params.set("layout", layout.type.toString());
    params.set("midShift", layout.midShift ? "1" : "0");
    params.set("mapping", mapping.value.techName || mapping.value.name);
    params.set("viz", vizType.value.toString());
    let subLayout = "";

    switch (layout.type) {
        case LayoutType.ANSI:
            params.set("split", layout.ansiSplit ? "1" : "0");
            params.set("wide", layout.ansiWide ? "1" : "0");
            params.set("ansi", layout.ansiVariant.toString());
            params.set("thumbsUp16", layout.thumbsUp16 ? "1" : "0");
            subLayout = AnsiVariant[layout.ansiVariant] + (layout.ansiWide ? "+wide" : "") + (layout.ansiSplit ? "+split" : "") + (layout.ansiVariant === AnsiVariant.XHKB && layout.thumbsUp16 ? "+16" : "");
            break;
        case LayoutType.Harmonic:
            params.set("harmonic", layout.harmonicVariant.toString());
            subLayout = HarmonicVariant[layout.harmonicVariant];
            break;
        case LayoutType.Ergoplank:
            params.set("plank", layout.plankVariant.toString());
            params.set("epArrows", layout.epArrows.toString());
            params.set("epRightRet", layout.epRightReturn ? "1" : "0");
            params.set("esNumberless", layout.esNumberless ? "1" : "0");
            params.set("esSmallerThumbs", layout.esSmallerThumbs ? "1" : "0");
            params.set("ebLsVariant", layout.ergoboardLowshiftVariant.toString());
            params.set("ebMsVariant", layout.ergoboardMidshiftVariant.toString());
            subLayout = PlankVariant[layout.plankVariant] + (layout.epArrows === ErgoplankArrows.Inline ? "+inline-arrows" : layout.epArrows === ErgoplankArrows.Center ? "+center-arrows" : "") + (layout.epRightReturn ? "+epRightReturn" : "") + (layout.esNumberless ? "+esNumberless" : "") + (layout.esSmallerThumbs ? "+esSmallerThumbs" : "");
            break;
        case LayoutType.Ergosplit:
            params.set("soThumbShift", layout.soThumbShift ? "1" : "0");
            break;
    }
    posthog.register({
        viz: VisualizationType[vizType.value],
        layout: LayoutType[layout.type],
        subLayout,
        mapping: mapping.value.name,
    });

    params.set("angle", layout.angleMod ? "1" : "0");
    window.history.pushState(null, "", "#" + params.toString());
}

// let's just have one.
export function createAppState(): AppState {
    const params = new URLSearchParams(window.location.hash.slice(1));
    const ansiVariant = s2i(params.get("ansi")) ?? AnsiVariant.IBM;
    const epArrows = s2i(params.get("epArrows")) ?? (s2b(params.get("bottomArrows") ?? params.get("ep60arrows")) ? ErgoplankArrows.Inline : ErgoplankArrows.None);
    // important to use ?? because (the falsy) 0 is a proper value that should not trigger the default.
    const layoutOptionsState: Signal<LayoutOptions> = signal<LayoutOptions>({
        type: s2i(params.get("layout")) ?? LayoutType.ANSI,
        midShift: s2b(params.get("midShift")) ?? false,
        soThumbShift: s2b(params.get("soThumbShift")) ?? false,
        ansiVariant,
        ansiSplit: s2b(params.get("split")) ?? false,
        ansiWide: ansiVariant === AnsiVariant.AHKB ? true : s2b(params.get("wide")) ?? false,
        thumbsUp16: s2b(params.get("thumbsUp16")) ?? (ansiVariant === AnsiVariant.XHKB && epArrows !== ErgoplankArrows.None) ?? false,
        angleMod: s2b(params.get("angle")) ?? false,
        harmonicVariant: s2i(params.get("harmonic")) ?? HarmonicVariant.H13_Wide,
        plankVariant: s2i(params.get("plank")) ?? PlankVariant.ERGOPLANK15,
        epArrows,
        epRightReturn: s2b(params.get("epRightRet")) ?? false,
        esNumberless: s2b(params.get("esNumberless")) ?? false,
        esSmallerThumbs: s2b(params.get("esSmallerThumbs")) ?? true,
        ergoboardLowshiftVariant: s2i(params.get("ebLsVariant") ?? params.get("eb65ls")) ?? ErgoboardLowshiftVariant.LESS_GAPS,
        ergoboardMidshiftVariant: s2i(params.get("ebMsVariant") ?? params.get("eb65ms")) ?? ErgoboardVariant.COMFY_WIDE,
        flipRetRub: false,
    });
    const layoutModel = computed(() => getLayoutModel(layoutOptionsState.value))
    // Initialize previousLayoutModel with the current layoutModel to avoid null handling
    const previousLayoutModelState = signal(layoutModel.value);

    const mappingState = signal(getMappingByName(params.get("mapping")));
    // Initialize previousMappingState with the current mapping to avoid null handling
    const previousMappingState = signal(mappingState.value);
    const vizType = signal(s2i(params.get("viz")) ?? VisualizationType.LayoutPlain)

    const mappingDiff = computed(() =>
        diffToBase(layoutModel.value, mappingState.value)
    )
    const bigramMovements = computed(() => {
        const charMap = fillMapping(layoutModel.value, mappingState.value);
        return getBigramMovements(
            getKeyPositions(layoutModel.value, isSplit(layoutOptionsState.value), charMap!),
            `get bigrams for visualization of ${mappingState.value.name} on ${layoutModel.value.name}`);
    });
    effect(() => updateUrlParams(layoutOptionsState.value, mappingState, vizType));
    return {
        layout: computed(() => layoutOptionsState.value),
        setLayout: (layoutOptions: Partial<LayoutOptions>) => {
            previousLayoutModelState.value = layoutModel.value;
            previousMappingState.value = mappingState.value;
            setLayout(layoutOptions, layoutOptionsState, mappingState);
        },
        layoutModel,
        prevLayoutModel: computed(() => previousLayoutModelState.value),
        mapping: computed(() => mappingState.value),
        setMapping: (m: FlexMapping) => {
            previousLayoutModelState.value = layoutModel.value;
            previousMappingState.value = mappingState.value;
            setMapping(m, layoutOptionsState, layoutModel.value, mappingState);
        },
        prevMapping: computed(() => previousMappingState.value),
        vizType,
        mappingDiff,
        bigramMovements
    };
    }
