import {isCommandKey, isKeyboardSymbol, isKeyName} from "../mapping/mapping-functions.ts";
import {
    defaultKeyColor, getKeySizeClass,
    isHomeKey,
    keyCapHeight,
    keyCapWidth,
    lettersAndVIP
} from "./layout-functions.ts";
import {
    type BigramMovement,
    BigramType,
    Finger,
    KeyboardRows,
    type KeyMovement,
    MappingChange,
    type RowBasedLayoutModel,
    VisualizationType
} from "../base-model.ts";
import type {ComponentChildren, JSX} from "preact";
import {singleCharacterFrequencies} from "../frequencies/english-single-character-frequencies.ts";

interface KeyboardSvgProps {
    children?: ComponentChildren;
}

// Our largest keyboards are 16u wide (Ergoboard), while all keyboards are 5u high.
// Adding 1u of wiggle room all around suggests a ratio of 7:17 for the SVG grid.
export const KeyboardSvg = (props: KeyboardSvgProps) =>
    <div>
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1700 500" class="keyboard-svg">
            <title>Keyboard Layout Diagram</title>
            {props.children}
        </svg>
    </div>

interface KeyProps {
    label: string,
    row: KeyboardRows,
    col: number, // Measured in key units from the left hand side starting with 0. Can be fractional!
    width: number,
    height: number,
    backgroundClass: string,
    // There will be no ribbon element, when there is no ribbon class.
    ribbonClass?: string,
    frequencyCircleRadius?: number,
    showHomeMarker: boolean,
    prevRow?: KeyboardRows,
    prevCol?: number,
}

const keyUnit = 100;
const keyPadding = 5;
const keyRibbonPaddingH = 17;
const keyRibbonPaddingV = 1;

// SVG viewBox center for calculating radial entry/exit points
const svgCenterX = 850;
const svgCenterY = 250;

/**
 * Calculate a position outside the SVG boundary on a radial line from the center through the given point.
 */
function getRadialExitPoint(x: number, y: number): {x: number, y: number} {
    const dx = x - svgCenterX;
    const dy = y - svgCenterY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    // Multiply by a factor to push the point well outside the visible area
    const factor = distance > 0 ? 2000 / distance : 2000;
    return {
        x: svgCenterX + dx * factor,
        y: svgCenterY + dy * factor
    };
}

