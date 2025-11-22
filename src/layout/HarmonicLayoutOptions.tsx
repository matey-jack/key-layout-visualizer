import {HarmonicVariant} from "../app-model.ts";
import {getHarmonicVariant} from "../layout-selection.ts";

export interface HarmonicLayoutOptionsProps {
    variant: HarmonicVariant;
    setVariant: (variant: HarmonicVariant) => void;
}

export function HarmonicLayoutOptions({variant, setVariant}: HarmonicLayoutOptionsProps) {
    return <div>
        <HarmonicVariantButton variant={HarmonicVariant.H14_Wide} currentVariant={variant} setVariant={setVariant}/>
        <HarmonicVariantButton variant={HarmonicVariant.H14_Traditional} currentVariant={variant} setVariant={setVariant}/>
        <HarmonicVariantButton variant={HarmonicVariant.H13_Wide} currentVariant={variant} setVariant={setVariant}/>
        <HarmonicVariantButton variant={HarmonicVariant.H13_MidShift} currentVariant={variant} setVariant={setVariant}/>
        <HarmonicVariantButton variant={HarmonicVariant.H12} currentVariant={variant} setVariant={setVariant}/>
    </div>
}

interface HarmonicVariantButtonProps {
    variant: HarmonicVariant;
    currentVariant: HarmonicVariant;
    setVariant: (variant: HarmonicVariant) => void;
}

export function HarmonicVariantButton({variant, currentVariant, setVariant}: HarmonicVariantButtonProps) {
    const selected = variant === currentVariant ? " selected" : "";
    return <button
        className={"layout-options-button" + selected}
        onClick={() => setVariant(variant)}
    >
        {getHarmonicVariant(variant).name}
    </button>
}
