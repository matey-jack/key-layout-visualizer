import {KEY_COLOR, KeyboardRows, type RenderableLayoutModel} from '../base-model.ts';
import {mirror, mirrorOdd, SymmetricKeyWidth} from '../layout/keyWidth.ts';
import {getKeyPositions} from '../layout/layout-functions.ts';
import {type DynamicLayoutModel, keyboardSvgWidth, type StaggerSet} from './se-model.ts';

const frac= (x: number) => x - Math.trunc(x)
const edgeKeyWidth = (width: number) => width < 0 ? 1 : 1 + frac(width);

// Rounding to three significant digits should be enough to convert 0.9999 into 1.
// Since the layout uses steps of 1/2, 1/3, and 1/4, we round to the nearest multiple of 1/12.
function round(x: number) {
    return Math.round(x * 12) / 12;
}

// For brevity, we express all widths in quarters of units. Thus, 5 means 1.25u.
// Keys are the remaining width in the bottom row, values are the key widths from the edge to the center.
const bottomArrangements: Record<number, number[]> = {
    [20]: [5, 5, 5, 5],
    [21]: [5, 5, 5, 6],
    [22]: [6, 5, 5, 6],
    [23]: [6, 6, 5, 6],
    [24]: [6, 6, 6, 6],
    // I want at least some 1.5u keys, so let's work with gaps before switching to 1.25u again.
    [25]: [6, 6, 1, 6, 6],
    // [25]: [5, 5, 5, 5, 5],
    // the following should never happen, because additional space goes between the thumb keys into the center.
    [26]: [6, 5, 5, 5, 5],
    [27]: [6, 5, 5, 5, 6],
}

function createQuartersBasedBottomRow(keyboardWidth: number, homeRowIndent: number, bottomRowIndent: number): number[] {
    // Ideally separate the thumb keys exactly 1u to the center from middle of index finger.
    const spaceForCentralThumbKey = keyboardWidth/2 - homeRowIndent - 5.5;
    // For non-Triplex, available space ranges from 6.5 - 5.5 = 1 to 8 - 5.5 = 2.5.
    // Because the most narrow configuration doesn't allow any homeRowIndent.
    const sizeOfCentralThumbKey = Math.min(1.75, Math.max(1.25, spaceForCentralThumbKey));
    const sizeOfOtherThumbKey = Math.min(1.5, sizeOfCentralThumbKey);
    const sizeOfCentralGap = Math.min(Math.max(0, 2 * (spaceForCentralThumbKey - sizeOfCentralThumbKey)), 1);
    // For the lookup map, this is expressed in quarter units for each keyboard half.
    const remainingSpace = Math.round((keyboardWidth - 2 * bottomRowIndent - 2 * sizeOfCentralThumbKey - sizeOfCentralGap) * 2);
    // console.log(`remaining space: ${remainingSpace}`);
    const otherBottomKeys = bottomArrangements[remainingSpace]
        ? bottomArrangements[remainingSpace].map((x) => x/4)
        : [sizeOfOtherThumbKey];
    return sizeOfCentralGap > 0
        ? mirrorOdd(...otherBottomKeys, sizeOfCentralThumbKey, sizeOfCentralGap)
        : mirror(...otherBottomKeys, sizeOfCentralThumbKey);
}

// Expressed in thirds of one key unit.
const triplexBottomArrangments: Record<number, number[]> = {
    [16]: [4, 4, 4, 4],
    [17]: [4, 4, 4, 5],
    [18]: [5, 4, 4, 5],
    [19]: [5, 5, 4, 5],
}

function createThirdsBasedBottomRow(keyboardWidth: number, homeRowIndent: number, bottomRowIndent: number): number[] {
    // Same formula as for the other layouts, but rounded so that everything is in thirds.
    const spaceForCentralThumbKey = keyboardWidth/2 - homeRowIndent - 5 - 2/3;
    // The minimum space is 7 - 1/3 - 5 - 2/3 = 2. (Because the 14u keyboard has at most 1/3 home-row indent.)
    // So 1.33 keys will go outside the range a bit, but anyway 1/3 within the G/H keys was the alternate rounding option.
    // Since there are only two acceptable options for thumb key size, we choose one with a simple threshold instead of calculating:
    const sizeOfCentralThumbKey = spaceForCentralThumbKey >= 5/3 ? 5/3 : 4/3;
    const sizeOfCentralGap = round(2 * Math.max(0, spaceForCentralThumbKey - sizeOfCentralThumbKey));
    // The 15u wide keyboard has 7.5u on each side, which can't be split nicely into thirds.
    // With smaller home row indents, the offending 0.5u ends up in the central gap, and we can apply 1/3 logic to the remaining part
    // of the bottom row. For the only case where that doesn't work, we just hard-code the following:
    if (keyboardWidth === 15 && Math.round(homeRowIndent * 3) === 2) {
        return mirror(...[5, 4, 0.5, 4, 5, 4].map((x) => x/3));
    }

    // Expressed in thirds of a key unit for the value lookup.
    // (The central key always has a size multiple of 2/3, so halving it stays in the 1/3 universe, no 1/6 needed.)
    // Minimal remaining space is 7 - 4/3 = 17/3 (smallest thumb key, no central gap).
    // (Incidentally, keyboard width 16 and home-row indent yield a bottom row indent of 1/3 and thus also just 17/3 of remaining space.)
    // Maximum is 8 - 5/3 = 19.
    const remainingSpace = Math.floor((keyboardWidth - 2 * bottomRowIndent - 2 * sizeOfCentralThumbKey - sizeOfCentralGap) / 2 * 3);
    console.log(`remaining space: ${remainingSpace}/3u.`)
    const otherBottomKeys = triplexBottomArrangments[remainingSpace]
        ? triplexBottomArrangments[remainingSpace].map((x) => x/3)
        : [sizeOfCentralThumbKey];
    // The gap can be a /6 fraction without problems. Need to round it, so tiny numbers become actual 0.
    return sizeOfCentralGap > 0
        ? mirrorOdd(...otherBottomKeys, sizeOfCentralThumbKey, sizeOfCentralGap)
        : mirror(...otherBottomKeys, sizeOfCentralThumbKey);
}

