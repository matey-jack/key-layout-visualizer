import {ErgoboardVariant, ErgoplankArrows, type LayoutOptions, PlankVariant} from "../app-model.ts";
import {LayoutVariantButton} from "../components/LayoutVariantButton.tsx";
import {FlipRetRubButton} from "./components/FlipRetRubButton.tsx";
import {MidShiftCheckbox} from "./components/MidShiftCheckbox.tsx";

export interface PlankLayoutOptionsProps {
    options: LayoutOptions;
    setOption: (opts: Partial<LayoutOptions>) => void;
}

export function ErgoplankLayoutOptions({options, setOption}: PlankLayoutOptionsProps) {
    const variant = options.plankVariant;
    const setVariant = (plankVariant: PlankVariant) => setOption({plankVariant});

    return <div class="plank-layout-options-container">
        <LayoutVariantButton variant={PlankVariant.KATANA_60} currentVariant={variant} setVariant={setVariant} name="Katana60"/>

        <LayoutVariantButton variant={PlankVariant.ERGOSLAT} currentVariant={variant} setVariant={setVariant} name="Ergoslat 13/3">
            <div class="variant-options-row variant-options-row--center">
                <div class="variant-option-column">
                    <MidShiftCheckbox options={options} setOption={setOption}/>
                </div>
                <div class="variant-option-column">
                    <div class="ergoplank-button-group">
                        <button type="button"
                                class={"toggle-btn toggle-btn--sm" + (!options.esNumberless && !options.esSmallerThumbs ? " selected" : "")}
                                onClick={() => setOption({esNumberless: false, esSmallerThumbs: false})}>
                            57 keys
                        </button>
                        <button type="button"
                                class={"toggle-btn toggle-btn--sm" + (!options.esNumberless && options.esSmallerThumbs ? " selected" : "")}
                                onClick={() => setOption({esNumberless: false, esSmallerThumbs: true})}>
                            59 keys
                        </button>
                        <button type="button"
                                class={"toggle-btn toggle-btn--sm" + (options.esNumberless ? " selected" : "")}
                                onClick={() => setOption({esNumberless: true, esSmallerThumbs: true})}>
                            47 keys
                        </button>
                    </div>
                </div>
            </div>
        </LayoutVariantButton>

        <LayoutVariantButton variant={PlankVariant.ERGOPLANK15}
                            currentVariant={variant} setVariant={setVariant}
                            name="❤️ Ergoplank 15/5"
        >
            <div class="variant-options-row">
                <div class="variant-option-column">
                    <div class="ergoplank-group-label">Lower Row</div>
                    <div class="ergoplank-button-group">
                        <button type="button"
                                class={"toggle-btn toggle-btn--sm" + (!options.midShift ? " selected" : "")}
                                onClick={() => setOption({midShift: false})}>
                            Shift
                        </button>
                        <button type="button"
                                class={"toggle-btn toggle-btn--sm" + (options.midShift && !options.epRightReturn ? " selected" : "")}
                                onClick={() => setOption({midShift: true, epRightReturn: false})}>
                            Characters
                        </button>
                        <button type="button"
                                class={"toggle-btn toggle-btn--sm" + (options.midShift && options.epRightReturn ? " selected" : "")}
                                onClick={() => setOption({midShift: true, epRightReturn: true})}>
                            Enter
                        </button>
                    </div>
                </div>
                <div class="variant-option-column">
                    <div class="ergoplank-group-label">Arrows</div>
                    <div class="ergoplank-button-group">
                        <button type="button"
                                class={"toggle-btn toggle-btn--sm" + (options.epArrows === ErgoplankArrows.None ? " selected" : "")}
                                onClick={() => setOption({epArrows: ErgoplankArrows.None})}>
                            None
                        </button>
                        <button type="button"
                                class={"toggle-btn toggle-btn--sm" + (options.epArrows === ErgoplankArrows.Inline ? " selected" : "")}
                                onClick={() => setOption({epArrows: ErgoplankArrows.Inline})}>
                            Inline
                        </button>
                        <button type="button"
                                class={"toggle-btn toggle-btn--sm" + (options.epArrows === ErgoplankArrows.Center ? " selected" : "")}
                                onClick={() => setOption({epArrows: ErgoplankArrows.Center})}>
                            Center
                        </button>
                    </div>
                </div>
            </div>
        </LayoutVariantButton>

        <LayoutVariantButton variant={PlankVariant.ERGOBOARD_CENTRAL}
                            currentVariant={variant} setVariant={setVariant}
                            name="❤️ Ergoboard 16/5 Central"
        >
        </LayoutVariantButton>

        <LayoutVariantButton variant={PlankVariant.ERGOBOARD_MID_SHIFT}
                            currentVariant={variant} setVariant={setVariant}
                            name="Ergoboard 16/x Legacy Ed">
            <div class="variant-options-row">
                <ErgoboardLayoutOptions msVariant={options.ergoboardMidshiftVariant}
                                        setMsVariant={(v) => setOption({ergoboardMidshiftVariant: v})}/>
                <div class="variant-option-column">
                    <FlipRetRubButton setOption={setOption} options={options}/>
                </div>
            </div>
        </LayoutVariantButton>
    </div>
}

type ErgoboardLayoutOptionsProps = {
    msVariant: ErgoboardVariant;
    setMsVariant: (v: ErgoboardVariant) => void;
}

export function ErgoboardLayoutOptions({msVariant, setMsVariant}: ErgoboardLayoutOptionsProps) {
    const narrowSubvariant = msVariant > ErgoboardVariant.SEMI_WIDE;

    function midshiftButton(msVar: ErgoboardVariant, label: string, selected: boolean) {
        return <button type="button"
                       class={"toggle-btn toggle-btn--sm" + (selected ? " selected" : "")}
                       onClick={() => setMsVariant(msVar)}>
            {label}
        </button>
    }

    // The Enter-key sub-group stacks *below* the width buttons (same column):
    // with no group labels there's room, and stacking avoids overflowing the page.
    return <div class="variant-option-column">
        <div class="ergoplank-button-group">
            {midshiftButton(ErgoboardVariant.EXTRA_WIDE, "16/5.5", msVariant === ErgoboardVariant.EXTRA_WIDE)}
            {midshiftButton(ErgoboardVariant.COMFY_WIDE, "16/5", msVariant === ErgoboardVariant.COMFY_WIDE)}
            {midshiftButton(ErgoboardVariant.SEMI_WIDE, "16/4.5", msVariant === ErgoboardVariant.SEMI_WIDE)}
            {midshiftButton(ErgoboardVariant.RIGHT_ENTER, "16/4", narrowSubvariant)}
        </div>

        {narrowSubvariant &&
            <div class="ergoboard-inline-group">
                <div class="ergoplank-group-label">Enter key:</div>
                <div class="ergoplank-button-group">
                    {midshiftButton(ErgoboardVariant.RIGHT_ENTER, "Right", msVariant === ErgoboardVariant.RIGHT_ENTER)}
                    {midshiftButton(ErgoboardVariant.CENTRAL_ENTER, "Central", msVariant === ErgoboardVariant.CENTRAL_ENTER)}
                    {midshiftButton(ErgoboardVariant.VERTICAL_ENTER, "Vertical", msVariant === ErgoboardVariant.VERTICAL_ENTER)}
                </div>
            </div>
        }
    </div>
}



