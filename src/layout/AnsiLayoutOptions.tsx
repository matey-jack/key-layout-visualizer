import {CheckboxWithLabel} from "../components/CheckboxWithLabel.tsx";
import {Signal} from "@preact/signals";
import {FlexMapping} from "../base-model.ts";
import {onlySupportsWide} from "./layout-functions.ts";

export interface AnsiLayoutOptionsProps {
    wide: boolean,
    setWide: (wide: boolean) => void,
    mapping: Signal<FlexMapping>
}

export function AnsiLayoutOptions({wide, setWide, mapping}: AnsiLayoutOptionsProps) {
    const disabled = onlySupportsWide(mapping.value);
    return <>
        <CheckboxWithLabel label="use wide key mapping" checked={wide} onChange={setWide} disabled={disabled}/>
    </>
}
