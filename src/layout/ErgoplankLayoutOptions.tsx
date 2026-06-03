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

    return <div class="layout-variant-grid layout-variant-grid--plank">
        <LayoutVariantButton variant={PlankVariant.KATANA_60} currentVariant={variant} setVariant={setVariant} name="Katana60"/>

        <LayoutVariantButton variant={PlankVariant.ERGOSLAT} currentVariant={variant} setVariant={setVariant} name="Ergoslat 13/3">
            <div class="layout-option-row">
                <div class="layout-option-column">
                    <div class="layout-option-button-group">
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
                    <MidShiftCheckbox options={options} setOption={setOption}/>
                </div>
            </div>
        </LayoutVariantButton>

        <LayoutVariantButton variant={PlankVariant.ERGOPLANK}
                            currentVariant={variant} setVariant={setVariant}
                            name="❤️ Ergoplank 15/5"
        >
            <div class="layout-option-row">
                <div class="layout-option-column">
                    <div class="layout-option-group--inline">
                        <div class="layout-option-group-label">Lower Row</div>
                        <div class="layout-option-button-group">
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
                    <div class="layout-option-group--inline">
                        <div class="layout-option-group-label">Arrows</div>
                        <div class="layout-option-button-group">
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
            </div>
        </LayoutVariantButton>

        <LayoutVariantButton variant={PlankVariant.ERGOBOARD_LEGACY}
                            currentVariant={variant} setVariant={setVariant}
                            name="Ergoboard 16/x Legacy&nbsp;Ed">
            <div class="layout-option-row">
                <ErgoboardLayoutOptions ergoboardVariant={options.ergoboardVariant}
                                        setErgoboardVariant={(v) => setOption({ergoboardVariant: v})}/>
                <div class="layout-option-column">
                    <FlipRetRubButton setOption={setOption} options={options}/>
                </div>
            </div>
        </LayoutVariantButton>

        <LayoutVariantButton variant={PlankVariant.ERGOBOARD_CENTRAL}
                             currentVariant={variant} setVariant={setVariant}
                             name="❤️ Ergoboard 16/5 Central"
        >
        </LayoutVariantButton>
    </div>
}

type ErgoboardLayoutOptionsProps = {
    ergoboardVariant: ErgoboardVariant;
    setErgoboardVariant: (v: ErgoboardVariant) => void;
}

export function ErgoboardLayoutOptions({ergoboardVariant, setErgoboardVariant}: ErgoboardLayoutOptionsProps) {
    const narrowSubvariant = ergoboardVariant > ErgoboardVariant.SEMI_WIDE;

    function variantButton(variant: ErgoboardVariant, label: string, selected: boolean) {
        return <button type="button"
                       class={"toggle-btn toggle-btn--sm" + (selected ? " selected" : "")}
                       onClick={() => setErgoboardVariant(variant)}>
            {label}
        </button>
    }

    // The Enter-key sub-group stacks below the hand-distance buttons in the same column.
    return <div class="layout-option-column">
        <div class="layout-option-group--inline">
            <div class="layout-option-group-label">Hand distance</div>
            <div class="layout-option-button-group">
                {variantButton(ErgoboardVariant.EXTRA_WIDE, "16/5.5", ergoboardVariant === ErgoboardVariant.EXTRA_WIDE)}
                {variantButton(ErgoboardVariant.COMFY_WIDE, "16/5 ❤️", ergoboardVariant === ErgoboardVariant.COMFY_WIDE)}
                {variantButton(ErgoboardVariant.SEMI_WIDE, "16/4.5", ergoboardVariant === ErgoboardVariant.SEMI_WIDE)}
                {variantButton(ErgoboardVariant.RIGHT_ENTER, "16/4", narrowSubvariant)}
            </div>
        </div>

        {narrowSubvariant &&
            <div class="layout-option-group--inline">
                <div class="layout-option-group-label">Enter key</div>
                <div class="layout-option-button-group">
                    {variantButton(ErgoboardVariant.RIGHT_ENTER, "Right", ergoboardVariant === ErgoboardVariant.RIGHT_ENTER)}
                    {variantButton(ErgoboardVariant.CENTRAL_ENTER, "Central", ergoboardVariant === ErgoboardVariant.CENTRAL_ENTER)}
                    {variantButton(ErgoboardVariant.VERTICAL_ENTER, "Vertical", ergoboardVariant === ErgoboardVariant.VERTICAL_ENTER)}
                </div>
            </div>
        }
    </div>
}



