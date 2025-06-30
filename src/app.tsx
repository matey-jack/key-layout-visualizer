// @ts-ignore
import './app.css'
import './model'
import {AppState, createAppState, VisualizationType} from "./model.ts";
import {LayoutArea} from "./layout/LayoutArea.tsx";
import {MappingList} from "./mapping/MappingArea.tsx";
import {DetailsArea} from "./details/DetailsArea.tsx";
import {Signal} from "@preact/signals";
import {ComponentChildren} from "preact";

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
            <VizTypeButton vizType={VisualizationType.LayoutEffort} signal={vizType}>Effort</VizTypeButton>
        </div>
        <div>
            Mapping Visualizations:
            <VizTypeButton vizType={VisualizationType.MappingDiff} signal={vizType}>Learning</VizTypeButton>
            <VizTypeButton vizType={VisualizationType.MappingFrequeny} signal={vizType}>Letter Frequency</VizTypeButton>
            <VizTypeButton vizType={VisualizationType.MappingBigrams} signal={vizType}>Bigrams</VizTypeButton>
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
