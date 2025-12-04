import {EB65_LowShift_Variant, EB65_MidShift_Variant, LayoutOptions, PlankVariant} from "../app-model.ts";
import {getPlankVariant} from "../layout-selection.ts";
import {CheckboxWithLabel} from "../components/CheckboxWithLabel.tsx";
import {LayoutVariantButton} from "../components/LayoutVariantButton.tsx";
import {FlipRetRubButton} from "./components/FlipRetRubButton.tsx";

export interface PlankLayoutOptionsProps {
    options: LayoutOptions;
    setOption: (opts: Partial<LayoutOptions>) => void;
}

export function ErgoplankLayoutOptions({options, setOption}: PlankLayoutOptionsProps) {
    const variant = options.plankVariant;
    const setVariant = (plankVariant: PlankVariant) => setOption({plankVariant});

    function lowshiftVariant(v: EB65_LowShift_Variant, label: string) {
        return <div class="ergoplank-lowshift-variants-container">
            <CheckboxWithLabel label={label}
                               type="radio"
                               groupName="lowshift_variant"
                               checked={options.eb65LowshiftVariant == v}
                               onChange={(checked) => checked && setOption({eb65LowshiftVariant: v})}/>
        </div>
    }

    return <div class="plank-layout-options-container">
        <LayoutVariantButton variant={PlankVariant.KATANA_60} currentVariant={variant} setVariant={setVariant} name="Katana60"/>

        <LayoutVariantButton variant={PlankVariant.EP60}
                            currentVariant={variant} setVariant={setVariant}
                            name="❤️ Ergoplank 60"
        >
            <CheckboxWithLabel label="angle mod"
                               checked={options.angleMod}
                               onChange={(angle) => setOption({angleMod: angle})}/>
            <CheckboxWithLabel label="Include arrow keys"
                               checked={options.bottomArrows}
                               onChange={(arrows: boolean) => setOption({bottomArrows: arrows})}/>
            <FlipRetRubButton setOption={setOption} options={options}/>
        </LayoutVariantButton>

        <LayoutVariantButton variant={PlankVariant.EB65_LOW_SHIFT}
                            currentVariant={variant} setVariant={setVariant}
                            name="Ergoboard 65 Lowshift">
            {lowshiftVariant(EB65_LowShift_Variant.WIDE_HANDS, "Wide Hands")}
            {options.eb65LowshiftVariant === EB65_LowShift_Variant.WIDE_HANDS &&
                <div class="ergoplank-angle-mod-checkbox">
                    <CheckboxWithLabel label="angle mod"
                                       checked={options.angleMod}
                                       onChange={(angle) => setOption({angleMod: angle})}/>
                </div>
            }
            {lowshiftVariant(EB65_LowShift_Variant.LESS_GAPS, "Less Gaps")}
            {lowshiftVariant(EB65_LowShift_Variant.BIG_ENTER, "Big Enter & Space")}
            <FlipRetRubButton setOption={setOption} options={options}/>
        </LayoutVariantButton>

        <LayoutVariantButton variant={PlankVariant.EB65_MID_SHIFT}
                            currentVariant={variant} setVariant={setVariant}
                            name="❤️Ergoboard 65 Midshift">
            <EbMidshiftLayoutOptions msVariant={options.eb65MidshiftVariant}
                                     setMsVariant={(v) => setOption({eb65MidshiftVariant: v})}/>
            <FlipRetRubButton setOption={setOption} options={options}/>
        </LayoutVariantButton>
    </div>
}

type EbMidshiftLayoutOptions = {
    msVariant: EB65_MidShift_Variant;
    setMsVariant: (v: EB65_MidShift_Variant) => void;
}

export function EbMidshiftLayoutOptions({msVariant, setMsVariant}: EbMidshiftLayoutOptions) {
    function midshiftVariant(msVar: EB65_MidShift_Variant, label: string, sub = false) {
        return <CheckboxWithLabel label={label}
                                  type="radio"
                                  groupName={sub ? "midshift_subvariant" : "midshift_variant"}
                                  checked={msVariant == msVar}
                                  onChange={(checked) => checked && setMsVariant(msVar)}/>
    }

    const narrowSubvariant = msVariant > EB65_MidShift_Variant.NICELY_WIDE;
    return <>
        {midshiftVariant(EB65_MidShift_Variant.EXTRA_WIDE, "Extra Wide Hands")}
        {midshiftVariant(EB65_MidShift_Variant.NICELY_WIDE, "❤️ Wide Hands")}
        {msVariant == EB65_MidShift_Variant.NICELY_WIDE && false &&
            <div className="ergoplank-midshift-xl-bars-checkbox">
                <CheckboxWithLabel label="XL bottom bars" checked={false}/>
            </div>
        }

        <CheckboxWithLabel label="Narrow Hands"
                           type="radio"
                           groupName={"midshift_variant"}
                           checked={narrowSubvariant}
                           onChange={(checked) =>  checked && setMsVariant(EB65_MidShift_Variant.CENTRAL_ENTER)}/>

        {narrowSubvariant && <div class="ergoplank-midshift-sub-variants-container">
            {midshiftVariant(EB65_MidShift_Variant.CENTRAL_ENTER, "Central Enter key", true)}
            {midshiftVariant(EB65_MidShift_Variant.RIGHT_ENTER, "Right-side Enter key", true)}
            {midshiftVariant(EB65_MidShift_Variant.VERTICAL_ENTER, "Vertical Enter key", true)}
        </div>}
    </>
}



