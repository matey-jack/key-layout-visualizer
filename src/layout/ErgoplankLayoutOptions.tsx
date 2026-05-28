import {ErgoboardLowshiftVariant, ErgoboardMidshiftVariant, type LayoutOptions, PlankVariant} from "../app-model.ts";
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

    function lowshiftVariant(v: ErgoboardLowshiftVariant, label: string) {
        return <div class="ergoplank-lowshift-variants-container">
            <CheckboxWithLabel label={label}
                               type="radio"
                               groupName="lowshift_variant"
                               checked={options.ergoboardLowshiftVariant === v}
                               onChange={(checked) => checked && setOption({ergoboardLowshiftVariant: v})}/>
        </div>
    }

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

        <LayoutVariantButton variant={PlankVariant.ERGOPLANK}
                            currentVariant={variant} setVariant={setVariant}
                            name="❤️ Ergoplank 15/5"
        >
            <MidShiftCheckbox options={options} setOption={setOption}/>
            <CheckboxWithLabel label="Include arrow keys"
                               checked={options.bottomArrows}
                               onChange={(arrows: boolean) => setOption({bottomArrows: arrows})}/>
        </LayoutVariantButton>

        <LayoutVariantButton variant={PlankVariant.ERGOBOARD_LOW_SHIFT}
                            currentVariant={variant} setVariant={setVariant}
                            name="Ergoboard 16/x (Lowshift)">
            {lowshiftVariant(ErgoboardLowshiftVariant.WIDE_HANDS, "Wide Hands 16/4.5")}
            {options.ergoboardLowshiftVariant === ErgoboardLowshiftVariant.WIDE_HANDS &&
                <div class="ergoplank-angle-mod-checkbox">
                    <CheckboxWithLabel label="angle mod"
                                       checked={options.angleMod}
                                       onChange={(angle) => setOption({angleMod: angle})}/>
                </div>
            }
            {lowshiftVariant(ErgoboardLowshiftVariant.LESS_GAPS, "Less Gaps 16/4")}
            {/* Disabled, because the second thumb keys are hard to reach with such big central thumb keys!
            {lowshiftVariant(ErgoboardLowshiftVariant.BIG_ENTER, "Big Enter & Space 16/4")}*/}
            <FlipRetRubButton setOption={setOption} options={options}/>
        </LayoutVariantButton>

        <LayoutVariantButton variant={PlankVariant.ERGOBOARD_MID_SHIFT}
                            currentVariant={variant} setVariant={setVariant}
                            name="❤️Ergoboard 16/x (Midshift)">
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



