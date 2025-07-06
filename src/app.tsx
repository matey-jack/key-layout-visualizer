// @ts-ignore
import './app.css'
import './app-model.ts'
import {FlexMapping, LayoutSplit, LayoutType, VisualizationType} from "./base-model.ts";
import {AppState} from "./app-model.ts";
import {LayoutArea} from "./layout/LayoutArea.tsx";
import {MappingList} from "./mapping/MappingArea.tsx";
import {DetailsArea} from "./details/DetailsArea.tsx";
import {computed, effect, signal, Signal} from "@preact/signals";
import {ComponentChildren} from "preact";
import {diffToQwerty, getKeyPositions, getLayoutModel} from "./layout/layout-functions.ts";
import {qwertyMapping} from "./mapping/mappings.ts";
import {getBigramMovements} from "./bigrams.ts";

// Some of the state could be local the Layout or Mapping areas, but unless this global thing gets too big,
// let's just have one.
export function createAppState(): AppState {
    const layoutType = signal(LayoutType.ANSI);
    const layoutSplit = signal(LayoutSplit.Bar);
    const layoutOptions = {
        ansiLayoutOptions: signal({wide: false}),
        harmonicLayoutOptions: signal({navKeys: false}),
        orthoLayoutOptions: signal({thumbKeys: true}),
    };
    const layoutModel = computed(() =>
        getLayoutModel(layoutType.value, layoutOptions, mapping.value, layoutSplit)
    )

    const mapping = signal(qwertyMapping as FlexMapping);
    effect(() => {
        // When switching layouts and the current mapping doesn't work on this layout, reset to default.
        if (!layoutModel.value.getSpecificMapping(mapping.value) && !mapping.value.mapping30) {
            mapping.value = qwertyMapping;
        }
    })
    const vizType = signal(VisualizationType.LayoutFingering)

    const mappingDiff = computed(() =>
        diffToQwerty(layoutModel.value, mapping.value)
    )
    const bigramMovements = computed(() => {
            const split = appState.layoutSplit.value == LayoutSplit.TwoPiece;
            return getBigramMovements(getKeyPositions(layoutModel.value, split, mapping.value));
        }
    )
    return {layoutType, layoutOptions, layoutSplit, layoutModel, mapping, vizType, mappingDiff, bigramMovements};
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
            <VizTypeButton vizType={VisualizationType.LayoutKeyEffort} signal={vizType}>Single-Key Effort</VizTypeButton>
        </div>
        <div>
            Mapping Visualizations:
            <VizTypeButton vizType={VisualizationType.MappingDiff} signal={vizType}>Learning</VizTypeButton>
            <VizTypeButton vizType={VisualizationType.MappingFrequeny} signal={vizType}>Letter Frequency</VizTypeButton>
            <VizTypeButton vizType={VisualizationType.MappingBigrams} signal={vizType}>Bigram Effort</VizTypeButton>
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
