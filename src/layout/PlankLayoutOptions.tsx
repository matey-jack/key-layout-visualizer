import {PlankVariant} from "../app-model.ts";
import {getPlankVariant} from "./layout-functions.ts";
import {CheckboxWithLabel} from "../components/CheckboxWithLabel.tsx";

export interface PlankLayoutOptionsProps {
    variant: PlankVariant;
    setVariant: (variant: PlankVariant) => void;
    includeArrows: boolean;
    setIncludeArrows: (arrows: boolean) => void;
}

export function PlankLayoutOptions({variant, setVariant, includeArrows, setIncludeArrows}: PlankLayoutOptionsProps) {
    return <div><div>
        <PlankVariantButton variant={PlankVariant.KATANA_60} currentVariant={variant} setVariant={setVariant}/>
        <PlankVariantButton variant={PlankVariant.MAX_WIDTH} currentVariant={variant} setVariant={setVariant}/>
        <PlankVariantButton variant={PlankVariant.ARROWS} currentVariant={variant} setVariant={setVariant}/>
    </div>
        {variant == PlankVariant.MAX_WIDTH &&
            <CheckboxWithLabel label="Include arrow keys" checked={includeArrows} onChange={setIncludeArrows}/>
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
        {getPlankVariant(variant).name}
    </button>
}
