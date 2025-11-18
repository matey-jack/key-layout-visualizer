import {CheckboxWithLabel} from "../components/CheckboxWithLabel.tsx";
import {Signal} from "@preact/signals";
import {FlexMapping} from "../base-model.ts";
import {onlySupportsWide} from "./layout-functions.ts";

export interface AnsiLayoutOptionsProps {
    wide: boolean,
    apple: boolean,
    setWide: (wide: boolean) => void,
    setApple: (apple: boolean) => void,
    mapping: Signal<FlexMapping>
}

export function AnsiLayoutOptions({wide, apple, setWide, setApple, mapping}: AnsiLayoutOptionsProps) {
    const disabled = onlySupportsWide(mapping.value);
    return <>
        <CheckboxWithLabel label="use wide key mapping" checked={wide} onChange={setWide} disabled={disabled}/>
        <CheckboxWithLabel label="use Apple form factor" checked={apple} onChange={setApple} disabled={false}/>
    </>
}
