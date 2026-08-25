# Feature: Key Levels (Shift and AltGr)

Status: planning

## Background and Motivation

The US ANSI keyboard layout has 47 character keys, each assigned two different characters:
one when pressing the key without holding Shift and the other while holding Shift.
Thus, there are 94 characters assigned in the layout.

The ISO keyboard layouts introduce two more "levels" for character mapping:
holding AltGr while pressing the key (third level), and holding AltGr and Shift together (fourth level).
This allows mapping 94 more characters, but only a few of them are actually used,
depending on the national layout in place.
(ISO also has one more character key, thus getting to 4 × 48 = 192 assignable positions in total.)
We call the levels base, Shift (second), and AltGr (third), and will not use the fourth level.

Now, some keyboards have fewer than 47 keys available to map characters.
This can easily be compensated by mapping those characters on unused spots of the AltGr level.
(The harder to access AltGr+Shift level doesn't even need to be used!)

But to create a comfortable and effective key map, we should take into account that the Shift level is easier to access than the AltGr level – both physically because of the large and well-positioned Shift keys and mentally, because we are already used to using Shift for accessing punctuation during typing.
Therefore we want prose punctuation characters – those that appear as part of text that users can type in a fast flow – to be mapped on the base and Shift levels.

As in the other layout work in this app, we also consider easy learnability by minimizing the changes compared to the standard ANSI keymap. We also take some inspiration from European keymaps, especially regarding
- the placement of `?` in the number row,
- `-` next to `,` and `.`,
- breaking the `;:` character pair and using that home-finger position for a letter – or in the case of English, the apostrophe, which is used inside words like a letter.


## Key Mapping Concept

### How many punctuation slots are there?

US ANSI has 32 punctuation characters in total: 11 on the base level
(`` ` ``, `-`, `=`, `[`, `]`, `\`, `;`, `'`, `,`, `.`, `/`)
and 21 on the Shift level (the 11 partners of those keys plus the 10 shifted digits).

The default small keyboards (Split Ortho, Thumbs Up 13, Ergoslat) have 41 character keys:
26 letters + 10 digit keys (which each carry a punctuation character on the Shift level)
+ 5 punctuation keys, instead of the 47 of US ANSI.
That gives them
- 5 punctuation characters on the base level (the 5 punctuation keys),
- 15 on the Shift level (10 shifted digits + the 5 shifted punctuation keys),
- and thus 12 of the 32 have to move to the AltGr level.

### Which characters go where?

We consider the following 10 punctuation characters as essential for writing prose:

    ,.;:!?-/'"

Five of those should go to the base level. 
Luckily `,.-/'` are already base characters in US ANSI.
Among the others, `!?":` are already on the Shift level, 
and we'll only need to move the remaining `;` to the Shift level. 

We also consider the following 10 characters as mostly technical:

    `~\|{}[]<>

Those 10 are moved to the AltGr level, and since there are already three pairs of parentheses/brackets in this group,
we'll also move the pair `()` to the AltGr level – thus the 12 characters on that level are already fixed.

That leaves `=`, `_`, `+`, `@`, `#`, `$`, `%`, `^`, `&`, `*` to fill up the base and Shift levels
next to the 10 essential ones (5 + 15 = 20 slots for 20 characters – it fits exactly).

### Sample Shift mapping

Here's a sample solution for a keyboard that has 1, 1, and 3 punctuation key positions in its upper, home, and lower row:

    1! 2@ 3# 4$ 5% 6^ 7& 8* 9+ 0?
                                  /=
                               '"
                         ,; .: -_

This creates one new character pairing (key label) with the `/=` key.
We could instead reuse the existing `/?` or `=+` key label.
We need to weigh the following trade-offs:
 - keeping the `/?` pair, we lose the symmetry of the `1!` and `0?` keys, because this pairs `=` onto the `0` key;
 - keeping the `=+` pair, we would need to pair `/` onto the `9` key and thus lose the base mapping for the `/` key, 
   which breaks keyboard shortcuts in some applications when the keymap is defined using a national layout mechanism. 
   But in a firmware mapping (like with [QMK's custom shift keys]), this will work without disadvantages, which is why it's the mapping I personally use.

[QMK's custom shift keys]: https://getreuer.info/posts/keyboards/custom-shift-keys/index.html

### AltGr Mapping

Stack of parentheses on the ring and middle fingers, with 
 - `()` in the home row,
 - `<>` on the same keys where ANSI maps them (the `,` and `.` positions in the lower row),
 - `[]` in the number row, matching exactly their German standard layout position, and
 - `{}` in the remaining (upper letter) row.

The remaining characters

    |\`~

are mapped on the index finger with `|` on the same key as `&`, reflecting their relationship in programming languages, and the other characters in sequence below.

This "mnemonic" mapping puts all AltGr characters on the **right** hand, which only works when there is an AltGr key for the **left** thumb:
 - On a German ISO keyboard we can use the extra ISO key (next to the left Shift) as a second AltGr.
   This also conveniently maps `[]` in the same positions that they have in the default German layout.
 - On Split Ortho we can simply place AltGr on the left side from the start.

With only the standard right-side AltGr, all AltGr characters have to move to the **left** hand instead:
`<>` then keeps its row and fingers, but on the other hand, and we lose the `7&|` mnemonic.

Let's see how we solve this on the other boards.
For the initial version of the feature, we'll start assuming the left-side AltGr key, 
so that we can use the right-side characters with their mnemonics.
(Because this is also what I personally use.)

## App UX

Design decision:
 - should there be a new layout visualization type named "Shift and AltGr levels" 
   or rather a checkbox on one of the other visualizations?
   (Note there already is an unused `VisualizationType.MappingAltGr` with a commented-out button in [app.tsx](../src/app.tsx) 
   and an `AltGrLayerDetails` text in [DetailsArea.tsx](../src/details/DetailsArea.tsx) – 
   this feature should either use or remove them.)

How do we make it work for the flex layouts? Decision: we only configure the levels globally (for all layouts and mappings), but in two different ways:
 - for the Shift level, we define it via a list of pairings. This list can include more characters on the base level than are actually in the present layout; those will be ignored.
 - for the AltGr level we define it via the fingers and map it onto the physical layout independent of what the keys show on the other levels.

How it looks on the keyboard SVG:
 - all digit and punctuation keys should show the base mapping below, Shift mapping above, in the same color.
 - the AltGr mapping of the key should be in a different color (maybe start with blue); 
   the AltGr key should also be highlighted with a blue background to make the relationship clear. 
   This should only happen when the key levels mode is actually active.

## Open questions

These need a decision before (or while) implementing:

1. **Which board does the sample mapping describe?** The real frame mappings of the small boards put punctuation
   on thumb keys as well (Split Ortho has `+`, `` ` ``, `\`, `/`, `'` in its bottom row; Thumbs Up 13 has `+` and `/`).
   The sample above ignores the thumb row, and some of those thumb keys carry "technical" characters on the base level,
   which contradicts the rule that technical characters live on AltGr. Does the feature move them, or leave them as an
   extra (duplicate) base mapping?
2. **Duplicate characters.** `Ansi30` and `Thumb30` still map `;` on its own key, while the Shift pairing list
   would also produce `;` as Shift+`,`. Which one wins, and do we warn about the duplicate?
3. (solved already)
4. **What exactly are the `/?` and `=+` alternatives?** The trade-off bullets say what we lose, but not where the
   displaced characters end up. Two more sample diagrams would settle it. ==> please check above if this is clear now!
5. **Scope of the first version.** Which layouts and keymap types does it cover, and what does "done" look like?

## Postponed work items

Tasks to do after the initial implementation:
 - update the KLC export which currently hardcodes the ANSI base/Shift pairs per key and declares only shift states 0, 1 and 2 (Ctrl) – no AltGr.
   (We might leave this TODO open until we work on KLC export again, since that export is currently not used much.) 


## Out of scope

Keyboards without a number row have much more limited space that I don't want to solve for completely.
In that case, we'll only define the Shift level and not AltGr. It's also a separate work item.
Possible Shift pairings: `,;`  `.:`  `-!`  `/?`  `'"`
(Probably one would also need more than three levels – and that's definitely out of scope!)
