import {CheckboxWithLabel} from "../components/CheckboxWithLabel.tsx";

export interface AnsiLayoutOptionsProps {
    wide: boolean;
    setWide: (wide: boolean) => void;
}

export function AnsiLayoutOptions({wide, setWide}: AnsiLayoutOptionsProps) {
    return <>
        <CheckboxWithLabel label="use wide key mapping" checked={wide} onChange={setWide}/>
    </>
}
