import {isCommandKey, isKeyboardSymbol, isKeyName} from "../mapping/mapping-functions.ts";
import {isHomeKey, lettersAndVIP} from "./layout-functions.ts";
import {
    BigramMovement,
    BigramType,
    Finger,
    KeyPosition,
    MappingChange,
    RowBasedLayoutModel,
    VisualizationType
} from "../base-model.ts";
import {ComponentChildren} from "preact";

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
const keyRibbonPaddingH = 17;
const keyRibbonPaddingV = 1;

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
        <rect class={"key-ribbon " + ribbonClass}
              x={x + keyRibbonPaddingV}
              y={y + keyRibbonPaddingH}
              width={keyUnit * width - 2 * (keyPadding + keyRibbonPaddingV)}
              height={keyUnit - 2 * (keyPadding + keyRibbonPaddingH)}
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
    mappingDiff: Record<string, MappingChange>;
    keyPositions: KeyPosition[];
    vizType: VisualizationType;
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

const bgClassByFinger: Record<Finger, string> = {
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

function getFingeringClasses(layoutModel: RowBasedLayoutModel, row: number, col: number, label: string) {
    const bgClass = bgClassByFinger[layoutModel.mainFingerAssignment[row][col]];
    const borderClass = isHomeKey(layoutModel, row, col) ? "home-key-border"
        : isCommandKey(label) ? "command-key-border"
            : "";
    return bgClass + " " + borderClass;
}

export function RowBasedKeyboard({layoutModel, keyPositions, mappingDiff, vizType}: KeyboardProps) {
    return keyPositions.map(({label, row, col, colPos}) => {
        const width = layoutModel.keyWidth(row, col);
        const bgClass = vizType == VisualizationType.LayoutKeyEffort ? getEffortClass(layoutModel.singleKeyEffort[row][col])
            : vizType == VisualizationType.LayoutFingering && !isNaN(layoutModel.mainFingerAssignment[row][col])
                ? getFingeringClasses(layoutModel, row, col, label)
                : isHomeKey(layoutModel, row, col) ? "home-key"
                    : "";
        const ribbonClass = vizType == VisualizationType.MappingDiff && lettersAndVIP.test(label)
            ? ribbonClassByDiff[mappingDiff[label]]
            : undefined;
        return <Key
            label={label}
            backgroundClass={bgClass}
            ribbonClass={ribbonClass}
            row={row}
            col={colPos}
            width={width}
            key={row + ',' + col}
        />
    })
}

export const bigramClassByType: Record<BigramType, string> = {
    [BigramType.SameRow]: "same-row",
    [BigramType.NeighboringRow]: "neighboring-row",
    [BigramType.OppositeRow]: "opposite-row",
    [BigramType.OppositeLateral]: "opposite-lateral",
    [BigramType.AltFinger]: "alt-finger",
    [BigramType.SameFinger]: "same-finger-bigram",
    [BigramType.OtherHand]: "",
    [BigramType.InvolvesThumb]: ""
}

export interface BigramLinesProps {
    bigrams: BigramMovement[];
}

export function BigramLines({bigrams}: BigramLinesProps) {
    return bigrams.map((pair) => {
                const offset = Math.abs(pair.a.col - pair.b.col);
                return pair.draw && <line
                    x1={keyUnit * (pair.a.colPos + 0.5)} y1={keyUnit * (pair.a.row + 0.5 - offset / 10)}
                    x2={keyUnit * (pair.b.colPos + 0.5)} y2={keyUnit * (pair.b.row + 0.5)}
                    className={`bigram-line bigram-rank-${pair.rank} ` + bigramClassByType[pair.type]}/>
            });
}