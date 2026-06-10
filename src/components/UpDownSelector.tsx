import type {Signal} from '@preact/signals';
import './UpDownSelector.css';

interface UpDownSelectorProps {
    value: Signal<number>;
    permittedValues: number[];
}

export function UpDownSelector({value, permittedValues}: UpDownSelectorProps) {
    const idx = permittedValues.indexOf(value.value);
    const atStart = idx <= 0;
    const atEnd = idx >= permittedValues.length - 1;

    return (
        <div class="up-down-selector">
            <button
                type="button"
                class="toggle-btn up-down-button"
                disabled={atStart}
                onClick={() => { if (!atStart) value.value = permittedValues[idx - 1]; }}
            >‹</button>
            <span class="up-down-selector__value">{value.value}</span>
            <button
                type="button"
                class="toggle-btn up-down-button"
                disabled={atEnd}
                onClick={() => { if (!atEnd) value.value = permittedValues[idx + 1]; }}
            >›</button>
        </div>
    );
}
