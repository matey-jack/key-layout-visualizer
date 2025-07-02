import {isCommandKey, isKeyboardSymbol, isKeyName} from "../mapping-functions.ts";
import {fillMapping, isHomeKey, lettersAndVIP, MappingChange, RowBasedLayoutModel} from "./layout-model.ts";
import {sum} from '../library/math.ts';
import {FlexMapping} from "../mapping/mapping-model.ts";

interface KeyboardSvgProps {
    children?: preact.ComponentChildren;
}

// Our largest keyboards are 15u wide (split Iris CE), while all keyboards are 5u high.
// Adding 1u of wiggle room all around suggests a ratio of 7:17 for the SVG grid.
export const KeyboardSvg = (props: KeyboardSvgProps) =>
    <div>
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1700 500" class="keyboard-svg">
            {props.children}
        </svg>
    </div>

// keep in sync with KeyboardSvg.viewBox
const totalWidth = 17;
// in key units
const horizontalPadding = 0.5;

interface KeyProps {
    label: string;
    // labelShift and label3 later added only for non-keyboard-symbol keys.
    // Actually we only need that for very small keyboards like the Iris... and only for very few keys.
    // It's unrelated to the main focus of comparing casual key mappings and the Harmonic layout; so leave for later.
    // labelShifted?: string;
    // label3?: string;
    row: number; // integer; 0 for the top row (numbers), 4 for the bottom (modifiers).
    col: number; // those can be fractional, but are measured in 1u from the left-hand side, starting with 0.
    // thus 0,0 is the top left key (tilde on ANSI, Escape on Harmonic, and Iris)
    width: number; // measured in units of height, with 1 being the default
    isHomeKey: boolean;
    diff?: MappingChange;
}

const keyUnit = 100;
const keyPadding = 5;
const keyOverlayPaddingH = 17;
const keyOverlayPaddingV = 1;

// can't use enum values in const expressions, so we use Array instead of object.
const keyClassByDiff = [null, "same-finger", "same-hand", "swap-hands"];

export const Key = (props: KeyProps) => {
    const x = props.col * keyUnit + keyPadding;
    const y = props.row * keyUnit + keyPadding;
    const labelClass =
        isKeyboardSymbol(props.label) ? "keyboard-symbol"
            : isKeyName(props.label) ? "key-name"
                : "";
    const text = (labelClass) ?
        <text x={x + keyUnit * props.width / 2} y={y + keyUnit / 2} className={"key-label " + labelClass}>
            {props.label}
        </text>
        :
        <text x={x + 20} y={y + 60} className="key-label">
            {props.label}
        </text>

    const keyClassByType = (!props.label) ? "unlabeled"
        : (isCommandKey(props.label)) ? "command-key"
            : (props.isHomeKey) ? "home-key"
            : "";
    const diffOverlay = (props.diff === undefined || props.diff === MappingChange.SamePosition) ? <></>
        : <rect class={"key-overlay " + keyClassByDiff[props.diff]!!}
                x={x + keyOverlayPaddingV}
                y={y + keyOverlayPaddingH}
                width={keyUnit * props.width - 2 * (keyPadding + keyOverlayPaddingV)}
                height={keyUnit - 2 * (keyPadding + keyOverlayPaddingH)}
        />
    return <g>
        <rect
            className={"key-outline " + keyClassByType}
            x={x}
            y={y}
            width={keyUnit * props.width - 2 * keyPadding}
            height={keyUnit - 2 * keyPadding}
        />
        {diffOverlay}
        {text}
    </g>
}

export interface KeyboardProps {
    layoutModel: RowBasedLayoutModel;
    flexMapping: FlexMapping;
    mappingDiff: Record<string, MappingChange>;
    // We split all keyboards by moving their outer edges to a width of 17 units.
    // In both split and unsplit case, the keyboard will be centered.
    split: boolean;
}

export function RowBasedKeyboard({flexMapping, layoutModel, mappingDiff, split}: KeyboardProps) {
    const fullMapping = fillMapping(layoutModel, flexMapping);
    const rowWidth = fullMapping.map( (row, r) =>
        2 * (horizontalPadding + layoutModel.rowStart(r)) + sum(row.map((_, c) => layoutModel.keyWidth(r, c)))
    );
    let keys: preact.JSX.Element[] = [];
    for (let row = 0; row < 5; row++) {
        let colPos = horizontalPadding + layoutModel.rowStart(row);
        if (!split) colPos += (totalWidth - rowWidth[row]) / 2;
        keys.push(...fullMapping[row].map((label, col) => {
            // idea: use splitColums special value "+" for lengthening the middle key across the split and "/" for splitting the key at the exact midpoint.
            if (split && (col==layoutModel.splitColumns[row])) colPos += totalWidth - rowWidth[row];
            const width = layoutModel.keyWidth(row, col);
            const key = <Key
                label={label}
                isHomeKey={isHomeKey(layoutModel, row, col)}
                diff={lettersAndVIP.test(label) ? mappingDiff[label] : undefined}
                row={row}
                col={colPos}
                width={width}
                key={row + ',' + col}
            />
            colPos += width;
            return key;
        }));
    }
    return <>{keys.flat()}</>
}
