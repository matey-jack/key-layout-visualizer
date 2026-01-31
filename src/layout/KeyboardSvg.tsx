import './KeyboardSvg.css';
import type {ComponentChildren, JSX} from "preact";
import {
    type BigramMovement,
    BigramType,
    Finger,
    KeyboardRows,
    type KeyMovement,
    type KeyPosition,
    type LayoutModel,
    MappingChange,
    VisualizationType,
} from "../base-model.ts";
import {singleCharacterFrequencies} from "../frequencies/english-single-character-frequencies.ts";
import {isCommandKey, isKeyboardSymbol, isKeyName} from "../mapping/mapping-functions.ts";
import {
    defaultKeyColor,
    getKeySizeClass,
    isHomeKey,
    keyCapHeight,
    lettersAndVIP,
    totalWidth,
} from "./layout-functions.ts";

interface KeyboardSvgProps {
    vizType: VisualizationType;
    keyMovements: KeyMovement[];
    showFrame: boolean;
    children?: ComponentChildren;
}

// Our largest keyboards are 16u wide (Ergoboard), while all keyboards are 5u high.
// Adding 1u of wiggle room all around suggests a ratio of 7:17 for the SVG grid.
export const KeyboardSvg = ({vizType, keyMovements, showFrame, children}: KeyboardSvgProps) => {
    const clazz = vizType === VisualizationType.LayoutPlain ? "viz-plain" : "";
    const keyboardPadding = 20;
    const nextDims = getRectDimensions(keyMovements.map((m) => m.next));
    const prevDims = getRectDimensions(keyMovements.map((m) => m.prev));
    const frameStyle = {
        '--from-x': `${prevDims.x - keyboardPadding}px`,
        '--to-x': `${nextDims.x - keyboardPadding}px`,
        '--from-width': `${prevDims.width + 2 * keyboardPadding}px`,
        '--to-width': `${nextDims.width + 2 * keyboardPadding}px`,
    };
    return <div>
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox={`0 -50 ${totalWidth * keyUnit} 600`}
             class={`keyboard-svg ${clazz}`}>
            <title>Keyboard Layout Diagram</title>
            {showFrame && <rect class={"keyboard-frame animating"}
                                key={`${nextDims.x}-${nextDims.width}`}
                style={frameStyle}
                x="var(--from-x)"
                y={-keyboardPadding}
                width="var(--from-width)"
                height={5 * keyUnit + 2*keyboardPadding}
            />}
            {children}
        </svg>
    </div>;
}

function getRectDimensions(positions: (KeyPosition | undefined)[]): {x: number, width: number} {
    const colPositions = positions.map(p => p?.colPos).filter(x => typeof x === 'number') as number[];
    const widths = positions.map(p => p?.keyCapWidth).filter(x => typeof x === 'number') as number[];
    const minCol = Math.min(...colPositions);
    const maxRight = Math.max(...widths.map((w, i) => colPositions[i] + w));
    return {x: minCol * keyUnit, width: (maxRight - minCol) * keyUnit};
}

interface KeyProps {
    label: string,
    row: KeyboardRows,
    col: number, // Measured in key units from the left-hand side starting with 0. Can be fractional!
    width: number,
    height: number,
    backgroundClass: string,
    // There will be no ribbon element, when there is no ribbon class.
    ribbonClass?: string,
    frequencyCircleRadius?: number,
    showHomeMarker: boolean,
    prevRow: KeyboardRows,
    prevCol: number,
    prevWidth: number,
}

const keyUnit = 100;
const keyPadding = 8;
const keyRibbonPaddingH = 17;
const keyRibbonPaddingV = 1;

