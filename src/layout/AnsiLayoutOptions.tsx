import type {Signal} from "@preact/signals";
import {AnsiVariant, type LayoutOptions} from "../app-model.ts";
import type {FlexMapping} from "../base-model.ts";
import {CheckboxWithLabel} from "../components/CheckboxWithLabel.tsx";
import {LayoutVariantButton} from "../components/LayoutVariantButton.tsx";
import {FlipRetRubButton} from "./components/FlipRetRubButton.tsx";
import {MidShiftCheckbox} from "./components/MidShiftCheckbox.tsx";
import {onlySupportsWide} from "./layout-functions.ts";

export interface AnsiLayoutOptionsProps {
    options: LayoutOptions;
    setOption: (opts: Partial<LayoutOptions>) => void;
    mapping: Signal<FlexMapping>;
}

const naturallyWideVariants = [AnsiVariant.AHKB, AnsiVariant.XHKB];

function ansiVariantNote(variant: AnsiVariant, wide: boolean): string {
    const denom = wide ? "3" : "2";
    switch (variant) {
        case AnsiVariant.IBM:   return `15/${denom}`;
        case AnsiVariant.APPLE: return `14.5/${denom}`;
        case AnsiVariant.HHKB:  return `15/${denom}`;
        case AnsiVariant.AN65:  return `16/${denom}`;
        case AnsiVariant.XHKB:  return `15/4 or 16/5`;
        default: return "";
    }
}

export function AnsiLayoutOptions({options, setOption, mapping}: AnsiLayoutOptionsProps) {
    const {ansiWide, ansiVariant, ansiSplit, angleMod, thumbsUp16} = options;
    const wideDisabled = onlySupportsWide(mapping.value) || naturallyWideVariants.includes(ansiVariant);
    const splitDisabled = (ansiVariant === AnsiVariant.HHKB) ||
        ((ansiVariant === AnsiVariant.XHKB) && thumbsUp16);
    const setVariant = (variant: AnsiVariant) => setOption({ansiVariant: variant});
    const variantOptions = [
        {variant: AnsiVariant.IBM, label: "IBM"},
        {variant: AnsiVariant.APPLE, label: "Apple"},
        {variant: AnsiVariant.HHKB, label: "HHKB"},
        {variant: AnsiVariant.AN65, label: "AN65"},
        {variant: AnsiVariant.XHKB, label: "❤️ Thumbs Up"},
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
                        note={ansiVariantNote(option.variant, ansiWide)}
                    >
                        {(option.variant === AnsiVariant.IBM || option.variant === AnsiVariant.APPLE) &&
                            <MidShiftCheckbox options={options} setOption={setOption}/>
                        }
                        {option.variant === AnsiVariant.XHKB &&
                            <div class="ansi-ahkb-options-container">
                                <CheckboxWithLabel
                                    label="15/4"
                                    type="radio"
                                    groupName="thumbs_up_variant"
                                    checked={!thumbsUp16}
                                    onChange={(checked) => checked && setOption({thumbsUp16: false})}
                                />
                                <CheckboxWithLabel
                                    label="16/5"
                                    type="radio"
                                    groupName="thumbs_up_variant"
                                    checked={thumbsUp16}
                                    onChange={(checked) => checked && setOption({thumbsUp16: true})}
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
