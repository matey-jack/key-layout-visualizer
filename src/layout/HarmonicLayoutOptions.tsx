import {HarmonicVariant, LayoutOptions} from "../app-model.ts";
import {getHarmonicVariant} from "../layout-selection.ts";

export interface HarmonicLayoutOptionsProps {
    options: LayoutOptions;
    setOption: (opts: Partial<LayoutOptions>) => void;
}

export function HarmonicLayoutOptions({options, setOption}: HarmonicLayoutOptionsProps) {
    const variant = options.harmonicVariant;
    const setVariant = (harmonicVariant: HarmonicVariant) => setOption({harmonicVariant});

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
