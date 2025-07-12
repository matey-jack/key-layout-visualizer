// @ts-ignore
import './app.css'
import './app-model.ts'
import {FlexMapping, LayoutType, VisualizationType} from "./base-model.ts";
import {AppState, HarmonicVariant} from "./app-model.ts";
import {LayoutArea} from "./layout/LayoutArea.tsx";
import {MappingList} from "./mapping/MappingArea.tsx";
import {DetailsArea} from "./details/DetailsArea.tsx";
import {computed, effect, signal, Signal} from "@preact/signals";
import {ComponentChildren} from "preact";
import {diffToQwerty, getKeyPositions, getLayoutModel, hasMatchingMapping} from "./layout/layout-functions.ts";
import {qwertyMapping} from "./mapping/mappings.ts";
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

// Some of the state could be local the Layout or Mapping areas, but unless this global thing gets too big,
// let's just have one.
export function createAppState(): AppState {
    const layoutTypeSignal = signal(LayoutType.ANSI);
    const layoutSplit = signal(false);
    const layoutOptions = {
        ansiLayoutOptions: signal({wide: false}),
        harmonicLayoutOptions: signal({variant: HarmonicVariant.H13_3}),
        orthoLayoutOptions: signal({thumbKeys: true}),
    };
    const layoutModel = computed(() =>
        getLayoutModel(layoutTypeSignal.value, layoutOptions, mapping.value, layoutSplit)
    )

    const mapping = signal(qwertyMapping as FlexMapping);
    const vizType = signal(VisualizationType.LayoutFingering)

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
        const fragment = `#layout=${layoutTypeSignal.value}&mapping=${mappingName}&viz=${vizType.value}`
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
