import {CheckboxWithLabel} from "../components/CheckboxWithLabel.tsx";
import {Signal} from "@preact/signals";
import {FlexMapping} from "../base-model.ts";
import {onlySupportsWide} from "./layout-functions.ts";
import {AnsiVariant, LayoutOptions} from "../app-model.ts";

import {FlipRetRubButton} from "./components/FlipRetRubButton.tsx";

export interface AnsiLayoutOptionsProps {
    options: LayoutOptions;
    setOption: (opts: Partial<LayoutOptions>) => void;
    mapping: Signal<FlexMapping>;
}

const naturallyWideVariants = [AnsiVariant.AHKB, AnsiVariant.XHKB];

export function AnsiLayoutOptions({options, setOption, mapping}: AnsiLayoutOptionsProps) {
    const {ansiWide, ansiVariant, ansiSplit, angleMod} = options;
    const wideDisabled = onlySupportsWide(mapping.value) || naturallyWideVariants.includes(ansiVariant);
    const splitDisabled = ansiVariant === AnsiVariant.HHKB;
    const variantOptions = [
        {variant: AnsiVariant.IBM, label: "IBM"},
        {variant: AnsiVariant.APPLE, label: "Apple"},
        {variant: AnsiVariant.HHKB, label: "HHKB"},
        {variant: AnsiVariant.XHKB, label: "XHKB"},
        {variant: AnsiVariant.AHKB, label: "AHKB"},
    ];

    return <div class="ansi-layout-options-container">
        <CheckboxWithLabel label="split keyboard"
                           checked={ansiSplit}
                           onChange={(split) => setOption({ansiSplit: split})}
                           disabled={splitDisabled}/>
        <CheckboxWithLabel label="use wide key mapping"
                           checked={ansiWide}
                           onChange={(wide) => setOption({ansiWide: wide})}
                           disabled={wideDisabled}/>
        <div class="ansi-layout-variant-options">
            {variantOptions.map((option) => {
                const checked = ansiVariant === option.variant;
                const isAhkb = option.variant === AnsiVariant.AHKB;
                return <div class="ansi-variant-option" key={option.variant}>
                    <CheckboxWithLabel
                        type="radio"
                        groupName="ansi-variant"
                        label={option.label}
                        checked={checked}
                        onChange={(isChecked) => isChecked && setOption({ansiVariant: option.variant})}
                        disabled={false}
                    />
                    {isAhkb && checked &&
                        <div class="ansi-ahkb-options-container">
                            <CheckboxWithLabel
                                label="angle mod"
                                checked={angleMod}
                                onChange={(angleMod) => setOption({angleMod})}
                            />
                            <FlipRetRubButton setOption={setOption} options={options}/>
                        </div>
                    }
                </div>
            })}
        </div>
    </div>
}
