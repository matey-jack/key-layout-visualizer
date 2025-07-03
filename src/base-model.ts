// Base types to be used in the entire app.
// This file should not have any imports from the app.

export enum LayoutType {
    ANSI,
    Ortho,
    Harmonic,
}

export enum LayoutSplit {
    Bar,
    Cleave,
    Flex,
    TwoPiece,
}

// Enum values need to be fixed as 0..4 because we have literal arrays indexed with this.
export enum KeyboardRows {
    Number = 0,
    Upper = 1,
    Home = 2,
    Lower = 3,
    Bottom = 4,
}

export enum VisualizationType {
    LayoutEffort,
    LayoutFingering,
    LayoutAngle,
    MappingDiff,
    MappingFrequeny,
    MappingBigrams,
}

export const isLayoutViz = (t: VisualizationType) =>
    [VisualizationType.LayoutEffort, VisualizationType.LayoutFingering, VisualizationType.LayoutAngle].includes(t)

export interface FlexMapping {
    name: string;
    description?: string;
    sourceUrl?: string;

    /*
        Key mappings can be defined generically or layout-specific or both.
        The app shows only the ones that apply to the selected layout,
        falling back to Qwerty if you switch layouts and the selected mapping doesn't apply.
     */

    // This is 3 rows of 10 characters – just the keys that most published key mappings are remapping.
    // It leaves some great improvements untapped, but transfers more easily between different keyboard layouts.
    // (Which is an ironic prevision of fate, since ortho keyboards only became really popular after many
    // of the classical layouts were invented...)
    mapping30?: string[];

    // for correct dimensions, see the layout model files
    mappingAnsi?: string[];
    mappingHarmonic?: string[];
    mappingSplitOrtho?: string[];

    // for customizing the ANSI wide Layout
    ansiMovedColumns?: number[];
}

export enum Finger {
    LPinky = 0,
    LRing,
    LMiddle,
    LIndex,
    LThumb,
    RThumb,
    RIndex,
    RMiddle,
    RRing,
    RPinky,
}


export enum Hand {
    Left,
    Right,
}

export const hand = (finger: Finger) => Math.floor(finger / 5)

// constants for common single-key effort scores
// I don't know why I want to be different from other people who define home keys as "effort 1",
// but I think a typically medium-easy to type key should be "1" and home keys some number lower than that.
export const SKE_HOME = 0.2;
export const SKE_LF_UP = 1;
export const SKE_NEIGHBOR = 1.5;
export const SKE_PINKY_UP = 2;
export const SKE_INCONV_NEIGHBOR = 2;
export const SKE_AWAY = 3;

export enum MappingChange {
    SamePosition,
    SameFinger,
    SameHand,
    SwapHands,
}

export type LayoutMapping = (string | number)[][];

export interface RowBasedLayoutModel {
    name: string;
    description: string;

    // 1 unit = width of the smallest key.
    rowStart: (row: KeyboardRows) => number;
    keyWidth: (row: KeyboardRows, col: number) => number;

    // How many columns are to the left of the split line for each row?
    // (Space bar splits just at the column of the row above.)
    splitColumns: number[];

    // Column number counted from 0.
    leftHomeIndex: number;
    rightHomeIndex: number;

    // this one is standardized to take a flex Mapping of exactly 3 by 10 keys
    thirtyKeyMapping: LayoutMapping;

    // this one takes a flex mapping depending on the layout
    fullMapping: LayoutMapping;

    // finger assignment and key effort arrays have the same shape (number of entries in each row) as the LayoutMappings.
    mainFingerAssignment: Finger[][];

    singleKeyEffort: number[][];

    getSpecificMapping(flexMapping: FlexMapping): string[] | undefined;
}