export function Key(props: KeyProps) {
    const {row, col, prevRow, prevCol, width, prevWidth} = props;
    const x = col * keyUnit + keyPadding;
    const y = row * keyUnit + keyPadding;
    const fromX = prevCol * keyUnit + keyPadding;
    const fromY = prevRow * keyUnit + keyPadding;
    const rectWidth = keyUnit * width - 2 * keyPadding;
    const fromRectWidth = keyUnit * prevWidth - 2 * keyPadding;

    // Use CSS custom properties to set initial and final positions and widths
    const groupStyle = {
        '--from-x': `${fromX}px`,
        '--from-y': `${fromY}px`,
        '--to-x': `${x}px`,
        '--to-y': `${y}px`,
        '--from-width': `${fromRectWidth}px`,
        '--to-width': `${rectWidth}px`,
        transform: `translate(var(--from-x), var(--from-y))`,
        transformOrigin: "0 0"
    };

    const {label, height, backgroundClass, ribbonClass, frequencyCircleRadius, showHomeMarker} = props;
    const labelClass =
        isKeyboardSymbol(label) ? "keyboard-symbol"
            : isKeyName(label) ? "key-name"
                : "";

    const text = (labelClass) ?
        // center all the non-character key labels
        <text x={keyUnit * width / 2} y={keyUnit * height / 2} className={"key-label " + labelClass}>
            {label}
        </text>
        :
        // left align labels for character keys
        <text x={20} y={60} className="key-label">
            {label}
        </text>

    const keyRibbon = ribbonClass &&
        <rect class={"key-ribbon " + ribbonClass}
              x={keyRibbonPaddingV}
              y={keyRibbonPaddingH}
              width={keyUnit * width - 2 * (keyPadding + keyRibbonPaddingV)}
              height={keyUnit * height - 2 * (keyPadding + keyRibbonPaddingH)}/>

    const frequencyCircle = frequencyCircleRadius &&
        <circle cx={70} cy={30} r={frequencyCircleRadius} className="frequency-circle"/>;

    const homeMarker = showHomeMarker &&
        <circle cx={keyUnit / 2} cy={keyUnit / 2} r={12} className="home-marker-circle"/>;

    const keyHeight = keyUnit * height - 2 * keyPadding;
    const isometric3dOffset = 8; // pixels for the 3D depth

    const keycapCornerRadius = 6;
    return <g
        style={groupStyle}
        className={"key-group animating"}>
        {/* Left side of keycap (isometric) */}
        <polygon
            className={"key-outline key-side-left " + backgroundClass}
            points={`${0},${keycapCornerRadius/2} ${-isometric3dOffset},${isometric3dOffset+keycapCornerRadius/2} ${-isometric3dOffset},${keyHeight + isometric3dOffset} ${0},${keyHeight}`}/>
        {/* Bottom side of keycap (isometric) */}
        <polygon
            className={"key-outline key-side-bottom " + backgroundClass}
            points={`${0},${keyHeight} ${rectWidth-keycapCornerRadius/2},${keyHeight} ${rectWidth - isometric3dOffset-keycapCornerRadius/2},${keyHeight + isometric3dOffset} ${-isometric3dOffset},${keyHeight + isometric3dOffset}`}/>
        {/* Top face of keycap (main) */}
        <rect
            className={"key-outline animating " + backgroundClass}
            x={0}
            y={0}
            width={rectWidth}
            height={keyHeight}
            rx={keycapCornerRadius}
            ry={keycapCornerRadius}/>
        {keyRibbon || frequencyCircle || homeMarker}
        {text}
    </g>
}

export interface KeyboardProps {
    layoutModel: LayoutModel;
    prevLayoutModel: LayoutModel;
    mappingDiff: Record<string, MappingChange>;
    keyMovements: KeyMovement[];
    vizType: VisualizationType;
}

