import {BigramType, type FlexMapping, type LayoutModel} from "../base-model.ts";
import {getBigramMovements, weighBigramTypes} from "../bigrams.ts";
import {singleCharacterFrequencies as englishFreqs} from "../frequencies/english-single-character-frequencies.ts";
import {compatibilityScore, diffSummary, diffToBase, fillMapping, getKeyPositions} from "./layout-functions.ts";
import {offHomeRowFrequency} from "../mapping/mapping-functions.ts";
import {allMappings} from "../mapping/mappings.ts";

interface TradeoffDiagramProps {
    layout: LayoutModel;
    selectedMapping: FlexMapping;
    onSelectMapping: (m: FlexMapping) => void;
}

interface DataPoint {
    mapping: FlexMapping;
    learning: number;
    offHome: number;
    sameFinger: number;
}

// Color constants. Keep in sync with the legend in DetailsArea.
export const TRADEOFF_OFF_HOME_COLOR = "#d62728"; // red
export const TRADEOFF_SAME_FINGER_COLOR = "#1f77b4"; // blue

// SVG geometry. The viewBox matches KeyboardSvg's height for visual consistency.
const VIEW_X = 0;
const VIEW_Y = -50;
const VIEW_W = 1800;
const VIEW_H = 600;

const PLOT_LEFT = 110;
const PLOT_RIGHT = VIEW_W - 110;
const PLOT_TOP = 0;
const PLOT_BOTTOM = 380;

const LABEL_ROTATION_DEG = 30;

function computeData(layout: LayoutModel): DataPoint[] {
    const mappings = allMappings.filter((m) => m.localMaximum === true);
    const points: DataPoint[] = [];
    for (const mapping of mappings) {
        const charMap = fillMapping(layout, mapping);
        if (!charMap) continue;
        const learning = compatibilityScore(diffSummary(diffToBase(layout, mapping)));
        const offHome = offHomeRowFrequency(layout, charMap, englishFreqs);
        const movements = getBigramMovements(
            getKeyPositions(layout, false, charMap),
            `TradeoffDiagram for ${mapping.name} on ${layout.name}`,
        );
        const sameFinger = weighBigramTypes(movements, [BigramType.AltFinger, BigramType.SameFinger]);
        points.push({mapping, learning, offHome, sameFinger});
    }
    return points;
}

function niceMax(value: number): number {
    if (value <= 0) return 1;
    const exponent = Math.floor(Math.log10(value));
    const magnitude = 10 ** exponent;
    const normalized = value / magnitude;
    let nice: number;
    if (normalized <= 1) nice = 1;
    else if (normalized <= 2) nice = 2;
    else if (normalized <= 5) nice = 5;
    else nice = 10;
    return nice * magnitude;
}

function makeTicks(max: number, count: number): number[] {
    const step = max / count;
    const ticks: number[] = [];
    for (let i = 0; i <= count; i++) {
        ticks.push(Math.round(step * i));
    }
    return ticks;
}

function isSameMapping(a: FlexMapping, b: FlexMapping): boolean {
    if (a.techName != null && b.techName != null) {
        return a.techName === b.techName;
    }
    return a.name === b.name;
}

