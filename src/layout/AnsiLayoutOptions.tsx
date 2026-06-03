import type {Signal} from "@preact/signals";
import {AnsiVariant, type LayoutOptions} from "../app-model.ts";
import type {FlexMapping} from "../base-model.ts";
import {CheckboxWithLabel} from "../components/CheckboxWithLabel.tsx";
import {LayoutVariantButton} from "../components/LayoutVariantButton.tsx";
import {MidShiftCheckbox} from "./components/MidShiftCheckbox.tsx";
import {onlySupportsWide} from "./layout-functions.ts";

export interface AnsiLayoutOptionsProps {
    options: LayoutOptions;
    setOption: (opts: Partial<LayoutOptions>) => void;
    mapping: Signal<FlexMapping>;
}

const naturallyWideVariants = [AnsiVariant.XHKB];

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
    const {ansiWide, ansiVariant, ansiSplit, thumbsUp16} = options;
    const wideDisabled = onlySupportsWide(mapping.value) || naturallyWideVariants.includes(ansiVariant);
    const splitDisabled = (ansiVariant === AnsiVariant.HHKB) ||
        ((ansiVariant === AnsiVariant.XHKB) && thumbsUp16);
    const setVariant = (variant: AnsiVariant) => setOption({ansiVariant: variant});
    const variantOptions = [
        {variant: AnsiVariant.IBM, label: "IBM"},
        {variant: AnsiVariant.APPLE, label: "Apple"},
        {variant: AnsiVariant.HHKB, label: "HHKB"},
        {variant: AnsiVariant.AN65, label: "AN65"},
        // &nbsp; in a string will be output literally, so use Unicode instead.
        {variant: AnsiVariant.XHKB, label: "Thumbs Up\u00A0❤️"},
    ];

    return <div class="ansi-options">
            <div class="layout-variant-grid layout-variant-grid--ansi">
                {variantOptions.map((option) => (
                    <LayoutVariantButton
                        key={option.variant}
                        variant={option.variant}
                        currentVariant={ansiVariant}
                        setVariant={setVariant}
                        name={option.label}
                        note={ansiVariantNote(option.variant, ansiWide)}
                        shareSpace={option.variant === AnsiVariant.XHKB}
                    >
                        {(option.variant === AnsiVariant.IBM || option.variant === AnsiVariant.APPLE) &&
                            <div class="layout-option-row">
                                <div class="layout-option-column">
                                    <MidShiftCheckbox options={options} setOption={setOption}/>
                                </div>
                            </div>
                        }
                        {option.variant === AnsiVariant.XHKB &&
                            <div class="layout-option-row">
                                <div class="layout-option-column">
                                    <div class="layout-option-button-group">
                                        <button type="button"
                                                class={"toggle-btn toggle-btn--sm" + (!thumbsUp16 ? " selected" : "")}
                                                onClick={() => setOption({thumbsUp16: false})}>
                                            15/4
                                        </button>
                                        <button type="button"
                                                class={"toggle-btn toggle-btn--sm" + (thumbsUp16 ? " selected" : "")}
                                                onClick={() => setOption({thumbsUp16: true})}>
                                            16/5
                                        </button>
                                    </div>
                                </div>
                            </div>
                        }
                    </LayoutVariantButton>
                ))}
            </div>
            <div class="layout-option-checkboxes">
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
