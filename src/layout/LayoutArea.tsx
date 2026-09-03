import './LayoutArea.css';
import type {Signal} from "@preact/signals";
import {type AppState, HarmonicVariant, isSplit, type LayoutOptions, PlankVariant} from "../app-model.ts";
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
import {BigramLines, Keyboard, KeyboardSvg, StaggerLines} from "./KeyboardSvg.tsx";
import {
    defaultTotalWidth,
    fillMapping,
    findMatchingKeymapType,
    getKeyMovements,
    getKeyPositions,
} from "./layout-functions.ts";
import {SplitOrthoLayoutOptions} from "./SplitOrthoLayoutOptions.tsx";
import {TradeoffDiagram} from "./TradeoffDiagram.tsx";
import {alignForHex} from './harmonic-layout-functions.ts';
import {colloquialiseCharMap, getKeyLevels} from "../mapping/key-levels.ts";
import {numberlessCharMap} from "../mapping/numberless-key-levels.ts";

interface LayoutAreaProps {
    appState: AppState;
}

function layoutSupportsFlipRetRub(options: LayoutOptions) {
    switch (options.type) {
        case LayoutType.Ergoplank:
            return options.plankVariant >= PlankVariant.ERGOPLANK;
    }
    return false;
}

// The rendered model and char map: hexagon alignment and the flipped Return/Rubout option both
// change what is actually drawn, so anything derived from the keyboard has to use these.
interface RenderedKeyboard {
    layoutModel: LayoutModel;
    charMap: string[][];
    positions: KeyPosition[];
}

function renderKeyboard(
    layoutModel: LayoutModel, mapping: FlexMapping, layout: LayoutOptions, hexagons: boolean,
    colloquial: boolean
): RenderedKeyboard {
    const lm = hexagons ? alignForHex(layoutModel) : layoutModel;
    let charMap = fillMapping(lm, mapping)!;
    if (layoutSupportsFlipRetRub(layout) && layout.flipRetRub) {
        flipRetRub(charMap);
    }
    // Both the numberless and the colloquial Shift level rearrange the keys themselves, so that
    // happens here rather than in getKeyLevels - the positions have to be computed from the
    // rearranged map. The keymap type is resolved per board rather than taken from the app state,
    // because this also renders the outgoing one, which has a model and key map of its own.
    charMap = numberlessCharMap(charMap, lm);
    if (colloquial) {
        // As certain as the filled char map above: both exist exactly when a keymap type matched.
        charMap = colloquialiseCharMap(charMap, lm, findMatchingKeymapType(lm, mapping)!.typeId);
    }
    return {
        layoutModel: lm,
        charMap,
        positions: getKeyPositions(lm, isSplit(layout), charMap, defaultTotalWidth),
    };
}

export function LayoutArea({appState}: LayoutAreaProps) {
    const {layout, layoutModel, prevLayoutModel, mapping, prevMapping} = appState;

    const hexagons = layout.value.type === LayoutType.Harmonic &&
        layout.value.harmonicVariant > HarmonicVariant.H14_Traditional &&
        layout.value.harmonicHexagons;
    // The outgoing board is colloquialised too, so that toggling the switch does not animate.
    const {colloquial, keymapType} = appState.resolvedKeyLevels.value;
    const current = renderKeyboard(layoutModel.value, mapping.value, layout.value, hexagons, colloquial);
    const previousPositions = renderKeyboard(
        prevLayoutModel.value, prevMapping.value, layout.value, hexagons, colloquial).positions;
    const keyMovements = getKeyMovements(previousPositions, current.positions);

    const {setLayout, mappingDiff, bigramMovements, vizType, setMapping, navSide} = appState;
    const keyLevels = vizType.value === VisualizationType.MappingShiftLevels
        ? getKeyLevels(current.layoutModel, current.positions, current.charMap, keymapType,
            navSide.value, colloquial)
        : undefined;
    const showFrame = layout.value.type !== LayoutType.Ergosplit &&
        !(layout.value.type !== LayoutType.ANSI && layout.value.ansiSplit);
    const isTradeoff = vizType.value === VisualizationType.MappingTradeoff;
    return (
        <div>
            <TopBar layout={layout.value} setLayout={setLayout}/>
            <div class="layout-area-svg-container">
                <div class={"layout-area-svg-fader " + (isTradeoff ? "hide" : "show")}>
                    <KeyboardSvg vizType={vizType.value} keyMovements={keyMovements} showFrame={showFrame} totalWidth={defaultTotalWidth} hexagons={hexagons}>
                        <Keyboard
                            layoutModel={layoutModel.value}
                            prevLayoutModel={prevLayoutModel.value}
                            keyMovements={keyMovements}
                            hexagons={hexagons}
                            mappingDiff={mappingDiff.value}
                            keyLevels={keyLevels}
                            vizType={vizType.value}
                        >
                            {vizType.value === VisualizationType.LayoutAngle &&
                                <StaggerLines layoutModel={layoutModel.value} previousLayoutModel={prevLayoutModel.value}
                                              layoutSplit={isSplit(layout.value)}
                                              keyMovements={keyMovements} hexagons={hexagons}/>
                            }
                            {vizType.value === VisualizationType.MappingBigrams &&
                                <BigramLines bigrams={bigramMovements.value} hexagons={hexagons}/>
                            }
                        </Keyboard>
                    </KeyboardSvg>
                </div>
                <div class={"layout-area-svg-fader " + (isTradeoff ? "show" : "hide")}>
                    <TradeoffDiagram
                        layout={layoutModel.value}
                        selectedMapping={mapping.value}
                        onSelectMapping={setMapping}
                    />
                </div>
            </div>
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
    return <div className="layout-type-bar">
        <BlankGridElement/>
        {layoutOrder.map((layoutType) =>
            <LayoutTypeTab
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

interface LayoutTypeTabProps {
    layoutType: LayoutType;
    layoutName: string;
    layoutNote: string;
    currentLayout: LayoutType;
    setLayout: (layout: Partial<LayoutOptions>) => void;
}

function LayoutTypeTab({layoutType, layoutName, layoutNote, currentLayout, setLayout}: LayoutTypeTabProps) {
    const selected = layoutType === currentLayout;
    return <div class={"layout-type-tab" + (selected ? " selected" : "")}>
        <button type="button"
                onClick={() => setLayout({type: layoutType})}
                class={"toggle-btn toggle-btn--lg layout-type-button" + (selected ? " selected" : "")}
        >
            {layoutName}
        </button>
        <div class="layout-type-note">
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
        case LayoutType.Ergosplit:
            return <SplitOrthoLayoutOptions
                options={layoutOptions}
                setOption={setLayoutOptions}
            />
    }
}
