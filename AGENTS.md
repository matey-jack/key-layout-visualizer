# System documentation

This is a TypeScript/Vite/Preact project with the conventional folder structure and build scripts documented in package.json.
`tsconfig.app.json` aliases `react` and `react-dom` to `preact/compat`, so a `react` import resolves to Preact
and Preact-only APIs (signals, `@testing-library/preact`) are the ones to reach for.

It is a single page application which shows a keyboard (rendered via SVG by [KeyboardSvg.tsx](src/layout/KeyboardSvg.tsx)) at the top, a list of keymaps on the bottom left, and some detail information on the bottom right.

There are several different visualizations (called "vizzies" from here on) which show different information on the keyboard diagram. 
Some vizzies show information only related to the keyboard layout (like key size statistics, finger assignment, key effort assignment, ...) and others show information about the selected keymap.
For most visualizations, key labels are shown according to the keymap which is selected in the bottom left list.

The data model consists of:

* keyboard layouts (`LayoutModel` in [base-model.ts](src/base-model.ts), extending the `RenderableLayoutModel` that the
  Semi-Ergo Explorer shares) which define the number, size, and position of available keys. 
  Keyboards layouts also have data on which finger is used to type which key and how much effort this takes.
  This data is used to evaluate keymaps.

* key maps (`FlexMapping`, same file): define which key label (letter or key function) goes where on a keyboard layout. 
   - There are layout-independent "letter maps" which contain 30 or 32 characters (the generic keymap types in
     `KEYMAP_TYPES`, which also says how many of them go in each row). 
     Each keyboard layout defines which keys will receive those characters (usually the ones easiest to reach) and what is mapped to the remaining keys.
   - And there are Layout-specific mappings which map all 26 letter and 11 punctuation keys plus some more keys, but still not all the keys, so that each specific keymap can still cover several layouts that are variants of each other, each specifying what's mapped to the remaining keys.

* Letter and bigram frequency data for different languages which is used to calculate weighted typing effort for those languages and each mapping for the selected keyboard layout.

## Testing

A fresh checkout needs `npm ci` before any of this works.

The local app runs under http://localhost:3000 (or whichever port [vite.config.ts](vite.config.ts) says.) The app auto-updates after code changes, so you can test features there by making code changes and refreshing the browser.
The whole app state lives in the URL hash (see `createAppState` in [app-state.ts](src/app-state.ts) for the parameter
names), so you can open the app directly in the state you want to look at.

- `npm test` - Runs the unit tests, can be called by AI agents.
  It transpiles without typechecking, so it happily runs code that does not compile.
- `npm run build` - The actual gate: circular-import check (dpdm), `tsc -b`, vite build, SEO content generation.
  Run it before calling a change done, or a type error reaches CI unseen.
- `npx biome check src/ scripts/` - Lint. (`npm run biome-fix` is the same thing with `--write`.)
- `npm run e2e` - Run all Playwright tests, from the `e2e/` directory.
  Set `PLAYWRIGHT_CHROMIUM_PATH` if the environment brings its own Chromium instead of Playwright's own download.
- `npm run e2e:ui` - Run tests with UI mode for debugging, only for human use!

CI ([build.yml](.github/workflows/build.yml)) runs all of those, the e2e tests in a job of their own,
and deploys only when both jobs are green.

## Adding a keyboard layout model or variant

The design rules for the board itself are in [docs/layout-design-guide.md](docs/layout-design-guide.md).
A new model has to be registered in every one of these, and the compiler only catches some of it:

- its own file in `src/layout/`, with the frame mappings for each keymap type it supports,
- [all-layout-models.ts](src/all-layout-models.ts) - the list the shape-validating tests iterate over,
- [layout-selection.ts](src/layout-selection.ts) - which options select it,
- [app-model.ts](src/app-model.ts) - the variant enum (never renumber: the URL parameters store these values),
- [app-state.ts](src/app-state.ts) - URL parameter and default,
- the matching `*LayoutOptions.tsx` component - the buttons,
- [seo-content.ts](src/seo-content.ts) - only if the model's description says something the listed ones don't.
  Note that this file exports an `allLayoutModels` of its own, a subset of the one above.

# Where the rest is written down

- [ReadMe.md](ReadMe.md) - what the app is for, the terminology, and the reasoning behind the keyboards it shows.
- [css-gotchas.md](css-gotchas.md) - CSS lessons learned in this project (subgrid row sharing, `min-height` / `align-content` interaction, bold ghost `::after` pattern).
- [docs/key-levels.md](docs/key-levels.md) - the Shift and AltGr levels: which pairing a map gets and why. The largest spec here.
- [docs/key-symbols.md](docs/key-symbols.md) - which glyph stands for which non-character key, and where the code keeps that list.
- [docs/layout-design-guide.md](docs/layout-design-guide.md) - key sizes, staggering and gaps: the rules a new layout model should follow.
- [docs/thumb30-mapping-format.md](docs/thumb30-mapping-format.md) and [docs/thumb32-rationale.md](docs/thumb32-rationale.md) - why the generic keymap types hold the keys they hold.
- [docs/ergoplank-family-notes.md](docs/ergoplank-family-notes.md) - what distinguishes the boards of that family from each other.
- [scripts/ReadMe.md](scripts/ReadMe.md) - the read-only probes over the layout and mapping tables, and what each answers.
- `docs/old-plans/` - historic, kept for interest; do not treat as a description of the code.
- [TODO.txt](TODO.txt) and [ideas.txt](ideas.txt) - planned work and unsure ideas respectively.

# Code Style Guidelines

Avoid optional parameters unless there's a good reason, like when there are several or most callers really use the same value.
Prefer to add parameter values at each call site and make the parameter mandatory. 

