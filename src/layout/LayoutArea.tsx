import {AppState, LayoutOptionsState, LayoutType} from "../model.ts";
import {KeyboardSvg, RowBasedKeyboard} from "./KeyboardSvg.tsx";
import {TruncatedText} from "../components/TruncatedText.tsx";
import {getLayoutModel, LayoutDescriptions, LayoutNames} from "./layout-model.ts";
import {qwertyMapping} from "../mapping/mappings-30-keys.ts";
import {Signal} from "@preact/signals";
import {AnsiLayoutOptions} from "./AnsiLayoutOptions.tsx";

interface LayoutAreaProps {
    appState: AppState;
}

export function LayoutArea({appState}: LayoutAreaProps) {
    const selectedLayoutType = appState.layoutType.value;
    const layoutModel = getLayoutModel(selectedLayoutType, appState.layoutOptions);
    console.log("[LayoutArea] Wide key mapping: " + appState.layoutOptions.ansiLayoutOptions.value.wide);

    return (
        <div>
            <TopBar layoutSignal={appState.layoutType}/>
            <div className="layout-description">
                <TruncatedText text={LayoutDescriptions[selectedLayoutType]}/>
            </div>
            <KeyboardSvg>
                <RowBasedKeyboard layoutModel={layoutModel} mapping={qwertyMapping.mapping}/>
            </KeyboardSvg>
            <LayoutOptionsBar state={appState}/>
        </div>
    )
}


interface TopBarProps {
    layoutSignal: Signal<LayoutType>;
}

function TopBar(props: TopBarProps) {
    const layoutOrder = [LayoutType.ANSI, LayoutType.Harmonic, LayoutType.Ortho];
    return <div className="layout-top-bar-container">
        <BlankGridElement/>
        {layoutOrder.map((layoutType) =>
            <TopBarKeyboardTab
                layoutType={layoutType}
                setLayoutType={(t) => props.layoutSignal.value = t}
                isSelected={layoutType === props.layoutSignal.value}
            />
        )}
        <BlankGridElement/>
    </div>
}

const BlankGridElement = () =>
    <div className="blank"></div>

interface TopBarKeyboardTabProps {
    layoutType: LayoutType,
    setLayoutType: (layoutType: LayoutType) => void,
    isSelected: boolean
}

const TopBarKeyboardTab = (props: TopBarKeyboardTabProps) =>
    <div
        onClick={() => props.setLayoutType(props.layoutType)}
    >
        <button className={"top-bar-keyboard-tab-label " + (props.isSelected ? "selected" : "")}>
            {LayoutNames[props.layoutType]}
        </button>
    </div>

interface LayoutOptionsProps {
    layoutType: LayoutType;
    layoutOptions: LayoutOptionsState;
}

interface LayoutOptionsBarProps {
    state: AppState;
}

function LayoutOptionsBar({state}: LayoutOptionsBarProps) {
    return <div className="layout-options-bar-container">
        <BlankGridElement/>
            <LayoutOptions layoutType={state.layoutType.value} layoutOptions={state.layoutOptions}/>
        <BlankGridElement/>
    </div>
}

function LayoutOptions({layoutType, layoutOptions}: LayoutOptionsProps) {
    switch (layoutType) {
        case LayoutType.ANSI:
            return <AnsiLayoutOptions options={layoutOptions.ansiLayoutOptions}/>
    }
    return <></>;
}