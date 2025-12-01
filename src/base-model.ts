// Base types to be used in the entire app.
// This file should not have any imports from the app.

// --- Keymap Type System ---

export enum KeymapTypeId {
    Ansi30 = "ansi30",
    Thumb30 = "thumb30",
    Ansi = "ansi",
    AnsiWide = "ansiWide",
    SplitOrtho = "splitOrtho",
    Harmonic13Wide = "harmonic13wide",
    Harmonic14T = "harmonic14t",
}

export interface KeymapType {
    id: KeymapTypeId;
    // Number of keys per row, used for validation
    keysPerRow: number[];
    description?: string;
}

// Registry of all known keymap types
export const KEYMAP_TYPES: Record<KeymapTypeId, KeymapType> = {
    [KeymapTypeId.Ansi30]: { id: KeymapTypeId.Ansi30, keysPerRow: [10, 10, 10], description: "3×10 core letter keys" },
    [KeymapTypeId.Thumb30]: { id: KeymapTypeId.Thumb30, keysPerRow: [10, 10, 9, 1], description: "3×10 with thumb key replacing slash" },
    [KeymapTypeId.Ansi]: { id: KeymapTypeId.Ansi, keysPerRow: [2, 13, 11, 10, 2], description: "Full ANSI layout" },
    [KeymapTypeId.AnsiWide]: { id: KeymapTypeId.AnsiWide, keysPerRow: [2, 13, 11, 10, 2], description: "ANSI wide hand position" },
    [KeymapTypeId.SplitOrtho]: { id: KeymapTypeId.SplitOrtho, keysPerRow: [0, 11, 11, 10, 4], description: "Split ortholinear" },
    [KeymapTypeId.Harmonic13Wide]: { id: KeymapTypeId.Harmonic13Wide, keysPerRow: [2, 12, 13, 12, 2], description: "Harmonic 13-wide" },
    [KeymapTypeId.Harmonic14T]: { id: KeymapTypeId.Harmonic14T, keysPerRow: [1, 14, 13, 12, 4], description: "Harmonic 14 traditional" },
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

    /*
        Key mappings can be defined generically or layout-specific or both.
        Generic mappings can be shown on all layouts.
        Specific mappings override the generic one for one layout if both are defined.
            TODO: we might add a switch for the user to see also the generic one in that case.
        There can also be mappings that work only on a specific layout.
     */

    // NEW: unified mappings property indexed by KeymapTypeId
    // Will replace all the individual mapping properties below once migration is complete.
    mappings?: Partial<Record<KeymapTypeId, string[]>>;

    // This is 3 rows of 10 characters – just the keys that most published key mappings are remapping.
    // It leaves some great improvements untapped, but transfers more easily between different keyboard layouts.
    // (Which is an ironic prevision of fate, since ortho keyboards only became really popular after many
    // of the classical layouts were invented...)
    // This mapping should include 26 letters plus the punctuation characters `;,./`.
    mapping30?: string[];
    /* ^^^
        The fact that traditional keyboard mappings just swap things around those thirty positions is also some legacy
        not based on science. On the ANSI/Qwerty layout keys `'` and to less extend even `[` are easier to reach than `B`
        and just as easy as J and V, but still traditional mappings don't use them.
        Also, character-wise, the hyphen is used in English as much or more as semi-colon and slash (depending on personal
        style maybe). In any case, the hyphen has more reason to be part of the "core keys" than [] and \.
     */

    // Keys per row: 10, 10, 9 plus one thumb key.
    // Includes 26 letters plus the punctuation characters `;,.-`.
    // Other punctuation is placed by the Layout-specific mapping.
    // Note that this uses another "frame mapping" than 'mapping30', so it's an opportunity to modernize also the non-core
    // key arrangement a little!
    // For rationale see //thumb30-mapping-format.md
    mappingThumb30?: string[];

    // for correct dimensions, see the layout model files
    mappingAnsi?: string[];
    mappingAnsiWide?: string[];
    mappingSplitOrtho?: string[];
    mappingHarmonic13wide?: string[];
    mappingHarmonic14t?: string[];
    // mappingHarmonic13MS?: string[];
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

// NEW: Entry for supportedKeymapTypes array
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

    // NEW: Supported keymap types in preference order.
    // The first matching type between layout and FlexMapping is used.
    // Will replace thirtyKeyMapping, thumb30KeyMapping, fullMapping, and getSpecificMapping once migration is complete.
    supportedKeymapTypes?: SupportedKeymapType[];

    // to be filled by FlexMapping.mapping30
    thirtyKeyMapping?: LayoutMapping;

    // to be filled by FlexMapping.mappingThumb30
    // As a guideline `-` should be mapped closer to the top and right hand, so it's closer to its old position and also
    // the `=+` key. (The latter being important for tapping Ctrl with + and - to zoom in and out.
    // Ctrl held with one hand, + and - tapped with the other.)
    thumb30KeyMapping?: LayoutMapping;

    // to be filled by whatever getSpecificMapping() selects
    fullMapping?: LayoutMapping;

    // Finger assignment and key effort arrays have the same shape (number of entries in each row) as the LayoutMappings.
    // 'null' value used for gaps between keys and keys which require the hand off home position (such as the arrow cluster).
    mainFingerAssignment: (Finger | null)[][];

    hasAltFinger: (row: number, col: number) => boolean;

    singleKeyEffort: (number | null)[][];

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
