import {isCommandKey, isKeyboardSymbol, isKeyName} from "../mapping/mapping-functions.ts";
import {fillMapping, isHomeKey, lettersAndVIP} from "./layout-functions.ts";
import {sum} from '../library/math.ts';
import {Finger, FlexMapping, MappingChange, RowBasedLayoutModel, VisualizationType} from "../base-model.ts";
import {ComponentChildren, JSX} from "preact";

interface KeyboardSvgProps {
    children?: ComponentChildren;
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

    backgroundClass: string;
    // There will be no ribbon element, when there is no ribbon class.
    // Otherwise, the <rect> will be the same, only the class will be the provided one.
    ribbonClass?: string;
    //diff?: MappingChange;
}

const keyUnit = 100;
const keyPadding = 5;
const keyOverlayPaddingH = 17;
const keyOverlayPaddingV = 1;

export function Key({col, ribbonClass, backgroundClass, label, row, width}: KeyProps) {
    const x = col * keyUnit + keyPadding;
    const y = row * keyUnit + keyPadding;
    const labelClass =
        isKeyboardSymbol(label) ? "keyboard-symbol"
            : isKeyName(label) ? "key-name"
                : "";
    const text = (labelClass) ?
        <text x={x + keyUnit * width / 2} y={y + keyUnit / 2} className={"key-label " + labelClass}>
            {label}
        </text>
        :
        <text x={x + 20} y={y + 60} className="key-label">
            {label}
        </text>

    const bgClass = backgroundClass ? backgroundClass
        : !label ? "unlabeled"
            : isCommandKey(label) ? "command-key"
                : "";

    const keyRibbon = ribbonClass &&
        <rect class={"key-overlay " + ribbonClass}
              x={x + keyOverlayPaddingV}
              y={y + keyOverlayPaddingH}
              width={keyUnit * width - 2 * (keyPadding + keyOverlayPaddingV)}
              height={keyUnit - 2 * (keyPadding + keyOverlayPaddingH)}
        />
    return <g>
        <rect
            className={"key-outline " + bgClass}
            x={x}
            y={y}
            width={keyUnit * width - 2 * keyPadding}
            height={keyUnit - 2 * keyPadding}
        />
        {keyRibbon}
        {text}
    </g>
}

export interface KeyboardProps {
    layoutModel: RowBasedLayoutModel;
    flexMapping: FlexMapping;
    mappingDiff: Record<string, MappingChange>;
    vizType: VisualizationType;
    // We split all keyboards by moving their outer edges to a width of 17 units.
    // In both split and unsplit case, the keyboard will be centered.
    split: boolean;
}

export function getEffortClass(effort: number) {
    if (isNaN(effort)) return "";
    if (effort < 1) return "home-key";
    return "effort-" + (effort * 10);
}

const ribbonClassByDiff: Record<MappingChange, string | undefined> = {
    [MappingChange.SamePosition]: undefined,
    [MappingChange.SameFinger]: "same-finger",
    [MappingChange.SameHand]: "same-hand",
    [MappingChange.SwapHands]: "swap-hands",
};

const ribbonClassByFinger: Record<Finger, string> = {
    [Finger.LThumb]: "lthumb",
    [Finger.RThumb]: "rthumb",
    [Finger.LIndex]: "lindex",
    [Finger.RIndex]: "rindex",
    [Finger.LMiddle]: "middy",
    [Finger.RMiddle]: "middy",
    [Finger.LRing]: "ringy",
    [Finger.RRing]: "ringy",
    [Finger.LPinky]: "pinky",
    [Finger.RPinky]: "pinky",
};

export function RowBasedKeyboard({flexMapping, layoutModel, mappingDiff, vizType, split}: KeyboardProps) {
    const fullMapping = fillMapping(layoutModel, flexMapping);
    const rowWidth = fullMapping.map((row, r) =>
        2 * (horizontalPadding + layoutModel.rowStart(r)) + sum(row.map((_, c) => layoutModel.keyWidth(r, c)))
    );
    let keys: JSX.Element[] = [];
    for (let row = 0; row < 5; row++) {
        let colPos = horizontalPadding + layoutModel.rowStart(row);
        if (!split) colPos += (totalWidth - rowWidth[row]) / 2;
        fullMapping[row].forEach((label, col) => {
            // to show the board as split, add some extra space after the split column.
            if (split && (col == layoutModel.splitColumns[row])) colPos += totalWidth - rowWidth[row];
            const width = layoutModel.keyWidth(row, col);
            const bgClass = vizType == VisualizationType.LayoutEffort ? getEffortClass(layoutModel.singleKeyEffort[row][col])
                : isHomeKey(layoutModel, row, col) ? "home-key"
                    : "";
            const ribbonClass = vizType == VisualizationType.MappingDiff && lettersAndVIP.test(label)
                ? ribbonClassByDiff[mappingDiff[label]]
                : vizType == VisualizationType.LayoutFingering && !isNaN(layoutModel.mainFingerAssignment[row][col])
                    ? ribbonClassByFinger[layoutModel.mainFingerAssignment[row][col]]
                    : undefined;
            const key = <Key
                label={label}
                backgroundClass={bgClass}
                ribbonClass={ribbonClass}
                row={row}
                col={colPos}
                width={width}
                key={row + ',' + col}
            />
            colPos += width;
            keys.push(key);
        });
    }
    return <>{keys}</>
}
