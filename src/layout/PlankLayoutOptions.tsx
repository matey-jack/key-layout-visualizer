import {PlankVariant} from "../app-model.ts";
import {getPlankVariant} from "./layout-functions.ts";

export interface PlankLayoutOptionsProps {
    variant: PlankVariant;
    setVariant: (variant: PlankVariant) => void;
}

export function PlankLayoutOptions({variant, setVariant}: PlankLayoutOptionsProps) {
    return <div>
        <PlankVariantButton variant={PlankVariant.KATANA_60} currentVariant={variant} setVariant={setVariant}/>
        <PlankVariantButton variant={PlankVariant.MAX_WIDTH} currentVariant={variant} setVariant={setVariant}/>
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
        {getPlankVariant(variant).name}
    </button>
}
