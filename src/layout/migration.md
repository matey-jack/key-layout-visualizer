# Layout Models Migration Status to SupportedKeymapType Format

This document tracks the migration of layout models from the old format (using `getSpecificMapping()`, `thirtyKeyMapping`, `thumb30KeyMapping`, `fullMapping`) to the new `SupportedKeymapType` format with unified keymap type support.

## Layout Models List

### ANSI-based Layouts

#### 1. **ansiLayoutModel** (ANSI/IBM)
- **File**: `ansiLayoutModel.ts`
- **Status**: ✅ PARTIALLY MIGRATED
- **Details**:
  - ✅ Has `supportedKeymapTypes` property with `Ansi` and `Ansi30` types
  - ⚠️ Still has old `getSpecificMapping()` for backward compatibility
  - ❌ No `thumb30KeyMapping` support in new format (intentional)
- **Transformation Functions**: Uses `copyAndModifyKeymap()` helper
- **Notes**: 
  - Base model that other ANSI variants derive from
  - `ansiWideLayoutModel` extends this with wide hand position
  - Supports both `fullMapping` and `thirtyKeyMapping` approaches

#### 2. **ansiWideLayoutModel** (ANSI with wide hand position)
- **File**: `ansiLayoutModel.ts`
- **Status**: ✅ PARTIALLY MIGRATED
- **Details**:
  - ✅ Has `supportedKeymapTypes` with `AnsiWide` and `Ansi30` types
  - ⚠️ Still has old `getSpecificMapping()` for backward compatibility
  - ✅ Has `thumb30KeyMapping` support in new format
- **Transformation Functions**: Uses `copyAndModifyKeymap()` and `splitSpaceBar()` (complex transformation)
- **Notes**:
  - Variant created from `ansiIBMLayoutModel`
  - Uses helper functions: `splitSpaceBar()`, `createApple()`, `createHHKB()`

#### 3. **ahkbLayoutModel** (ANSI Happy Hacker Keyboard)
- **File**: `ahkbLayoutModel.ts`
- **Status**: ⚠️ NOT MIGRATED
- **Details**:
  - ❌ No `supportedKeymapTypes` property
  - ❌ Uses old `getSpecificMapping()` pattern only
  - ❌ No `thumb30KeyMapping`
- **Transformation Functions**: Uses custom transformation (analog to ANSI variants)
- **Notes**:
  - Variant created by `ahkbAddAngleMod()` function
  - Used in layout-selection.ts with optional angle mod

### Ergoplank Layouts

#### 4. **ergoPlank60LayoutModel** (Ergoplank 60 ANSI angle)
- **File**: `ergoPlank60LayoutModel.ts`
- **Status**: ❌ NOT MIGRATED
- **Details**:
  - ❌ No `supportedKeymapTypes` property
  - ✅ Has both `thirtyKeyMapping` and `thumb30KeyMapping`
  - ✅ Has `fullMapping`
  - ✅ Uses `getSpecificMapping()` returning `undefined`
- **Transformation Functions**: 
  - `ep60addAngleMod()` - creates variant with angle mod
  - Uses `copyAndModifyKeymap()` helper
  - `angleModKeymap()` function for key modifications
- **Variants**:
  - `ep60WithArrowsLayoutModel` - uses helper function `replaceLast()`

#### 5. **ep60WithArrowsLayoutModel** (Ergoplank 60 with cursor block)
- **File**: `ergoPlank60LayoutModel.ts`
- **Status**: ❌ NOT MIGRATED (derived)
- **Details**:
  - Spreads from `ergoPlank60LayoutModel`
  - Uses `replaceLast()` helper to modify rows
  - Has custom `keyCapWidth()` function reference
- **Transformation Functions**: Uses `replaceLast()` helper

#### 6. **katanaLayoutModel** (Katana 60)
- **File**: `katanaLayoutModel.ts`
- **Status**: ❌ NOT MIGRATED
- **Details**:
  - ❌ No `supportedKeymapTypes` property
  - ✅ Has both `thirtyKeyMapping` and `thumb30KeyMapping`
  - ❌ No `fullMapping`
  - ✅ Uses `getSpecificMapping()` returning `undefined`
- **Transformation Functions**: None (static layout)

### Ergoboard 65 Low-Shift Layouts

#### 7. **eb65LowshiftLayoutModel** (Ergoboard 65 LowShift)
- **File**: `eb65LowshiftLayoutModel.ts`
- **Status**: ❌ NOT MIGRATED
- **Details**:
  - ❌ No `supportedKeymapTypes` property
  - ✅ Has both `thirtyKeyMapping` and `thumb30KeyMapping`
  - ❌ No `fullMapping`
  - ✅ Uses `getSpecificMapping()` returning `undefined`
- **Transformation Functions**: None (static layout)

