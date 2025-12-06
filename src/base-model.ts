// Base types to be used in the entire app.
// This file should not have any imports from the app.

// --- Keymap Type System ---

/*
 * There are two generic keymap types: ansi30 and thumb30 which map just the central 30 keys: 26 letters and 4 punctuation charaters.
 *
 * And then there are some keyboard layout specific key maps which allow to remap all character keys and some other keys as well.
 */
export enum KeymapTypeId {
    /** Ansi30 keymap
     This is 3 rows of 10 characters – just the keys that most published key mappings are remapping.
     It leaves some great improvements untapped, but transfers more easily between different keyboard layouts.
     (Which is an ironic prevision of fate, since ortho keyboards only became really popular after many
     of the classical layouts were invented...)
     This mapping should include 26 letters plus the punctuation characters `;,./`.
     */
    Ansi30 = "ansi30",
    /* ^^^
        The fact that traditional keyboard mappings just swap things around those thirty positions is also some legacy
        not based on science. On the ANSI/Qwerty layout keys `'` and to less extend even `[` are easier to reach than `B`
        and just as easy as J and V, but still traditional mappings don't use them.
        Also, character-wise, the hyphen is used in English as much or more as semi-colon and slash (depending on personal
        style maybe). In any case, the hyphen has more reason to be part of the "core keys" than [] and \.
     */


    /** Thumb30 keymap
     Keys per row: 10, 10, 9 plus one thumb key.
     Includes 26 letters plus the punctuation characters `;,.-`.
     Other punctuation is placed by the Layout-specific mapping.
     For rationale see //thumb30-mapping-format.md
     */
    Thumb30 = "thumb30",

    // All the boring rest.
    Ansi = "ansi",
    AnsiWide = "ansiWide",
    SplitOrtho = "splitOrtho",
    Harmonic12 = "harmonic12",
    Harmonic13Wide = "harmonic13wide",
    Harmonic13MS = "harmonic13ms",
    Harmonic14T = "harmonic14t",
}

export interface KeymapType {
    id: KeymapTypeId;
    // Number of mapping spots per row, used for validation.
    // A row with 0 mapping spots is fully defined by the frame mapping.
    // The FlexMappings entirely omit this row in their matrices.
    keysPerRow: number[];
    description?: string;
}

// Registry of all known keymap types
export const KEYMAP_TYPES: Record<KeymapTypeId, KeymapType> = {
    [KeymapTypeId.Ansi30]: {
        id: KeymapTypeId.Ansi30,
        keysPerRow: [0, 10, 10, 10, 0],
        description: "3×10 core letter keys"
    },
    [KeymapTypeId.Thumb30]: {
        id: KeymapTypeId.Thumb30,
        keysPerRow: [0, 10, 10, 9, 1],
        description: "3×10 with thumb key replacing slash"
    },
    [KeymapTypeId.Ansi]: {
        id: KeymapTypeId.Ansi,
        keysPerRow: [2, 13, 11, 10, 0],
        description: "Full ANSI layout"
    },
    [KeymapTypeId.AnsiWide]: {
        id: KeymapTypeId.AnsiWide,
        keysPerRow: [2, 13, 11, 10, 2],
        description: "ANSI wide hand position"
    },
    [KeymapTypeId.SplitOrtho]: {
        id: KeymapTypeId.SplitOrtho,
        keysPerRow: [0, 11, 11, 10, 4],
        description: "Split ortholinear"
    },
    [KeymapTypeId.Harmonic12]: {
        id: KeymapTypeId.Harmonic12,
        keysPerRow: [1, 9, 12, 9, 2],
        description: "Harmonic 12 mini"
    },
    [KeymapTypeId.Harmonic13Wide]: {
        id: KeymapTypeId.Harmonic13Wide,
        keysPerRow: [2, 10, 13, 10, 2],
        description: "Harmonic 13 wide"
    },
    [KeymapTypeId.Harmonic13MS]: {
        id: KeymapTypeId.Harmonic13MS,
        keysPerRow: [0, 12, 10, 11, 2],
        description: "Harmonic 13 midshift"
    },
    [KeymapTypeId.Harmonic14T]: {
        id: KeymapTypeId.Harmonic14T,
        keysPerRow: [1, 13, 11, 10, 4],
        description: "Harmonic 14 traditional"
    },
};

// --- End Keymap Type System ---

export enum LayoutType {
    ANSI,      // irregular stagger
    Harmonic,  // regular 0.5 stagger
    Ergoplank, // regular 0.25 stagger
    Ergosplit,     // zero stagger
}

// Note this depends on enum order, this is why I put it right under the enum!
export const LayoutTypeNames = [
    "ANSI / TypeWriter",
    "Harmonic family",
    "Ergoplank / Katana",
    "Split Ortho",
];

