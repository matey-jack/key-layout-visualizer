import {PlankVariant} from "../app-model.ts";
import {getPlankVariant} from "./layout-functions.ts";
import {CheckboxWithLabel} from "../components/CheckboxWithLabel.tsx";

export interface PlankLayoutOptionsProps {
    variant: PlankVariant;
    setVariant: (variant: PlankVariant) => void;
    ep60Arrows: boolean;
    setEp60Arrows: (arrows: boolean) => void;
    ep65BigEnter: boolean;
    setEp65BigEnter: (arrows: boolean) => void;
}

export function PlankLayoutOptions({variant, setVariant, ep60Arrows, setEp60Arrows, ep65BigEnter, setEp65BigEnter}: PlankLayoutOptionsProps) {
    return <div><div>
        <PlankVariantButton variant={PlankVariant.KATANA_60} currentVariant={variant} setVariant={setVariant}/>
        <PlankVariantButton variant={PlankVariant.EP60} currentVariant={variant} setVariant={setVariant}/>
        <PlankVariantButton variant={PlankVariant.EP65} currentVariant={variant} setVariant={setVariant}/>
        <PlankVariantButton variant={PlankVariant.EP65_MID_SHIFT} currentVariant={variant} setVariant={setVariant}/>
    </div>
        {variant == PlankVariant.EP60 &&
            <CheckboxWithLabel label="Include arrow keys" checked={ep60Arrows} onChange={setEp60Arrows}/>
        }
        {variant == PlankVariant.EP65 &&
            <CheckboxWithLabel label="Big Enter key" checked={ep65BigEnter} onChange={setEp65BigEnter}/>
        }
    </div>
}

interface PlankVariantButtonProps {
    variant: PlankVariant;
    currentVariant: PlankVariant;
    setVariant: (variant: PlankVariant) => void;
}

export function PlankVariantButton({variant, currentVariant, setVariant}: PlankVariantButtonProps) {
    const selected = variant === currentVariant ? " selected" : "";
    return <button
        className={"layout-options-button" + selected}
        onClick={() => setVariant(variant)}
    >
        {getPlankVariant(variant, false, false).name}
    </button>
}
