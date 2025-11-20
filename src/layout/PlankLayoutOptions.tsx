import {EB65_LowShift_Variant, EB65_MidShift_Variant, LayoutOptions, PlankVariant} from "../app-model.ts";
import {getPlankVariant} from "./layout-functions.ts";
import {CheckboxWithLabel} from "../components/CheckboxWithLabel.tsx";
import {ComponentChildren} from "preact";

export interface PlankLayoutOptionsProps {
    variant: PlankVariant;
    setVariant: (variant: PlankVariant) => void;
    options: LayoutOptions;
    setOption: (opts: Partial<LayoutOptions>) => void;
}

export function PlankLayoutOptions({variant, setVariant, options, setOption}: PlankLayoutOptionsProps) {
    function midshiftVariant(type: EB65_MidShift_Variant, label: string) {
        return <CheckboxWithLabel label={label}
                                  type="radio"
                                  groupName="midshift_variant"
                                  checked={options.eb65MidshiftVariant == type}
                                  onChange={(checked) => checked && setOption({eb65MidshiftVariant: type})}/>
    }

    function lowshiftVariant(type: EB65_LowShift_Variant, label: string) {
        return <CheckboxWithLabel label={label}
                                  type="radio"
                                  groupName="lowshift_variant"
                                  checked={options.eb65LowshiftVariant == type}
                                  onChange={(checked) => checked && setOption({eb65LowshiftVariant: type})}/>
    }

    return <div class="plank-layout-options-container">
        <PlankVariantButton variant={PlankVariant.KATANA_60} currentVariant={variant} setVariant={setVariant}/>
        <PlankVariantButton variant={PlankVariant.EP60} currentVariant={variant} setVariant={setVariant}>
            <CheckboxWithLabel label="Include arrow keys"
                               checked={options.ep60Arrows}
                               onChange={(arrows: boolean) => setOption({ep60Arrows: arrows})}/>
        </PlankVariantButton>
        <PlankVariantButton variant={PlankVariant.EP65} currentVariant={variant} setVariant={setVariant}>
            {lowshiftVariant(EB65_LowShift_Variant.WIDE_HANDS, "Wide Hands")}
            {lowshiftVariant(EB65_LowShift_Variant.LESS_GAPS, "Less Gaps")}
            {lowshiftVariant(EB65_LowShift_Variant.BIG_ENTER, "Big Enter and Space keys")}
        </PlankVariantButton>
        <PlankVariantButton variant={PlankVariant.EP65_MID_SHIFT} currentVariant={variant} setVariant={setVariant}>
            {midshiftVariant(EB65_MidShift_Variant.UPPER_ENTER, "Upper Enter key")}
            {midshiftVariant(EB65_MidShift_Variant.VERTICAL_ENTER, "Vertical Enter key")}
            {midshiftVariant(EB65_MidShift_Variant.MID_MID, "Home-row Enter key (recommended)")}
        </PlankVariantButton>
    </div>
}

interface PlankVariantButtonProps {
    variant: PlankVariant;
    currentVariant: PlankVariant;
    setVariant: (variant: PlankVariant) => void;
    children?: ComponentChildren;
}

export function PlankVariantButton({variant, currentVariant, setVariant, children}: PlankVariantButtonProps) {
    const selected = variant === currentVariant ? " selected" : "";
    return <div>
        <button
            className={"layout-options-button" + selected}
            onClick={() => setVariant(variant)}
        >
            {getPlankVariant({plankVariant: variant} as LayoutOptions).name}
        </button>
        {selected && children}
    </div>
}
