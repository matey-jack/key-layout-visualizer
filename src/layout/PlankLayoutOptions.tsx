import {LayoutOptions, PlankVariant} from "../app-model.ts";
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
    return <div class="plank-layout-options-container">
        <PlankVariantButton variant={PlankVariant.KATANA_60} currentVariant={variant} setVariant={setVariant}/>
        <PlankVariantButton variant={PlankVariant.EP60} currentVariant={variant} setVariant={setVariant}>
            <CheckboxWithLabel label="Include arrow keys"
                               checked={options.ep60Arrows}
                               onChange={(arrows: boolean) => setOption({ep60Arrows: arrows})}/>
        </PlankVariantButton>
        <PlankVariantButton variant={PlankVariant.EP65} currentVariant={variant} setVariant={setVariant}>
            <CheckboxWithLabel label="Big Enter key"
                               checked={options.eb65BigEnter}
                               onChange={(big) => setOption({eb65BigEnter: big})}/>
        </PlankVariantButton>
        <PlankVariantButton variant={PlankVariant.EP65_MID_SHIFT} currentVariant={variant} setVariant={setVariant}>
            <CheckboxWithLabel label="Vertical Enter key"
                               checked={options.eb65VerticalEnter}
                               onChange={(vertical) => setOption({eb65VerticalEnter: vertical})}/>
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
