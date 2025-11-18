import {CheckboxWithLabel} from "../components/CheckboxWithLabel.tsx";
import {Signal} from "@preact/signals";
import {FlexMapping} from "../base-model.ts";
import {onlySupportsWide} from "./layout-functions.ts";

export interface AnsiLayoutOptionsProps {
    wide: boolean,
    apple: boolean,
    split: boolean,
    setWide: (wide: boolean) => void,
    setApple: (apple: boolean) => void,
    setSplit: (split: boolean) => void,
    mapping: Signal<FlexMapping>
}

export function AnsiLayoutOptions({wide, apple, split, setWide, setApple, setSplit, mapping}: AnsiLayoutOptionsProps) {
    const disabled = onlySupportsWide(mapping.value);
    return <div class="ansi-layout-options-container">
        <CheckboxWithLabel label="split keyboard" checked={split} onChange={setSplit} disabled={false}/>
        <CheckboxWithLabel label="use wide key mapping" checked={wide} onChange={setWide} disabled={disabled}/>
        <CheckboxWithLabel label="use Apple form factor" checked={apple} onChange={setApple} disabled={false}/>
    </div>
}