export function getEffortClass(effort: number | null) {
    if (effort === null || Number.isNaN(effort)) return "";
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

function getFingeringClasses(layoutModel: LayoutModel, row: number, col: number, label: string) {
    const fingerOrNull = layoutModel.mainFingerAssignment[row][col];
    const bgClass = fingerOrNull === null ? "" : bgClassByFinger[fingerOrNull];
    const borderClass = isHomeKey(layoutModel, row, col) ? "home-key-border"
        : isCommandKey(label) ? "command-key-border"
            : "";
    return `${bgClass} ${borderClass}`;
}

function getEntryOrExitRow(row: number): number {
    return row < 2 ? row - 3 : row + 4;
}

export function RowBasedKeyboard({layoutModel, prevLayoutModel, keyMovements, mappingDiff, vizType}: KeyboardProps) {
    return keyMovements.map((movement) => {
        // key decorations always come from the next layout model, unless a key is exiting.
        const {label, row, col, keyCapWidth} = movement.next ?? movement.prev!;
        const model = movement.next ? layoutModel : prevLayoutModel;

        const keyColorFunction = (model.keyColorClass) || defaultKeyColor;
        const capHeight = keyCapHeight(model, row, col);
        const capSize = Math.max(keyCapWidth, capHeight);
        const bgClass = (vizType === VisualizationType.LayoutKeySize ? getKeySizeClass(capSize)
                : vizType === VisualizationType.LayoutKeyEffort ? getEffortClass(model.singleKeyEffort[row][col])
                    : vizType === VisualizationType.LayoutFingering // && (model.mainFingerAssignment[row][col] !== null)
                        ? getFingeringClasses(model, row, col, label)
                        : isHomeKey(model, row, col) ? "home-key"
                            : keyColorFunction(label, row, col))
            || (!label ? "unlabeled" : "");
        const ribbonClass = vizType === VisualizationType.MappingDiff && lettersAndVIP.test(label)
            ? ribbonClassByDiff[mappingDiff[label]]
            : undefined;
        let frequencyCircleRadius: number | undefined;
        if (vizType === VisualizationType.MappingFrequeny) {
            const freq = Math.sqrt(singleCharacterFrequencies[label.toUpperCase()] / singleCharacterFrequencies['E']);
            frequencyCircleRadius = freq * keyUnit / 2;
        }
        // this would be a generically better approach than the current left-aligning,
        // but for the Escape key on Ergoplank, left-align is actually better.
        // const capColPos = colPos + (slotWidth - capWidth)/2;

        let displayLabel = label;
        if (vizType === VisualizationType.LayoutKeySize) {
            displayLabel = capSize > 1 ? `${capSize}` : "";
        }

        const newRow = movement.next?.row ?? getEntryOrExitRow(movement.prev!.row);
        const newCol = movement.next?.colPos ?? movement.prev!.colPos;
        return <Key
            label={displayLabel}
            backgroundClass={bgClass}
            ribbonClass={ribbonClass}
            row={newRow}
            col={newCol}
            width={keyCapWidth}
            height={capHeight}
            frequencyCircleRadius={frequencyCircleRadius}
            showHomeMarker={vizType === VisualizationType.LayoutKeySize && isHomeKey(model, row, col)}
            prevRow={movement.prev?.row ?? getEntryOrExitRow(movement.next!.row)}
            prevCol={movement.prev?.colPos ?? movement.next!.colPos}
            prevWidth={movement.prev?.keyCapWidth ?? keyCapWidth}
            key={`${label}-${newRow}-${newCol}-${keyCapWidth}`}
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
            className={`bigram-line bigram-rank-${pair.rank} ${bigramClassByType[pair.type]}`}/>
    });
}

export interface StaggerLinesProps {
    layoutModel: LayoutModel;
    previousLayoutModel: LayoutModel;
    layoutSplit: boolean;
    keyMovements: KeyMovement[];
}

export function StaggerLines({layoutModel, previousLayoutModel, layoutSplit, keyMovements}: StaggerLinesProps) {
    // Extract current and previous positions from key movements
    const currentKeyPositions = keyMovements.map(m => m.next ?? m.prev!);
    const previousKeyPositions = keyMovements.map(m => m.prev ?? m.next!);

    // we get the actual colPos instead of adding 1, 2, 3 to the index finger column,
    // because keys might not have width 1.
    const leftHomePositions = currentKeyPositions.filter((kp) =>
        kp.row === KeyboardRows.Home && kp.col <= layoutModel.leftHomeIndex && kp.col > layoutModel.leftHomeIndex - 4
    ).map((kp) => kp.colPos);
    const rightHomePositions = currentKeyPositions.filter((kp) =>
        kp.row === KeyboardRows.Home && kp.col >= layoutModel.rightHomeIndex && kp.col < layoutModel.rightHomeIndex + 4
    ).map((kp) => kp.colPos);
    
    const prevLeftHomePositions = previousKeyPositions.filter((kp) =>
        kp.row === KeyboardRows.Home && kp.col <= previousLayoutModel.leftHomeIndex && kp.col > previousLayoutModel.leftHomeIndex - 4
    ).map((kp) => kp.colPos);
    const prevRightHomePositions = previousKeyPositions.filter((kp) =>
        kp.row === KeyboardRows.Home && kp.col >= previousLayoutModel.rightHomeIndex && kp.col < previousLayoutModel.rightHomeIndex + 4
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
            prevHomePositions={prevLeftHomePositions}
            staggerOffsets={leftHandOffsets}
            className="hand-stagger-line hand-stagger-line-left"
        />
        <OneHandStaggerLines
            homePositions={rightHomePositions}
            prevHomePositions={prevRightHomePositions}
            staggerOffsets={rightHandOffsets}
            className="hand-stagger-line hand-stagger-line-right"
        />
        <OneHandStaggerLines
            homePositions={leftHomePositions}
            prevHomePositions={prevLeftHomePositions}
            staggerOffsets={layoutModel.staggerOffsets}
            className="stagger-line stagger-line-left"
        />
        <OneHandStaggerLines
            homePositions={rightHomePositions}
            prevHomePositions={prevRightHomePositions}
            staggerOffsets={rightKeyboardOffsets}
            className="stagger-line stagger-line-right"
        />
    </>
}

export interface OneHandStaggerLinesProps {
    // Same unit as colPos. The row is always the home row.
    homePositions: number[];
    prevHomePositions: number[];
    // Three numbers, measure in units of key width (thus 0, 0.25, or 0.5) for the number, upper, and lower row,
    // all in relation to the homeRow. (Either above or below home row numbers should be negative to keep the direction.
    // And for the home row it should be 0.)
    staggerOffsets: number[];
    className: string;
}

export function OneHandStaggerLines({homePositions, prevHomePositions, staggerOffsets, className}: OneHandStaggerLinesProps) {
    // it's simpler to draw this with separate lines instead of a nice continuous SVG path...
    // Set coordinates as if homePositions were [0, 1, 2, 3], then use CSS to offset to actual positions
    const results = [] as JSX.Element[];
    homePositions.forEach((homePos, index) => {
        const prevHomePos = prevHomePositions[index];
        // Calculate offset from normalized position 0, 1, 2, 3
        const currentOffset = homePos - index;
        const previousOffset = prevHomePos - index;
        
        for (let row = 0; row < staggerOffsets.length - 1; row++) {
            // Coordinates relative to normalized position (as if home keys were at 0, 1, 2, 3)
            const x1Normalized = keyUnit * (index + 0.5 + staggerOffsets[row]);
            const y1 = keyUnit * (row + 0.5);
            const x2Normalized = keyUnit * (index + 0.5 + staggerOffsets[row + 1]);
            const y2 = keyUnit * (row + 1.5);
            
            // CSS custom properties for animation: translate from previous offset to current offset
            const style = {
                '--from-offset': `${keyUnit * previousOffset}px`,
                '--to-offset': `${keyUnit * currentOffset}px`,
            };
            
            results.push(<g
                key={`${row},${homePos},${index}`}
                style={style}
                className={`${className} stagger-line-animating`}
            >
                <line
                    x1={x1Normalized} y1={y1}
                    x2={x2Normalized} y2={y2}
                />
            </g>)
        }
    })
    return results;
}