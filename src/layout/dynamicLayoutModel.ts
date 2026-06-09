import {KeyboardRows, type KeyPosition, type LayoutModel} from '../base-model.ts';
import {SymmetricKeyWidth, zeroIndent} from './keyWidth.ts';
import {getKeyPositions} from './layout-functions.ts';

// Reduced version of LayoutModel which can only be used for the key-size viz in KeyboardSvg and nothing else.
export interface MinimalLayoutModel {
    // actually, only those are accessed by the RowBasedKeyboard SVG maker.
    leftHomeIndex: number;
    rightHomeIndex: number;
    // we produce this in the same generator, since it
    keyPositions: KeyPosition[];
}

const edgeKeyWidth = (width: number) => width + 1 - Math.floor(width)

export function ergoMaker(
    // Has to be in steps of 0.5 (or a whole number in the trifecta case);
    width: number,
    // Should be a mix of 0.25 and 0.5 or 0.33 throughout;
    // TODO: Could we gain anything by using whole numbers only and defining a separate global denominator that is either 3 or 4?
    staggerPerRow: [number, number, number],
    // Multiple of 0.5 or 0.33
    homeRowEdge: number,
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
): MinimalLayoutModel {
    const keyWidthMaker = new SymmetricKeyWidth(width, zeroIndent);
    const edgeIndents = [
        homeRowEdge + staggerPerRow[1] + staggerPerRow[0],
        homeRowEdge + staggerPerRow[1],
        homeRowEdge,
        homeRowEdge - staggerPerRow[2],
    ];
    const keyWidths = edgeIndents.map((width, rowNum) =>
        keyWidthMaker.row(rowNum, edgeKeyWidth(width))
    );
    const numEdgeKeys = edgeIndents.map((indent) => Math.floor(indent));
    if (numEdgeKeys[KeyboardRows.Lower] === 0) {
        const lowerRow = keyWidths[KeyboardRows.Lower];
        lowerRow[0] = 1;
        lowerRow[lowerRow.length - 1] = 1;
    }
    const fullMapping = keyWidths.map((row, rowNum) => {
        const numEdgeKeys = Math.floor(edgeIndents[rowNum]);
        const rowLength = keyWidths[rowNum].length;
        const lastCharacter = rowLength - numEdgeKeys - 1;
        return row.map((width, colNum) => {
                if (width < 1) return null;
                if (colNum <= numEdgeKeys || colNum > lastCharacter) return "";
                if (colNum < numEdgeKeys + 5) return coreCharacters[rowNum][colNum - numEdgeKeys];
                if (colNum >= lastCharacter - 5) return coreCharacters[rowNum][colNum - (lastCharacter - 5)];
                // Only the center part of the keyboard is left over.
                return "";
        }
    )});
    return {
        leftHomeIndex: 4,
        rightHomeIndex: keyWidths[KeyboardRows.Home].length - 1 - 4,
        keyPositions: getKeyPositions({keyWidths} as LayoutModel, false, fullMapping),
    }
}