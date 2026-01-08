import './app.css';
import './app-model.ts';
import type {Signal} from "@preact/signals";
import type {ComponentChildren} from "preact";
import type {AppState} from "./app-model.ts";
import {AnsiVariant} from "./app-model.ts";
import {createAppState} from "./app-state.ts";
import {VisualizationType, LayoutType} from "./base-model.ts";
import {DetailsArea} from "./details/DetailsArea.tsx";
import {LayoutArea} from "./layout/LayoutArea.tsx";
import {MappingList} from "./mapping/MappingArea.tsx";
import {getKlc} from "./mapping/msKlcTemplate.ts";
import {fillMapping} from "./layout/layout-functions.ts";

const appState = createAppState();

export function App() {
     return <>
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
         <div>
             Layout Visualizations:
             <VizTypeButton vizType={VisualizationType.LayoutKeySize} signal={vizType}>Key Sizes</VizTypeButton>
             <VizTypeButton vizType={VisualizationType.LayoutFingering} signal={vizType}>Fingering</VizTypeButton>
             <VizTypeButton vizType={VisualizationType.LayoutAngle} signal={vizType}>Angle</VizTypeButton>
             <VizTypeButton vizType={VisualizationType.LayoutKeyEffort} signal={vizType}>Single-Key
                 Effort</VizTypeButton>
         </div>
         <div>
             Mapping Visualizations:
             <VizTypeButton vizType={VisualizationType.MappingDiff} signal={vizType}>Learning</VizTypeButton>
             <VizTypeButton vizType={VisualizationType.MappingFrequeny} signal={vizType}>Letter Frequency</VizTypeButton>
             <VizTypeButton vizType={VisualizationType.MappingBigrams} signal={vizType}>Bigram Effort</VizTypeButton>
             {/*<VizTypeButton vizType={VisualizationType.MappingAltGr} signal={vizType}>AltGr</VizTypeButton>*/}
             {appState && isKlcCompatible(appState) && <DownloadKlcLink appState={appState}/>}
         </div>
     </div>
 }

interface VizTypeButtonProps {
    vizType: VisualizationType;
    signal: Signal<VisualizationType>;
    children?: ComponentChildren;
}

function VizTypeButton({vizType, signal, children}: VizTypeButtonProps) {
    return <button type="button"
        class={"viz-type-button" + (vizType === signal.value ? " selected" : "")}
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

  function DownloadKlcLink({appState}: DownloadKlcLinkProps) {
       const handleDownload = () => {
          const layout = appState.layoutModel.value;
          const keyMap = appState.mapping.value;
          const layoutOptions = appState.layout.value;
          const mergedMapping = fillMapping(layout, keyMap);

          if (!mergedMapping) {
              alert("Unable to generate KLC file for this mapping");
              return;
          }

          const klcContent = getKlc(mergedMapping, keyMap, layoutOptions.ansiWide);
          const baseName = keyMap.techName || keyMap.name;
          const fileName = layoutOptions.ansiWide ? `${baseName}-wide` : baseName;
          const blob = new Blob([klcContent], { type: "text/plain" });
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `${fileName}.klc`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
      };

      return <a href="#" onClick={(e) => {e.preventDefault(); handleDownload();}} class="download-klc-link">Download as .klc</a>;
  }

 export interface MappingAreaProps {
     appState: AppState;
 }

 export function MappingAndDetailsArea({appState}: MappingAreaProps) {
     return <div class="mapping-and-details-container">
         <MappingList appState={appState}/>
         <DetailsArea appState={appState}/>
     </div>
 }
