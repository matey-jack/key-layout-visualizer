# Instructions for agents working in this repo

What the app is for, the terminology, and the reasoning behind the keyboards it shows: [ReadMe.md](ReadMe.md).
This file is the part you need before you know what you have been asked to do.

TypeScript/Vite/Preact, with the conventional folder structure and the build scripts in package.json.
`tsconfig.app.json` aliases `react` and `react-dom` to `preact/compat`, so a `react` import resolves to Preact
and Preact-only APIs (signals, `@testing-library/preact`) are the ones to reach for.

## The data model in code

* Keyboard layouts (`LayoutModel` in [base-model.ts](src/base-model.ts), extending the `RenderableLayoutModel` that
  the Semi-Ergo Explorer shares) define the number, size, and position of the keys, plus which finger types which key
  and how much effort that takes. Every variant the app can show is listed in [all-layout-models.ts](src/all-layout-models.ts).

* Key maps (`FlexMapping`, same file) define which label goes where. The generic keymap types in `KEYMAP_TYPES` hold
  30 or 32 characters and fit every layout; the layout-specific ones map most of a particular board. Each layout
  carries a frame mapping per keymap type, which says where those characters land and what the remaining keys say.
  The maps themselves are in [mappings.ts](src/mapping/mappings.ts) and its neighbours.

* Letter and bigram frequencies per language, used to weigh typing effort for a mapping on a layout.

## Commands, and what each one checks

A fresh checkout needs `npm ci` before any of this works.

- `npm test` - the unit tests. It transpiles without typechecking, so it happily runs code that does not compile.
- `npm run build` - the actual gate: circular-import check (dpdm), `tsc -b`, vite build, SEO content generation.
  Run it before calling a change done, or a type error reaches CI unseen.
- `npx biome check src/ scripts/` - lint. (`npm run biome-fix` is the same thing with `--write`.)
- `npm run e2e` - the Playwright tests in `e2e/`. Set `PLAYWRIGHT_CHROMIUM_PATH` if the environment brings its own
  Chromium instead of Playwright's own download.
- `npm run e2e:ui` - UI mode for debugging, only for human use!

CI ([build.yml](.github/workflows/build.yml)) runs all of those, the e2e tests in a job of their own, and deploys
only when both jobs are green.

## Working in this codebase

The app runs on http://localhost:3000 (or whichever port [vite.config.ts](vite.config.ts) says) and auto-updates on
code changes. Its whole state lives in the URL hash - `createAppState` in [app-state.ts](src/app-state.ts) has the
parameter names - so you can open it directly in the state you want to look at.

**The fastest ground truth is a `tsx` probe, not the browser.** This codebase is mostly pure functions over data
tables, `tsx` needs no install, and imports need explicit `.ts` extensions since the project is ESM:

    npx tsx -e "import('./src/base-model.ts').then(m => console.log(m.KEYMAP_TYPES.thumb32)).catch(e => console.log('ERR', e.stack))"

Keep the `.catch`: it tells a real failure apart from a silent one. On the author's Windows shell a multiline `-e`
script (and any top-level static `import` in one) exits 0 with no output at all, so write one physical line there
and use dynamic imports; on Linux both forms work.

**Outgoing keys stay in the SVG - don't read the DOM right after a switch.** After a layout or mapping switch the
keys of the *previous* board are still rendered next to the new ones, so that they can animate out. `getKeyMovements`
matches keys by label, so a key whose label changed counts as one leaving and one arriving, and both are in the DOM
at once. Outgoing keys carry no Shift/AltGr levels (`KeyboardLayer` only passes levels to `movement.next`), so they
show a bare base label. When reading the DOM to check a change, this looks exactly like a bug: a number row that is
supposed to be gone, punctuation whose Shift character vanished, two different sets of centre keys. Switch to
another mapping and back, or reload, and read again - or better, check the real thing with a probe and use the
browser only to confirm.

## Changing layout models

How the models are composed, which invariants hold, and every place a new model has to be registered:
[docs/layout-models-in-code.md](docs/layout-models-in-code.md).

## Code style

Avoid optional parameters unless there's a good reason, like when there are several or most callers really use the
same value. Prefer to add parameter values at each call site and make the parameter mandatory.

## Dependencies

First ask whether we need one at all. <https://youmightnotneed.com/> covers a lot of what the platform already
does, and a small function belongs in [src/library](src/library) rather than in a package - that is where `sum`
lives, since JavaScript has `Math.max` but no `sum`.

When we do add one, prefer small and focused over the library that does everything. Good signs:

- it is written in TypeScript and ships its own types, so no separate `@types/…` package is needed.
  Being listed on [jsr.io](https://jsr.io) is a good hint.
- it offers explicitly named exports rather than one big default object, which also keeps it tree-shakable.
- it brings few or no dependencies of its own: a package with a small API and forty transitive dependencies
  is not a small dependency.
- for anything that reaches the browser, the size it adds - `npm run build` prints the per-chunk numbers, so
  the before-and-after is easy to compare. A dev dependency is a cheaper decision than one that ships.

## Documentation style

A lot of the app describes itself, because the behavior is easily observed. We don't document key sizes or key
mappings, because it's easier to see them graphically in the app than described anywhere. What we need to document
is the rationale of why things are the way they are. But even this need not be overdone.

Documentation describes the code as it is now, never as it was before. No "this replaces X", no "used to be Y",
no "is being retired", no migration notes - not in `docs/`, not in code comments. Rationale for the current state
is welcome ("we picked ␣ over ␠ because …"); the history of how we got there belongs in commit messages and pull
requests, where it stays attached to the change that made it true.

There should also be no redundancy in the documentation, which includes the user-facing docs (like keymap and
layout descriptions), any .md files and comments in the code. Each fact should only be given or explained in the
appropriate one of those places. If needed, other places can refer to the canonical place, but don't even need to
do that if the relation to find the relevant doc is sufficiently obvious.

## Where the rest is written down

- [ReadMe.md](ReadMe.md) - what the app is for, the terminology, and the reasoning behind the keyboards it shows.
- [docs/key-levels.md](docs/key-levels.md) - the Shift and AltGr levels: which pairing a map gets and why. The largest spec here.
- [docs/key-symbols.md](docs/key-symbols.md) - which glyph stands for which non-character key, and where the code keeps that list.
- [docs/layout-design-guide.md](docs/layout-design-guide.md) - key sizes, staggering and gaps: the rules a new board should follow.
- [docs/layout-models-in-code.md](docs/layout-models-in-code.md) - how those boards are built and registered in code.
- [docs/thumb30-mapping-format.md](docs/thumb30-mapping-format.md) and [docs/thumb32-rationale.md](docs/thumb32-rationale.md) - why the generic keymap types hold the keys they hold.
- [docs/ergoplank-family-notes.md](docs/ergoplank-family-notes.md) - what distinguishes the boards of that family from each other.
- [docs/css-gotchas.md](docs/css-gotchas.md) - CSS lessons learned here (subgrid row sharing, `min-height` / `align-content`, the bold ghost `::after`).
- [scripts/ReadMe.md](scripts/ReadMe.md) - the read-only probes over the layout and mapping tables, and what each answers.
- `docs/old-plans/` - historic, kept for interest; do not treat as a description of the code.
- [TODO.txt](TODO.txt) and [ideas.txt](ideas.txt) - planned work and unsure ideas respectively.
