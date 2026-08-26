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
Therefore, we want prose punctuation characters – those that appear as part of text that users can type in a fast flow – to be mapped on the base and Shift levels.

As in the other layout work in this app, we also consider easy learnability by minimizing the changes compared to the standard ANSI keymap. We also take some inspiration from European keymaps, especially regarding
- the placement of `?` in the right-side number row (symmetrically with `!` on the left),
- `-` next to `,` and `.`,
- breaking the `;:` character pair and using that home-finger position for a letter – or in the case of English, the apostrophe, which is used inside words like a letter. This change is actually also an improvement in finger movement for typing English texts. 
  It extends to optimized letter-maps which can include the apostrophe and its most common bigrams `'s`, `'l`, `n'`, and `'t` into their optimization constraints.

Even full-size keyboards can profit from our revamped Shift mappings:
 - their keymap can be made compatible with that of a smaller keyboard, so that both can be used with fewer differences between them.
 - keys used during the typing of text will be closer to the hand's home position – this is the "one unit from home" principle. 
 - the keys that become freed from the move punctuation character can then be used for navigation functions (especially useful on laptops where nav keys are often too small or badly positioned for easy use) or others.


## Key Mapping Concept

### How many punctuation slots are there?

US ANSI has 32 punctuation characters in total: 11 on the base level
(`` ` ``, `-`, `=`, `[`, `]`, `\`, `;`, `'`, `,`, `.`, `/`)
and 21 on the Shift level (the 11 partners of those keys plus the 10 shifted digits).

The default small keyboards (Split Ortho, Thumbs Up 13, Ergoslat) have 43 to 45 character keys instead of the 47 of US ANSI,
and 7 to 9 of those are punctuation keys – see [the table below](#pre-existing-punctuation-maps-on-our-smallest-keyboards).
This feature brings them down to 41 character keys, not counting extra characters on bottom row keys:
26 letters + 10 digit keys (which each carry a punctuation character on the Shift level)
+ 5 punctuation keys.

In terms of assignable punctuation characters, this yields:
- 5 on the base level (the 5 "punctuation keys"),
- 15 on the Shift level (10 shifted digits + the 5 shifted punctuation keys),
- and thus 12 of the 32 total punctuation characters have to move to the AltGr level.

Leaving out the bottom keys matters, because our Split Ortho variant is generous with them:
most real-life small split keyboards have significantly fewer.
Bottom key counts of 4, 6, and 8 are all common 
(often all assigned to the thumbs, which is why "thumb key" is sometimes used synonymous with "bottom row key").
Among the popular models only the MoErgo Go60 actually has all 12 that our app shows.
My personal Iris is a typical example: it has 8 thumb keys,
but only 6 of them are usable without making a big hand movement.

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

    ⎋  1! 2@ 3# 4$ 5% 6^ 7& 8* 9+ 0?  ⌫
                               o  p  /=
                            k  l  '"  ↵  
                      n  m  ,; .: -_  ⇧

This creates one new character pairing (key label) with the `/=` key.
We could instead reuse the existing `/?` or `=+` key label.
We need to weigh the following trade-offs:
 - keeping the `/?` pair, we lose the symmetry of the `1!` and `0?` keys, because this pairs `=` onto the `0` key;
 - keeping the `=+` pair, we would need to pair `/` onto the `9` key and thus lose the base mapping for the `/` key, 
   which breaks keyboard shortcuts in some applications when the keymap is defined using a national layout mechanism. 
   But in a firmware mapping (like with [QMK's custom shift keys]), this will work without disadvantages, which is why it's the mapping I personally use.

[QMK's custom shift keys]: https://getreuer.info/posts/keyboards/custom-shift-keys/index.html

### A compatible punctuation map for full-size keyboards

On keyboard layouts with all 47 keys, compression punctuation from 11 down to 5 keys allows us to place 6 more non-character keys. 
One of those is usually Escape in the top left corner; the others could be Home/End, PageUp/Down, and (forward) Delete. 
But there is also the option of simply rearranging the punctuation characters, so that the "1 unit from home" keys are mapped exactly like on the smaller keyboards and the remaining 6 keys collect the remaining punctuation characters.
This allows for a very logical character assignment, since the compressed punctuation dislodges both bracket pairs `()` and `<>`.
We can nicely arrange them on the same pair of keys.
The resulting punctuation keymap looks like this:

    ⎋   1!  2@  3#  4$  5%  6^  7&  8*  9+  0?  (<  )>   ⌫⌫⌫
                                          o   p   [{  ]}  \|
                                       k   l   '"  /=   ↵↵↵↵  
                                 n   m   ,;  .:  -_   ⇧⇧⇧⇧⇧⇧

Given this keymap, we can simply replace the two pairs of brackets with two pairs of navigation keys, 
while the larger `\|` key becomes (forward) Delete.


#### Rejected Alternatives

In a strict usage-based view, the characters `#` and `^` are more "technical" compared to the round parenthesis `()` which are more common in prose writing. 
While this suggests that `#` and `^` should be moved to the AltGr layer instead of the parenthesis, I decided to move the parenthesis for several reasons:
 - the collection of all four types of brackets on the same level (AltGr) already mentioned above.
 - freeing the Shift+0 position for the question mark's European layouts position that is so nicely symmetrical with `!` on Shift+1.
 - more generally, reassigning the Shift positions on `9` and `0` gives us two adjacent spots on the right side where most of the punctuation characters live, so that characters don't move very far and part of the muscle memory stays intact.
 - and finally, placing the round parentheses in the middle of the AltGr home row actually make them more easily accessible than on the top right, especially when one wants to type both of them in sequence. Since the pinky finger is too short to comfortably reach the number row, their standard position up there makes the ring finger type both of them.


### Freeing the extra punctuation keys

Our small keyboards have more punctuation keys than the five base-level slots of this concept –
7 to 9 of them, see [the table below](#pre-existing-punctuation-maps-on-our-smallest-keyboards) –
and some of those sit in the bottom row carrying technical characters like `` ` `` or `\`,
which contradicts the rule that technical characters live on the AltGr level.
The feature therefore removes all punctuation keys except the five base ones
and gives the freed positions to navigation and other keys.
We call the result the **compressed Shift pairings**, as opposed to the ANSI pairings.
It is produced in two steps.

**1. Permutation.** The keys keep their positions, but their character pairs move along a cycle:
`;:` is replaced by `'"`, which is in turn replaced by `/=`.
This keeps `,` `.` `-` where they are and leaves the old `/` key unassigned.
It also resolves the duplicate that the Shift pairing list would otherwise create:
`Ansi30` and `Thumb30` map `;` on its own key, while the pairing list already produces `;` as Shift+`,`.
After the permutation there is no `;` key left, so there is nothing to warn about.

**2. Reassignment.** Every position that is now unassigned – the old `/` key plus the keys whose technical
characters moved to the AltGr level – becomes a navigation or other "hands off" key.
If a keyboard has N punctuation keys, this frees X = N − 5 of them:
 - if X is odd, one of the freed keys becomes `⌦` (Delete), or `Insert` if the layout already has a Delete key;
 - the next pair becomes Home/End;
 - one more pair becomes PageUp/PageDown.

On all four small boards X is 2 (Home/End) or 4 (Home/End plus PageUp/PageDown),
so the odd case does not occur there.

On keyboards which carry all 11 punctuation keys – the ANSI variants – six keys are freed at once,
which is more than the generic rule can place sensibly.
There we customize the full layout mapping instead, so that the additional nav keys end up in sensible pairs.
In exchange, we only do this for the `ansi30` keymap type, which is enough to show what the key levels can do.

### AltGr Mapping

Stack of parentheses on the ring and middle fingers, with 
 - `()` in the home row,
 - `<>` on the same keys where ANSI maps them (the `,` and `.` positions in the lower row),
 - `[]` in the number row, which (in the right-hand variant below) is exactly their German standard layout position, and
 - `{}` in the remaining (upper letter) row.

The remaining characters

    |\`~

are mapped on the index finger with `|` on the same key as `&`, reflecting their relationship in programming languages, and the other characters in sequence below.

As an extra to make bigrams like `<=` and `==>` easier to type, 
we also map `=` redundantly to its Shift level position to the AltGr to the right side of the `<>` keys.

The whole block, in its default right-hand variant, looks like this
(columns are the hand's two index columns, then middle, ring, and pinky):

    ^   |   [   ]
          \   {   }
           `   (   )
             ~   <   >   =

The diagram follows the ANSI row stagger: 1/4 key width between home row and the one above; 
1/2 between the other rows. We use four characters (including spacing) per key to make this exact.

The `^` in the number row is not part of the general block: only the Ergoslat's 32-key keymaps need it,
because there the number row Shift level reads `6+ 7& 8* 9/ 0?`
(see [Postponed work items](#postponed-work-items)).

This "mnemonic" mapping puts all AltGr characters on the **right** hand, which only works when there is an AltGr key for the **left** thumb:
 - On a German ISO keyboard we can use the extra ISO key (next to the left Shift) as a second AltGr.
 - On Split Ortho we can simply place AltGr on the left side from the start.

With only the standard right-side AltGr, all AltGr characters have to move to the **left** hand instead:
`<>` then keeps its row and fingers, but with mirrored characters, and we lose the `7&|` mnemonic.

All three default small boards currently place `AltGr` on the right half of the bottom row
(`splitOrthoLayoutModel.ts`, `ergoslatLayoutModel.ts`, `xhkbLayoutModel.ts`),
but the app simply ignores that question: instead of changing the frame mappings or adding a layout option,
it offers two buttons to switch the AltGr-level character labels between the left and the right hand.
The initial version defaults to the right-hand placement with its mnemonics,
which assumes the left-side AltGr key. (Because this is also what I personally use.)

### AltGr navigation keys on the other half of the keyboard

Depending on the system used for actually implementing the key map, we can abuse the character levels to create a **navigation layer** that keeps the hands in their typing position.  
 - Windows national layouts don't allow that
 - xkb config allows it (using the term "levels")
 - programmable keyboard firmware such as QMK and ZMK allows it (but using the term "layer" which is a more general concept)

I call it "hands down" navigation, because the hands don't leave the home row.
In other places of this repository we use "hands off" keys for those keys so far away from the home row that they require taking the hands off.
(But "hands off" navigation needs no layer/level key pressed, so it's great for when the hands are already off the keyboard.)

Just like the AltGr character block above, the nav block is fixed by the physical position, 
not by pairing with specific base layer keys.
Its longest row is on the home row and the ↑↓ keys are on the middle finger (which is the longest),
which leaves the four cursor keys in the familiar inverted-T shape, just moved onto the home row.

        ↞   ↑   ↠
     ⇤   ←   ↓   →   ⇥
       ⇞   ↟   ↡   ⇟

Four characters per key and the ANSI row stagger, same as the AltGr diagram above:
the block sits on the `wer`, `asdfg`, and `zxcv` keys of an ANSI keyboard.

Note that the ↟ ↡ denote mouse scrolls which can be mapped using keyboard firmware and possibly some third-party tools, 
but probably not using xkb.


## Popular workarounds

There are reasons why many keymaps, even on small keyboards where it's especially useful, are not modifying the Shift layer:
 1. Switching to a new (physical) keyboard layout already requires a lot of readjustment. Remembering new Shift pairings only adds to the adjustment effort.
 2. Most programmable keyboard firmware, even when it has a lot of advanced features, still sends simple keycodes to the computer and leaves the Shift and AltGr layer mapping (and indeed, all the actual character assignments to modifier+keycode pairs) to the computer software keymap. (As stated above, even QMK needs a custom user extension to change the Shift pairing which means that most GUI tools which are based on standard QMK or VIA or VIAL do not support that.) 

For those reasons, keyboard designers often squeeze some extra punctuation keys into the bottom row where traditional keyboards only have the space bar and modifier keys. 
This makes sense from a space-usage point of view, since the space bar and modifier keys are way oversized and keyboards that use unit-sized keys everywhere naturally have extra space in the bottom.
On the other hand, typing characters in the bottom row is not as practical. 
Once the characters move closer to the home row, the bottom spots can be assigned with navigation and other keys which are used outside a fast typing flow – "hands off" usage – which is more practical.

### Pre-existing punctuation maps on our smallest keyboards

| Layout Model       | Keymap Type | Punctuation Keys                           | Total | Thereof in Bottom Row   |
|--------------------|-------------|--------------------------------------------|-------|-------------------------|
| Thumbs Up 13/2     | `ansi30`    | `,` `.` `;` `/` – `'` `-` `+`              | 7     | 1: `+`                  |
|                    | `thumb30`   | `,` `.` `;` `-` – `'` `+` `/`              | 7     | 2: `+` `/`              |
|                    | `ansi32`    | `,` `.` `-` – `/` `+`                      | 5     | 2: `/` `+`              |
|                    | `thumb32`   | `,` `.` `-` – `/` `+`                      | 5     | 1: `+`                  |
| Harmonic 12 Mini   | `ansi30`    | `,` `.` `;` `/` – `+` `'` `-`              | 7     | 1: `-`                  |
|                    | `thumb30`   | `,` `.` `;` `-` – `+` `'` `/`              | 7     | 1: `/`                  |
| Ergoslat 13/3      | `ansi30`    | `,` `.` `;` `/` – `-` `+` `'`              | 7     | 0                       |
|                    | `thumb30`   | `,` `.` `;` `-` – `+` `'` `/`              | 7     | 0                       |
|                    | `ansi32`    | `,` `.` `-` – `+`                          | 4     | 0                       |
|                    | `thumb32`   | `,` `.` `-` – `+`                          | 4     | 0                       |
| Split Ortho (12/∞) | `ansi30`    | `,` `.` `;` `/` – `'` `\` `` ` `` `+` `-`  | 9     | 4: `\` `` ` `` `+` `-`  |
|                    | `thumb30`   | `,` `.` `;` `-` – `'` `/` `+` `\` `` ` ``  | 9     | 3: `+` `\` `` ` ``      |
|                    | `ansi32`    | `,` `.` `-` – `/` `` ` `` `'` `+`          | 7     | 4: `/` `` ` `` `'` `+`  |
|                    | `thumb32`   | `,` `.` `-` – `'` `` ` `` `/` `+`          | 7     | 3: `` ` `` `/` `+`      |

The characters left of the dash come with the keymap type itself, those right of it from the layout's frame mapping.
The 32-key keymaps contribute only `,` `.` `-`, because three of their character slots go to language-specific letters.

More notes on the numbers:
 - Neither the thumb-shift option of the Split Ortho nor the MidShift variants of the Ergoslat change any total;
   they only move keys between rows. (Split Ortho with thumb shift has 3 instead of 4 punctuation keys
   in the bottom row on `ansi30`, and 2 instead of 3 on `thumb30`.)
 - Major and Minor Ergoslat, low-shift and mid-shift, all have the same counts.
 - Split Ortho's own `splitOrtho` keymap type leaves all punctuation to the flex mapping and thus has no fixed count.
   Colemak, for example, places 8 punctuation characters there (`;` `'` `,` `.` `/` `-` `=` `\`),
   3 of them in the bottom row and only 2 of those (`=` and `\`) on an actual thumb key.
   The Harmonic 12's own `harmonic12` keymap type is currently not used by any flex mapping.
 - For comparison: the ANSI variants have all 11 punctuation keys in their `ansi30` frame
   (`` ` `` `-` `=` `[` `]` `\` `;` `'` `,` `.` `/`), none of them in the bottom row.

## App UX

Design decision: add a new mapping visualization type named "Shift and AltGr levels" 
   (It can use the `VisualizationType.MappingShiftLevels` and its commented-out button in [app.tsx](../src/app.tsx) 
   and the `AltGrLayerDetails` text in [DetailsArea.tsx](../src/details/DetailsArea.tsx),
   which should be renamed to match the enum.)

Using a mapping viz type shows the keyboard as 2D which distracts less from the key labels.

On all keyboard layout models, this will show the Shifted characters and the AltGr mappings as described below.

On keyboard layout models, where the [compressed Shift pairings](#freeing-the-extra-punctuation-keys)
are implemented (see [Scope of the first version](#scope-of-the-first-version)), 
it will offer a two-button switch group labeled "Shift pairings" with buttons "ANSI" and "Compressed".
"ANSI" is just the normal state shown on all keyboard layouts by default (see `msKlcTemplate.ts`),
"Compressed" is the reduction to 5 punctuation keys described in this file.

How do we make it work for the flex layouts? Decision: we only configure the levels globally (for all layouts and mappings), but in two different ways:
 - for the Shift level, we define it via a list of pairings. This list can include more characters on the base level than are actually in the present layout; those will be ignored.
 - for the AltGr level we define it via the fingers and map it onto the physical layout independent of what the keys show on the other levels.

How it looks on the keyboard SVG:
 - all digit and punctuation keys should show the base mapping below, Shift mapping above, in the same color.
 - a two-button switch group labeled "AltGr side" with buttons "left" and "right"
   switches the AltGr characters between the hands (see [AltGr Mapping](#altgr-mapping)).
 - the AltGr mapping of the key should be in a different color (maybe start with blue); 
   the AltGr key should also be highlighted with a blue background to make the relationship clear. 
   This should only happen when the key levels mode is actually active.

TODO: 
 - placement of the buttons
 - buttons for switching the compressed full-size punctuation from punctuation to Nav-key mode


## Scope of the first version

1. A generic implementation of the layout changes described in
   [Freeing the extra punctuation keys](#freeing-the-extra-punctuation-keys)
   for the three small keyboard layouts: Split Ortho, Thumbs Up 13/2, and Ergoslat 13/3.
   The Harmonic 12 Mini is included as well, if the generic code produces a good result there.
   If this works, it is our first version, and that is what "done" means for it.
   This should work on the `ansi30` and `thumb30` keymap types. 
   + Activating the visualization should switch to a compatible flex mapping (similar logic as in switch layout models).
   + Selecting a non-compatible flex mapping should switch to the "learning viz".
   + The changes to the base layer key mappings specified above should only be visible in this visualization; 
     Others continue to show the ANSI values as before.

2. A single `ansi30` mapping for the wide and non-wide modes of the ANSI keyboard variants
   (except the larger XHKB variants, which are too different), which puts `Escape` in place of `` `~ `` in the top left,
   Home/End and PageUp/PageDown in pairwise spots, and finally `⌦` in the remaining spot.


## Semi-related open questions and discovered bugs

1. The Ergoslat has 43 characters and as many 1u keys, but it maps `⌦` on a 1u key and `-` on a 1.25u key. 
   Should those be swapped? (Which means moving `-` further away from its standard right-pinky position...)

2. There's a bug in the current production app (4773011ba8c54c8873497c3d8d371cb296c540fc) that makes all thumb key mappings disappear. It was fixed by a reload.

## Postponed work items

Tasks to do after the initial implementation:
 - enable and test the levels visualization also for the ansi32 and thumb32 keymap types that have at least 5 punctuation keys.
   + the permutation formula will be simpler, because the `;:` is already missing there. 

 - possibly enable it also for the ansi32 and thumb32 keymap types on the Ergoslat which has only 4 punctuation keys. In this case, omit the `/=` key and map 
   + the number row Shift level as `6+ 7& 8* 9/ 0?`
   + `=` on the AltGr layer pinky position next to `<>`.
   + `^` on AltGr+6 (such that the `6^` label serves as a correct reminder) 
   + This changes the punctuation character distribution to 4, 14, 14 on base, Shift, and AltGr levels. 
     Different from the other layout models, simply because we only have 4 pure punctuation keys.

 - update the KLC export which currently hardcodes the ANSI base/Shift pairs per key and declares only shift states 0, 1 and 2 (Ctrl) – no AltGr.
   (We might leave this TODO open until we work on KLC export again, since that export is currently not used much.) 


## Out of scope

Keyboards without a number row have much more limited space that I don't want to solve for completely.
When implementing the initial version of the feature, the AltGr characters on the numberless Ergoslat will not be shown (but nav keys will).

As a follow-up – a separate work item – we'll change the Shift pairings for the ErgoSlat without number row
to the following, and define only the Shift level there, no AltGr.
Use the same "compressed" button to switch between this set and the ANSI pairings.

Possible Shift pairings: `,;`  `.:`  `-!`  `/?`  `'"`  `$%`  `&+`

The seven pairs match the seven punctuation keys that both keymap types have there:
`,` `.` `;` and `/` (or in thumb30 `-`) from the keymap type, plus `+`, `'`, and the remaining one of `-`/`/`
from the frame mapping.
`,` `.` and `/` keep their positions and only get their Shift character changed. 
`;` from the keymap type is replaced by `'`, which in turn is replaced by `-`, which is replaced by `$`.
And `+` in the non-compressed keymap becomes `&+`.
The permutation is the same for both keymap types, since they place the same seven characters –
only `/` and `-` come from the other source.

Rationale: `-` and `+` should be separate keys because of Ctrl +/- zoom.
`+` stays on the Shift level, because some apps expect it there when reading the `Ctrl +` shortcut.

I don't want to go deeper than that, because a keyboard that small can't be practical anyway.