export function TradeoffDiagram({layout, selectedMapping, onSelectMapping}: TradeoffDiagramProps) {
    const data = computeData(layout);

    // X domain: pad by 1 on each side for visual breathing room.
    const xValues = data.map((d) => d.learning);
    const xMin = xValues.length ? Math.floor(Math.min(...xValues)) - 1 : 0;
    const xMax = xValues.length ? Math.ceil(Math.max(...xValues)) + 1 : 10;

    const yLeftMax = niceMax(data.length ? Math.max(...data.map((d) => d.offHome)) : 100);
    const yRightMax = niceMax(data.length ? Math.max(...data.map((d) => d.sameFinger)) : 100);

    const xScale = (v: number) =>
        PLOT_LEFT + ((v - xMin) / (xMax - xMin)) * (PLOT_RIGHT - PLOT_LEFT);
    const yLeftScale = (v: number) =>
        PLOT_BOTTOM - (v / yLeftMax) * (PLOT_BOTTOM - PLOT_TOP);
    const yRightScale = (v: number) =>
        PLOT_BOTTOM - (v / yRightMax) * (PLOT_BOTTOM - PLOT_TOP);

    const leftTicks = makeTicks(yLeftMax, 5);
    const rightTicks = makeTicks(yRightMax, 5);

    return (
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1"
             viewBox={`${VIEW_X} ${VIEW_Y} ${VIEW_W} ${VIEW_H}`}
             class="tradeoff-svg">
            <title>Learning effort trade-off</title>

            {/* Background covering the whole SVG */}
            <rect x={VIEW_X} y={VIEW_Y}
                  width={VIEW_W} height={VIEW_H}
                  class="tradeoff-svg-bg"/>

            {/* Plot area frame */}
            <rect x={PLOT_LEFT} y={PLOT_TOP}
                  width={PLOT_RIGHT - PLOT_LEFT}
                  height={PLOT_BOTTOM - PLOT_TOP}
                  class="tradeoff-plot-bg"/>

            {/* Left Y axis */}
            <line x1={PLOT_LEFT} y1={PLOT_TOP} x2={PLOT_LEFT} y2={PLOT_BOTTOM} class="tradeoff-axis"/>
            {leftTicks.map((tick) => {
                const y = yLeftScale(tick);
                return (
                    <g key={`lt-${tick}`}>
                        <line x1={PLOT_LEFT - 6} x2={PLOT_LEFT} y1={y} y2={y} class="tradeoff-axis"/>
                        <text x={PLOT_LEFT - 10} y={y + 6}
                              text-anchor="end"
                              class="tradeoff-tick-label"
                              fill={TRADEOFF_OFF_HOME_COLOR}>
                            {tick}
                        </text>
                    </g>
                );
            })}
            <text x={PLOT_LEFT - 70} y={(PLOT_TOP + PLOT_BOTTOM) / 2}
                  text-anchor="middle"
                  transform={`rotate(-90 ${PLOT_LEFT - 70} ${(PLOT_TOP + PLOT_BOTTOM) / 2})`}
                  class="tradeoff-axis-title"
                  fill={TRADEOFF_OFF_HOME_COLOR}>
                Off-home-row score (English)
            </text>

            {/* Right Y axis */}
            <line x1={PLOT_RIGHT} y1={PLOT_TOP} x2={PLOT_RIGHT} y2={PLOT_BOTTOM} class="tradeoff-axis"/>
            {rightTicks.map((tick) => {
                const y = yRightScale(tick);
                return (
                    <g key={`rt-${tick}`}>
                        <line x1={PLOT_RIGHT} x2={PLOT_RIGHT + 6} y1={y} y2={y} class="tradeoff-axis"/>
                        <text x={PLOT_RIGHT + 10} y={y + 6}
                              text-anchor="start"
                              class="tradeoff-tick-label"
                              fill={TRADEOFF_SAME_FINGER_COLOR}>
                            {tick}
                        </text>
                    </g>
                );
            })}
            <text x={PLOT_RIGHT + 70} y={(PLOT_TOP + PLOT_BOTTOM) / 2}
                  text-anchor="middle"
                  transform={`rotate(90 ${PLOT_RIGHT + 70} ${(PLOT_TOP + PLOT_BOTTOM) / 2})`}
                  class="tradeoff-axis-title"
                  fill={TRADEOFF_SAME_FINGER_COLOR}>
                Same-finger bigram score
            </text>

            {/* X axis */}
            <line x1={PLOT_LEFT} y1={PLOT_BOTTOM} x2={PLOT_RIGHT} y2={PLOT_BOTTOM} class="tradeoff-axis"/>

            {/* Data points and labels */}
            {data.map((d) => {
                const x = xScale(d.learning);
                const yLeft = yLeftScale(d.offHome);
                const yRight = yRightScale(d.sameFinger);
                const topY = Math.min(yLeft, yRight);
                const isSelected = isSameMapping(selectedMapping, d.mapping);
                return (
                    <g key={d.mapping.techName ?? d.mapping.name}
                       class={"tradeoff-point-group" + (isSelected ? " selected" : "")}
                       onClick={() => onSelectMapping(d.mapping)}>
                        {/* connector line from x-axis to highest point */}
                        <line x1={x} x2={x} y1={PLOT_BOTTOM} y2={topY} class="tradeoff-connector"/>
                        {/* x-axis tick mark */}
                        <line x1={x} x2={x} y1={PLOT_BOTTOM} y2={PLOT_BOTTOM + 6} class="tradeoff-axis"/>
                        {/* off-home-row point (left axis) */}
                        <circle cx={x} cy={yLeft} r={isSelected ? 9 : 6}
                                fill={TRADEOFF_OFF_HOME_COLOR}
                                class="tradeoff-point"/>
                        {/* same-finger bigram point (right axis) */}
                        <circle cx={x} cy={yRight} r={isSelected ? 9 : 6}
                                fill={TRADEOFF_SAME_FINGER_COLOR}
                                class="tradeoff-point"/>
                        {/* numeric learning score directly under the axis */}
                        <text x={x} y={PLOT_BOTTOM + 22}
                              text-anchor="middle"
                              class={"tradeoff-x-tick-label" + (isSelected ? " selected" : "")}>
                            {d.learning}
                        </text>
                        {/* mapping name label rotated 30° below the number */}
                        <text x={x} y={PLOT_BOTTOM + 40}
                              text-anchor="end"
                              transform={`rotate(${LABEL_ROTATION_DEG} ${x} ${PLOT_BOTTOM + 40})`}
                              class={"tradeoff-x-label" + (isSelected ? " selected" : "")}>
                            {d.mapping.name}
                        </text>
                    </g>
                );
            })}

            {/* X axis title — placed close to the x-axis below the labels */}
            <text x={(PLOT_LEFT + PLOT_RIGHT) / 2} y={PLOT_BOTTOM + 145}
                  text-anchor="middle" class="tradeoff-axis-title">
                Learning Score (lower = easier to learn)
            </text>
        </svg>
    );
}