export function Key({label, row, col, width, height, backgroundClass, ribbonClass, frequencyCircleRadius, showHomeMarker, prevRow, prevCol}: KeyProps) {
    const x = col * keyUnit + keyPadding;
    const y = row * keyUnit + keyPadding;

    // Calculate previous position if provided, or use radial exit point for appearing keys
    let fromX = x;
    let fromY = y;
    if (prevRow !== undefined && prevCol !== undefined) {
        fromX = prevCol * keyUnit + keyPadding;
        fromY = prevRow * keyUnit + keyPadding;
    } else {
        // Key is appearing - start from outside
        const exitPoint = getRadialExitPoint(x + keyUnit * width / 2, y + keyUnit * height / 2);
        fromX = exitPoint.x;
        fromY = exitPoint.y;
    }

    const animationDuration = "0.5s";
    const labelClass =
        isKeyboardSymbol(label) ? "keyboard-symbol"
            : isKeyName(label) ? "key-name"
                : "";

    // Determine if we need animation
    const needsAnimation = (fromX !== x) || (fromY !== y);

    const text = (labelClass) ?
        // center all the non-character key labels
        <text x={x + keyUnit * width / 2} y={y + keyUnit * height / 2} className={"key-label " + labelClass}>
            {needsAnimation && <>
                <animate attributeName="x" from={fromX + keyUnit * width / 2} to={x + keyUnit * width / 2} dur={animationDuration} fill="freeze"/>
                <animate attributeName="y" from={fromY + keyUnit * height / 2} to={y + keyUnit * height / 2} dur={animationDuration} fill="freeze"/>
            </>}
            {label}
        </text>
        :
        // left align labels for character keys
        <text x={x + 20} y={y + 60} className="key-label">
            {needsAnimation && <>
                <animate attributeName="x" from={fromX + 20} to={x + 20} dur={animationDuration} fill="freeze"/>
                <animate attributeName="y" from={fromY + 60} to={y + 60} dur={animationDuration} fill="freeze"/>
            </>}
            {label}
        </text>

    const keyRibbon = ribbonClass &&
        <rect class={"key-ribbon " + ribbonClass}
              x={x + keyRibbonPaddingV}
              y={y + keyRibbonPaddingH}
              width={keyUnit * width - 2 * (keyPadding + keyRibbonPaddingV)}
              height={keyUnit * height - 2 * (keyPadding + keyRibbonPaddingH)}>
            {needsAnimation && <>
                <animate attributeName="x" from={fromX + keyRibbonPaddingV} to={x + keyRibbonPaddingV} dur={animationDuration} fill="freeze"/>
                <animate attributeName="y" from={fromY + keyRibbonPaddingH} to={y + keyRibbonPaddingH} dur={animationDuration} fill="freeze"/>
            </>}
        </rect>
    const frequencyCircle = frequencyCircleRadius &&
        <circle cx={x + 70} cy={y + 30} r={frequencyCircleRadius} className="frequency-circle">
            {needsAnimation && <>
                <animate attributeName="cx" from={fromX + 70} to={x + 70} dur={animationDuration} fill="freeze"/>
                <animate attributeName="cy" from={fromY + 30} to={y + 30} dur={animationDuration} fill="freeze"/>
            </>}
        </circle>;
    const homeMarker = showHomeMarker &&
        <circle cx={x + keyUnit / 2} cy={y + keyUnit / 2} r={12} className="home-marker-circle">
            {needsAnimation && <>
                <animate attributeName="cx" from={fromX + keyUnit / 2} to={x + keyUnit / 2} dur={animationDuration} fill="freeze"/>
                <animate attributeName="cy" from={fromY + keyUnit / 2} to={y + keyUnit / 2} dur={animationDuration} fill="freeze"/>
            </>}
        </circle>;
    return <g>
        <rect
            className={"key-outline " + backgroundClass}
            x={x}
            y={y}
            width={keyUnit * width - 2 * keyPadding}
            height={keyUnit * height - 2 * keyPadding}>
            {needsAnimation && <>
                <animate attributeName="x" from={fromX} to={x} dur={animationDuration} fill="freeze"/>
                <animate attributeName="y" from={fromY} to={y} dur={animationDuration} fill="freeze"/>
            </>}
        </rect>
        {keyRibbon || frequencyCircle || homeMarker}
        {text}
    </g>
}

export interface KeyboardProps {
    layoutModel: RowBasedLayoutModel;
    mappingDiff: Record<string, MappingChange>;
    keyMovements: KeyMovement[];
    vizType: VisualizationType;
}

export function getEffortClass(effort: number | null) {
    if (effort === null || isNaN(effort)) return "";
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
    const fingerOrNull = layoutModel.mainFingerAssignment[row][col];
    const bgClass = fingerOrNull === null ? "" : bgClassByFinger[fingerOrNull];
    const borderClass = isHomeKey(layoutModel, row, col) ? "home-key-border"
        : isCommandKey(label) ? "command-key-border"
            : "";
    return bgClass + " " + borderClass;
}

