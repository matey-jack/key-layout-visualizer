import {CheckboxWithLabel} from "../components/CheckboxWithLabel.tsx";
import {Signal} from "@preact/signals";
import {FlexMapping} from "../base-model.ts";
import {onlySupportsWide} from "./layout-functions.ts";
import {AnsiVariant} from "../app-model.ts";

export interface AnsiLayoutOptionsProps {
    wide: boolean;
    variant: AnsiVariant;
    split: boolean;
    setWide: (wide: boolean) => void;
    setVariant: (variant: AnsiVariant) => void;
    setSplit: (split: boolean) => void;
    mapping: Signal<FlexMapping>;
}

export function AnsiLayoutOptions(props: AnsiLayoutOptionsProps) {
    const {wide, variant, split, setWide, setVariant, setSplit, mapping} = props;
    const wideDisabled = onlySupportsWide(mapping.value) || variant === AnsiVariant.ANSI_AHKB;
    const splitDisabled = variant === AnsiVariant.ANSI_HHKB;
    const variantOptions = [
        {variant: AnsiVariant.ANSI_IBM, label: "IBM"},
        {variant: AnsiVariant.ANSI_APPLE, label: "Apple"},
        {variant: AnsiVariant.ANSI_HHKB, label: "HHKB"},
        {variant: AnsiVariant.ANSI_AHKB, label: "AHKB"},
    ];

    return <div class="ansi-layout-options-container">
        <CheckboxWithLabel label="split keyboard" checked={split} onChange={setSplit} disabled={splitDisabled}/>
        <CheckboxWithLabel label="use wide key mapping" checked={wide} onChange={setWide} disabled={wideDisabled}/>
        <div class="ansi-layout-variant-options">
            {variantOptions.map((option) =>
                <CheckboxWithLabel
                    key={option.variant}
                    type="radio"
                    groupName="ansi-variant"
                    label={option.label}
                    checked={variant === option.variant}
                    onChange={(checked) => checked && setVariant(option.variant)}
                    disabled={false}
                />
            )}
        </div>
    </div>
}
