Current state:
 * the actual keymaps are named properties on the FlexMapping class.
   - thirthyKeyMapping has the 3 by 10 core rows from the ANSI keyboard. That is letters, comma, dot, semicolon, slash.
   - thumb30Mapping has the same, but the hyphen (minus) instead of the slash.
   - specific mappings for some keyboard types
 * each keyboard layout has at most three frame mappings: one to be filled by each of thirtyKeyMapping and thumb30Mapping; and one called fullMapping which is for the keyboard-specific mapping corresponding to this keyboard in the FlexMapping. If such a fullMapping is present, there will also be a function getSpecificMapping which picks the corresponding specific mapping from FlexMapping, which nicely decentralizes this logic.  
 * This all works fine unless the user selects a layout/mapping combination that has no fit, meaning the FlexMap only defines mapping types which the layout does not support. The desired application behavior in this case is to select a similar keymap (if the layout was switched by the user) or a similar layout (if the keymap was switched). This is currently hard-coded logic with some bugs and should be replaced by a more generic logic. 

Desired state:
 - We introduce the new explicit concept of a "keymapType" identified by a string ID. Each keymap type has some meta-data like how many rows of keys it has and how many keys are in each row. But this data is not used in the application logic, it's mostly for automatic validation in unit test and for better error reporting.
 - Each FlexMapping can define any number (at least one) of keymapTypes, explicitly labeled with their id, and each keyboard layout does the same. The order of definition on the keyboard layout decides which keymap type is used if a FlexMapping / keyboard combination has several matches.
 - Create a generalized logic to find a matching (but similar) keyboard layout when a new mapping is selected and vice versa.

---

# Implementation Plan

While the code contains both old and new logic, fillMapping() should be written to prefer the new mapping types if available, fall back to old logic.
Likewise, setMapping and setLayout in app-state.ts can ignore some requested change of mapping or layout if that leads to a missing match. We can add the new logic there last. We just need to avoid crashes due to mismatching layout and mapping being set.
In @DetailView.tsx MappingSummary(), we should show the currently used KeymapType.

## Phase 1: Define the new keymapType system

1. DONE **Create `KeymapType` interface** in `base-model.ts`:
   - `id: string` — unique identifier (e.g., `"ansi30"`, `"thumb30"`, `"ansi"`, `"ansiWide"`, `"splitOrtho"`, `"harmonic13wide"`, `"harmonic14t"`)
   - `rows: number[]` — number of keys per row (for validation)
   - `description?: string` — human-readable description

2. DONE **Create a registry of all keymapTypes** as a `Record<string, KeymapType>` constant.

## Phase 2: Refactor `FlexMapping`

3. DONE **Replace individual mapping properties** with a single `mappings` record:
   - Remove: `mapping30`, `mappingThumb30`, `mappingAnsi`, `mappingAnsiWide`, `mappingSplitOrtho`, `mappingHarmonic13wide`, `mappingHarmonic14t`
   - Add: `mappings: Record<string, string[]>` — keys are keymapType IDs

4. DONE **Migrate all existing FlexMapping definitions** in `mappings.ts` to use the new structure.

## Phase 3: Refactor `RowBasedLayoutModel`

5. **Replace frame mapping properties** with a `supportedKeymapTypes` array:
   - Remove: `thirtyKeyMapping`, `thumb30KeyMapping`, `fullMapping`, `getSpecificMapping()`
   - Add: `supportedKeymapTypes: Array<{ typeId: string; frameMapping: LayoutMapping }>`
   - The array order defines preference (first match wins)
   - List of all layout models can be inferred from [layout-selection.ts](src/layout-selection.ts)
IN PROGRESS: some Layout Models have the new fields and also still have the old fields.

6. **Migrate all layout model files** to the new structure.

## Phase 4: Update matching logic

7. DONE **Rewrite `fillMapping()` in `layout-functions.ts`**:
   - Iterate through `layout.supportedKeymapTypes` in order
   - For each, check if `flexMapping.mappings[typeId]` exists
   - Return the first match

8. DONE **Rewrite `hasMatchingMapping()`**: 
   - Return true if any typeId in `layout.supportedKeymapTypes` exists in `flexMapping.mappings`

9. DONE **Create new `findCompatibleLayout()` function**:
   - Given a FlexMapping and list of all layouts, find the best matching layout
   - Use similarity heuristics (same LayoutType preferred, then by keymapType overlap)

10. DONE **Create new `findCompatibleMapping()` function**:
    - Given a RowBasedLayoutModel and list of all mappings, find the best matching mapping
    - Prefer mappings with specific support, then generic ones

## Phase 5: Simplify app-state.ts

11. **Replace hard-coded logic in `setLayout()` and `setMapping()`**:
    - Use the new generic `findCompatibleLayout()` / `findCompatibleMapping()` functions
    - Remove special cases for Colemak, ANSI variants, etc.

12. (removed)

## Phase 6: Update tests

13. DONE **Update `mappings.test.ts`** to validate mappings against their declared keymapType row counts.

14. **Add tests for the new matching/fallback logic**.

---

# Updated Interfaces

```typescript
// New type definition for keymap types
export interface KeymapType {
    id: string;
    // Number of keys per row, used for validation
    keysPerRow: number[];
    description?: string;
}

// Registry of all known keymap types
export const KEYMAP_TYPES: Record<string, KeymapType> = {
    "ansi30": { id: "ansi30", keysPerRow: [10, 10, 10], description: "3×10 core letter keys" },
    "thumb30": { id: "thumb30", keysPerRow: [10, 10, 9, 1], description: "3×10 with thumb key replacing slash" },
    "ansi": { id: "ansi", keysPerRow: [13, 13, 11, 10], description: "Full ANSI layout" },
    "ansiWide": { id: "ansiWide", keysPerRow: [13, 13, 11, 10], description: "ANSI wide hand position" },
    "splitOrtho": { id: "splitOrtho", keysPerRow: [12, 12, 12, 6], description: "Split ortholinear" },
    "harmonic13wide": { id: "harmonic13wide", keysPerRow: [13, 13, 13, 7], description: "Harmonic 13-wide" },
    "harmonic14t": { id: "harmonic14t", keysPerRow: [14, 14, 14, 7], description: "Harmonic 14 traditional" },
};

export interface FlexMapping {
    name: string;
    techName?: string;
    localMaximum?: boolean;
    description?: string;
    sourceUrl?: string;
    sourceLinkTitle?: string;
    comparisonBase?: FlexMapping;

    // Key mappings indexed by keymapType ID
    // At least one entry required. Example: { "ansi30": [...], "ansiWide": [...] }
    mappings: Partial<Record<string, string[]>>;
}

export interface RowBasedLayoutModel {
    name: string;
    description: string;

    rowIndent: [number, number, number, number, number];
    keyWidths: number[][];
    keyCapWidth?: (row: KeyboardRows, col: number) => (number | undefined);
    keyCapHeight?: (row: KeyboardRows, col: number) => number;
    keyColorClass?: (label: string, row: KeyboardRows, col: number) => KeyColor;
    splitColumns?: number[];
    leftHomeIndex: number;
    rightHomeIndex: number;
    staggerOffsets: number[];
    symmetricStagger: boolean;

    // Supported keymap types in preference order.
    // The first matching type between layout and FlexMapping is used.
    supportedKeymapTypes: Array<{
        typeId: string;
        frameMapping: LayoutMapping;
    }>;

    mainFingerAssignment: (Finger | null)[][];
    hasAltFinger: (row: number, col: number) => boolean;
    singleKeyEffort: (number | null)[][];
}
```
