import {LayoutSplit, LayoutType, VisualizationType} from "../base-model.ts";
import {AppState, LayoutOptionsState} from "../app-model.ts";
import {BigramLines, KeyboardSvg, RowBasedKeyboard} from "./KeyboardSvg.tsx";
import {getKeyPositions, getLayoutModel, hasMatchingMapping} from "./layout-functions.ts";
import {ReadonlySignal, Signal} from "@preact/signals";
import {AnsiLayoutOptions} from "./AnsiLayoutOptions.tsx";
import {CheckboxWithLabel} from "../components/CheckboxWithLabel.tsx";
import {HarmonicLayoutOptions} from "./HarmonicLayoutOptions.tsx";

interface LayoutAreaProps {
    appState: AppState;
}

export function LayoutArea({appState}: LayoutAreaProps) {
    const split = appState.layoutSplit.value == LayoutSplit.TwoPiece;
    const keyPositions = getKeyPositions(appState.layoutModel.value, split, appState.mapping.value);

    return (
        <div>
            <TopBar
                currentLayout={appState.layoutType}
                setLayout={appState.setLayoutType}
                layoutOptions={appState.layoutOptions}
            />
            <KeyboardSvg>
                <RowBasedKeyboard
                    layoutModel={appState.layoutModel.value}
                    keyPositions={keyPositions}
                    mappingDiff={appState.mappingDiff.value}
                    vizType={appState.vizType.value}
                />
                {appState.vizType.value == VisualizationType.MappingBigrams &&
                    <BigramLines bigrams={appState.bigramMovements.value}/>
                }
            </KeyboardSvg>
            <LayoutOptionsBar state={appState}/>
        </div>
    )
}

interface TopBarProps {
    currentLayout: ReadonlySignal<LayoutType>;
    setLayout: (layout: LayoutType) => void;
    layoutOptions: LayoutOptionsState;
}

function TopBar({currentLayout, setLayout, layoutOptions}: TopBarProps) {
    const layoutOrder = [LayoutType.ANSI, LayoutType.Harmonic, LayoutType.Ortho];
    return <div className="layout-top-bar-container">
        <BlankGridElement/>
        {layoutOrder.map((layoutType) =>
            <TopBarKeyboardTab
                layoutType={layoutType}
                layoutName={getLayoutModel(layoutType, layoutOptions).name}
                currentLayout={currentLayout}
                setLayout={setLayout}
                key={layoutType}
            />
        )}
        <BlankGridElement/>
    </div>
}

const BlankGridElement = () =>
    <div class="blank"></div>

interface TopBarKeyboardTabProps {
    layoutType: LayoutType;
    layoutName: string;
    currentLayout: ReadonlySignal<LayoutType>;
    setLayout: (layout: LayoutType) => void;
}

function TopBarKeyboardTab({layoutType, layoutName, currentLayout, setLayout}: TopBarKeyboardTabProps) {
    const selected = layoutType === currentLayout.value;
    return <div
        onClick={() => setLayout(layoutType)}
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
        <GenericLayoutOptions split={state.layoutSplit}/>
        <TypeSpecifcLayoutOptions layoutType={state.layoutType.value} layoutOptions={state.layoutOptions}/>
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
        case LayoutType.Harmonic:
            return <HarmonicLayoutOptions options={layoutOptions.harmonicLayoutOptions}/>
    }
    return <></>;
}