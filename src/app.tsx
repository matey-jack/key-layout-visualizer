import './app.css';
import './app-model.ts';
import {type Signal, useSignal} from "@preact/signals";
import {useEffect} from "preact/hooks";
import type {ComponentChildren} from "preact";
import type {AppState} from "./app-model.ts";
import {AnsiVariant} from "./app-model.ts";
import {createAppState} from "./app-state.ts";
import {Hand, LayoutType, LayoutTypeNames, VisualizationType} from "./base-model.ts";
import {OptionButton} from "./components/OptionButton.tsx";
import {OptionGroup} from "./components/OptionGroup.tsx";
import {DetailsArea} from "./details/DetailsArea.tsx";
import {LayoutArea} from "./layout/LayoutArea.tsx";
import {fillMapping} from "./layout/layout-functions.ts";
import {MappingList} from "./mapping/MappingArea.tsx";
import {getKlc} from "./mapping/msKlcTemplate.ts";
import {extractSvgWithStyles} from "./utils/svg-export.ts";
import {PageHeader} from "./components/PageHeader.tsx";

const appState = createAppState();

export function App() {
     return <>
         <span class="klv-title">
            <PageHeader title="Key Layout and Mapping Visualizer"/>
         </span>
         <LayoutArea appState={appState}/>
         <hr/>
         <VisualizationSwitches vizType={appState.vizType} appState={appState}/>
         <hr/>
         <MappingAndDetailsArea appState={appState}/>
     </>
 }

interface VisualizationSwitchesProps {
    vizType: Signal<VisualizationType>;
    appState?: AppState;
}
 
 export function VisualizationSwitches({vizType, appState}: VisualizationSwitchesProps) {
     return <div class="visualization-switches">
         <div class="viz-type-groups">
         <div>
             Layout Visualizations:
             <VizTypeButton vizType={VisualizationType.LayoutPlain} signal={vizType}>Plain</VizTypeButton>
             <VizTypeButton vizType={VisualizationType.LayoutKeySize} signal={vizType}>Key Sizes</VizTypeButton>
             <VizTypeButton vizType={VisualizationType.LayoutFingering} signal={vizType}>Fingering</VizTypeButton>
             <VizTypeButton vizType={VisualizationType.LayoutAngle} signal={vizType}>Angle</VizTypeButton>
             <VizTypeButton vizType={VisualizationType.LayoutKeyEffort} signal={vizType}>Single-Key
                 Effort</VizTypeButton>
             {appState && <DownloadSvgLink appState={appState}/>}
         </div>
         <div>
             Mapping Visualizations:
             <VizTypeButton vizType={VisualizationType.MappingDiff} signal={vizType}>Learning</VizTypeButton>
             <VizTypeButton vizType={VisualizationType.MappingFrequeny} signal={vizType}>Letter Frequency</VizTypeButton>
             <VizTypeButton vizType={VisualizationType.MappingBigrams} signal={vizType}>Bigram Effort</VizTypeButton>
             <VizTypeButton vizType={VisualizationType.MappingTradeoff} signal={vizType}>Learning Effort Trade-off</VizTypeButton>
             <VizTypeButton vizType={VisualizationType.MappingShiftLevels} signal={vizType}>Shift and AltGr
                 Levels</VizTypeButton>
             {/* The KLC export knows only the ANSI base/Shift pairs, so it has nothing to offer
                 while the levels view is showing something else. */}
             {appState && vizType.value !== VisualizationType.MappingShiftLevels
                 && isKlcCompatible(appState) && <DownloadKlcLink appState={appState}/>}
         </div>
         </div>
         {appState && vizType.value === VisualizationType.MappingShiftLevels &&
             <LevelSwitches appState={appState}/>}
     </div>
 }

// The switches that configure the key levels visualization, in their own container right of the
// viz type buttons. A group whose choice does not exist on the current key map is left out.
function LevelSwitches({appState}: { appState: AppState }) {
    return <div class="level-switches">
        <NavSideOptions navSide={appState.navSide}/>
        {appState.resolvedKeyLevels.value.hasColloquialLevel &&
            <ShiftLevelOptions shiftColloquial={appState.shiftColloquial}/>}
    </div>
}

function ShiftLevelOptions({shiftColloquial}: { shiftColloquial: Signal<boolean> }) {
    return <OptionGroup label="Shift level">
        <OptionButton selected={!shiftColloquial.value} onClick={() => {shiftColloquial.value = false;}}>
            standard
        </OptionButton>
        <OptionButton selected={shiftColloquial.value} onClick={() => {shiftColloquial.value = true;}}>
            colloquial
        </OptionButton>
    </OptionGroup>
}

interface NavSideOptionsProps {
    navSide: Signal<Hand>;
}

