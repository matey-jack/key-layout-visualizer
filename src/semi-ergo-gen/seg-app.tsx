import {PageHeader} from '../components/PageHeader.tsx';
import {KeyboardSvg, RowBasedKeyboard} from '../layout/KeyboardSvg.tsx';
import {VisualizationType} from '../base-model.ts';
import {createSegState} from './seg-state.ts';
import {getKeyMovements} from '../layout/layout-functions.ts';

const appState = createSegState();

export function SegApp() {
    const movements = getKeyMovements(appState.previousModel.value.keyPositions, appState.layoutModel.value.keyPositions);
    return <>
        <PageHeader title="Semi-Ergo Keyboard Layout Generator"/>
        <div class={"seg-stagger-type-group"}>

        </div>
        <KeyboardSvg vizType={VisualizationType.SemiErgoGen} keyMovements={movements} showFrame={true}>
            <RowBasedKeyboard
                layoutModel={appState.layoutModel.value}
                prevLayoutModel={appState.previousModel.value}
                keyMovements={movements}
                vizType={VisualizationType.SemiErgoGen}
                layer="base"
            />
            <RowBasedKeyboard
                layoutModel={appState.layoutModel.value}
                prevLayoutModel={appState.previousModel.value}
                keyMovements={movements}
                vizType={VisualizationType.SemiErgoGen}
                layer="label"
            />
        </KeyboardSvg>
    </>
}
