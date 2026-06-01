import {ErgoboardMidshiftVariant, ErgoplankArrows, type LayoutOptions, PlankVariant} from "../app-model.ts";
import {CheckboxWithLabel} from "../components/CheckboxWithLabel.tsx";
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
            <MidShiftCheckbox options={options} setOption={setOption}/>
            <CheckboxWithLabel label="57 keys"
                               type="radio"
                               groupName="ergoslat_keys"
                               checked={!options.esNumberless && !options.esSmallerThumbs}
                               onChange={(checked) => checked && setOption({esNumberless: false, esSmallerThumbs: false})}/>
            <CheckboxWithLabel label="59 keys"
                               type="radio"
                               groupName="ergoslat_keys"
                               checked={!options.esNumberless && options.esSmallerThumbs}
                               onChange={(checked) => checked && setOption({esNumberless: false, esSmallerThumbs: true})}/>
            <CheckboxWithLabel label="47 keys"
                               type="radio"
                               groupName="ergoslat_keys"
                               checked={options.esNumberless}
                               onChange={(checked) => checked && setOption({esNumberless: true, esSmallerThumbs: true})}/>
        </LayoutVariantButton>

        <LayoutVariantButton variant={PlankVariant.ERGOPLANK15}
                            currentVariant={variant} setVariant={setVariant}
                            name="❤️ Ergoplank 15/5"
        >
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
            <hr class="ergoplank-divider"/>
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
        </LayoutVariantButton>

        <LayoutVariantButton variant={PlankVariant.ERGOBOARD_CENTRAL}
                            currentVariant={variant} setVariant={setVariant}
                            name="❤️Ergoboard Central"
        >
        </LayoutVariantButton>

        <LayoutVariantButton variant={PlankVariant.ERGOBOARD_MID_SHIFT}
                            currentVariant={variant} setVariant={setVariant}
                            name="Ergoboard 16/x (Midshift)">
            <ErgoboardMidshiftLayoutOptions msVariant={options.ergoboardMidshiftVariant}
                                     setMsVariant={(v) => setOption({ergoboardMidshiftVariant: v})}/>
            <FlipRetRubButton setOption={setOption} options={options}/>
        </LayoutVariantButton>
    </div>
}

type ErgoboardMidshiftLayoutOptions = {
    msVariant: ErgoboardMidshiftVariant;
    setMsVariant: (v: ErgoboardMidshiftVariant) => void;
}

export function ErgoboardMidshiftLayoutOptions({msVariant, setMsVariant}: ErgoboardMidshiftLayoutOptions) {
    function midshiftVariant(msVar: ErgoboardMidshiftVariant, label: string, sub = false) {
        return <CheckboxWithLabel label={label}
                                  type="radio"
                                  groupName={sub ? "midshift_subvariant" : "midshift_variant"}
                                  checked={msVariant === msVar}
                                  onChange={(checked) => checked && setMsVariant(msVar)}/>
    }

    const narrowSubvariant = msVariant > ErgoboardMidshiftVariant.SEMI_WIDE;
    return <>
        {midshiftVariant(ErgoboardMidshiftVariant.EXTRA_WIDE, "Extra Wide Hands 16/5.5")}
        {midshiftVariant(ErgoboardMidshiftVariant.COMFY_WIDE, "❤️ Comfortably Wide 16/5")}
        {midshiftVariant(ErgoboardMidshiftVariant.SEMI_WIDE, "Semi Wide 16/4.5")}

        <CheckboxWithLabel label="Narrow Hands 16/4"
                           type="radio"
                           groupName={"midshift_variant"}
                           checked={narrowSubvariant}
                           onChange={(checked) =>  checked && setMsVariant(ErgoboardMidshiftVariant.RIGHT_ENTER)}/>

        {narrowSubvariant && <div class="ergoplank-midshift-sub-variants-container">
            {midshiftVariant(ErgoboardMidshiftVariant.RIGHT_ENTER, "Right-side Enter key", true)}
            {midshiftVariant(ErgoboardMidshiftVariant.VERTICAL_ENTER, "Vertical Enter key", true)}
            {midshiftVariant(ErgoboardMidshiftVariant.CENTRAL_ENTER, "Central Enter key", true)}
        </div>}
    </>
}



