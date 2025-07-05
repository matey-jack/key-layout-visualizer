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

export const isThumb = (finger: Finger) =>
    finger == Finger.RThumb || finger == Finger.LThumb;

export interface KeyPosition {
    label: string;

    // Logical positions, that is, indices to the layout-arrays.
    row: number;
    col: number;

    // Graphical position on the screen, taking into account different key width and gaps.
    // Measured in fractional units of one square key.
    colPos: number;

    // Needed for a different purpose, but convenient to have in the same structure.
    finger: Finger;
    hasAltFinger: boolean;
}

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

    hasAltFinger: (row: number, col: number) => boolean;

    singleKeyEffort: number[][];

    getSpecificMapping(flexMapping: FlexMapping): string[] | undefined;
}

// this is the format that we received as JSON array
export type BigramList = [string, number][];

export interface BigramMovement {
    a: KeyPosition;
    b: KeyPosition;
    type: BigramType;
    // original value is used for weighting.
    frequency: number;
    // frequency rank used for formatting bigram lines.
    rank: number;
    draw: boolean;
}

// Listed in order of priority.
// This means that for SameFinger, AltFinger, or OppositeLateral we don't care about the row.
// (All other cases are mutually exclusive anyway.)
export enum BigramType {
    OtherHand,
    InvolvesThumb,
    SameFinger,
    // AltFinger applies when both keys have the same main assigned finger, but one of the keys has an alt-fingering available.
    AltFinger,
    // TODO: our current definition column-difference between keys > 4 does not apply to any bigram,
    //  because pinkies have no lateral movement to letters and even on wide layouts, there are no letters in the central column.
    OppositeLateral,
    SameRow,
    NeighboringRow,
    OppositeRow,
}

// Indexed by BigramType!
export const bigramEffort = [
    0,
    0,
    4,
    1,
    2,
    // this is fun to type, so gives a rebate on effort.
    -0.5,
    0,
    2,
];
