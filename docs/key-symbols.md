# Key symbols

Which Unicode character we use for which non-character key, and why that one and not another.

## Source of truth in the code

- `keyboardSymbols` in [../src/mapping/mapping-functions.ts](../src/mapping/mapping-functions.ts) is the operative whitelist.
  A glyph that is not in it renders as an ordinary character key: no `keyboard-symbol` CSS class,
  no `command-key-border`, and not the grey `KEY_COLOR.EDGE`. **Adding a symbol here is not optional.**
- `keyboardNames` in the same file lists the labels we spell out as text instead of a symbol.
- `keyLabelShortcuts` in [../src/layout/layout-functions.ts](../src/layout/layout-functions.ts) holds glyphs that exist
  only to keep flex mappings writable as plain strings; `mergeMapping` expands them to a text name before rendering.
  These never reach a key cap as a symbol.
- `cycleAbbreviations` in [../src/layout/permutation-functions.ts](../src/layout/permutation-functions.ts) does the same
  for cycle specs, where a token is a single character and a multi-character label would otherwise be unaddressable.

Whenever this document and those four tables disagree, they are right and this document needs fixing.

## Symbols rendered on key caps

| Symbol | Codepoint | Unicode name | Key |
|---|---|---|---|
| ␣ | U+2423 | open box | Space |
| ⏎ | U+23CE | return symbol | Enter / Return |
| ↹ | U+21B9 | leftwards arrow over rightwards arrow | Tab |
| ⌫ | U+232B | erase to the left | Backspace |
| ⌦ | U+2326 | erase to the right | Delete (forward) |
| ⎀ | U+2380 | insertion symbol | Insert |
| ⇧ | U+21E7 | upwards white arrow | Shift |
| ☰ | U+2630 | trigram for heaven | Menu (context menu / application key) |
| ← ↑ ↓ → | U+2190/2191/2193/2192 | arrows | Cursor keys, one character cell / one line |
| ⇤ | U+21E4 | leftwards arrow to bar | Home — start of **line** |
| ⇥ | U+21E5 | rightwards arrow to bar | End — end of **line** |
| ⇱ | U+21F1 | north west arrow to corner | Start of **document** (traditionally Ctrl+Home) |
| ⇲ | U+21F2 | south east arrow to corner | End of **document** (traditionally Ctrl+End) |
| ⇞ | U+21DE | upwards arrow with double stroke | Page Up |
| ⇟ | U+21DF | downwards arrow with double stroke | Page Down |
| ↞ | U+219E | leftwards two headed arrow | Word backward |
| ↠ | U+21A0 | rightwards two headed arrow | Word forward |
| ↟ | U+219F | upwards two headed arrow | Scroll up |
| ↡ | U+21A1 | downwards two headed arrow | Scroll down |
| ¤ | U+00A4 | currency sign | The ChromeBook "magic" key — see below |

### The navigation set is systematic

Read the whole navigation block as one family, because that is how it was chosen:

