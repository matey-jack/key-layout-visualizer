import {isCommandKey, isKeyboardSymbol, isKeyName} from "../mapping-functions.ts";
import {LayoutType} from "../model.ts";
import {fillMapping, isHomeKey, RowBasedLayoutModel} from "./layout-model.ts";
import {harmonicLayoutModel} from "./harmonicLayoutModel.ts";
import {ansiLayoutModel} from "./ansiLayoutModel.ts";
import {orthoLayoutModel} from "./orthoLayoutModel.ts";

const keyUnit = 100;
const keyboardTop = 0;
const keyboardLeft = 100;

// interface KeyboardDimensions {
//     keyboardSplit: number; // gap between halves in key units
//     // idea: for ISO and Harmonic put a little slider on the page to move them apart or together.
// }

interface KeyboardSvgProps {
    children?: preact.ComponentChildren;
}

// Our largest keyboards are 15u wide (split Iris CE), while all keyboards are 5u high.
// Adding 1u of wiggle room all around suggests a ratio of 7:17 for the SVG grid.
export const KeyboardSvg = (props: KeyboardSvgProps) =>
    <div>
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1700 500">
            {props.children}
        </svg>
    </div>

interface KeyProps {
    label: string;
    // labelShift and label3 later added only for non-keyboard-symbol keys.
    // Actually we only need that for very small keyboards like the Iris... and only for very few keys.
    // It's unrelated to the main focus of comparing casual key mappings and the Harmonic layout; so leave for later.
    // labelShifted?: string;
    // label3?: string;
    row: number; // integer; 0 for the top row (numbers), 4 for the bottom (modifiers).
    col: number; // those can be fractional, but are measured in 1u from the left-hand side, starting with 0.
    // thus 0,0 is the top left key (tilde on ISO, Escape on Harmonic, and Iris)
    width: number; // measured in units of height, with 1 being the default
    isHomeKey: boolean;
}

const keyPadding = 5;

export const Key = (props: KeyProps) => {
    const x = keyboardLeft + props.col * keyUnit + keyPadding;
    const y = keyboardTop + props.row * keyUnit + keyPadding;
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

    const keyClass = (!props.label) ? "unlabeled"
        : (isCommandKey(props.label)) ? "command-key"
            : (props.isHomeKey) ? "home-key"
            : "";
    return <g>
        <rect
            className={"key-outline " + keyClass}
            x={x}
            y={y}
            width={keyUnit * props.width - 2 * keyPadding}
            height={keyUnit - 2 * keyPadding}
        />
        {text}
    </g>
}

export interface KeyboardProps {
    mapping: string[];
    layoutModel?: RowBasedLayoutModel;
}

export function RowBasedKeyboard(props: KeyboardProps) {
    let model = props.layoutModel!!;
    let keys: preact.JSX.Element[] = [];
    const fullMapping = fillMapping(model, props.mapping);
    for (let row = 0; row < 5; row++) {
        let colPos = model.rowStart(row);
        keys.push(...fullMapping[row].map((label, col) => {
            const width = model.keyWidth(row, col);
            const key = <Key
                label={label}
                isHomeKey={isHomeKey(model, row, col)}
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


type KeyboardElementType = (props: KeyboardProps) => preact.JSX.Element;

export const LayoutElements: Record<LayoutType, KeyboardElementType | null> = {
    [LayoutType.ANSI]: (props) => RowBasedKeyboard({layoutModel: ansiLayoutModel, ...props}),
    [LayoutType.Harmonic]: (props) => RowBasedKeyboard({layoutModel: harmonicLayoutModel, ...props}),
    [LayoutType.Ortho]: (props) => RowBasedKeyboard({layoutModel: orthoLayoutModel, ...props}),
}
