import './SemiCirclePicker.css';

interface SemiCirclePickerProps {
    min: number;
    max: number;
    current: number;
    step: number;
    onChange: (value: number) => void;
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

function getLabel(v: number, step: number, count: number, idx: number): string {
    if (!isWhole(step) && count > 5) {
        return isWhole(v) ? String(v) : '·';
    }
    if (isWhole(step) && count > 9) {
        return idx % 2 === 0 ? String(v) : '·';
    }
    return String(v);
}

const R = 100;
const CX = 140;
const CY = 120;
const W = 280;
const H = 145;

export function SemiCirclePicker({min, max, current, step, onChange}: SemiCirclePickerProps) {
    const options = generateOptions(min, max, step);
    const N = options.length;
    const arcPath = N > 1 ? `M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${CX + R} ${CY}` : '';

    return (
        <div class="semi-circle-picker" style={{width: `${W}px`, height: `${H}px`}}>
            <svg class="semi-circle-picker__arc" aria-hidden="true">
                {arcPath && <path d={arcPath} />}
            </svg>
            {options.map((v, i) => {
                const angle = N <= 1 ? Math.PI / 2 : Math.PI * (1 - i / (N - 1));
                const x = CX + R * Math.cos(angle);
                const y = CY - R * Math.sin(angle);
                const label = getLabel(v, step, N, i);
                const isDot = label === '·';
                const isSelected = Math.abs(v - current) < 0.001;

                return (
                    <button
                        key={v}
                        type="button"
                        aria-label={String(v)}
                        aria-pressed={isSelected}
                        class={
                            'toggle-btn toggle-btn--sm semi-circle-picker__option' +
                            (isDot ? ' semi-circle-picker__option--dot' : '') +
                            (isSelected ? ' selected' : '')
                        }
                        style={{left: `${x}px`, top: `${y}px`}}
                        onClick={() => onChange(v)}
                    >
                        {label}
                    </button>
                );
            })}
        </div>
    );
}
