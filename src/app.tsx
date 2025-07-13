// @ts-ignore
import './app.css'
import './app-model.ts'
import {FlexMapping, LayoutType, VisualizationType} from "./base-model.ts";
import {AppState, HarmonicVariant, LayoutOptionsState} from "./app-model.ts";
import {LayoutArea} from "./layout/LayoutArea.tsx";
import {MappingList} from "./mapping/MappingArea.tsx";
import {DetailsArea} from "./details/DetailsArea.tsx";
import {computed, effect, signal, Signal} from "@preact/signals";
import {ComponentChildren} from "preact";
import {diffToQwerty, getKeyPositions, getLayoutModel, hasMatchingMapping} from "./layout/layout-functions.ts";
import {allMappings, qwertyMapping} from "./mapping/mappings.ts";
import {getBigramMovements} from "./bigrams.ts";

// Function needed, because doing the same in an effect() would already run all the computed() functions
// with inconsistent data that might crash them.
function setLayout(layoutType: LayoutType, layoutSignal: Signal<LayoutType>, appState: AppState) {
    const newLayoutModel =
        getLayoutModel(layoutType, appState.layoutOptions, appState.mapping.value, appState.layoutSplit)
    if (!hasMatchingMapping(newLayoutModel, appState.mapping.value)) {
        appState.mapping.value = qwertyMapping;
    }
    layoutSignal.value = layoutType;
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

// Some of the state could be local the Layout or Mapping areas, but unless this global thing gets too big,
// let's just have one.
export function createAppState(): AppState {
    const params = new URLSearchParams(window.location.hash.slice(1));
    // important to use ?? because (the falsy) 0 is a proper value that should not trigger the default.
    const layoutTypeSignal = signal(s2i(params.get("layout")) ?? LayoutType.ANSI);
    const layoutSplit = signal(s2b(params.get("split")) ?? false);
    const layoutOptions: LayoutOptionsState = {
        ansiLayoutOptions: signal({wide: s2b(params.get("wide")) ?? false}),
        harmonicLayoutOptions: signal({variant: s2i(params.get("harmonic")) ?? HarmonicVariant.H13_3}),
        orthoLayoutOptions: signal({}),
    };
    const layoutModel = computed(() =>
        getLayoutModel(layoutTypeSignal.value, layoutOptions, mapping.value, layoutSplit)
    )

    let mappingName = params.get("mapping");
    let startMapping = qwertyMapping as FlexMapping;
    if (mappingName) {
        allMappings.forEach((mapping) => {
            if (mapping.name == mappingName || mapping.techName == mappingName) {
                startMapping = mapping;
            }
        });
    }
    const mapping = signal(startMapping);
    const vizType = signal(s2i(params.get("viz")) ?? VisualizationType.LayoutFingering)

    const mappingDiff = computed(() =>
        diffToQwerty(layoutModel.value, mapping.value)
    )
    const bigramMovements = computed(() => {
        return getBigramMovements(
            getKeyPositions(layoutModel.value, layoutSplit.value, mapping.value),
            `get bigrams for visualization of ${mapping.value.name} on ${layoutModel.value.name}`);
    })
    effect(() => {
        const mappingName = mapping.value.techName || mapping.value.name;
        const fragment = "#layout=" + layoutTypeSignal.value
            + "&mapping=" + mappingName
            + "&viz=" + vizType.value
            + "&split=" + (layoutSplit.value ? "1" : "0")
            + "&wide=" + (layoutOptions.ansiLayoutOptions.value.wide ? "1" : "0")
            + "&harmonic=" + layoutOptions.harmonicLayoutOptions.value.variant;
        window.history.pushState(null, "", fragment);
    })
    return {
        layoutType: computed(() => layoutTypeSignal.value),
        setLayoutType: (layoutType) => setLayout(layoutType, layoutTypeSignal, appState),
        layoutOptions,
        layoutSplit,
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
