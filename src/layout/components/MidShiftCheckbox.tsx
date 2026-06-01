import type {LayoutOptions} from "../../app-model.ts";
import {CheckboxWithLabel} from "../../components/CheckboxWithLabel.tsx";

type MidShiftCheckboxProps = {
    options: LayoutOptions;
    setOption: (opts: Partial<LayoutOptions>) => void;
}

export function MidShiftCheckbox({options, setOption}: MidShiftCheckboxProps) {
    return <CheckboxWithLabel label="Mid-shift"
                              checked={options.midShift}
                              onChange={(midShift) => setOption({midShift})}/>
}
