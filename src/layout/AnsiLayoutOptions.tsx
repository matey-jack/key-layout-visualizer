import type {Signal} from "@preact/signals";
import {AnsiVariant, type LayoutOptions} from "../app-model.ts";
import type {FlexMapping} from "../base-model.ts";
import {CheckboxWithLabel} from "../components/CheckboxWithLabel.tsx";
import {LayoutVariantButton} from "../components/LayoutVariantButton.tsx";
import {FlipRetRubButton} from "./components/FlipRetRubButton.tsx";
import {onlySupportsWide} from "./layout-functions.ts";

export interface AnsiLayoutOptionsProps {
    options: LayoutOptions;
    setOption: (opts: Partial<LayoutOptions>) => void;
    mapping: Signal<FlexMapping>;
}

const naturallyWideVariants = [AnsiVariant.AHKB, AnsiVariant.ERGO_KB];

export function AnsiLayoutOptions({options, setOption, mapping}: AnsiLayoutOptionsProps) {
    const {ansiWide, ansiVariant, ansiSplit, angleMod} = options;
    const wideDisabled = onlySupportsWide(mapping.value) || naturallyWideVariants.includes(ansiVariant);
    const splitDisabled = ansiVariant === AnsiVariant.HHKB;
    const setVariant = (variant: AnsiVariant) => setOption({ansiVariant: variant});
    const variantOptions = [
        {variant: AnsiVariant.IBM, label: "IBM"},
        {variant: AnsiVariant.APPLE, label: "Apple"},
        {variant: AnsiVariant.HHKB, label: "HHKB"},
        {variant: AnsiVariant.ERGO_KB, label: "❤️ Thumbs Up"},
        // {variant: AnsiVariant.AHKB, label: "AHKB"},
    ];

    return <div class="ansi-layout-options-container">
            <div class="ansi-variant-buttons">
                {variantOptions.map((option) => (
                    <LayoutVariantButton 
                        key={option.variant}
                        variant={option.variant}
                        currentVariant={ansiVariant}
                        setVariant={setVariant}
                        name={option.label}
                    >
                        {option.variant === AnsiVariant.ERGO_KB &&
                            <div class="ansi-ahkb-options-container">
                                <CheckboxWithLabel
                                    label="Include arrow keys"
                                    checked={options.bottomArrows}
                                    onChange={(arrows) => setOption({bottomArrows: arrows})}
                                />
                            </div>
                        }
                        {option.variant === AnsiVariant.AHKB &&
                            <div class="ansi-ahkb-options-container">
                                <CheckboxWithLabel
                                    label="angle mod"
                                    checked={angleMod}
                                    onChange={(angleMod) => setOption({angleMod})}
                                />
                                <FlipRetRubButton setOption={setOption} options={options}/>
                            </div>
                        }
                    </LayoutVariantButton>
                ))}
            </div>
            <div class="ansi-variant-checkboxes">
                <CheckboxWithLabel label="split keyboard"
                                   checked={ansiSplit}
                                   onChange={(split) => setOption({ansiSplit: split})}
                                   disabled={splitDisabled}/>
                <CheckboxWithLabel label="use wide key mapping"
                                   checked={ansiWide}
                                   onChange={(wide) => setOption({ansiWide: wide})}
                                   disabled={wideDisabled}/>
            </div>
    </div>
}
