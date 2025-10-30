import {FlexMapping, LayoutType, VisualizationType} from "../base-model.ts";
import {AppState, LayoutOptions} from "../app-model.ts";
import {BigramLines, KeyboardSvg, RowBasedKeyboard, StaggerLines} from "./KeyboardSvg.tsx";
import {fillMapping, getKeyPositions, getLayoutModel} from "./layout-functions.ts";
import {AnsiLayoutOptions} from "./AnsiLayoutOptions.tsx";
import {CheckboxWithLabel} from "../components/CheckboxWithLabel.tsx";
import {HarmonicLayoutOptions} from "./HarmonicLayoutOptions.tsx";
import {Signal} from "@preact/signals";
import {PlankLayoutOptions} from "./PlankLayoutOptions.tsx";

interface LayoutAreaProps {
    appState: AppState;
}

export function LayoutArea({appState}: LayoutAreaProps) {
    const {layout, layoutModel, mapping, setLayout, mappingDiff, bigramMovements, vizType} = appState;
    const charMap = fillMapping(layoutModel.value, mapping.value);
    const keyPositions = getKeyPositions(layoutModel.value, layout.value.split, charMap!);

    return (
        <div>
            <TopBar layout={layout.value} setLayout={setLayout}/>
            <KeyboardSvg>
                <RowBasedKeyboard
                    layoutModel={layoutModel.value}
                    keyPositions={keyPositions}
                    mappingDiff={mappingDiff.value}
                    vizType={vizType.value}
                />
                {vizType.value == VisualizationType.LayoutAngle &&
                    <StaggerLines layoutModel={layoutModel.value} layoutSplit={layout.value.split}
                                  keyPositions={keyPositions}/>
                }
                {vizType.value == VisualizationType.MappingBigrams &&
                    <BigramLines bigrams={bigramMovements.value}/>
                }
            </KeyboardSvg>
            <LayoutOptionsBar state={appState}/>
        </div>
    )
}

interface TopBarProps {
    layout: LayoutOptions;
    setLayout: (layout: LayoutOptions) => void;
}

function TopBar({layout, setLayout}: TopBarProps) {
    const layoutOrder = [LayoutType.ANSI, LayoutType.Harmonic, LayoutType.ErgoPlank, LayoutType.Ortho];
    return <div className="layout-top-bar-container">
        <BlankGridElement/>
        {layoutOrder.map((layoutType) =>
            <TopBarKeyboardTab
                layoutType={layoutType}
                layoutName={getLayoutModel({...layout, type: layoutType}).name}
                currentLayout={layout.type}
                setLayoutType={(type) => setLayout({...layout, type})}
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
    currentLayout: LayoutType;
    setLayoutType: (layout: LayoutType) => void;
}

function TopBarKeyboardTab({layoutType, layoutName, currentLayout, setLayoutType}: TopBarKeyboardTabProps) {
    const selected = layoutType === currentLayout;
    return <div onClick={() => setLayoutType(layoutType)}>
        <button class={"top-bar-keyboard-tab-label" + (selected ? " selected" : "")}>
            {layoutName}
        </button>
    </div>
}

interface LayoutOptionsBarProps {
    state: AppState;
}

function LayoutOptionsBar({state}: LayoutOptionsBarProps) {
    return <div class="layout-options-bar-container">
        <CheckboxWithLabel label="split keyboard"
                           checked={state.layout.value.split}
                           onChange={(split) => state.setLayout({...state.layout.value, split})}
                           disabled={state.layout.value.type != LayoutType.ANSI}
        />
        <TypeSpecifcLayoutOptions layoutOptions={state.layout.value} setLayoutOptions={state.setLayout} mapping={state.mapping}/>
    </div>
}


interface LayoutOptionsProps {
    layoutOptions: LayoutOptions;
    setLayoutOptions: (layoutOptions: LayoutOptions) => void;
    mapping: Signal<FlexMapping>;
}

function TypeSpecifcLayoutOptions({layoutOptions, setLayoutOptions, mapping}: LayoutOptionsProps) {
    switch (layoutOptions.type) {
        case LayoutType.ANSI:
            return <AnsiLayoutOptions
                wide={layoutOptions.wideAnsi}
                setWide={(wide) => setLayoutOptions({...layoutOptions, wideAnsi: wide})}
                mapping={mapping}
            />
        case LayoutType.Harmonic:
            return <HarmonicLayoutOptions
                variant={layoutOptions.harmonicVariant}
                setVariant={(variant) => setLayoutOptions({...layoutOptions, harmonicVariant: variant})}
            />
        case LayoutType.ErgoPlank:
            return <PlankLayoutOptions
                variant={layoutOptions.plankVariant}
                setVariant={(variant) => setLayoutOptions({...layoutOptions, plankVariant: variant})}
            />
    }
    return <></>;
}