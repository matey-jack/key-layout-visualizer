import type {LayoutOptions} from "../app-model.ts";
import {CheckboxWithLabel} from "../components/CheckboxWithLabel.tsx";

export interface SplitOrthoLayoutOptionsProps {
    options: LayoutOptions;
    setOption: (opts: Partial<LayoutOptions>) => void;
}

export function SplitOrthoLayoutOptions({options, setOption}: SplitOrthoLayoutOptionsProps) {
    return <div class="split-ortho-layout-options-container">
        <CheckboxWithLabel label="Thumb Shift"
                           checked={options.soThumbShift}
                           onChange={(checked) => setOption({soThumbShift: checked})}/>
    </div>
}