export const LayoutTypeNotes =[
    "Irregular stagger",
    "Symmetric 0.5u stagger",
    "Symmetric 0.25u stagger",
    "No row stagger, optional column-stagger"
]

// Enum values need to be fixed as 0..4 because we have literal arrays indexed with this.
export enum KeyboardRows {
    Number = 0,
    Upper = 1,
    Home = 2,
    Lower = 3,
    Bottom = 4,
}

export enum VisualizationType {
    LayoutKeySize,
    LayoutKeyEffort,
    LayoutFingering,
    LayoutAngle,
    MappingDiff,
    MappingFrequeny,
    MappingBigrams,
    MappingAltGr,
}

export const isLayoutViz = (t: VisualizationType) =>
    [
        VisualizationType.LayoutKeySize, VisualizationType.LayoutKeyEffort, VisualizationType.LayoutFingering, VisualizationType.LayoutAngle
    ].includes(t)

export interface FlexMapping {
    name: string;
    techName?: string;
    localMaximum?: boolean,
    fallback?: FlexMapping,
    description?: string;
    sourceUrl?: string;
    sourceLinkTitle?: string;
    // used for showing the learning diff
    comparisonBase?: FlexMapping;
    mappings: Partial<Record<KeymapTypeId, string[]>>;
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
    finger === Finger.RThumb || finger === Finger.LThumb;

/*
    Key Movements are of three kinds:
        - entering, when prev===undefined;
        - exiting, when next===undefined;
        - moving, when both are defined.
 */
export interface KeyMovement {
    prev?: KeyPosition;
    next?: KeyPosition;
    // Invariant: at least one of prev or cur most be defined. If both are defined, their .label must be the same or equivalent.
    // (We'll add an equivalency function later. Until then, they must be the same.)
}

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
export const SKE_INCONV_NEIGHBOR = 2;
export const SKE_AWAY = 3;

export enum MappingChange {
    SamePosition,
    SameFinger,
    SameHand,
    SwapHands,
}

export type LayoutMapping = (string | number | null | [number, number])[][];

export const harmonicStaggerOffsets = [1, 0.5, 0, -0.5];

export const KEY_COLOR = {
    EDGE: "edge-key",
    HIGHLIGHT: "highlighted-key",
}

export type KeyColor = (typeof KEY_COLOR)[keyof typeof KEY_COLOR];

export interface SupportedKeymapType {
    typeId: KeymapTypeId;
    frameMapping: LayoutMapping;
}

export interface RowBasedLayoutModel {
    name: string;
    description: string;

    // 1 unit = width of the smallest key.
    // This defines symmetric indentation applied to both sides of the keyboard row.
    // For indentation on one side only, insert a gap ('null' in the keymap) instead.
    rowIndent: [number, number, number, number, number];

    // Different keyWidth and keyCap with is basically a different way to specify gaps.
    // It's different gaps than null entries in the keymap, because they are symmetric
    // and don't add a column in all the layout arrays.
    keyWidths: number[][];
    keyCapWidth?: (row: KeyboardRows, col: number) => (number | undefined);
    keyCapHeight?: (row: KeyboardRows, col: number) => number;

    keyColorClass?: (label: string, row: KeyboardRows, col: number) => KeyColor;

    // How many columns are to the left of the split line for each row?
    // (We could actually automatically derive this from the finger assignment...)
    splitColumns?: number[];

    // Column number counted from 0.
    leftHomeIndex: number;
    rightHomeIndex: number;

    // cumulative values relative to home row
    staggerOffsets: number[];
    symmetricStagger: boolean;

    // More specific keymap types should be first in the list, so they will be preferred over the generic ones.
    supportedKeymapTypes: SupportedKeymapType[];

    // Finger assignment and key effort arrays have the same shape (number of entries in each row) as the LayoutMappings.
    // 'null' value used for gaps between keys and keys which require the hand off home position (such as the arrow cluster).
    mainFingerAssignment: (Finger | null)[][];

    hasAltFinger: (row: number, col: number) => boolean;

    singleKeyEffort: (number | null)[][];
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
    OppositeLateral,
    SameRow,
    NeighboringRow,
    // those are the awkward "scissor" bigrams.
    OppositeRow,
}

// Indexed by BigramType!
export const bigramEffort = [
    0,
    0,
    4,
    1,
    2,
    // This rebate gives an outsized advantage to placing frequent letters in the center of the home row,
    // thus making the old Cozy Keyboard look better than any Thumby variant, which is not
    // reflected in actual typing experience.
    0, // -0.33,
    0,
    2,
];