export function ergoMaker(
    // Has to be in steps of 1/2 (or a whole number in the trifecta case).
    keyboardWidth: number,
    staggerSet: StaggerSet,
    // Multiple of 1/4 or 1/3.
    homeRowIndent: number,

    /* 4×10 matrix of characters to display on the keys that form a staggered trapeze from the home positions;
    the marked index finger positions hold coreCharacters[2][4] and [2][5].
    Since edge keys are always split or merged to fall into a size >=1 and <2, there can be more than one non-character
    key above the home row, and none at all below. In that latter case, we replace a >1 sized edge key with an indent
    and a 1u key, so that it is the same size as other character keys.
    (In other words, the Colemak angle-mod is always on.)
    */
    coreCharacters: string[],

    /*
    NOT IMPLEMENTED YET, because having ZXVB staggered towards the center is wrong and only acceptable for the legacy
    0.5 stagger that people are used to from ANSI keyboards.
    This undoes the angle-mod to always have a long edge key here that reaches under the pinky, so it can be used as
    easily accessible Shift. In the case of low edge indent, this is no change to the keyWidth, only the letter assignment.
    But in case of high indent, we'll have two "edge keys" and need to decide how to distribute any extra width between them.
    (Think of the Thumbs Up right shift where Shift is not at the edge and has all the extra width while the actual edge
    key is a 1u PageDown.)
     */
    _longLowerEdge: boolean = false,
): DynamicLayoutModel {
    /* * *
            First build the four keyboard rows above the bottom.
    * * */
    const edgeIndents = [
        homeRowIndent + 1/staggerSet[1] + 1/staggerSet[0],
        homeRowIndent + 1/staggerSet[1],
        homeRowIndent,
        homeRowIndent - 1/staggerSet[2],
    ].map(round);
    // If there is no space on the lower row edge for a key outside the last character key,
    // then make this space into an indent instead.
    const lowerRowIndent = edgeIndents[KeyboardRows.Lower] < 0 ? 1 + edgeIndents[KeyboardRows.Lower]: 0;
    // An alternative to "one quarter less" would be to halve the indent (and round down).
    // This would only make a difference for 0.75 => 0.25.
    const bottomRowIndent = staggerSet[0] === 3
        ? Math.max(lowerRowIndent - 1/3, 0)
        : Math.max(lowerRowIndent - 0.25, 0);
    // console.log(`lower / bottom row indent: ${lowerRowIndent} / ${bottomRowIndent}`);
    const rowIndent: [number, number, number, number, number] = [0, 0, 0, lowerRowIndent, bottomRowIndent];
    const keyWidthMaker = new SymmetricKeyWidth(keyboardWidth, rowIndent);
    const keyWidths = edgeIndents.map((indent, rowNum) =>
        keyWidthMaker.row(rowNum, edgeKeyWidth(indent))
    );
    const fullMapping = keyWidths.map((row, rowNum) => {
        const numEdgeKeys = Math.floor(edgeIndents[rowNum] + 1);
        const rowLength = keyWidths[rowNum].length;
        const rightEdge = rowLength - numEdgeKeys;
        return row.map((width, colNum) => {
                if (width < 1) return null;
                if (colNum < numEdgeKeys || colNum >= rightEdge) return "";
                if (colNum < numEdgeKeys + 5) return coreCharacters[rowNum][colNum - numEdgeKeys];
                if (colNum >= rightEdge - 5) return coreCharacters[rowNum][5 + colNum - (rightEdge - 5)];
                // Only the center part of the keyboard is left over.
                return "";
        }
    )});

    /* * * Now the bottom row. * * */
    const bottomRowWidths = staggerSet[0] === 3
        ? createThirdsBasedBottomRow(keyboardWidth, homeRowIndent, bottomRowIndent)
        : createQuartersBasedBottomRow(keyboardWidth, homeRowIndent, bottomRowIndent);
    keyWidths.push(bottomRowWidths);
    const bottomRowLabels  = bottomRowWidths.map((w) => w < 1 ? null : "");
    fullMapping.push(bottomRowLabels);
    const renderInfo: RenderableLayoutModel = {
        keyWidths,
        rowIndent,
        leftHomeIndex: 4,
        rightHomeIndex: keyWidths[KeyboardRows.Home].length - 1 - 4,
        keyColorClass: (_label, _row, _col) => KEY_COLOR.BORING,
    };
    return {
        renderInfo,
        keyPositions: getKeyPositions(renderInfo, false, fullMapping, keyboardSvgWidth),
        fullMapping,
    }
}