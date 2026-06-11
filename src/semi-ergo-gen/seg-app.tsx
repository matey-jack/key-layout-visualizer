import '../app.css';
import './seg.css';
import {PageHeader} from '../components/PageHeader.tsx';
import {Keyboard, KeyboardSvg} from '../layout/KeyboardSvg.tsx';
import {getMaxRowWidth} from '../layout/layout-functions.ts';
import {VisualizationType} from '../base-model.ts';
import {createSegState} from './seg-state.ts';
import {NamedTypes, permittedHomeRowIndent, permittedKeyboardWidths, permittedRowStagger,
    type StaggerSet} from './seg-model.ts';
import {formatDecimal} from '../library/math.ts';
import type {Signal} from '@preact/signals';
import {NumberPicker} from '../components/NumberPicker.tsx';
import {pairKeysByPosition} from './functions.ts';

const appState = createSegState();

interface StaggerTypeButtonProps {
    myType: NamedTypes;
    currentType: Signal<NamedTypes>;
    setType: (t: NamedTypes) => void;
    passive?: boolean;
    toolTip?: string;
}

function StaggerTypeButton({myType, currentType, setType, passive, toolTip}: StaggerTypeButtonProps) {
    return <button type="button"
            onClick={passive ? undefined : () => setType(myType)}
            title={toolTip}
            class={"toggle-btn layout-type-button"
                + (myType === currentType.value ? " selected" : "")
                + (passive ? " toggle-btn--passive" : "")}
    >
        {myType}
    </button>;
}

export function SegApp() {
    const movements = pairKeysByPosition(appState.previousModel.value.keyPositions, appState.layoutModel.value.keyPositions);
    const maxRowWidth = getMaxRowWidth(appState.layoutModel.value.renderInfo);
    const kw = permittedKeyboardWidths(appState.staggerType.value);
    const hr = permittedHomeRowIndent(appState.staggerType.value);
    const rsDivisors = permittedRowStagger(appState.staggerType.value);
    const staggerSet = appState.staggerSet.value;

    return <>
        <span class="seg-title">
            <PageHeader title="Semi-Ergo Keyboard Layout Generator"/>
        </span>
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
                        <StaggerTypeButton myType={NamedTypes.Other}      passive
                                           toolTip="Select a mixed pattern and change row stagger manually."
                                           currentType={appState.staggerType} setType={appState.setStaggerType}/>
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
            <div class="seg-keyboard">
                <KeyboardSvg vizType={VisualizationType.SemiErgoGen} keyMovements={movements} showFrame={true} totalWidth={maxRowWidth}>
                    <Keyboard
                        layoutModel={appState.layoutModel.value.renderInfo}
                        prevLayoutModel={appState.previousModel.value.renderInfo}
                        keyMovements={movements}
                        vizType={VisualizationType.SemiErgoGen}
                    />
                </KeyboardSvg>
            </div>

            <div class="seg-keyboard-controls">
                <div class="seg-row-stagger-section">
                    <div class="seg-section-label">Row Stagger</div>
                    <div class="seg-row-stagger-pickers">
                        {([0, 1, 2] as const).map(i =>
                            <div class="seg-row-stagger-row">
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
                                            {formatDecimal(1 / d)}
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div class="seg-home-row-section">
                    <div class="seg-section-label">Home Row Indent</div>
                    <NumberPicker
                        min={hr.min} max={hr.max} step={hr.step}
                        current={appState.homeRowIndent.value}
                        onChange={appState.setHomeRowIndent}
                        dotPattern="x."
                    />
                </div>
            </div>
        </div>
        <hr/>
        <div class={"footer"}>
            <p>This app is part of the <a href={".."}>Keyboard Layout and Mapping Visualizer
               </a>, which lets you see how different keymaps make use of all the keys on different traditional
                and novel keyboard layouts, including some selected Semi-Ergo variants.</p>
            <p>A <b>Semi-Ergo Keyboard Layout</b> is defined by the following axioms:
                <ol>
                    <li>The keys are arranged in rows inside a <b>regular box</b>. Just like a traditional standard keyboard.</li>
                    <li>The <b>hand resting position</b> is as <b>far apart</b> as the keyboard size allows.</li>
                    <li>The <b>row stagger goes inward</b> as fingers move up (to align with the natural hand and arm position) and does so for both hands.</li>
                    <li>There are <b>two comfortable thumb keys</b> for each thumb.
                        (Or at least one on narrow boards or those that place an arrow cluster in the bottom center.)</li>
                </ol>
                As you can see above, those constraints still leave a lot of freedom to design – and it's even more
                when considering where to map standard key functions and what to map on any additional keys.
            </p>
        </div>
    </>
}