export function RowBasedKeyboard({layoutModel, keyMovements, mappingDiff, vizType}: KeyboardProps) {
    return keyMovements.map((movement, index) => {
        // Use current position if available, otherwise use previous position
        const keyPos = movement.cur ?? movement.prev!;
        const {label, row, col, colPos} = keyPos;

        const keyColorFunction = (layoutModel.keyColorClass) || defaultKeyColor;
        const capWidth = keyCapWidth(layoutModel, row, col);
        const capHeight = keyCapHeight(layoutModel, row, col);
        const capSize = Math.max(capWidth, capHeight);
        const bgClass = (vizType === VisualizationType.LayoutKeySize ? getKeySizeClass(capSize)
                : vizType === VisualizationType.LayoutKeyEffort ? getEffortClass(layoutModel.singleKeyEffort[row][col])
                    : vizType === VisualizationType.LayoutFingering // && (layoutModel.mainFingerAssignment[row][col] !== null)
                        ? getFingeringClasses(layoutModel, row, col, label)
                        : isHomeKey(layoutModel, row, col) ? "home-key"
                            : keyColorFunction(label, row, col))
            || (!label ? "unlabeled" : "");
        const ribbonClass = vizType === VisualizationType.MappingDiff && lettersAndVIP.test(label)
            ? ribbonClassByDiff[mappingDiff[label]]
            : undefined;
        let frequencyCircleRadius = undefined;
        if (vizType === VisualizationType.MappingFrequeny) {
            const freq = Math.sqrt(singleCharacterFrequencies[label.toUpperCase()] / singleCharacterFrequencies['E']);
            frequencyCircleRadius = freq * keyUnit / 2;
        }
        // this would be a generically better approach than the current left-aligning,
        // but for the Escape key on Ergoplank, left-align is actually better.
        // const capColPos = colPos + (slotWidth - capWidth)/2;

        let displayLabel = label;
        if (vizType === VisualizationType.LayoutKeySize) {
            displayLabel = capSize > 1 ? capSize + "" : "";
        }

        return <Key
            label={displayLabel}
            backgroundClass={bgClass}
            ribbonClass={ribbonClass}
            row={row}
            col={colPos}
            width={capWidth}
            height={capHeight}
            frequencyCircleRadius={frequencyCircleRadius}
            showHomeMarker={vizType === VisualizationType.LayoutKeySize && isHomeKey(layoutModel, row, col)}
            prevRow={movement.prev?.row}
            prevCol={movement.prev?.colPos}
            key={label + '-' + index}
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

export interface StaggerLinesProps {
    layoutModel: RowBasedLayoutModel;
    layoutSplit: boolean;
    keyMovements: KeyMovement[];
}

export function StaggerLines({layoutModel, layoutSplit, keyMovements}: StaggerLinesProps) {
    // Extract current positions from key movements
    const keyPositions = keyMovements.map(m => m.cur ?? m.prev!);

    const leftHomePositions = keyPositions.filter((kp) =>
        kp.row === KeyboardRows.Home && kp.col <= layoutModel.leftHomeIndex && kp.col > layoutModel.leftHomeIndex - 4
    ).map((kp) => kp.colPos);
    const rightHomePositions = keyPositions.filter((kp) =>
        kp.row === KeyboardRows.Home && kp.col >= layoutModel.rightHomeIndex && kp.col < layoutModel.rightHomeIndex + 4
    ).map((kp) => kp.colPos);
    const leftHandOffsets = layoutSplit ? [0, 0, 0, 0] : [0.5, 0.25, 0, -0.25];
    const rightHandOffsets = leftHandOffsets.map((x) => -x);
    // This uses object identity comparison and only works, because the models actually reference the same array.
    const rightKeyboardOffsets = layoutModel.symmetricStagger
        ? layoutModel.staggerOffsets.map((x) => -x)
        : layoutModel.staggerOffsets;
    return <>
        <OneHandStaggerLines
            homePositions={leftHomePositions}
            staggerOffsets={leftHandOffsets}
            className="hand-stagger-line"
        />
        <OneHandStaggerLines
            homePositions={rightHomePositions}
            staggerOffsets={rightHandOffsets}
            className="hand-stagger-line"
        />
        <OneHandStaggerLines
            homePositions={leftHomePositions}
            staggerOffsets={layoutModel.staggerOffsets}
            className="stagger-line"
        />
        <OneHandStaggerLines
            homePositions={rightHomePositions}
            staggerOffsets={rightKeyboardOffsets}
            className="stagger-line"
        />
    </>
}

export interface OneHandStaggerLinesProps {
    // Same unit as colPos. The row is always the home row.
    homePositions: number[];
    // Three numbers, measure in units of key width (thus 0, 0.25, or 0.5) for the number, upper, and lower row,
    // all in relation to the homeRow. (Either above or below home row numbers should be negative to keep the direction.
    // And for the home row it should be 0.)
    staggerOffsets: number[];
    className: string;
}

export function OneHandStaggerLines({homePositions, staggerOffsets, className}: OneHandStaggerLinesProps) {
    // it's simpler to draw this with separate lines instead of a nice continuous SVG path...
    const results = [] as JSX.Element[];
    homePositions.forEach((homePos) => {
        for (let row = 0; row < staggerOffsets.length - 1; row++) {
            results.push(<line
                key={`${row},${homePos}`}
                x1={keyUnit * (homePos + 0.5 + staggerOffsets[row])} y1={keyUnit * (row + 0.5)}
                x2={keyUnit * (homePos + 0.5 + staggerOffsets[row + 1])} y2={keyUnit * (row + 1.5)}
                class={className}
            />)
        }
    })
    return results;
}