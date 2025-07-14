// @ts-ignore
import './app.css'
import './app-model.ts'
import {FlexMapping, LayoutType, VisualizationType} from "./base-model.ts";
import {AppState, HarmonicVariant, LayoutOptions} from "./app-model.ts";
import {LayoutArea} from "./layout/LayoutArea.tsx";
import {MappingList} from "./mapping/MappingArea.tsx";
import {DetailsArea} from "./details/DetailsArea.tsx";
import {computed, effect, signal, Signal} from "@preact/signals";
import {ComponentChildren} from "preact";
import {diffToQwerty, getKeyPositions, getLayoutModel, hasMatchingMapping} from "./layout/layout-functions.ts";
import {allMappings, colemakMapping, qwertyMapping, thumbyNine} from "./mapping/mappings.ts";
import {getBigramMovements} from "./bigrams.ts";

// Function needed, because doing the same in an effect() would already run all the computed() functions
// with inconsistent data that might crash them.
function setLayout(
    newLayoutOptions: LayoutOptions,
    layoutOptionsState: Signal<LayoutOptions>,
    mapping: Signal<FlexMapping>,
) {
    const newLayoutModel = getLayoutModel(newLayoutOptions)
    if (!hasMatchingMapping(newLayoutModel, mapping.value)) {
        const mappingName = mapping.value.name.toLowerCase();
        if (mappingName.includes("thumby") && !mappingName.includes("colemak")) {
            mapping.value = thumbyNine;
        } else {
            mapping.value = colemakMapping;
        }
    }
    layoutOptionsState.value = newLayoutOptions;
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
        allMappings.forEach((mapping) => {
            if (mapping.name == name || mapping.techName == name) {
                return mapping;
            }
        });
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
    params.set("harmonic", layout.harmonicVariant.toString());
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
        harmonicVariant: s2i(params.get("harmonic")) ?? HarmonicVariant.H13_Wide,
    });
    const layoutModel = computed(() => getLayoutModel(layoutOptionsState.value))

    const mapping = signal(getMappingByName(params.get("mapping")));
    const vizType = signal(s2i(params.get("viz")) ?? VisualizationType.LayoutFingering)

    const mappingDiff = computed(() =>
        diffToQwerty(layoutModel.value, mapping.value)
    )
    const bigramMovements = computed(() => {
        return getBigramMovements(
            getKeyPositions(layoutModel.value, layoutOptionsState.value.split, mapping.value),
            `get bigrams for visualization of ${mapping.value.name} on ${layoutModel.value.name}`);
    });
    effect(() => updateUrlParams(layoutOptionsState.value, mapping, vizType));
    return {
        layout: computed(() => layoutOptionsState.value),
        setLayout: (layoutOptions: LayoutOptions) => setLayout(layoutOptions, layoutOptionsState, mapping),
        layoutModel,
        mapping,
        vizType,
        mappingDiff,
        bigramMovements
    };
}

const appState = createAppState();

export function App() {
    return <>
        <LayoutArea appState={appState}/>
        <hr/>
        <VisualizationSwitches vizType={appState.vizType}/>
        <hr/>
        <MappingAndDetailsArea appState={appState}/>
    </>
}

interface VisualizationSwitchesProps {
    vizType: Signal<VisualizationType>
}

export function VisualizationSwitches({vizType}: VisualizationSwitchesProps) {
    return <div class="visualization-switches">
        <div>
            Layout Visualizations:
            <VizTypeButton vizType={VisualizationType.LayoutFingering} signal={vizType}>Fingering</VizTypeButton>
            <VizTypeButton vizType={VisualizationType.LayoutAngle} signal={vizType}>Angle</VizTypeButton>
            <VizTypeButton vizType={VisualizationType.LayoutKeyEffort} signal={vizType}>Single-Key
                Effort</VizTypeButton>
        </div>
        <div>
            Mapping Visualizations:
            <VizTypeButton vizType={VisualizationType.MappingDiff} signal={vizType}>Learning</VizTypeButton>
            <VizTypeButton vizType={VisualizationType.MappingFrequeny} signal={vizType}>Letter Frequency</VizTypeButton>
            <VizTypeButton vizType={VisualizationType.MappingBigrams} signal={vizType}>Bigram Effort</VizTypeButton>
            {/*<VizTypeButton vizType={VisualizationType.MappingAltGr} signal={vizType}>AltGr</VizTypeButton>*/}
        </div>
    </div>
}

interface VizTypeButtonProps {
    vizType: VisualizationType;
    signal: Signal<VisualizationType>;
    children?: ComponentChildren;
}

function VizTypeButton({vizType, signal, children}: VizTypeButtonProps) {
    return <button
        class={"viz-type-button" + (vizType === signal.value ? " selected" : "")}
        onClick={() => signal.value = vizType}
    >
        {children}
    </button>
}

export interface MappingAreaProps {
    appState: AppState;
}

export function MappingAndDetailsArea({appState}: MappingAreaProps) {
    return <div class="mapping-and-details-container">
        <MappingList appState={appState}/>
        <DetailsArea appState={appState}/>
    </div>
}
