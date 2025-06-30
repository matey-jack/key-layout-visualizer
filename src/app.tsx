// @ts-ignore
import './app.css'
import './model'
import {AppState, createAppState} from "./model.ts";
import {LayoutArea} from "./layout/LayoutArea.tsx";
import {MappingList} from "./mapping/MappingArea.tsx";
import {DetailsArea} from "./details/DetailsArea.tsx";

const appState = createAppState();

export function App() {
    return <>
        <LayoutArea appState={appState}/>
        <hr></hr>
        <MappingAndDetailsArea appState={appState}/>
    </>
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
