import {KEY_COLOR, KeyboardRows, type RenderableLayoutModel} from '../base-model.ts';
import {mirror, mirrorOdd, SymmetricKeyWidth, zeroIndent} from '../layout/keyWidth.ts';
import {getKeyPositions} from '../layout/layout-functions.ts';
import  {type DynamicLayoutModel, keyboardSvgWidth, type StaggerSet} from './seg-model.ts';

const edgeKeyWidth = (width: number) => width + 1 - Math.floor(width)

// Rounding to three significant digits should be enough to convert 0.9999 into 1.
// Since the layout uses steps of 1/2, 1/3, and 1/4, we round to the nearest multiple of 1/12.
function round(x: number) {
    return Math.round(x * 12) / 12;
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
    const keyWidthMaker = new SymmetricKeyWidth(keyboardWidth, zeroIndent);
    const edgeIndents = [
        homeRowIndent + 1/staggerSet[1] + 1/staggerSet[0],
        homeRowIndent + 1/staggerSet[1],
        homeRowIndent,
        homeRowIndent - 1/staggerSet[2],
    ].map(round);
    const keyWidths = edgeIndents.map((indent, rowNum) =>
        keyWidthMaker.row(rowNum, edgeKeyWidth(indent))
    );
    if (edgeIndents[KeyboardRows.Lower] < 0) {
        const lowerRow = keyWidths[KeyboardRows.Lower];
        lowerRow[0] = 1;
        lowerRow[lowerRow.length - 1] = 1;
    }
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
    /*
    Goal: show two thumb keys with appropriate positions and size.
    Constraint: thumb key size should be > 1u and like all keys < 2u.
    Out of scope: how to practically use the central gap between thumb keys, if there is one. We just leave the gap.
     */
    // ideally separate the thumb keys exactly 1u to the center from middle of index finger.
    const spaceForCentralThumbKey = keyboardWidth/2 - homeRowIndent - 5.5
    // For non-Triplex, available space ranges from 6.5 - 5.5 = 1 to 8 - 5.5 = 2.5.
    // Because the most narrow configuration doesn't allow any homeRowIndent.
    let sizeOfCentralThumbKey = Math.min(1.75, Math.max(1.25, spaceForCentralThumbKey));
    let sizeOfOtherThumbKey = Math.min(1.5, sizeOfCentralThumbKey);
    let sizeOfCentralGap = 2 * Math.max(0, spaceForCentralThumbKey - sizeOfCentralThumbKey);
    if (staggerSet[0] === 3) {
        // For Triplex, minimum space is 7 - 5.5 - 1/3 = 7/6, which we'll clamp to 8/6 = 1.33.
        // Maximum is as above.
        // But since the calculation can yield any /6 fractions, we need to explicitly set the key size.
        sizeOfCentralThumbKey = spaceForCentralThumbKey >= 5/3 ? 5/3 : 4/3;
        sizeOfOtherThumbKey = sizeOfCentralThumbKey;
        // The gap can be a /6 fraction without problems. Need to round it, so tiny numbers become actual 0.
        sizeOfCentralGap = round(2 * Math.max(0, spaceForCentralThumbKey - sizeOfCentralThumbKey));
    }
    const bottomRowWidths = sizeOfCentralGap > 0
        ? mirrorOdd(sizeOfOtherThumbKey, sizeOfCentralThumbKey, sizeOfCentralGap)
        : mirror(sizeOfOtherThumbKey, sizeOfCentralThumbKey);
    keyWidths.push(bottomRowWidths);
    const bottomRowLabels  = sizeOfCentralGap > 0
        ? mirrorOdd("", "", null)
        : mirror("", "");
    fullMapping.push(bottomRowLabels);
    const renderInfo: RenderableLayoutModel = {
        keyWidths,
        rowIndent: zeroIndent,
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