// The navigation block is the easiest part of the AltGr level to recognize, so it names the
// switch; the AltGr characters always sit on the other hand and move along with it.
function NavSideOptions({navSide}: NavSideOptionsProps) {
    return <OptionGroup label="Nav keys">
        <OptionButton selected={navSide.value === Hand.Left} onClick={() => {navSide.value = Hand.Left;}}>
            left
        </OptionButton>
        <OptionButton selected={navSide.value === Hand.Right} onClick={() => {navSide.value = Hand.Right;}}>
            right
        </OptionButton>
    </OptionGroup>
}

interface VizTypeButtonProps {
    vizType: VisualizationType;
    signal: Signal<VisualizationType>;
    children?: ComponentChildren;
}

function VizTypeButton({vizType, signal, children}: VizTypeButtonProps) {
    return <button type="button"
        class={"toggle-btn toggle-btn--ui viz-type-button" + (vizType === signal.value ? " selected" : "")}
        onClick={() => {signal.value = vizType;}}
    >
        {children}
    </button>
}

function isKlcCompatible(appState: AppState): boolean {
     const layoutOptions = appState.layout.value;
     if (layoutOptions.type !== LayoutType.ANSI) {
         return false;
     }
     if (!appState.mapping.value.klcId) {
         return false;
     }
     return layoutOptions.ansiVariant === AnsiVariant.IBM || layoutOptions.ansiVariant === AnsiVariant.APPLE;
}

interface DownloadKlcLinkProps {
    appState: AppState;
}

interface DownloadFile {
    content: string;
    type: string;
    fileName: string;
}

/**
 * Holds a file behind an object URL so a plain download anchor can point at it.
 * Returns the current file plus a `prepare` for the events that precede activating
 * a link (pointer down, focus): the SVG export reads the live DOM, which right after
 * a layout switch still holds the outgoing board, so the file built when the state
 * changed can be out of date by the time it is clicked.
 */
function useDownloadFile(buildFile: () => DownloadFile | null, deps: unknown[]) {
    const prepared = useSignal<{url: string; fileName: string} | null>(null);

    const prepare = () => {
        const file = buildFile();
        if (prepared.value) URL.revokeObjectURL(prepared.value.url);
        prepared.value = file && {
            url: URL.createObjectURL(new Blob([file.content], {type: file.type})),
            fileName: file.fileName,
        };
    };

    useEffect(prepare, deps);
    useEffect(() => () => {
        if (prepared.value) URL.revokeObjectURL(prepared.value.url);
    }, [prepared]);

    return {file: prepared.value, prepare};
}

function DownloadKlcLink({appState}: DownloadKlcLinkProps) {
    const layout = appState.layoutModel.value;
    const keyMap = appState.mapping.value;
    const layoutOptions = appState.layout.value;

    const {file, prepare} = useDownloadFile(() => {
        const mergedMapping = fillMapping(layout, keyMap);
        if (!mergedMapping) {
            console.warn("Unable to generate KLC file for this mapping");
            return null;
        }
        const baseName = keyMap.techName || keyMap.name;
        const fileName = layoutOptions.ansiWide ? `${baseName}-wide` : baseName;
        return {
            content: getKlc(mergedMapping, keyMap, layoutOptions.ansiWide),
            type: "text/plain",
            fileName: `${fileName}.klc`,
        };
    }, [layout, keyMap, layoutOptions]);

    if (!file) {
        return null;
    }
    return <a href={file.url} download={file.fileName} class="download-klc-link"
              onPointerDown={prepare} onFocus={prepare}>
        Download as .klc
    </a>;
}

interface DownloadSvgLinkProps {
    appState: AppState;
}

function DownloadSvgLink({appState}: DownloadSvgLinkProps) {
    const layoutOptions = appState.layout.value;
    const keyMap = appState.mapping.value;

    const {file, prepare} = useDownloadFile(() => {
        // Find the keyboard SVG container - look for the parent div or the svg itself
        const svgContainer = document.querySelector('.keyboard-svg') || document.querySelector('svg.keyboard-svg');
        if (!svgContainer) {
            console.warn("Keyboard visualization not found");
            return null;
        }

        const svgString = extractSvgWithStyles(svgContainer as Element);
        if (!svgString) {
            console.warn("Unable to extract SVG from visualization");
            return null;
        }

        const layoutName = LayoutTypeNames[layoutOptions.type];
        return {
            content: svgString,
            type: "image/svg+xml",
            fileName: sanitizeFileName(`${keyMap.name}-${layoutName}.svg`),
        };
    }, [layoutOptions, keyMap]);

    if (!file) {
        return null;
    }
    return <a href={file.url} download={file.fileName} class="download-svg-link"
              onPointerDown={prepare} onFocus={prepare}>
        Download SVG
    </a>;
}

function sanitizeFileName(fileName: string): string {
    // Remove/replace characters that are invalid in filenames on most filesystems
    return fileName
        .replace(/[/\\:*?"<>|]/g, '_')
        .replace(/\s+/g, '_');
}

export interface MappingAreaProps {
    appState: AppState;
}

export function MappingAndDetailsArea({appState}: MappingAreaProps) {
    return <div class="mapping-and-details-container">
        <MappingList appState={appState}/>
        <DetailsArea appState={appState}/>
    </div>;
}