- **One arrowhead** — move by the smallest unit: `← ↑ ↓ →`, one cell or one line.
- **Two arrowheads** — move by a bigger unit in the same direction: `↞ ↠` by a word, `↟ ↡` by a scroll step.
  (The vertical one here is the only one that just scrolls without movign the caret. 
   Not 100% consistent in the notation, but it's what the user wants.)
- **Arrow to a bar** — go to the boundary of the *line*: `⇤ ⇥`. Home sits left of End,
  as the pairing rule in [layout-design-guide.md](layout-design-guide.md) wants.
- **Arrow to a corner** — go to the boundary of the *document*: `⇱ ⇲`.
- **Double-stroke arrows** — the page-wise jump: `⇞ ⇟`.

So the bar/corner distinction carries line-versus-document, and the arrowhead count carries small-versus-large.
Neither dimension is spent on anything else, which is why nothing else in this table should borrow those shapes.

## Labels spelled out as text

`Esc`, `Tab`, `Backspace`, `CAPS`, `Delete`, `Enter`, `Space`, `Shift`, `Ctrl`, `Alt`, `Fn`, `Cmd`, `Opt`, `AltGr`, `Menu`.

Several of these have a symbol above as well. That is deliberate: a layout model may spell out a label where the
extra clarity is worth the width, and the symbol is preferred where it is not.

## Source-only shorthands

These appear inside flex mapping strings so that a mapping stays one readable string per row.
`mergeMapping` replaces them with the text name, so they are never drawn as symbols.

| Shorthand | Expands to |
|---|---|
| `^` | Ctrl |
| ⎋ | Esc |
| ⌘ | Cmd |
| ⎇ | Alt |
| ⌥ | AltGr — this is the macOS Option glyph, borrowed for the key with the similar function |
| ⇪ | CAPS |
| `ƒ` | Fn |

## Decisions, and what was rejected

**Menu — ☰ (U+2630 trigram for heaven).**
Rejected: ≣ (U+2263 strictly equivalent to) and ≡ (U+2261 identical to). Both are mathematical relation operators
that happen to look like three lines; ☰ is the shape people now read as "menu" everywhere else.

**Escape — the text `Esc`, not a symbol.**
Rejected: ⎋ (U+238B broken circle with northwest arrow) *on the key cap*. It is the correct Unicode
escape-key symbol, but we use it only internally, because on a keycap, almost nobody recognises it.
(Also at key-cap size the broken circle turns to mush.)

**Space — ␣ (U+2423 open box).**
Replaces ⍽ (U+237D shouldered open box), which is an APL character with thinner font coverage and no particular
claim to meaning "space". Also rejected: ␠ (U+2420 symbol for space), which is the control-picture for the
character, not the key, and is rendered as a tiny "SP" in many fonts.

**Word backward / forward — ↞ ↠. Scroll up / down — ↟ ↡.**
Chosen for the arrowhead-count logic described above: one complete four-direction family, in one Unicode run,
that reads directly against the single-headed cursor arrows.
Rejected alternatives:
- ⇇ ⇉ ⇈ ⇊ (U+21C7/21C9/21C8/21CA, paired arrows) — the same four-direction consistency and more legible at small
  sizes, but "two arrows" suggests doubled speed, which collides with the page-wise jump. Keep as the fallback if
  the second arrowhead of ↞ ↠ ↟ ↡ does not survive rendering at key-cap size.
- ⇐ ⇒ ⇑ ⇓ (double-line arrows) — read as logical implication.
- ⇡ ⇣ (dashed arrows) — this would be a great contrast to show that scrolling does not move the caret, 
  but the dashes vanish at key-cap size.
- ⤒ ⤓ (U+2912/2913, arrow to bar) — these say "to the very top/bottom", so they belong to document start/end,
  not to a scroll step; and that job is already ⇱ ⇲.

**Home/End — ⇤ ⇥ kept, despite the Tab clash.**
⇥ is the near-universal Tab glyph on other keyboards. We keep it for End anyway, because inside this app
Tab is unambiguously ↹, and because ⇤ ⇥ read horizontally with Home left of End — which is exactly the
adjacency the design guide asks for. ⇱ ⇲ were the obvious alternative for Home/End and are instead
given the document-wide jump, so both pairs have a distinct job.

**The ChromeBook magic key — ¤ (U+00A4 currency sign).**
Used at the Caps Lock position of the Harmonic 14 Traditional model. The visual ambiguity is the point:
the ChromeBook key in that spot has been the Search key, the Launcher key, the Everything button and
now the Quick Insert key, and on other boards the same position carries a command key of some other name.
¤ is the "generic currency" placeholder — a glyph that deliberately stands for *some* denomination without
committing to one — so it reads as "the magic command key of this board, whatever that board calls it".
Rejected: `CAPS` / ⇪, which would name a function the key does not have on the boards modelled here;
and ⌘ (U+2318), which is already the source-only shorthand for Cmd and would claim the macOS meaning specifically.

## Related characters that might be useful later

Mentioned in the code or in discussion, currently unused. Listed so we do not re-litigate them from scratch,
and so nobody assumes they are already wired up — none of these are in `keyboardSymbols`.

| Character | Codepoint | Possible use |
|---|---|---|
| ↵ | U+21B5 | An alternative Enter glyph. ⏎ is the purpose-built one, so this stays spare. |
| ≣ ≡ | U+2263, U+2261 | The rejected Menu candidates. |
| ⍽ | U+237D | The former Space glyph. |
| ␠ | U+2420 | Space, as a control picture. |
| 🖰 | U+1F5B0 | A mouse key or a pointer-related function. Note it is outside the BMP; check font coverage before use. |
| ⇇ ⇉ ⇈ ⇊ | U+21C7/21C9/21C8/21CA | The fallback family for word motion and scrolling. |
| ⤒ ⤓ | U+2912/2913 | Top/bottom of something, if a use distinct from ⇱ ⇲ turns up. |
| ⇕ ⇔ | U+21D5, U+21D4 | Bidirectional motion or a toggle. |
| ⌧ | U+2327 | "X in a rectangle box" — the Clear key on some keyboards. |
| ⇭ | U+21ED | Num Lock. |
| ⇬ | U+21EC | Caps Lock, but the locking variant. We use ⇪ / `CAPS`. |

## Follow-up work

1. A test asserting that every non-ASCII glyph appearing in any frame mapping or flex mapping is covered by
   `keyboardSymbols`, `keyLabelShortcuts`, or `keyboardNames` would have caught the ≡ divergence, and will catch
   the next one.
