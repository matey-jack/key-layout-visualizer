import '../app.css';
import './seg.css';
import {PageHeader} from '../components/PageHeader.tsx';
import {KeyboardSvg, RowBasedKeyboard} from '../layout/KeyboardSvg.tsx';
import {type LayoutModel, VisualizationType} from '../base-model.ts';
import {createSegState} from './seg-state.ts';
import {NamedTypes, permittedHomeRowIndent, permittedKeyboardWidths} from './seg-model.ts';
import type {Signal} from '@preact/signals';
import {UpDownSelector} from '../components/UpDownSelector.tsx';
import {SemiCirclePicker} from '../components/SemiCirclePicker.tsx';
import {pairKeysByPosition} from './functions.ts';

const appState = createSegState();

interface StaggerTypeButtonProps {
    myType: NamedTypes;
    currentType: Signal<NamedTypes>;
    setType: (t: NamedTypes) => void;
}

function StaggerTypeButton({myType, currentType, setType}: StaggerTypeButtonProps) {
    return <button type="button"
            onClick={myType === NamedTypes.Other ? undefined : () => setType(myType)}
            class={"toggle-btn toggle-btn--lg layout-type-button" + (myType === currentType.value ? " selected" : "")}
    >
        {myType}
    </button>;
}

export function SegApp() {
    const movements = pairKeysByPosition(appState.previousModel.value.keyPositions, appState.layoutModel.value.keyPositions);
    return <>
        <PageHeader title="Semi-Ergo Keyboard Layout Generator"/>
        <div class={"seg-stagger-type-group"}>
            {Object.keys(NamedTypes).map( (typ) =>
                <StaggerTypeButton myType={typ as NamedTypes} currentType={appState.staggerType} setType={appState.setStaggerType}/>
            )}
        </div>
        <div class="seg-width-picker">
            <div class="seg-width-picker__label">Total Keyboard Width</div>
            {(() => {
                const widths = permittedKeyboardWidths(appState.staggerType.value);
                const kMin = widths[0];
                const kMax = widths[widths.length - 1];
                const kStep = widths.length > 1 ? Math.round((widths[1] - widths[0]) * 1e6) / 1e6 : 1;
                return <SemiCirclePicker
                    min={kMin}
                    max={kMax}
                    current={appState.keyboardWidth.value}
                    step={kStep}
                    onChange={appState.setKeyboardWidth}
                />;
            })()}
        </div>
        <div>Home Row Indent:
            <UpDownSelector
                value={appState.homeRowIndent}
                onChange={appState.setHomeRowIndent}
                permittedValues={permittedHomeRowIndent(appState.staggerType.value)}
            />
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
