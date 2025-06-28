import {AppState, LayoutOptionsState, LayoutSplit, LayoutType} from "../model.ts";
import {KeyboardSvg, RowBasedKeyboard} from "./KeyboardSvg.tsx";
import {TruncatedText} from "../components/TruncatedText.tsx";
import {getLayoutModel, LayoutDescriptions, LayoutNames} from "./layout-model.ts";
import {qwertyMapping} from "../mapping/mappings-30-keys.ts";
import {Signal} from "@preact/signals";
import {AnsiLayoutOptions, AnsiLayoutOptionsProps} from "./AnsiLayoutOptions.tsx";
import {CheckboxWithLabel} from "../components/CheckboxWithLabel.tsx";

interface LayoutAreaProps {
    appState: AppState;
}

export function LayoutArea({appState}: LayoutAreaProps) {
    const selectedLayoutType = appState.layoutType.value;
    const layoutModel = getLayoutModel(selectedLayoutType, appState.layoutOptions);
    const split = appState.layoutSplit.value == LayoutSplit.TwoPiece;

    return (
        <div>
            <TopBar layoutSignal={appState.layoutType}/>
            <div className="layout-description">
                <TruncatedText text={LayoutDescriptions[selectedLayoutType]}/>
            </div>
            <KeyboardSvg>
                <RowBasedKeyboard layoutModel={layoutModel} flexMapping={qwertyMapping.mapping} split={split}/>
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
    <div class="blank"></div>

interface TopBarKeyboardTabProps {
    layoutType: LayoutType,
    setLayoutType: (layoutType: LayoutType) => void,
    isSelected: boolean
}

const TopBarKeyboardTab = (props: TopBarKeyboardTabProps) =>
    <div
        onClick={() => props.setLayoutType(props.layoutType)}
    >
        <button class={"top-bar-keyboard-tab-label " + (props.isSelected ? "selected" : "")}>
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
    return <div class="layout-options-bar-container">
        <BlankGridElement/>
        <GenericLayoutOptions split={state.layoutSplit}/><br/>
        <TypeSpecifcLayoutOptions layoutType={state.layoutType.value} layoutOptions={state.layoutOptions}/>
        <BlankGridElement/>
    </div>
}

interface GenericLayoutOptionsProps {
    split: Signal<LayoutSplit>;
}

export function GenericLayoutOptions({split}: GenericLayoutOptionsProps) {
    return <>
        <CheckboxWithLabel
            label="split keyboard"
            checked={split.value != LayoutSplit.Bar}
            onChange={(checked) =>
                split.value = checked ? LayoutSplit.TwoPiece : LayoutSplit.Bar
            }
        />
    </>
}

function TypeSpecifcLayoutOptions({layoutType, layoutOptions}: LayoutOptionsProps) {
    switch (layoutType) {
        case LayoutType.ANSI:
            return <AnsiLayoutOptions options={layoutOptions.ansiLayoutOptions}/>
    }
    return <></>;
}