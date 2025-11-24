import {FlexMapping, LayoutType, LayoutTypeNames, VisualizationType} from "../base-model.ts";
import {AnsiVariant, AppState, LayoutOptions, PlankVariant} from "../app-model.ts";
import {BigramLines, KeyboardSvg, RowBasedKeyboard, StaggerLines} from "./KeyboardSvg.tsx";
import {fillMapping, getKeyPositions} from "./layout-functions.ts";
import {AnsiLayoutOptions} from "./AnsiLayoutOptions.tsx";
import {HarmonicLayoutOptions} from "./HarmonicLayoutOptions.tsx";
import {Signal} from "@preact/signals";
import {ErgoplankLayoutOptions} from "./ErgoplankLayoutOptions.tsx";

interface LayoutAreaProps {
    appState: AppState;
}

function layoutSupportsFlipRetRub(options: LayoutOptions) {
    switch (options.type) {
        case LayoutType.Ergoplank:
            return options.plankVariant >= PlankVariant.EP60;
        case LayoutType.ANSI:
            return options.ansiVariant === AnsiVariant.ANSI_AHKB;
    }
    return false;
}

export function LayoutArea({appState}: LayoutAreaProps) {
    const {layout, layoutModel, mapping, setLayout, mappingDiff, bigramMovements, vizType} = appState;
    const charMap = fillMapping(layoutModel.value, mapping.value);
    if (layoutSupportsFlipRetRub(layout.value) && layout.value.flipRetRub) {
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
function flipRetRub(charMap: (string | null)[][]) {
    let enterLabel: string;
    let enterPosition: [number, number];
    charMap.forEach((charRow, row) => {
        charRow.forEach((char, col) => {
            if (char && char.includes("⏎")) {
                enterLabel = char;
                enterPosition = [row, col];
                charRow[col] = "⌫";
            }
        })
    })
    charMap.forEach((charRow, row) => {
        charRow.forEach((char, col) => {
            if (char == "⌫" && row != enterPosition[0] && col != enterPosition[1]) {
                charRow[col] = enterLabel;
            }
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
    const setOption = (opts: Partial<LayoutOptions>) => setLayoutOptions({...layoutOptions, ...opts});

    switch (layoutOptions.type) {
        case LayoutType.ANSI:
            return <AnsiLayoutOptions
                options={layoutOptions}
                setOption={setOption}
                mapping={mapping}
            />
        case LayoutType.Harmonic:
            return <HarmonicLayoutOptions
                options={layoutOptions}
                setOption={setOption}
            />
        case LayoutType.Ergoplank:
            return <ErgoplankLayoutOptions
                options={layoutOptions}
                setOption={setOption}
            />
    }
    return <></>;
}
