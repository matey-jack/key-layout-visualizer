# Layout models in code

The design rules a board itself should follow - key sizes, staggering, gaps - are in
[layout-design-guide.md](layout-design-guide.md). This is about the code that expresses them.

## Composition

Models are plain object literals composed by **spread factories** (`{...lm, ...overrides}`), for example
`createErgoPlankCenterArrows`. Object spread drops the prototype, so class-based inheritance does not mix with
this pattern.

`keyColorClass(label, row, col)` returns a `KEY_COLOR` ("" boring / "edge-key" grey / "highlighted-key").
`ergoFamilyKeyColorClass(shape)` captures a frame shape to derive row width, so **re-bind it in any factory that
changes row widths** (center or inline arrows), or it uses stale geometry.

`model.keyWidths[row].length` always equals the frame-mapping row length - both drive `getKeyPositions` - which
makes it a safe live width source.

## Registering a new model or variant

The compiler catches only some of these, so walk the list:

- its own file in `src/layout/`, with the frame mappings for each keymap type it supports,
- [all-layout-models.ts](../src/all-layout-models.ts) - the list the shape-validating tests iterate over,
- [layout-selection.ts](../src/layout-selection.ts) - which options select it,
- [app-model.ts](../src/app-model.ts) - the variant enum. Never renumber: the URL parameters store these values.
- [app-state.ts](../src/app-state.ts) - URL parameter and default,
- the matching `*LayoutOptions.tsx` component - the buttons,
- [seo-content.ts](../src/seo-content.ts) - only if the model's description says something the listed ones don't.
  Note that this file exports an `allLayoutModels` of its own, a subset of the one above.
