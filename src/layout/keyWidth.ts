import type {KeyboardRows} from "../base-model.ts";
import {frac, sum} from "../library/math.ts";

export const zeroIndent: [number, number, number, number, number] = [0, 0, 0, 0, 0]; // Array(5).fill(0); is a type error.

/**
 MonotonicKeyWidth and SymmetricKeyWidth both generate a keyWidth array for a keyboard row.
 Each object of the class has generic properties describing the keyboard (such as width, staggering, and rowIndent).
 Then you call the function row() with parameters specifying how it should be staggered.
 You make a 'keyWidths' array for a layout model, simply as a constant array with usually four rows being a call to this function.
 And the bottom row defined separately.
 */

/**
 This class is for boring old, typewriter-like staggered keyboards like ANSI.
 It also works for the Harmonic range, because a 0.5 stagger is monotonic and symmetric at the same time.
 Numbers don't have to fall on a fixed grid, any fractions are fine (as long is the widths add up).
 */
export class MonotonicKeyWidth {
    constructor(
        readonly kbWidth: number,
        // Passing the values from the layoutModel to calculate the remaining width of each row.
        readonly rowIndent: [number, number, number, number, number],
        // For logging purposes.
        readonly kbName: string,
    ) {
    }

    // The width of the left-edge key defines the entire row.
    // Right-edge key-width only needs to be specified if >= 2.
    // If omitted, a fitting value between 1 and <2 will be calculated.
    row(row: KeyboardRows, leftEdge: number, rightEdge?: number) {
        const totalKeyWidth = this.kbWidth - 2 * this.rowIndent[row];
        rightEdge = rightEdge || 1 + frac(totalKeyWidth - leftEdge);
        const remainingWidth = totalKeyWidth - leftEdge - rightEdge;
        if (remainingWidth !== Math.floor(remainingWidth)) {
            console.log(`ERROR: ${this.kbName} row ${row}: remaining width ${remainingWidth} is not integer!`);
        }
        return [leftEdge, ...Array(remainingWidth).fill(1), rightEdge];
    }
}

/**
 Generates rows of keyWidth arrays for a keyboard with symmetric staggering.
 The difference to monotonically staggered keyboards, when just considering individual rows,
 is that there are up to three non-unitary keys per row: left, center, right.

 For the axis to be guaranteed to be exactly in the middle of the gap,
 all keyWidths and indents must be quarters of integers,
 and `kbWidth` and `axis` must be halves of integers.

 But even if numbers are arbitrary, we can guarantee that the axis will at least go through the gap
 or touch it on its side.
 */
export class SymmetricKeyWidth {
    readonly axis: number;

    constructor(
        readonly kbWidth: number,
        // Passing the values from the layoutModel to calculate the remaining width of each row.
        readonly rowIndent: [number, number, number, number, number],
        /*
            Where the gap will be placed. If undefined, use the center of the keyboard.
            This will also determine the size of gap, 0.5 or 1.5, because the gap will always be centered on this line.
            (That is, rowIndent + sum(keyWiths to the left) + gapWidth/2 === axis.)
        */
        axis?: number,
    ) {
        this.axis = axis ?? kbWidth / 2;
    }

    /*
        If only one edge key is specified, the other is assumed to be the same size.
        `axis` overrides the value for this row. You can use it to specifically force a big or small gap.
     */
    row(row: KeyboardRows, leftEdge: number, rightEdge?: number, axis: number = this.axis): number[] {
        rightEdge = rightEdge || leftEdge;
        // the width of all non-edge keys plus the gap, if any.
        const remainingWidth = this.kbWidth - leftEdge - rightEdge - 2 * this.rowIndent[row];
        const uniKeys = Math.floor(remainingWidth);
        const gapWidth = remainingWidth - uniKeys;
        const result = [leftEdge, ...Array(uniKeys).fill(1), rightEdge];
        if (gapWidth === 0) {
            return result;
        }
        const leftFloat = axis - this.rowIndent[row] - leftEdge;
        // this is also the position where the gap will be
        const keysLeftOfAxis = 1 + Math.floor(leftFloat);

        // This value can only be 0.25 or 0.75 if everyone played to our rule of only using quarters and halves as specified.
        // But even if they don't, we'll just take whatever is closest to perfect symmetry.
        const leftPartOfGap = leftFloat - Math.floor(leftFloat);
        if (leftPartOfGap > gapWidth) {
            // This means the axis doesn't go through the gap if we keep it at the minimal value.
            // So we merge it with the next key.
            result[keysLeftOfAxis] = 1 + gapWidth;
        } else {
            // Axis is on gap, so we add the fraction as a new element.
            result.splice(keysLeftOfAxis, 0, gapWidth);
        }
        return result;
    }
}

// This function can be directly used as the 'keyCapWidth' property of a LayoutModel.
// You can also chain them together to provide micro-gaps in several rows.
export type KeyCapWidthsFn = (row: KeyboardRows, col: number, next?: KeyCapWidthsFn) => number;

/*
    Micro gaps are added by making keyWidth slightly higher (it's actually a key switch distance, only we don't call it that),
    and then using keyCapWidth as the actual keyWidth.
    This class takes a description of how much space should be distributed between what keys,
    and from this creates a row of adjusted keyCapWidths plus a keyCapWith function.

    Note that each instance of the class describes only one row.
 */
export class MicroGapKeyWidths {
    readonly keyWidths: number[];
    readonly keyCapWidths: number[];

    constructor(
        readonly row: KeyboardRows,
        // Both arrays must have the same length.
        // A group width can be null or NaN to signify: use keys directly with no microgaps.
        // The most typical use-case has only one group with an actual groupWidth
        // and then optionally straight groups to the left and right of that.
        groupWidths: number[],
        keyWidthsPerGroup: number[][],
        // needed for the keyCapWidths function
    ) {
        this.keyCapWidths = keyWidthsPerGroup.flat();
        this.keyWidths = [];
        groupWidths.forEach((groupWidth, i) => {
            const kWidths = keyWidthsPerGroup[i];
            if (!groupWidth) {
                this.keyWidths.push(...kWidths);
            } else {
                const remainder = groupWidth - sum(kWidths);
                kWidths.forEach((kw) => {
                    this.keyWidths.push(kw + remainder / kWidths.length);
                })
            }
        });
    }

    keyCapWidthsFn(next?: KeyCapWidthsFn) {
        return (r: KeyboardRows, col: number) => {
            if (r === this.row) {
                return this.keyCapWidths[col];
            }
            if (next) {
                return next(r, col);
            }
            return undefined;
        }
    }
}

/* some helpers for the bottom row */

export function mirror<T>(...arr: T[]): T[] {
    return arr.concat(arr.toReversed());
}

export function mirrorOdd<T>(...arr: T[]): T[] {
    const flipped = arr.toReversed();
    arr.pop();
    return arr.concat(flipped);
}