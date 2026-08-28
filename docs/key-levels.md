# Feature: Key Levels (Shift and AltGr)

Status: in progress

Done parts:
 - New "MappingShiftLevels" viz type can be selected 
 - ANSI Shift level characters are displayed (see `key-levels.ts`)
 - AltGr level characters and navigation keys are displayed
 - AltGr level can be mirrored between hands using a new button pair

Next parts:
 - Update Number row AltGr mappings (including the `@` character for 32-key flex maps)
 - Fix 32-key basic Shift level
 - [30-key and 32-key] Ergoslat numberless modified Shift pairings (no switching button)
 - [30-key] Compressed Shift level for ansi30/thumb30 on small keyboards (see below) -- includes introduction of the "compression buttons"!
 - NOT_READY: [32-key] Compressed Shift level for ansi32/thumb32 on small keyboards, including the 4-punctuation-key version for the Ergoslat.
 - [30-key] Compressed Shift level for ansi30/thumb30 on the ANSI keyboard layout model and variants
   (with a new button group option to remap the remaining punctuation characters or place nav keys)

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

### Prerequisites

While the ANSI English character map is the model for our 30-key flex maps and 
the Standard German (qwertz) is the model for the 32-key flex maps, 
the "base level only" keymaps take some liberties with both:
 - I sometimes use a Shifted character (such as `+` in ANSI and `'` in German) as base label for a key.
   When the app actually shows both base and Shift layers, those should be corrected.
   (But note how those two swaps make the German and ANSI base character sets more similar.)
 - Similarly, the `` `~ `` key already shows its Shifted label in plain mode, because the plain accent is hard to read.
 - Finally, on some of the larger keyboards for 32-key flex maps I map more characters than an ANSI keyboard has. 
   This lands some characters which don't have a standard Shift pairing.

German makes it worse, because my optimized German Shift pairing actually swap `'` back to the base layer.
But at least that is done by the explict button group option to switch between "standard" and "compressed". 

### How many punctuation slots are there?

