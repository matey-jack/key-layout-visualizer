import {Signal} from "@preact/signals";
import {CheckboxWithLabel} from "../components/CheckboxWithLabel.tsx";
import {AnsiLayoutOptionsModel} from "./ansiLayoutModel.ts";

export interface AnsiLayoutOptionsProps {
    options: Signal<AnsiLayoutOptionsModel>,
}

export function AnsiLayoutOptions({options}: AnsiLayoutOptionsProps) {
    return <>
        <CheckboxWithLabel
            label="use wide key mapping"
            checked={options.value.wide}
            onChange={(checked) => options.value = {...options.value, wide: checked}}
        />
    </>
}