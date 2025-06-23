// @ts-ignore
import './app.css'
import './model'
import {LayoutNames, LayoutType} from "./model.ts";
import {HarmonicKeyboard, KeyboardSvg} from "./KeyboardSvg.tsx";
import {QwertyMapping} from "./KeyMapping.tsx";

export function App() {
    return (
        <>
            <TopBar/>
            <KeyboardSvg>
                <HarmonicKeyboard mapping={QwertyMapping.mapping}/>
            </KeyboardSvg>
        </>
    )
}

const TopBar = () =>
    <div className="grid-container">
        <TopBarBlank/>
        <TopBarKeyboardTab layoutType={LayoutType.ANSI}/>
        <TopBarKeyboardTab layoutType={LayoutType.Harmonic}/>
        <TopBarKeyboardTab layoutType={LayoutType.Ortho}/>
        <TopBarBlank/>
    </div>


const TopBarBlank = () =>
    <div className="blank"></div>

const TopBarKeyboardTab = (props: { layoutType: LayoutType }) =>
    <div>
        <div className="top-bar-keyboard-tab-label">{LayoutNames[props.layoutType]}</div>
    </div>

