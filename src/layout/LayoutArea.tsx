import {LayoutSplit, LayoutType} from "../base-model.ts";
import {AppState, LayoutOptionsState} from "../app-model.ts";
import {KeyboardSvg, RowBasedKeyboard} from "./KeyboardSvg.tsx";
import {getLayoutModel} from "./layout-functions.ts";
import {Signal} from "@preact/signals";
import {AnsiLayoutOptions} from "./AnsiLayoutOptions.tsx";
import {CheckboxWithLabel} from "../components/CheckboxWithLabel.tsx";

interface LayoutAreaProps {
    appState: AppState;
}

export function LayoutArea({appState}: LayoutAreaProps) {
    const selectedLayoutType = appState.layoutType.value;
    const layoutModel = getLayoutModel(selectedLayoutType, appState.layoutOptions, appState.mapping.value, appState.layoutSplit);
    const split = appState.layoutSplit.value == LayoutSplit.TwoPiece;

    return (
        <div>
            <TopBar layoutSignal={appState.layoutType} layoutOptions={appState.layoutOptions}/>
            <KeyboardSvg>
                <RowBasedKeyboard
                    layoutModel={layoutModel}
                    flexMapping={appState.mapping.value}
                    mappingDiff={appState.mappingDiff.value}
                    vizType={appState.vizType.value}
                    split={split}
                />
            </KeyboardSvg>
            <LayoutOptionsBar state={appState}/>
        </div>
    )
}


interface TopBarProps {
    layoutSignal: Signal<LayoutType>
    layoutOptions: LayoutOptionsState
}

function TopBar({layoutSignal, layoutOptions}: TopBarProps) {
    const layoutOrder = [LayoutType.ANSI, LayoutType.Harmonic, LayoutType.Ortho];
    return <div className="layout-top-bar-container">
        <BlankGridElement/>
        {layoutOrder.map((layoutType) =>
            <TopBarKeyboardTab
                layoutType={layoutType}
                layoutName={getLayoutModel(layoutType, layoutOptions).name}
                layoutSignal={layoutSignal}
                key={layoutType}
            />
        )}
        <BlankGridElement/>
    </div>
}

const BlankGridElement = () =>
    <div class="blank"></div>

interface TopBarKeyboardTabProps {
    layoutType: LayoutType
    layoutName: string
    layoutSignal: Signal<LayoutType>
}

function TopBarKeyboardTab({layoutType, layoutName, layoutSignal}: TopBarKeyboardTabProps) {
    const selected = layoutType === layoutSignal.value;
    return <div
        onClick={() => layoutSignal.value = layoutType}
    >
        <button class={"top-bar-keyboard-tab-label" + (selected ? " selected" : "")}>
            {layoutName}
        </button>
    </div>
}

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
        <GenericLayoutOptions split={state.layoutSplit}/>
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