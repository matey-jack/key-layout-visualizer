import '../app.css';
import './seg.css';
import {PageHeader} from '../components/PageHeader.tsx';
import {KeyboardSvg, RowBasedKeyboard} from '../layout/KeyboardSvg.tsx';
import {type LayoutModel, VisualizationType} from '../base-model.ts';
import {createSegState} from './seg-state.ts';
import {NamedTypes, permittedHomeRowIndent, permittedKeyboardWidths, permittedRowStagger,
    formatStagger, type StaggerSet} from './seg-model.ts';
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

export function SegApp() {
    const movements = pairKeysByPosition(appState.previousModel.value.keyPositions, appState.layoutModel.value.keyPositions);
    const kw = permittedKeyboardWidths(appState.staggerType.value);
    const hr = permittedHomeRowIndent(appState.staggerType.value);
    const rsDivisors = permittedRowStagger(appState.staggerType.value);
    const staggerSet = appState.staggerSet.value;

    return <>
        <PageHeader title="Semi-Ergo Keyboard Layout Generator"/>

        <div class="seg-top-row">
            <div class="seg-patterns-card">
                <div class="seg-section-label">Named Stagger Patterns</div>
                <div class="seg-pattern-rows">
                    <div class="seg-pattern-row">
                        <span class="seg-category-label">Uniform</span>
                        <StaggerTypeButton myType={NamedTypes.Harmonic}  currentType={appState.staggerType} setType={appState.setStaggerType}/>
                        <StaggerTypeButton myType={NamedTypes.Triplex}   currentType={appState.staggerType} setType={appState.setStaggerType}/>
                        <StaggerTypeButton myType={NamedTypes.Ergoboard} currentType={appState.staggerType} setType={appState.setStaggerType}/>
                    </div>
                    <div class="seg-pattern-row">
                        <span class="seg-category-label">Mixed</span>
                        <StaggerTypeButton myType={NamedTypes.Typewriter} currentType={appState.staggerType} setType={appState.setStaggerType}/>
                        <StaggerTypeButton myType={NamedTypes.Katana}     currentType={appState.staggerType} setType={appState.setStaggerType}/>
                        <StaggerTypeButton myType={NamedTypes.Ergoplank}  currentType={appState.staggerType} setType={appState.setStaggerType}/>
                        <StaggerTypeButton myType={NamedTypes.Other}      currentType={appState.staggerType} setType={appState.setStaggerType}/>
                    </div>
                </div>
            </div>

            <div class="seg-keyboard-width-section">
                <div class="seg-section-label">Total Keyboard Width</div>
                <NumberPicker
                    min={kw.min} max={kw.max} step={kw.step}
                    current={appState.keyboardWidth.value}
                    onChange={appState.setKeyboardWidth}
                />
            </div>
        </div>

        <div class="seg-keyboard-row">
            <div class="seg-home-row-section">
                <div class="seg-section-label">Home Row Indent</div>
                <NumberPicker
                    min={hr.min} max={hr.max} step={hr.step}
                    current={appState.homeRowIndent.value}
                    onChange={appState.setHomeRowIndent}
                    dotPattern="x."
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

            <div class="seg-row-stagger-section">
                <div class="seg-section-label">Row Stagger</div>
                <div class="seg-row-stagger-pickers">
                    {([0, 1, 2] as const).map(i =>
                        <div class="seg-row-stagger-row">
                            <span class="seg-row-indicator">· · ·</span>
                            <div class="seg-divisor-btn-group">
                                {rsDivisors.map(d =>
                                    <button type="button"
                                        class={"toggle-btn toggle-btn--sm toggle-btn--seg" + (d === staggerSet[i] ? " selected" : "")}
                                        onClick={() => {
                                            const s = [...staggerSet] as [number, number, number];
                                            s[i] = d;
                                            appState.setStaggerSet(s as StaggerSet);
                                        }}
                                    >
                                        {formatStagger(1 / d)}
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </>
}
