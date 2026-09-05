# Scripts

## The build step

`generate-seo-content.ts` is the one script here that the app depends on: `npm run build` runs it
last, and it replaces the `<!--SEO_CONTENT-->` placeholder of the built `index.html`
(`dist/index.html` unless a path is given) with the output of `generateSeoContent()`.

## The analysis scripts

Everything else here is a read-only probe over the data tables the app is built from: the layout
models in `src/all-layout-models.ts`, the flex mappings in `src/mapping/mappings.ts`, and the frame
mappings each layout model carries. Each of them walks one of those collections, prints a table, and
changes nothing — they answer questions the tables are too large to answer by reading.

Run one with:

    npx tsx scripts/<name>.ts

Every `.ts` file directly in this directory is one of those runnable scripts; the code more than
one of them shares, and the tests over it, live in `lib/`.

`tsconfig.node.json` includes this directory, so `npm run build` typechecks the scripts along with
everything else, and they cannot rot unnoticed when the tables they read change shape. `npm test`
picks up the tests under `lib/` along with those in `src/`.

### bracket-key-positions.ts

Walks **every layout model, once per reference mapping** – Qwerty for `ansi30` and Quipper Thumby
for `thumb30` – skipping the combinations whose filled map has no colloquial Shift level. For each
one it looks up where the colloquial level put `(` and `)` and classifies the two: *centred* (their
middle is within half a key of the middle of the board or of the middle between the home index
keys), *pair*, *stack* or *apart*. It prints the tally with the model names behind it, then a table
of the boards the design question focuses on, including whether their `[]` keys stay centred.

This is analysis 1 of the parenthesis-key question in `docs/key-levels.md`. Change the colloquialisation
rules in `src/mapping/key-levels.ts` and run it again to compare.

The classification lives in `lib/bracket-classification.ts` so that the test beside it can read it
too: that test pins the verdicts of the focus table.

### flex-map-inventory.ts

Walks **every English flex mapping** and lists the keymap types it defines for a specific layout
model, next to (or instead of) the generic 30- and 32-key ones. A model-specific keymap is where a
mapping may place punctuation of its own, so this is the list of mappings that do.

### german-flex-map-keys.ts and frame-map-keys.ts

Both scripts print punctuation characters defined in keymaps, so we can harmonize them to fit
specific Shift pairings, for example.

`german-flex-map-keys.ts` finds model-specific (aka larger than 32 keys) flexmaps for German. Those
are the only ones with space for the `ß` letter and thus the only ones where the standard German
Shift pairings might ever apply.

`frame-map-keys.ts` this finds frame mappings for our 32-flex-key international format. Since this
uses the colloquial Shift pairing directly, we need to make sure that all the frame mappings
actually have base keys matching those Shift pairings.

Both scripts print the same table through `lib/key-columns.ts`, and both drop the letters `a`-`z` and
the digits, which every map has anyway. All lines use the same columns: the union of the keys of
every map listed, most widely shared first and Unicode order breaking the ties, and a map that does
not have a key leaves its column blank. A column is as wide as the label it stands for, so the
two-character `` `~ `` label takes two of them. The first line spells out that column order, the
last one the keys that every map carries.

### frame-map-key-counts.ts

Lists the layout models that define both a 30-key and a 32-key frame mapping, with a count per
keymap type of the keys that end up carrying a character rather than a command. The count is split
at the bottom row because a character key down there is one the thumbs have to reach: two boards
with the same total can still ask quite different things of the hands, and the same board can divide
the total differently for each of its keymap types.

Which keys those are is `isFrameCharacterKey` in `src/mapping/mapping-functions.ts`.
