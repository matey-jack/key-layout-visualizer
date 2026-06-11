import './NumberPicker.css';
import {formatStagger} from '../semi-ergo-gen/seg-model.ts';

interface NumberPickerProps {
    min: number;
    max: number;
    current: number;
    step: number;
    onChange: (value: number) => void;
    semicircular?: boolean;
    /** Cyclic pattern: '.' → dot, any other char → label. E.g. "x." → label, dot, label, dot, … */
    dotPattern?: string;
}

function generateOptions(min: number, max: number, step: number): number[] {
    const count = Math.round((max - min) / step) + 1;
    return Array.from({length: count}, (_, i) =>
        Math.round((min + i * step) * 1e6) / 1e6
    );
}

function isWhole(v: number): boolean {
    return Math.abs(v - Math.round(v)) < 0.001;
}

function getLabel(v: number, step: number, count: number, idx: number, dotPattern?: string): string {
    const val = formatStagger(v);
    if (dotPattern) {
        return dotPattern[idx % dotPattern.length] === '.' ? '·' : val;
    }
    if (!isWhole(step) && count > 5) {
        return isWhole(v) ? val : '·';
    }
    if (isWhole(step) && count > 9) {
        return idx % 2 === 0 ? val : '·';
    }
    return val;
}

const R = 100;
const CX = 140;
const CY = 120;
const ARC_W = 280;
const ARC_H = 145;

export function NumberPicker({min, max, current, step, onChange, semicircular, dotPattern}: NumberPickerProps) {
    const options = generateOptions(min, max, step);
    const N = options.length;

    const renderButton = (v: number, i: number, arcStyle?: {left: string; top: string}) => {
        const label = getLabel(v, step, N, i, dotPattern);
        const isDot = label === '·';
        const isSelected = Math.abs(v - current) < 0.001;
        return (
            <button
                key={v}
                type="button"
                aria-label={String(v)}
                aria-pressed={isSelected}
                class={
                    'toggle-btn toggle-btn--sm number-picker__option' +
                    (isDot ? ' number-picker__option--dot' : '') +
                    (isSelected ? ' selected' : '')
                }
                style={arcStyle}
                onClick={() => onChange(v)}
            >
                {label}
            </button>
        );
    };

    if (semicircular) {
        const arcPath = N > 1 ? `M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${CX + R} ${CY}` : '';
        return (
            <div class="number-picker number-picker--arc" style={{width: `${ARC_W}px`, height: `${ARC_H}px`}}>
                <svg class="number-picker__arc" aria-hidden="true">
                    {arcPath && <path d={arcPath} />}
                </svg>
                {options.map((v, i) => {
                    const angle = N <= 1 ? Math.PI / 2 : Math.PI * (1 - i / (N - 1));
                    const x = CX + R * Math.cos(angle);
                    const y = CY - R * Math.sin(angle);
                    return renderButton(v, i, {left: `${x}px`, top: `${y}px`});
                })}
            </div>
        );
    }

    return (
        <div class="number-picker number-picker--linear">
            {options.map((v, i) => renderButton(v, i))}
        </div>
    );
}
