import {type LayoutOptions} from "../app-model.ts";
import {MidShiftCheckbox} from "./components/MidShiftCheckbox.tsx";

export interface SplitOrthoLayoutOptionsProps {
    options: LayoutOptions;
    setOption: (opts: Partial<LayoutOptions>) => void;
}

export function SplitOrthoLayoutOptions({options, setOption}: SplitOrthoLayoutOptionsProps) {
    return <div class="split-ortho-layout-options-container">
        <MidShiftCheckbox options={options} setOption={setOption}/>
    </div>
}