#### 8. **eb65BigEnterLayoutModel** (Ergoboard 65 LowShift Big Enter)
- **File**: `eb65LowshiftLayoutModel.ts`
- **Status**: ❌ NOT MIGRATED (derived)
- **Details**: Spreads from `eb65LowshiftLayoutModel` with modified `name` and key mappings

#### 9. **eb65LowshiftWideLayoutModel** (Ergoboard 65 LowShift Wide)
- **File**: `eb65LowshiftWideLayoutModel.ts`
- **Status**: ❌ NOT MIGRATED
- **Details**:
  - ❌ No `supportedKeymapTypes` property
  - ✅ Has both `thirtyKeyMapping` and `thumb30KeyMapping`
  - ❌ No `fullMapping`
  - ✅ Uses `getSpecificMapping()` returning `undefined`
- **Transformation Functions**: Uses `angleModKeymap()` for angle mod variant
- **Variants**:
  - `eb65LowshiftWideAngleModLayoutModel` - uses `copyAndModifyKeymap()` with `angleModKeymap()`

#### 10. **eb65LowshiftWideAngleModLayoutModel** (Ergoboard 65 LowShift Wide angle mod)
- **File**: `eb65LowshiftWideLayoutModel.ts`
- **Status**: ❌ NOT MIGRATED (derived)
- **Details**: Spreads from `eb65LowshiftWideLayoutModel` with `copyAndModifyKeymap()` transformation

#### 11. **eb65MidshiftNiceLayoutModel** (Ergoboard 65 MidShift Nice - wide hands)
- **File**: `eb65MidshiftNiceLayoutModel.ts`
- **Status**: ❌ NOT MIGRATED
- **Details**:
  - ❌ No `supportedKeymapTypes` property
  - ✅ Has both `thirtyKeyMapping` and `thumb30KeyMapping`
  - ❌ No `fullMapping`
  - ✅ Uses `getSpecificMapping()` returning `undefined`
- **Transformation Functions**: None (static layout)

#### 12. **eb65MidshiftExtraWideLayoutModel** (Ergoboard 65 MidShift Extra Wide)
- **File**: `eb65MidshiftExtraWideLayoutModel.ts`
- **Status**: ❌ NOT MIGRATED
- **Details**:
  - ❌ No `supportedKeymapTypes` property
  - ✅ Has both `thirtyKeyMapping` and `thumb30KeyMapping`
  - ❌ No `fullMapping`
  - ✅ Uses `getSpecificMapping()` returning `undefined`
- **Transformation Functions**: None (static layout)

#### 13. **eb65CentralEnterLayoutModel** (Ergoboard 65 MidShift Central Enter - narrow hands)
- **File**: `eb65MidshiftNarrowLayoutModels.ts`
- **Status**: ❌ NOT MIGRATED
- **Details**:
  - ❌ No `supportedKeymapTypes` property
  - ✅ Has both `thirtyKeyMapping` and `thumb30KeyMapping`
  - ❌ No `fullMapping`
  - ✅ Uses `getSpecificMapping()` returning `undefined`
- **Transformation Functions**: None (static layout)

#### 14. **eb65MidshiftRightRetLayoutModel** (Ergoboard 65 MidShift Right Return - narrow hands)
- **File**: `eb65MidshiftNarrowLayoutModels.ts`
- **Status**: ❌ NOT MIGRATED
- **Details**:
  - ❌ No `supportedKeymapTypes` property
  - ✅ Has both `thirtyKeyMapping` and `thumb30KeyMapping`
  - ❌ No `fullMapping`
  - ✅ Uses `getSpecificMapping()` returning `undefined`
- **Transformation Functions**: None (static layout)

#### 15. **eb65VerticalEnterLayoutModel** (Ergoboard 65 MidShift Vertical Enter - narrow hands)
- **File**: `eb65MidshiftNarrowLayoutModels.ts`
- **Status**: ❌ NOT MIGRATED
- **Details**:
  - ❌ No `supportedKeymapTypes` property
  - ✅ Has both `thirtyKeyMapping` and `thumb30KeyMapping`
  - ❌ No `fullMapping`
  - ✅ Uses `getSpecificMapping()` returning `undefined`
- **Transformation Functions**: None (static layout)

### Harmonic Layouts

#### 16. **harmonic12LayoutModel** (Harmonic 12 Mini)
- **File**: `harmonic12LayoutModel.ts`
- **Status**: ❌ NOT MIGRATED
- **Details**:
  - ❌ No `supportedKeymapTypes` property
  - ✅ Has both `thirtyKeyMapping` and `thumb30KeyMapping`
  - ✅ Has `fullMapping`
  - ✅ Uses `getSpecificMapping()` returning `undefined`
- **Transformation Functions**: None (static layout)
- **Notes**: Has comment about using custom key index arrays with `[-1, 0]` syntax

