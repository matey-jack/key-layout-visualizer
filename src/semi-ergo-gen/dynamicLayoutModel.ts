import {KEY_COLOR, KeyboardRows, type LayoutModel} from '../base-model.ts';
import {SymmetricKeyWidth, zeroIndent} from '../layout/keyWidth.ts';
import {getKeyPositions} from '../layout/layout-functions.ts';
import type {MinimalLayoutModel, StaggerSet} from './seg-model.ts';

const edgeKeyWidth = (width: number) => width + 1 - Math.floor(width)

interface DebugInfo {
    fullMapping: (string | null)[][];
    keyWidths: number[][];
}

// Rounding to three significant digits should be enough to convert 0.9999 into 1.
function round(x: number) {
    return Math.round(x * 1000) / 1000;
}

export function ergoMaker(
    // Has to be in steps of 1/2 (or a whole number in the trifecta case).
    width: number,
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
): MinimalLayoutModel & DebugInfo {
    const keyWidthMaker = new SymmetricKeyWidth(width, zeroIndent);
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
    const fakeLayoutModel = {
        keyWidths,
        rowIndent: zeroIndent,
    } as LayoutModel;
    return {
        leftHomeIndex: 4,
        rightHomeIndex: keyWidths[KeyboardRows.Home].length - 1 - 4,
        keyColorClass: (_label, _row, _col) => KEY_COLOR.BORING,
        keyPositions: getKeyPositions(fakeLayoutModel, false, fullMapping),
        // values published only for testing:
        fullMapping,
        keyWidths,
    }
}