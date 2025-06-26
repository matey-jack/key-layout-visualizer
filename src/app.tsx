// @ts-ignore
import './app.css'
import './model'
import {createAppState} from "./model.ts";
import {LayoutArea} from "./layout/LayoutArea.tsx";
import {MappingArea} from "./mapping/MappingArea.tsx";

const appState = createAppState();

export function App() {
    return <>
        <LayoutArea appState={appState}/>
        <hr></hr>
        <MappingArea appState={appState}/>
    </>
}
