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

export function AnsiLayoutOptions({options, setOption, mapping}: AnsiLayoutOptionsProps) {
    const {ansiWide, ansiVariant, ansiSplit, angleMod} = options;
    const wideDisabled = onlySupportsWide(mapping.value) || ansiVariant === AnsiVariant.ANSI_AHKB;
    const splitDisabled = ansiVariant === AnsiVariant.ANSI_HHKB;
    const variantOptions = [
        {variant: AnsiVariant.ANSI_IBM, label: "IBM"},
        {variant: AnsiVariant.ANSI_APPLE, label: "Apple"},
        {variant: AnsiVariant.ANSI_HHKB, label: "HHKB"},
        {variant: AnsiVariant.ANSI_AHKB, label: "AHKB"},
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
                const isAhkb = option.variant === AnsiVariant.ANSI_AHKB;
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
                        <div class="ansi-ahkb-angle-option">
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
