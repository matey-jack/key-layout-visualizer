import {HarmonicVariant} from "../app-model.ts";
import {ComponentChildren} from "preact";

export interface HarmonicLayoutOptionsProps {
    variant: HarmonicVariant;
    setVariant: (variant: HarmonicVariant) => void;
}

export function HarmonicLayoutOptions({variant, setVariant}: HarmonicLayoutOptionsProps) {
    return <div>
        <HarmonicVariantButton variant={HarmonicVariant.H14_Traditional} currentVariant={variant}
                               setVariant={setVariant}>
            14/Traditional
        </HarmonicVariantButton>
        <HarmonicVariantButton variant={HarmonicVariant.H13_Wide} currentVariant={variant} setVariant={setVariant}>
            13/Balance
        </HarmonicVariantButton>
        <HarmonicVariantButton variant={HarmonicVariant.H13_MidShift} currentVariant={variant} setVariant={setVariant}>
            13/MidShift
        </HarmonicVariantButton>
        <HarmonicVariantButton variant={HarmonicVariant.H12} currentVariant={variant} setVariant={setVariant}>
            12/Mini
        </HarmonicVariantButton>
    </div>
}

interface HarmonicVariantButtonProps {
    variant: HarmonicVariant;
    currentVariant: HarmonicVariant;
    setVariant: (variant: HarmonicVariant) => void;
    children?: ComponentChildren;
}

export function HarmonicVariantButton({variant, currentVariant, setVariant, children}: HarmonicVariantButtonProps) {
    const selected = variant === currentVariant ? " selected" : "";
    return <button
        className={"layout-options-button" + selected}
        onClick={() => setVariant(variant)}
    >
        {children}
    </button>
}