#### 17. **harmonic13MidshiftLayoutModel** (Harmonic 13 MidShift)
- **File**: `harmonic13MidshiftLayoutModel.ts`
- **Status**: ❌ NOT MIGRATED
- **Details**:
  - ❌ No `supportedKeymapTypes` property
  - ✅ Has both `thirtyKeyMapping` and `thumb30KeyMapping`
  - ✅ Has `fullMapping`
  - ✅ Uses `getSpecificMapping()` returning `undefined`
- **Transformation Functions**: None (static layout)

#### 18. **harmonic13WideLayoutModel** (Harmonic 13 Wide)
- **File**: `harmonic13WideLayoutModel.ts`
- **Status**: ❌ NOT MIGRATED
- **Details**:
  - ❌ No `supportedKeymapTypes` property
  - ✅ Has both `thirtyKeyMapping` and `thumb30KeyMapping`
  - ✅ Has `fullMapping`
  - ✅ Uses `getSpecificMapping()` returning `undefined`
- **Transformation Functions**: None (static layout)

#### 19. **harmonic14TraditionalLayoutModel** (Harmonic 14 Traditional)
- **File**: `harmonic14TraditionalLayoutModel.ts`
- **Status**: ❌ NOT MIGRATED
- **Details**:
  - ❌ No `supportedKeymapTypes` property
  - ✅ Has both `thirtyKeyMapping` and `thumb30KeyMapping`
  - ✅ Has `fullMapping`
  - ✅ Uses `getSpecificMapping()` returning `undefined`
- **Transformation Functions**: None (static layout)

#### 20. **harmonic14WideLayoutModel** (Harmonic 14 Wide)
- **File**: `harmonic14WideLayoutModel.ts`
- **Status**: ❌ NOT MIGRATED
- **Details**:
  - ❌ No `supportedKeymapTypes` property
  - ✅ Has both `thirtyKeyMapping` and `thumb30KeyMapping`
  - ✅ Has `fullMapping`
  - ✅ Uses `getSpecificMapping()` returning `undefined`
- **Transformation Functions**: None (static layout)

### Split Layouts

#### 21. **splitOrthoLayoutModel** (Split Ortho)
- **File**: `splitOrthoLayoutModel.ts`
- **Status**: ⚠️ NOT MIGRATED
- **Details**:
  - ❌ No `supportedKeymapTypes` property
  - ✅ Has both `thirtyKeyMapping` and `thumb30KeyMapping`
  - ❌ No `fullMapping`
  - ✅ Uses `getSpecificMapping()` returning `undefined`
- **Transformation Functions**: None (static layout)

## Migration Complexity Summary

### 🟢 High Priority (Simple static layouts - no transformations)
These can be migrated straightforwardly by adding `supportedKeymapTypes` properties:
- harmonic12LayoutModel
- harmonic13MidshiftLayoutModel
- harmonic13WideLayoutModel
- harmonic14TraditionalLayoutModel
- harmonic14WideLayoutModel
- katanaLayoutModel
- eb65LowshiftLayoutModel
- eb65BigEnterLayoutModel
- eb65MidshiftNiceLayoutModel
- eb65MidshiftExtraWideLayoutModel
- eb65CentralEnterLayoutModel
- eb65MidshiftRightRetLayoutModel
- eb65VerticalEnterLayoutModel
- splitOrthoLayoutModel
===> ALL DONE 

**Total**: 14 layouts

### 🟡 Medium Priority (With transformation functions)
These require careful handling of transformation functions that modify keymaps:
- **ergoPlank60LayoutModel** - has `ep60addAngleMod()` transformation
- **eb65LowshiftWideLayoutModel** - has `angleModKeymap()` transformation
- **ansiLayoutModel (variants)** - uses `splitSpaceBar()`, `createApple()`, `createHHKB()` transformations

**Total**: 3-5 layouts (depending on variant handling)

### 🔴 High Complexity (Complex variants with spread operators)
- **ahkbLayoutModel** - needs special handling in transformation chain
- **ep60WithArrowsLayoutModel** - uses `replaceLast()` helper and custom `keyCapWidth()`

**Total**: 2 layouts

### Already Migrated
- **ansiLayoutModel** and **ansiWideLayoutModel** - have partial new format support

## Migration Notes

### Transformation Function Considerations
Layouts that use transformation functions like `copyAndModifyKeymap()` may need special attention:
1. Functions that modify keymaps in-place need to be aware of new format
2. Variant layouts (created via spread operator + transformations) need consistent naming and handling
3. Helper functions like `replaceLast()` and `angleModKeymap()` should remain separate but needs to work with new keymap types

### Backward Compatibility
- Old properties (`getSpecificMapping()`, `thirtyKeyMapping`, etc.) can remain for now
- New `supportedKeymapTypes` can coexist with old properties
- Layout-functions.ts has fallback logic in `fillMappingNew()` and `hasMatchingMappingNew()`

### Testing Impact
- Current tests in `ergoPlank60LayoutModel.test.ts` and `ansiLayoutModel.test.ts` should continue to work
- Migration should be tested incrementally per layout model
