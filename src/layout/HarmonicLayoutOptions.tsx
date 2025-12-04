import {HarmonicVariant, LayoutOptions} from "../app-model.ts";
import {LayoutVariantButton} from "../components/LayoutVariantButton.tsx";

export interface HarmonicLayoutOptionsProps {
    options: LayoutOptions;
    setOption: (opts: Partial<LayoutOptions>) => void;
}

export function HarmonicLayoutOptions({options, setOption}: HarmonicLayoutOptionsProps) {
    const variant = options.harmonicVariant;
    const setVariant = (harmonicVariant: HarmonicVariant) => setOption({harmonicVariant});

    return <div class="harmonic-layout-options-container">
        <LayoutVariantButton variant={HarmonicVariant.H14_Wide} currentVariant={variant} setVariant={setVariant} name="Harmonic 14 Macro"/>
        <LayoutVariantButton variant={HarmonicVariant.H14_Traditional} currentVariant={variant} setVariant={setVariant} name="Harmonic 14 Traditional"/>
        <LayoutVariantButton variant={HarmonicVariant.H13_Wide} currentVariant={variant} setVariant={setVariant} name="Harmonic 13 Balance"/>
        <LayoutVariantButton variant={HarmonicVariant.H13_MidShift} currentVariant={variant} setVariant={setVariant} name="Harmonic 13 MidShift"/>
        <LayoutVariantButton variant={HarmonicVariant.H12} currentVariant={variant} setVariant={setVariant} name="Harmonic 12 Mini"/>
    </div>
}
