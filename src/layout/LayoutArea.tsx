import type {Signal} from "@preact/signals";
import {AnsiVariant, type AppState, isSplit, type LayoutOptions, PlankVariant} from "../app-model.ts";
import {
    type FlexMapping,
    type KeyPosition,
    type LayoutModel,
    LayoutType,
    LayoutTypeNames,
    LayoutTypeNotes,
    VisualizationType,
} from "../base-model.ts";
import {AnsiLayoutOptions} from "./AnsiLayoutOptions.tsx";
import {ErgoplankLayoutOptions} from "./ErgoplankLayoutOptions.tsx";
import {HarmonicLayoutOptions} from "./HarmonicLayoutOptions.tsx";
import {BigramLines, KeyboardSvg, RowBasedKeyboard, StaggerLines} from "./KeyboardSvg.tsx";
import {fillMapping, getKeyMovements, getKeyPositions} from "./layout-functions.ts";

interface LayoutAreaProps {
    appState: AppState;
}

function layoutSupportsFlipRetRub(options: LayoutOptions) {
    switch (options.type) {
        case LayoutType.Ergoplank:
            return options.plankVariant >= PlankVariant.EP60;
        case LayoutType.ANSI:
            return options.ansiVariant === AnsiVariant.AHKB;
    }
    return false;
}

function getKeyPositionsForModel(layoutModel: LayoutModel, mapping: FlexMapping, layout: LayoutOptions): KeyPosition[] {
    const charMap = fillMapping(layoutModel, mapping);
    if (layoutSupportsFlipRetRub(layout) && layout.flipRetRub) {
        flipRetRub(charMap!);
    }
    return getKeyPositions(layoutModel, isSplit(layout), charMap!);
}

export function LayoutArea({appState}: LayoutAreaProps) {
    const {layout, layoutModel, prevLayoutModel, mapping} = appState;

    const currentPositions = getKeyPositionsForModel(layoutModel.value, mapping.value, layout.value);
    const previousPositions = getKeyPositionsForModel(prevLayoutModel.value, mapping.value, layout.value);
    const keyMovements = getKeyMovements(previousPositions, currentPositions);

    const {setLayout, mappingDiff, bigramMovements, vizType} = appState;
    return (
        <div>
            <TopBar layout={layout.value} setLayout={setLayout}/>
            <KeyboardSvg>
                <RowBasedKeyboard
                    layoutModel={layoutModel.value}
                    keyMovements={keyMovements}
                    mappingDiff={mappingDiff.value}
                    vizType={vizType.value}
                />
                {vizType.value === VisualizationType.LayoutAngle &&
                    <StaggerLines layoutModel={layoutModel.value} previousLayoutModel={prevLayoutModel.value}
                                  layoutSplit={isSplit(layout.value)}
                                  keyMovements={keyMovements}/>
                }
                {vizType.value === VisualizationType.MappingBigrams &&
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
    // Just because we use a different label for Enter on one keyboard, we have to find that to preserve it.
    charMap.forEach((charRow) => {
        charRow.forEach((char) => {
            if (char?.includes("⏎")) {
                enterLabel = char;
            }
        })
    })
    charMap.forEach((charRow) => {
        charRow.forEach((char, col) => {
            if (char?.includes("⏎")) {
                charRow[col] = "⌫";
            }
            if (char === "⌫") {
                charRow[col] = enterLabel;
            }
        })
    })
}

interface TopBarProps {
    layout: LayoutOptions;
    setLayout: (layout: Partial<LayoutOptions>) => void;
}

function TopBar({layout, setLayout}: TopBarProps) {
    const layoutOrder = [LayoutType.ANSI, LayoutType.Harmonic, LayoutType.Ergoplank, LayoutType.Ergosplit];
    return <div className="layout-top-bar-container">
        <BlankGridElement/>
        {layoutOrder.map((layoutType) =>
            <TopBarKeyboardTab
                layoutType={layoutType}
                layoutName={LayoutTypeNames[layoutType]}
                layoutNote={LayoutTypeNotes[layoutType]}
                currentLayout={layout.type}
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
    layoutNote: string;
    currentLayout: LayoutType;
    setLayout: (layout: Partial<LayoutOptions>) => void;
}

function TopBarKeyboardTab({layoutType, layoutName, layoutNote, currentLayout, setLayout}: TopBarKeyboardTabProps) {
    const selected = layoutType === currentLayout;
    return <div class={"top-bar-keyboard-tab-label-and-note" + (selected ? " selected" : "")}>
        <button type="button"
                onClick={() => setLayout({type: layoutType})}
                class="top-bar-keyboard-tab-label"
        >
            {layoutName}
        </button>
        <div class="top-bar-keyboard-tab-note">
            {layoutNote}
        </div>
    </div>
}

interface LayoutOptionsBarProps {
    state: AppState;
}

function LayoutOptionsBar({state}: LayoutOptionsBarProps) {
    return <div class="layout-options-bar-container">
        <TypeSpecifcLayoutOptions layoutOptions={state.layout.value} setLayoutOptions={state.setLayout}
                                  mapping={state.mapping}/>
    </div>
}


interface LayoutOptionsProps {
    layoutOptions: LayoutOptions;
    setLayoutOptions: (layoutOptions: Partial<LayoutOptions>) => void;
    mapping: Signal<FlexMapping>;
}

function TypeSpecifcLayoutOptions({layoutOptions, setLayoutOptions, mapping}: LayoutOptionsProps) {

    switch (layoutOptions.type) {
        case LayoutType.ANSI:
            return <AnsiLayoutOptions
                options={layoutOptions}
                setOption={setLayoutOptions}
                mapping={mapping}
            />
        case LayoutType.Harmonic:
            return <HarmonicLayoutOptions
                options={layoutOptions}
                setOption={setLayoutOptions}
            />
        case LayoutType.Ergoplank:
            return <ErgoplankLayoutOptions
                options={layoutOptions}
                setOption={setLayoutOptions}
            />
    }
    return null;
}
