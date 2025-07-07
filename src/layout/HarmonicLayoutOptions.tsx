import {Signal} from "@preact/signals";
import {HarmonicLayoutOptionsModel} from "./harmonic13cLayoutModel.ts";

export interface HarmonicLayoutOptionsProps {
    options: Signal<HarmonicLayoutOptionsModel>,
}

export function HarmonicLayoutOptions({options}: HarmonicLayoutOptionsProps) {
    const compact = options.value.h13c;
    const setCompact = (compact: boolean) =>
        options.value = {...options.value, h13c: compact};
    return <div>
        <button
            class={"layout-options-button" + (compact ? " selected" : "")}
            onClick={() => setCompact(true)}
        >
            Compact
        </button>
        <button
            class={"layout-options-button" + (!compact ? " selected" : "")}
            onClick={() => setCompact(false)}
        >
            Traditional
        </button>
    </div>
}
