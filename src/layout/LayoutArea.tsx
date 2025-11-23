import {FlexMapping, LayoutType, LayoutTypeNames, VisualizationType} from "../base-model.ts";
import {AppState, LayoutOptions} from "../app-model.ts";
import {BigramLines, KeyboardSvg, RowBasedKeyboard, StaggerLines} from "./KeyboardSvg.tsx";
import {fillMapping, getKeyPositions} from "./layout-functions.ts";
import {AnsiLayoutOptions} from "./AnsiLayoutOptions.tsx";
import {HarmonicLayoutOptions} from "./HarmonicLayoutOptions.tsx";
import {Signal} from "@preact/signals";
import {ErgoplankLayoutOptions} from "./ErgoplankLayoutOptions.tsx";

interface LayoutAreaProps {
    appState: AppState;
}

export function LayoutArea({appState}: LayoutAreaProps) {
    const {layout, layoutModel, mapping, setLayout, mappingDiff, bigramMovements, vizType} = appState;
    const charMap = fillMapping(layoutModel.value, mapping.value);
    if (layout.value.flipRetRub) {
        flipRetRub(charMap!);
    }
    let split = layout.value.type == LayoutType.Ergosplit
        || layout.value.type == LayoutType.ANSI && layout.value.ansiSplit;
    const keyPositions = getKeyPositions(layoutModel.value, split, charMap!);

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
                    <StaggerLines layoutModel={layoutModel.value} layoutSplit={split}
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

// This mutates the array, contrary the usual immutable value functions we have everywhere else.
function flipRetRub(charMap: string[][]) {
    charMap.forEach((charRow) => {
        charRow.forEach((char, col) => {
            if (char == "⏎") charRow[col] = "⌫";
            if (char == "⌫") charRow[col] = "⏎";
        })
    })
}

interface TopBarProps {
    layout: LayoutOptions;
    setLayout: (layout: LayoutOptions) => void;
}

function TopBar({layout, setLayout}: TopBarProps) {
    const layoutOrder = [LayoutType.ANSI, LayoutType.Harmonic, LayoutType.Ergoplank, LayoutType.Ergosplit];
    return <div className="layout-top-bar-container">
        <BlankGridElement/>
        {layoutOrder.map((layoutType) =>
            <TopBarKeyboardTab
                layoutType={layoutType}
                layoutName={LayoutTypeNames[layoutType]}
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
                wide={layoutOptions.ansiWide}
                setWide={(wide) => setLayoutOptions({...layoutOptions, ansiWide: wide})}
                apple={layoutOptions.ansiApple}
                setApple={(apple) => setLayoutOptions({...layoutOptions, ansiApple: apple})}
                split={layoutOptions.ansiSplit}
                setSplit={(split) => setLayoutOptions({...layoutOptions, ansiSplit: split})}
                mapping={mapping}
            />
        case LayoutType.Harmonic:
            return <HarmonicLayoutOptions
                variant={layoutOptions.harmonicVariant}
                setVariant={(variant) => setLayoutOptions({...layoutOptions, harmonicVariant: variant})}
            />
        case LayoutType.Ergoplank:
            return <ErgoplankLayoutOptions
                variant={layoutOptions.plankVariant}
                setVariant={(variant) => setLayoutOptions({...layoutOptions, plankVariant: variant})}
                options={layoutOptions}
                setOption={(opts: Partial<LayoutOptions>) => setLayoutOptions({...layoutOptions, ...opts})}
            />
    }
    return <></>;
}
