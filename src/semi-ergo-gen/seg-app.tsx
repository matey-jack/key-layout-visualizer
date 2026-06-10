import '../app.css';
import './seg.css';
import {PageHeader} from '../components/PageHeader.tsx';
import {KeyboardSvg, RowBasedKeyboard} from '../layout/KeyboardSvg.tsx';
import {type LayoutModel, VisualizationType} from '../base-model.ts';
import {createSegState} from './seg-state.ts';
import {NamedTypes, permittedHomeRowIndent, permittedKeyboardWidths} from './seg-model.ts';
import type {Signal} from '@preact/signals';
import {NumberPicker} from '../components/NumberPicker.tsx';
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

function deriveMinMaxStep(values: number[]): {min: number; max: number; step: number} {
    return {
        min: values[0],
        max: values[values.length - 1],
        step: values.length > 1 ? Math.round((values[1] - values[0]) * 1e6) / 1e6 : 1,
    };
}

export function SegApp() {
    const movements = pairKeysByPosition(appState.previousModel.value.keyPositions, appState.layoutModel.value.keyPositions);
    const kw = deriveMinMaxStep(permittedKeyboardWidths(appState.staggerType.value));
    const hr = deriveMinMaxStep(permittedHomeRowIndent(appState.staggerType.value));
    return <>
        <PageHeader title="Semi-Ergo Keyboard Layout Generator"/>
        <div class={"seg-stagger-type-group"}>
            {Object.keys(NamedTypes).map( (typ) =>
                <StaggerTypeButton myType={typ as NamedTypes} currentType={appState.staggerType} setType={appState.setStaggerType}/>
            )}
        </div>
        <div class="seg-width-picker">
            <div class="seg-width-picker__label">Total Keyboard Width</div>
            <NumberPicker
                min={kw.min} max={kw.max} step={kw.step}
                current={appState.keyboardWidth.value}
                onChange={appState.setKeyboardWidth}
            />
        </div>
        <div>Home Row Indent:
            <NumberPicker
                min={hr.min} max={hr.max} step={hr.step}
                current={appState.homeRowIndent.value}
                onChange={appState.setHomeRowIndent}
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