US ANSI has 32 punctuation characters in total: 11 on the base level
(`` ` ``, `-`, `=`, `[`, `]`, `\`, `;`, `'`, `,`, `.`, `/`)
and 21 on the Shift level (the 11 partners of those keys plus the 10 shifted digits).

The default small keyboards in this app (Split Ortho, Thumbs Up 13, Ergoslat, and Harmonic Mini) have 43 to 45 character keys instead of the 47 of US ANSI,
and 7 to 9 of those are punctuation keys – see [the table below](#pre-existing-punctuation-maps-on-our-smallest-keyboards).
In the case of the international 32-key flexmaps, this goes down to only 4 to 7 punctuation keys left.
While our Thumbs Up 13/2 and the Ergoslat are fictional keyboard layouts, the Split Ortho category has a lot of actual physical products used by actual people and those often even more constrained. 
See the description in `splitOrthoLayoutModel.ts`.
Those real-life keyboards often map no characters to the thumb keys and bottom row and thus end up with only 5 punctuation keys, so this is the number that we are aiming for here.

        26 letters 
      + 10 digit keys (which each carry a punctuation character on the Shift level)
      +  5 punctuation keys.
       ---
      = 41 character keys (out of between in most models 52 to 58 keys in total)

In terms of assignable punctuation characters, this yields:
- 5 on the base level (the 5 "punctuation keys"),
- 15 on the Shift level (10 shifted digits + the 5 shifted punctuation keys),
- and thus 12 of the 32 total punctuation characters have to move to the AltGr level.

My personal Iris CE keyboard (with which I created most of this app) is a typical example: 
it has 8 thumb keys, but only 6 of them are usable without making a big hand movement.

When using this 41 character map on a keyboard with more than 52 keys, 
we'll make sure that all the characters are mapped on the number and letter rows.
Most keyboards will have the additional keys in the bottom row, where they can't easily be reached during a typing flow.
On the other hand those key positions are very practical to use for additional navigation keys, 
because they can be found "by feel" when the hands are not locked in typing position on the keyboard. 
I call that "Hands off navigation mode".

### 30-key flex maps: Which characters go where?

Let's first consider the case of the 30-key flex maps (ansi30 and thumb30), which are based on the ANSI English keymap.
I'll label this case as [30-key], which includes the thumb-letter variant based on the same character set.

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

### [30-key] Sample Shift mapping – the compressed Shift level

Here's a sample solution for a keyboard that has 1, 1, and 3 punctuation key positions in its upper, home, and lower row
(which is a very common arrangement on Split Orthogonal keyboards!):

    ⎋  1! 2@ 3# 4$ 5% 6^ 7& 8* 9/ 0?  ⌫
                               o  p  =+
                            k  l  '"  ↵  
                      n  m  ,; .: -_  ⇧

It corresponds exactly to the character split from the previous sections: 
5 punctuation keys on the base level and 15 on the Shift level, leaving 12 for the AltGr level discussed below.

This Shift-pairing has the advantage of keeping 11 of the 15 punctuation-containing keycaps the same as US ANSI.
Digits 1 to 8 as well as `'"`, `=+`, and `-_` exactly representing the base and Shift level characters on the keycap.
Of the remaining 4 "new pairings" two ANSI keycaps (`,<` and `.>`) can be reused and represent the base and AltGr level characters (as we'll see below), while their Shift level characters are easy mnemonics. 
Only the pairings `9/` and `0?` are completely new. I personally used the numpad keys `9` and `0` on my keyboard, so at least it doesn't show the wrong Shift-level character.
Finally, this pairing also offers a boon to software developers who often type the `/*` and `*/` bigrams, 
which are now neighboring characters on the same level. 

(There is just one small drawback when configuring this Shift level mapping using Windows or Linux national layouts: 
`/` being placed on Shift level breaks keyboard shortcuts such as Alt+/ and Ctrl+/. 
But in a firmware mapping (like with [QMK's custom shift keys]), this will work without disadvantages, which is why it's the mapping I personally use.)

[QMK's custom shift keys]: https://getreuer.info/posts/keyboards/custom-shift-keys/index.html

#### Rejected Alternatives

In a strict usage-based view, the characters `#` and `^` are more "technical" compared to the round parenthesis `()` which are more common in prose writing.
While this suggests that `#` and `^` should be moved to the AltGr layer instead of the parenthesis, I decided to move the parenthesis for several reasons:
- the collection of all four types of brackets on the same level (AltGr) already mentioned above.
- freeing the Shift+0 position for the question mark's European layouts position that is so nicely symmetrical with `!` on Shift+1.
- more generally, reassigning the Shift positions on `9` and `0` gives us two adjacent spots on the right side where most of the punctuation characters live, so that characters don't move very far and part of the muscle memory stays intact.
- and finally, placing the round parentheses in the middle of the AltGr home row actually make them more easily accessible than on the top right, especially when one wants to type both of them in sequence. Since the pinky finger is too short to comfortably reach the number row, their standard position up there makes the ring finger type both of them.

Since we have one keyboard layout model with only 4 pure punctuation keys, we do also map `^` and `=` to the AltGr layer (using Shift+6 for the `+` character).
Those mappings are practical and memorable (`=` near `<>` and `+` near `*/`), but since most small keyboards actually have at least 5 keys for pure punctuation,
we opt for preserving muscle memory and reducing the need to use the AltGr layer. ==> The AltGr mappings are redundant and the 5 punctuation keys are preserved.

#### Special Case: Ergoslat numberless

Keyboards without a number row have much more limited space that I don't want to solve for completely.
When implementing the initial version of the feature, the AltGr characters on the numberless Ergoslat will not be shown (but nav keys will). ==> DONE

As a follow-up – a separate work item – we'll change the Shift pairings for the ErgoSlat without number row
to the following, and define only the Shift level there, no AltGr.
This modified set will always be shown in the Shift Levels viz -- no "compressed" button to switch between this set and the ANSI pairings,
because the ANSI pairings simply don't make sense without a number row.
(Having `?` but not `!` is crazy, also having `_<>`, but not `$%&` is sad.)

Decided Shift pairings: `,;`  `.:`  `-!`  `/?`  `'"`  `$%`  `&+`

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

Ironically, this generalizes to the 32-key international flex maps more easily than on keyboards with a number row:
we simply use the first three keys from the list above and pair `?` onto `+`.
Since there's no number row, those four are the only keys where a Shift label is shown.
No more work needed!

I don't want to go deeper than that, because a keyboard that small can't be practical anyway.

#### Special case compression to only 4 punctuation keys for the Ergoslat on 32-key flex maps

TODO: this doesn't make sense, since the punctuation keys for the 32-key flex maps are based on the standard German keymap.
We first need to define the entire Shifted punctuation for this keymap and then base the Ergoslat special-case on that.

The Ergoslat has only 7 punctuation keys when using the English 30-key flex maps, 
which leaves only 4 punctuation keys for the international 32-key flex maps.
Luckily, most of the above concept with small modifications:
   + omit the `=+` key
   + map the number row Shift level as `6+ 7& 8* 9/ 0?` – that's only one more keycap (the `6`) that needs to be replaced.
   + map `=` and `^` on the AltGr level. As we'll see, there are great mnemonic and practical positions for them.
     So good, in fact, that we'll always map them there redundantly, even if the keyboard has a physical `=+` key.

This changes the punctuation character distribution to 4, 14, 14 on base, Shift, and AltGr levels,
but thanks to the redundant AltGr mappings, doesn't add that much complexity.

### [30-key] A compatible punctuation map for full-size keyboards

On keyboard layouts with all 47 keys, compression punctuation from 11 down to 5 keys allows us to place 6 more non-character keys. 
One of those is usually Escape in the top left corner; the others could be Home/End, PageUp/Down, and (forward) Delete. 
But there is also the option of simply rearranging the punctuation characters, 
so that the "1 unit from home" keys are mapped exactly like on the smaller keyboards and the remaining 6 keys collect the remaining punctuation characters.
This allows for a very logical character assignment: since the compressed punctuation dislodges both bracket pairs `()` and `<>`, we can nicely arrange them on the same pair of keys.

The resulting punctuation keymap looks like this:

    ⎋   1!  2@  3#  4$  5%  6^  7&  8*  9/  0?  (<  )>   ⌫⌫⌫
                                          o   p   [{  ]}  \|
                                       k   l   '"  =+   ↵↵↵↵  
                                 n   m   ,;  .:  -_   ⇧⇧⇧⇧⇧⇧

Given this keymap, we can simply replace the two pairs of brackets with two pairs of navigation keys, 
while the larger `\|` key becomes (forward) Delete.

The same Shift pairings could also be applied to our larger fictional keyboards (Thumbs Up, Harmonic and the Ergoplank family).
Those often already have additional navigation keys assigned, so that the option of replacing rarely-used punctuation 
with Nav keys doesn't make sense – but using the same punctuation map as their smaller family members does!

### [30-key] Applying the compressed Shift pairings to all layout models (and all 30-key maps)

To avoid defining the Shift and AltGr level characters on each of our many keyboard layout models (and variants thereof)
we instead define them mostly as pairings. 
That is, the base-level character no matter where it's placed determines the Shift level character. 
The descriptions above already describe those pairs exact enough for implementation.

We also want to make sure that the five compressed punctuation keys actually end up in good positions.
To this end, we use the fact that the `;:` and `/?` keys deleted by compression are usually mapped in very central positions.
We only need to take heed of the fact that only ansi30 flex map has `/` in a central (flex map area) position, 
while all the other flex maps include `-` in the flex map sets instead.
(And my personal ideosyncracy of labeling the `=+` key on some keyboards as `+`, 
which needs to change the base level back to `=` to create a correct base/Shift pair.)

Our rules for key replacement are as follows:
 - `;:` is replaced by `'"`, because this is the most central spot and `'` is used inside words and thus practical to place among the letters.
 - `,` and `.` keep their position and receive their Shift level character as defined above.
 - Only on ansi30, `/?` is replaced by `-_`.
 - `=+` moves to the spot freed by `'"` (which always moves, so that is always free).

All the remaining base-level punctuation keys can now be removed and be replaced with additional navigation keys. 

### [32-key] Standard and Compressed Shift levels

None of our keyboard layout model is an actual ISO keyboard that accurately reflects the standard German keymap,
but our frame mappings in the layout models already did the hard part of the translation and our "international"
AltGr key map also does its part by including not only all characters from the standard German AltGr level, 
but also the three characters from the missing `<>|` ISO key.

So all we need to do to get a relatively accurate (on the base and Shift levels) and working (on the AltGr level) key map is to add the standard German Shift pairings for the digits and base-level punctuation.

TODO: the compressed punctuation will be quite different, since the base-layer punctuation in Standard German is already compressed because there are no `;:` and `/?` keys. 
What we need to do instead is to make better use of the Shift level number row by placing `@` instead of `§`.
And some more changes TBD.
On the smallest keyboards I can only think of workable solutions using thumb-letter layouts, since without using the bottom row, only two keys would be left for punctuation!


### Replacing freed punctuation keys with extra nav keys

First of all, if the key map before Shift compression had a `` `~ `` key, but no Escape key, 
we place Escape in that freed position. 
(This might not actually apply anywhere by the big ANSI layout models.) 

Let N be the number of remaining keys freed by the Shift-level compression.

 - if N is odd, one of the freed keys becomes `⌦` (Delete), or `Insert` if the layout already has a Delete key;
 - the next pair becomes Home/End (unless already present on the key map);
 - one more pair becomes PageUp/PageDown.

On all four small boards N is 2 (Home/End) or 4 (Home/End plus PageUp/PageDown),
so the odd case does not occur there.

On keyboards which carry all 11 punctuation keys – the ANSI variants – six keys are freed at once,
which is more than the generic rule can place sensibly.
There we customize the full layout mapping instead, so that the additional nav keys end up in sensible pairs.
In exchange, we only do this for the `ansi30` keymap type, which is enough to show what the key levels can do.

### AltGr Mapping

Much of the value of our AltGr level keymap comes from the logical arrangement of the various parenthesis and bracket characters.
To keep this independent of the letter keymap which can change underneath 

Stack of parentheses on the ring and middle fingers, with 
 - `()` in the home row,
 - `<>` on the same keys where ANSI maps them (the `,` and `.` positions in the lower row),
 - `[]` in the number row, which (in the right-hand variant below) is exactly their German standard layout position, and
 - `{}` in the remaining (upper letter) row.

The remaining characters

    |\`~

are mapped on the index finger with `|` on the same key as `&`, reflecting their relationship in programming languages.
`\` is below that, while `` `~ `` go to the home row (see below), so that we can place `=` on the lower row.
This latter placement helps typing bigrams like `<=` and `==>` because it places `=` right next to the `<>` keys.
(`=` is mapped redundantly to its placement on the Shift layer.)

The whole block, in its default right-hand variant, looks like this
(columns are the hand's two index columns, then middle, ring, and pinky):

    ^   |   [   ]
          \   {   }
       ~   `   (   )
             =   <   >

The diagram follows the ANSI row stagger: 1/4 key width between home row and the one above; 
1/2 between the other rows. We use four characters (including spacing) per key to make this exact.
On the left side, everything is mirrored, so that the index finger (not the pinky) carries the six characters.

Since we already place a lot of AltGr level characters in the number row, we can as well make it complete by filling the entire row. And we can do this using a lot of mnemonic pairings for the Shift and AltGr characters:

       ¡  ¢  £  €  ‰  ^  |  [  ]  ¿
      1! 2@ 3# 4$ 5% 6^ 7& 8* 9+ 0?

Sadly, one mnemonic gets lost on the young generation which reads `#` as "hash", while older people still remember it as the "pound" character, making it perfect for the British Pounds currency sign.

When the user opts to map nav keys to the right side of the keyboard, `[]` will move to a mirrored position along with the other brackets and two characters from the other side take their places. 
That kills two mnemonic positions (along with the standard German `[]` position), thus it's not my favorite.

[32-key only]: the flex map position [Upper, 0] (Q in qwertz) has the AltGr assignment `@`.
We don't show the remaining standard German AltGr, because the above one already covers most of the relevant keys.
We also override the standard German positions of `\` and `€` for the Nav layer and bracket stack and it's not worth it to rework that.
It's actually quite nice to see that our compressed Shift level sends a lot of those characters to the AltGr level that standard German has there alreay!

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

Note that the `↟ ↡` denote mouse scrolls which can be mapped using keyboard firmware and possibly some third-party tools, 
but probably not using xkb.
In the case that `⇟` would fall on the pinky and clash with the Shift key, we omit `↟ ↡` and put `⇞ ⇟` in their place.

## App UX

Design decision: the mapping visualization type "Shift and AltGr Levels"
(`VisualizationType.MappingShiftLevels`, with `ShiftLevelsDetails` in
[DetailsArea.tsx](../src/details/DetailsArea.tsx) explaining it) shows the levels.

Using a mapping viz type shows the keyboard as 2D which distracts less from the key labels.

On all keyboard layout models, this will show the Shifted characters and the AltGr mappings as described below.

On keyboard layout models, where the compressed Shift pairings are implemented, 
it will offer a two-button switch group labeled "Shift pairings" with buttons "ANSI" and "Compressed".
"ANSI" is just the normal state shown on all keyboard layouts by default,
"Compressed" is the reduction to 5 punctuation keys described in this file.
The button group is located below the "Nav keys" one.
Both groups need to take the entire space of the two viz type button groups. 
With a vertical separator between the viz types and the buttons for the Shift/AltGr levels.

How do we make it work for the flex layouts? Decision: we only configure the levels globally (for all layouts and mappings), but in two different ways:
 - for the Shift level, we define it via a list of pairings. This list can include more characters on the base level than are actually in the present layout; those will be ignored.
 - for the AltGr level we define it via the fingers and map it onto the physical layout independent of what the keys show on the other levels.

How it looks on the keyboard SVG:
 - all digit and punctuation keys show the base mapping below, Shift mapping above, in the same color.
 - a two-button switch group labeled "Nav keys" with buttons "left" and "right" sits in the row of
   mapping visualization buttons, right of the one that selects this visualization. The navigation
   block is the easiest part of the AltGr level to recognize, which is why it names the switch; the
   AltGr characters always sit on the other hand and move along with it. (Characters appear on all
   three levels and thus make a poorer landmark.)
 - the AltGr mapping of the key is in blue, and the AltGr key is highlighted with the same blue as a
   background, to make the relationship clear. This only happens when the key levels mode is active.

A layout without a number row (the numberless Ergoslat) shows the navigation block but no AltGr
characters: with the number row's Shift characters missing, a third level on the remaining rows only
looks broken.

TODO: 
 - buttons for switching the compressed full-size punctuation on the large ANSI layouts from punctuation to Nav-key mode

### <<Needs Design>> Offering a left-hand AltGr key

This is a bigger question: 
 - on ANSI boards, CAPS is the best option;
 - on ISO boards, the ISO key is the best option... which means I would have to add ISO after all!
 - on the fictional layouts and the Split Ortho, one of the thumb keys would be right... but that requires redesigning each bottom row and modifier concept separately. outch! 

## Semi-related open questions and discovered bugs

1. The 59 and 47 key Ergoslat `⌦` on a 1u key and `-` on a 1.25u key. 
   Should those be swapped? (Which means moving `-` further away from its standard right-pinky position...)

2. There's a bug in the current production app (4773011ba8c54c8873497c3d8d371cb296c540fc) that makes all thumb key mappings disappear. It was fixed by a reload.

## Postponed work items

not currently in scope at all:

 - update the KLC export which currently hardcodes the ANSI base/Shift pairs per key and declares only shift states 0, 1 and 2 (Ctrl) – no AltGr.
   (We might leave this TODO open until we work on KLC export again, since that export is currently not used much.) 

