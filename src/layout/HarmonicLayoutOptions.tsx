import {HarmonicVariant, type LayoutOptions} from "../app-model.ts";
import {LayoutVariantButton} from "../components/LayoutVariantButton.tsx";
import {CheckboxWithLabel} from "../components/CheckboxWithLabel.tsx";

export interface HarmonicLayoutOptionsProps {
    options: LayoutOptions;
    setOption: (opts: Partial<LayoutOptions>) => void;
}

export function HarmonicLayoutOptions({options, setOption}: HarmonicLayoutOptionsProps) {
    const variant = options.harmonicVariant;
    const setVariant = (harmonicVariant: HarmonicVariant) => setOption({harmonicVariant});

    return <div class="harmonic-options">
        <div class="layout-variant-grid layout-variant-grid--harmonic">
            <LayoutVariantButton variant={HarmonicVariant.H12} currentVariant={variant} setVariant={setVariant} name="12/2 Mini"/>
            <LayoutVariantButton variant={HarmonicVariant.H13_Mid_shift} currentVariant={variant} setVariant={setVariant} name="13/2 Mid-shift"/>
            <LayoutVariantButton variant={HarmonicVariant.H13_Wide} currentVariant={variant} setVariant={setVariant} name="13/3 Balance"/>
            <LayoutVariantButton variant={HarmonicVariant.H14_Traditional} currentVariant={variant} setVariant={setVariant} name="14/3 Traditional"/>
            <LayoutVariantButton variant={HarmonicVariant.H14_Wide} currentVariant={variant} setVariant={setVariant} name="14/4 Macro"/>
        </div>
        <div class="layout-option-checkboxes">
            <CheckboxWithLabel label="Hexagon keycaps"
                               checked={options.harmonicHexagons}
                               onChange={(hex) => setOption({harmonicHexagons: hex})}/>
        </div>
    </div>
}
