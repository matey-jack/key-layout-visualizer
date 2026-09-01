Like many features in this app, key levels have an easy part and a hard part. The easy part is to
simply show the Shift and AltGr level characters and the Nav keys in the keyboard visualization. The
hard part is to fine-tune this for all keyboard layout models and flex key maps, and to provide a
few sensible additional options for the key maps. All new functionality is accessed via a new
"mapping visualization" in the app called "Shift and AltGr Levels", so that all this new information
doesn't clash with what is already there.

The purpose of including those character levels is not to give an accurate description of existing
keymaps. Rather, we include existing keymaps only as a starting point so that we can experiment with
modified maps that improve the typing experience and also fit smaller keyboards.

This document contains both purely domain descriptions (that is, implementation-independent design
and rationale of keymaps) and app-specific descriptions (that is, what is shown where and how in the
app). I try to keep the two separate, but since each informs the other, the boundaries sometimes
blur. For sections or chapters that are mostly about one or the other I use the tags [domain]
and [app], so readers can orient themselves.

# Task items

Done:

- I wrote this spec; yay!
- renamed "compressed" Shift pairings to "colloquial" (both in UI and code).
- merged the German position of `@` into the updated AltGr mapping spec.
- change the `ä` check for German to `;` for English — how premature this seems now!
- change the code to use the new AltGr mappings
- prepared frame mappings for the new 32-flex-key Shift pairings
- added Danish flex map

Todo in code:

- change the standard Shift mapping selection (everywhere but 32-key flex maps) to use `ß` as the
  discriminator.
- change the Shift pairing selection again to use the colloquial system for all 32-key maps,
  including the German exception. (In that case, no `@` on the AltGr level, since it's already on
  Shift.)
    + Include the `/?` Shift pairing, because some of the larger frame mappings have that 
      redundantly with the number row mappings. 
- Change the wording in the scripts to not say "German", where it actually concerns the new
  generic international levels.
- implement the Nav key replacements
- check some of my favorite English model-specific flex-maps: how do they look with colloquial Shift
  pairings? do I want to fix anything?

# Showing the Shift and AltGr level characters (and functions)

[Domain] Flex maps can place any character (or other key) on a layout, and frame mappings can do the
same. Maps of either kind make use of this to place unconventional characters. Since we don't want
to explode complexity by adding a perfectly matched Shift mapping for each combination, we restrict
ourselves to two conventional Shift maps (US ANSI and German Qwertz) plus three unconventional ones.
Rules and heuristics then decide which Shift mapping is shown for a given flex map and layout model
combination. Only for the very common case of key maps with the ANSI character set do we offer an
actual user-facing choice between the standard mapping and a custom one (described below). That is
the first unconventional mapping. The second one covers our 32-key flex map types (ansi32 and
thumb32), which are already designed to be used for many different languages, encapsulating the
common punctuation in the frame mappings; the same mapping serves every combination of a 32-key flex
map with a layout model. The third is a minimally tuned variant of it for German.

## [App] Shift level

Shift-level characters are defined purely as pairings with base characters, so they automatically
follow the different flex maps and the layout models' frame maps. The two conventional pairings are
English and German, where the latter stands as an example for many languages based on the Latin
alphabet: all of them place more characters on the keyboard than the 94 of the ANSI English
keyboard. (That is 47 character keys, each with two characters. At least this character count is
independent of the many variations in modifier and other key counts that various keyboards have.)

Deciding between the two standard Shift mappings takes a very simple rule: the German standard Shift
mapping contains the pair `ß?`, so we apply it whenever the character `ß` exists in the merged
keymap. In practice that only happens on layout-model-specific flex maps. The 32-key types have no
room for the key, because their three free letter spots already go to `äöü`, and no frame mapping
carries it either — that would tie the whole layout model to German.

A board without a number row gets no Shift level at all: its pairings live in the number row as much
as in the letter area, and showing only half of them would be more confusing than showing none.

There is just one more little snag. To make keymaps and keycaps look prettier, I sometimes labeled a
key with its Shift-level character instead of its base character — for example, the key whose base
character is `=` is labeled `+`. ([Domain] In this case it was to highlight the symmetry between `+`
and `-`; the latter is already a base character. A similar example is the German `#'` key, which I
label as `'`, and the German `^°` key, which I label as `°` — a lone `^` in a flex map is the
shorthand for the Ctrl key.) And for the backtick character I actually included its Shift-level
character (the tilde `~`) in the frame mappings, because it would otherwise be hard to see. So the
app needs to work around all of those cases and recognize which key the base label actually denotes.
In the "Shift and AltGr Levels" visualization, all such keys are normalized to the base/Shift pair
of the auto-selected language.

A quick note on terminology: the term "character level" comes from the international keyboard layout
(actually: keymap) configuration. We use it here, because we mostly deal with characters; the nav
layer is just a small excursion. More popular in the keyboard community is the term
"layer", which is a generalization of the "character levels", because keyboard layers can map any
keycode to a key — even key-modifier combinations and more complicated things. The layer handling is
done on the keyboard firmware itself or special remapping daemons on the computer. Sticking with
character levels has the advantage of not needing any special keyboard or software, because every
operating system has the international layout (actually: keymap) configuration built-in.

## [App] AltGr level

To define character placement for the AltGr level, we use a dual approach. For the number row we use
the same base-key indexing as for Shift, because many of the characters here form nice mnemonics
with the Shift-level keys. For the letter area we use a positional approach instead, because the
AltGr characters there have a meaningful relationship among each other and don't relate to the
letters "below". (This "below" refers to base being level 1, Shift level 2, and AltGr level 3, all
stacked above each other.) The positional approach is especially sensible for the navigation keys,
which are highly mnemonic in their positions, as we will see.

((TODO)) One important point, not yet designed, is that the keyboard should have an AltGr modifier
key on each side, the same as the two Shift keys. We might later add some visuals and options for
that in the app. For now we just highlight the AltGr key in the "Shift and AltGr Levels" view, so
that people who have never used one can relate it to the AltGr-level key labels shown in the same
color.

[Domain] While the Shift level in the app represents both ANSI English and German standard keymaps,
and offers an improved alternative, we have taken more liberties with the AltGr level from the
start. This is because ANSI doesn't define one anyway and the standard German one is ergonomically
terrible. Although we use almost the same AltGr level mapping for both languages, and it has
ergonomic typing benefits in both, the current version supports smaller keyboards only for the ANSI
English character set. The reason is that our shared mapping covers characters that German already
has on its own AltGr level — not on base or Shift — so dropping keys wins nothing there. For ANSI,
on the other hand, all those characters are redundant, which lets us shrink the keyboard by removing
the keys that carry them on the base and Shift levels.

# [Domain] Options for ergonomic keyboard layout models

What follows in this section applies to the English keymaps only, because it goes into quite some
detail and the German/international punctuation isn't strictly defined in the app.

## Motivation and background

There's a "one key from home" movement among keyboard nerds that has leaked into the industry, and
it applies both to small keyboards and to larger ones. The smallest keyboards literally remove every
key that is not a finger's home key or a neighbor thereof. Most still count diagonal neighbors, so
they have at least 6×3 keys per hand. For our purposes we'll also allow the number row, giving 6×4
keys per hand plus some thumb keys. All characters and other functions of the removed keys have to
be mapped to the AltGr level (for characters) and often to further layers (like the one on laptops,
activated by the "Fn" key). The shorter distance allows more comfortable typing and can reduce
typos, because the hands won't lose their home position after hitting a far-away key. (Compared to
legacy ANSI and ISO keyboards it also reduces strain on the right pinky finger — at least for people
who are crazy enough to follow formal typing practice on those keyboards.)

Anyway, it turns out that typing characters and commanding navigation and other functions using two
keys (a modifier and the multi-level key) close to your hands can be much more comfortable than
having to reach further away. And this is why the same AltGr-level mappings that small keyboards
need — because many characters couldn't otherwise be accessed — are actually useful on larger
keyboards as well! Even better: once we have defined a good AltGr key map, we can use the same one
on large and small keyboards alike. That automatically gives us the option to support keyboards of
many in-between sizes! We simply define a core of 40 character keys and create redundant AltGr
mappings for all the remaining keys. (The 40 keys are 5 columns × 4 rows per hand, leaving the 6th
column and the thumb keys for non-character keys like Shift, AltGr, Return, Delete, etc. Most
keyboards I have seen do have one character key in the sixth column, but this 41-key case is
automatically covered by our approach.)

The solution "move all characters from missing keys to a new keyboard layer" is what most
programmable keyboards do, but we are offering something on top of that. The Shift level is usually
easier to reach, and we already use it regularly when typing prosaic (meaning non-technical) texts —
for capital letters and for punctuation like `!`, `?`, and `:`. So it makes sense that any
punctuation used in such writing should be available as a base or Shift-level character. What we'll
do, then, is remove some of the more technical characters from the Shift level and put prosaic ones
there instead! And to let people flexibly experiment with this solution, we'll map the displaced
characters redundantly on AltGr. It's a bit of a puzzle, but the reward is that we can adapt all the
existing keymaps in this app to keyboards with anything from a tiny 4 to a full 11 punctuation keys.
(Those numbers follow from the 40 and 47 total character keys, and from the fact that we are not
removing any letter or digit keys.)

## Removing the obviously technical punctuation keys

US ANSI has 32 punctuation characters in total: 11 on the base level and 21 on the Shift level (the
11 partners of those keys plus the 10 shifted digits). I don't want to list all of them, so let me
start by calling out four punctuation keys that I consider highly "technical", that is, not needed
for writing simple English texts and messages: `[{`, `]}`, `\|`, and the backtick-tilde key
`` `~ ``, which I call by name because the backtick itself is Markdown syntax that sometimes
confuses text rendering. Those four keys are easy to handle, for two reasons:

- They are already on the edge of the keyboard, so we can remove them and the board gets smaller
  without leaving a gap.
- Since their characters are so technical, we can move them directly to the AltGr level without
  having to think about any Shift-level rearrangement.

And as a sweet extra, the backtick-tilde key sits exactly where keyboards without a function row
like to put their Escape key.

## The core of the AltGr level key map

Starting from those 8 characters, 4 of which are brackets, it seems reasonable to collect all of
ANSI's brackets on the AltGr level. Indeed, you might say "the plain parentheses `()` are actually
used a lot in plain, non-technical text", but I have a surprise for you: we can map `(` and `)` to
AltGr-level home row positions, so that they become even easier to access than via Shift plus a
reach to the number row! A similar trick applies to the angle brackets `<` and `>`. Their normal
positions are on very easily reachable keys on the Shift level — positions too good for characters
not used in prose. So we move them to the AltGr level, but leave them on the same keys. We can then
build a logical AltGr-level keymap by starting from those keys, which are typed by the two longest
fingers: the middle and ring finger. Let's see the mapping:

        |   [   ]
          \   {   }   ~
           +   (   )   `
             =   <   >

The diagram represents the staggered rows of the right-hand side of an ANSI/ISO keyboard: ¼ key
width of stagger between the home row and the row above it, ½ between the other rows, and four
characters (including spacing) per key to make that exact. This mapping has numerous mnemonic
advantages:

- All brackets are typed with the middle finger (opening) and the ring finger (closing).
- `<>` sit on the same keys as in standard ANSI – so the keycaps are still valid.
- `()` sit on the same fingers as they do in the German and other keymaps – so one could get keycaps
  from there, or just enjoy the mnemonic.
- `[]` are literally in the same position – same level and same keys – as in the German keymap.
- `|` is on the `7&` key, hinting at `&` and `|` being 'and' / 'or' in programming languages.
- The backtick is close to the apostrophe in standard ANSI (and often ends up on the very same key,
  see below). The tilde is close to where the German keymap has it: same level, same finger, same
  row, but easier to reach!
- We offer a special place to `=`, so far unmentioned, because putting it on the same level as `<>`
  makes sequences like `<=` and `==>` so much easier to type.
- Also note that most of the characters that once shared a key on two different levels are now in
  the same column on neighboring rows. This is why I just had to add the `+` character as well —
  purely for completeness!

Now that both `=` and `+` have found a place on our AltGr keymap, we can already consider the `=+`
key optional. We have thus made five ANSI punctuation keys optional, getting down from 11 to 6.

## AltGr bonus characters for the number row

Since the above bracket block already places three AltGr characters in the number row, we may as
well fill the entire row. For mnemonic reasons we do this by character pairing and independent of
fingering:

       ¡  ¢  £  €  ‰     |  [  ]  ¿
      1! 2@ 3# 4$ 5% 6^ 7& 8* 9/ 0?

(Sadly, one mnemonic is lost on the generation that reads `#` as "hash", while older people still
remember it as the "pound" character, which makes it perfect for the British pound sign.)

((TODO: find a cool character for the AltGr+6 spot!))

The `|`, `[`, and `]` here are the same keys that head the letter-area block above. The row can
shift around on layout models that rearrange the number row, and on larger keyboards that have extra
keys in its center.

Incidentally, the `€` character here is important for our German keymap, because standard German has
it on `AltGr+E`, a position that we need for our nav layer below. Together with the "technical
punctuation" characters, only one practically useful character from the standard German AltGr
mapping is still missing. It is the `@` sign, and we map it in its conventional German position
[Upper, 0] (which is `q` in qwertz). Note that this assignment needs to be tied to the finger, so
that it survives on different flex maps without clashing with other AltGr characters and Nav keys in
the letter area. Unfortunately, it clashes with `~` when the nav layer is on the right side. In that
case, we move it to `AltGr+2`, overwriting `¢`, which is there more for fun than for real use. That
position is very mnemonic thanks to the ANSI keymap, and the key is quite close to the original one.

## Removing non-technical punctuation keys aka keeping the colloquial punctuation on base and Shift levels

Moving `<>` to the AltGr level also prepares for a power move that makes our punctuation map both
prettier and more practical, and that brings the ANSI keymap closer to international ones. I call it
the dissolution of the `;:` key. We simply move its characters to the freed Shift-level spots and
thus create the `,;` and `.:` keys. A very logical pairing, with keycaps available from other
countries, and no addition to the AltGr level needed! I think this is a great move, also because
`;:` occupied a home-row spot in the main letter area: we can make better use of that spot by
putting the `'"` key there! Since the single quote is also used as the apostrophe inside words, just
like a letter, this change is an improvement in finger movement for typing English texts too.

The pure-punctuation keys we are left with are now few enough to enumerate: `,;`, `.:`, `'"`, `/?`,
and (the only one still outside the letter area) `-_`. The common wisdom is to remove the `-_` key
and map its characters onto the AltGr level. But thanks to our mighty stack of brackets, we
additionally have the option to map two more characters onto the Shift level, where `()` used to be.
We could of course do that with `-` and `_`, although it would make more sense to put `+` and `-`
together on the Shift level and `_` (a rather technical character) on the AltGr level.

But I suggest a nicer move: `/` and `?` go to the Shift level, and the `-_` key takes the former's
spot. There are again mnemonic, international, and practical advantages:

- It's practical for typing `/*` and `*/` if you are a programmer and still write code without AI.
- `?` lands symmetrically to `!` on the other side of the number row. That's really sweet, and
  incidentally something that a lot of other languages do as well, for example German, Dutch,
  Danish, Swedish, Italian, and Spanish.
- `-` is a much-used character, maybe more so than `/` – though that may depend on your writing
  style / personality. (Note the punctuation characters in that last half-sentence!)
- And yes, the `-_` key is placed in that exact spot in the German and some other keymaps.

And thus we have reduced our keymap to 40 keys (including 4 punctuation keys) without moving any
prosaic punctuation key to the AltGr level. The minimal set now looks like this:

    1!  2@  3#  4$  5%  6^  7&  8*  9/  0?
    '"  ,;  .:  -_

Out of those 14 keycaps, 10 are pure US ANSI, 3 are obtainable from other languages, and only `9/`
is the odd one out. (Although I didn't check whether it exists somewhere.) This count of 40 keys
also means that all the mandatory base-level punctuation fits into a 30-key flex map, so a layout
model for a small keyboard only needs to provide the ten digits and the 30 flex spots. All the
remaining characters of the 94-character ANSI set are mapped onto our AltGr level and the colloquial
Shift level.

A final note: because I use `Ctrl +` and `Ctrl -` so much for zooming text, I have included the `=+`
key on my 41-key board. It's more logical that way, too, because `/?` is represented on the Shift
level and thus more dispensable. But the nice thing is that you are free to choose which of the 7
redundant keys you want to keep; the keymap works regardless. Note that if you don't have a physical
`=+` key, but use a programmable keyboard or another key-hacking tool, you can pick some key that
has no Ctrl shortcut assigned and have it send `Ctrl +` to the computer. I do something similar for
Ctrl+Tab and Alt+Tab on my keyboard and it works splendidly!

### How to actually place the keys on an arbitrary flex map

We express this as permutations, including entering and exiting keys, as is already done elsewhere
in the app. And if a key with a very good position moves (on standard ANSI this affects
`'`, on many of our fictional layout models, also `-`), then some other follows into that spot. The
actual implementation reads a permutation from behind: first a new key that enters (represented by
its base level character, in our case `(` and `)`), then the key where it is to be placed, then
where the replaced key goes, and so on; the last key in the cycle is then removed. And if the first
key in the cycle was already on the map, then the last key closes the cycle and moves into that old
position.

The permutations for the above key replacements are `)=';` and `(-/`, which means all of `=`,
`'`, and `-` are moving towards the center, leaving their more outward position to the new pair of
brackets. If you make a custom set which, for example keeps `/?` as a character key, but does not
have space for the `[]\` keys and wants to place Delete on `=+`, then you would replace the above
permutations with `⌦-';` which lets the `-_` key advance at least a bit towards the center, where
`=` is in our colloquial mapping, or `'` in the original ANSI.

## Using the optimized Shift level without removing any keys

If you type on a full-size keyboard with a redundant AltGr mapping for the far-away keys, you can
get used to the comfort of having two different ways to type a character. When you are in typing
flow, use the closer one with a modifier; when you are just editing text, maybe with one hand on the
mouse, use the base-level character. (Many people can't properly type those unlabeled characters
without first centering their hands on the keyboard and then following muscle memory.) It's also
nice to use the same keymap on both small and large keyboards without having to mentally switch
between them.

So here's a neat trick, and it works no matter which of the above variations of the Shift map you
chose. Consider that `;:` and one other key have moved their characters to the Shift level, making
their original keys fully redundant, while the characters `()<>` have moved from the Shift level to
AltGr. We can use those doubly redundant key positions to re-introduce the characters on the base
and Shift level! We create two brand-new keys: `(<` and `)>`. With this trick we have optimized the
Shift-level mappings for small and big keyboards alike. Here's what the punctuation keymap looks
like:

        1!  2@  3#  4$  5%  6^  7&  8*  9/  0?  (<  )>   ⌫⌫⌫
                                          o   p   [{  ]}  \|
                                       k   l   '"  =+   ↵↵↵↵
                                 n   m   ,;  .:  -_   ⇧⇧⇧⇧⇧⇧

All ANSI characters are still available on the base and Shift level. And from this keymap (with the
redundant AltGr map shown above) we can successively remove keys to create smaller keyboards without
having to adjust any mapping or key position at all: the keys we'll keep are already in the letter
area!

## Using the redundant keys as navigation keys instead

Now here's where the advantages double up! Once you have got used to typing your technical
punctuation using the AltGr level only, why not repurpose the unused keys right next to your
keyboard's letter area? Those keys are easier to reach than the explicit navigation keys further to
the right, and much easier than the often tiny and cramped nav keys on laptops! And obviously, once
you have nav keys this close, you may as well get a more compact keyboard that doesn't have any of
those far-away nav keys at all!

The replacement is obvious:

- one pair of brackets takes Home/End,
- the other takes PageUp/PageDown,
- the oversized `\|` key becomes Delete (or Insert, or Fn, or whatever you like),
- optionally, if strongly desired, the `=+` key could also become Delete or Insert (especially on
  smaller boards, where `\|` has already dropped off),
- and the same holds for the backtick-tilde key, in case it hasn't become Escape.

You might ask: don't cool keyboards have a nav layer in their letter area? (Yes, see below.) Why,
then, have separate nav keys? The answer is that one often uses nav (and other) keys while not
typing, with the hands off the keyboard. For example, PageUp/PageDown get used while reading, with
your hands wherever is comfortable. Or you might select something with the mouse and then press
Delete.

## The nav layer

Depending on the system used for actually implementing the key map, we can abuse the character
levels to create a **navigation layer** that keeps the hands in their typing position.

- Windows national layouts don't allow it.
- xkb config allows it (using the term "levels").
- Programmable keyboard firmware such as QMK and ZMK allows it (but using the term "layer", which is
  a more general concept).

I call it "hands down" navigation, because the hands don't leave the home row. Elsewhere in this
repository we use "hands off" for those keys that are so far away from the home row that they
require taking the hands off. (But "hands off" navigation needs no layer or level key pressed, so
it's great for when the hands are already off the keyboard.)

Just like the letter-area AltGr character block above, the nav block is fixed by physical position,
not by pairing with specific base-layer keys. Its longest row is on the home row, and the ↑↓ keys
are on the middle finger (the longest one), leaving the four cursor keys in the familiar inverted-T
shape, just moved onto the home row.

        ↞   ↑   ↠
     ⇤   ←   ↓   →   ⇥
       ⇞   ↟   ↡   ⇟

Four characters per key and the ANSI row stagger, same as in the AltGr diagram above: the block sits
on the `wer`, `asdfg`, and `zxcv` keys of an ANSI keyboard.

Note that `↟` and `↡` denote mouse scrolls, which can be mapped using keyboard firmware and possibly
some third-party tools, but probably not using xkb. In case `⇟` or `⇞` would fall on the pinky and
clash with the Shift key, we move the lower row of the nav block one key towards the center.

# [Domain] Going international

## A generic international Shift pairing for punctuation

Since the colloquial English Shift pairings are already inspired by the punctuation keys of some
European keymaps, we can extend them to our 32-key flex maps. This doesn't yield a perfect keymap
for each language, but at least something non-stupid that the app can show. It also gives us a
simple rule for when to apply this mapping: whenever the shown flex map is of the ansi32 or thumb32
type.

Indeed, we can use the exact same Shift pairings as the colloquial English ones. Most layout models
have no room left for the four bracket keys, so on those all brackets (including the parentheses)
have to be typed from the AltGr level. Those lost keys compensate for the three extra letters of the
32-key flex map (which in exchange has one punctuation spot less, because the `'"` key moves into
the frame mapping) plus the backtick-tilde key, which many layout models spend on Escape. We also
don't need to apply a colloquialization step, since the 32-key character set already mandates the
base punctuation keys `,`, `.`, and `-`, and the frame mappings carry the other characters. (They
still have the freedom to use either `+` or `=` for this Shift pair, and similarly `'` or `#`.)
The minimum keyboard space for character keys using this mapping is then 43: ten digits, 32 flex
spots, and the `'"` key placed outside the flex map. If a keyboard has one more spot, I recommend
placing `=+`, for the same reasons as in the colloquial English key map. An ANSI-like keyboard with
Escape in the number row has two more spots on top of that, which can take redundant characters or
navigation keys. Since the 32-key map types always come with this Shift level and our AltGr level,
the frame mappings need no conditional customizing: they can arrange the flex spots and the other
keys directly, so that the free spots land where nav, Delete, or another key is most useful.

We make one small exception: when a German flex map (recognizable by its `ä`) is involved, the
pairings of the digits `6` to `9` become `6& 7/ 8* 9ß` to accommodate the letter `ß` and to move `&`
and `/` to their conventional German spots. (`8*` stays unchanged.) Since `2@` stays as it is, such
a map has `@` on the Shift level and doesn't need it on AltGr.

((TODO: adapt the AltGr level to include some more characters common on European keyboards. This is
not critical, since at least the German ones are rarely used, and never in keyboard shortcuts.))

## Excursion: what a colloquial German keymap would look like

This is not implemented. German maps that fit a 32-key flex map get the generic international
pairings above, which cover that case nicely enough, and the model-specific German maps keep the
standard German pairings.

Some numbers in advance: there are 29 letters in the German alphabet which have both minuscule and
capital form, and there is `ß`, which exists only in minuscule. Since we are really tight on space
and the standard keymap already has `ß` in the number row, we'll move it to one of the freed Shift
level spots in the number row. The standard German keymap also has the three keys `,;`, `.:`, and
`-_` in the same lower row spots of the main letter area as our colloquial English keymap. Those 3
plus 29 letter keys and 10 digits are already 42 keys, which I think is the minimum set needed for a
modified keymap to still resemble the original one enough to be easily learnable. Thus, we only need
to think about optimizing the number row.

As a baseline, look at the standard German Shift level. Since the standard German AltGr level is
ergonomically superseded by the English one we designed above, I am already using that as a start.

       ¡  ¢  £  €  ‰     |  [  ]  ¿
       1! 2" 3§ 4$ 5% 6& 7/ 8( 9) 0= ß?

The last key of this block is already outside the 42 key count and its two characters need to move.

Let's take stock:

- characters that are colloquial enough to stay on a Shift+digit position: `! " % & /` (5)
- characters that will definitely move out: `(`, `)`, `=` – and probably `§` as well (4)
- (Only `$` hasn't been committed to one of the above groups.)
- characters that need to be added: `?` and `ß` and maybe `'` (3)

Two reasons why I suggest removing `=` from the Shift level: first, its AltGr position on our
English AltGr map is really great; second, both `ß` and `?` vie for those spots on the right side.
Applying what we found so far gives:

       ¡  ¢  £  €  ‰     |  [  ]  ¿
       1! 2" 3' 4$ 5% 6& 7/ 8  9ß 0?

Note that I already placed `'`, because the free spot next to `"` was just too good to miss.
Candidates for the Shift+8 position are `+` and `*` and the latter clearly wins for two reasons:
first, because it's a Shift-level character in the standard German keymap, needing less relearning;
and second, because `8*` is a keycap in ANSI English – that's reuse and a mnemonic in one. Besides,
we already placed `+` in the English AltGr level and can reuse that.

Next, let's place the remaining keys on the AltGr level. I also included a Shift+AltGr level,
because we have a few rarely used characters where the mnemonic is more important than the ease of
typing them.

       °¡  @§  #£  €¢  ‰   |^  \   [   ]   ´¿
       1!  2"  3'  4$  5%  6&  7/  8*  9ß  0?

This is not super-well thought out, but here are the good parts from left to right:

- `°` moves by one key (and changes level)
- `@` is already an AltGr level key in the German standard, but sits in the letter area that we
  better keep clear for navigation keys. Thus, we move it to the key that has it in English, which
  is just one key away from the old position – the same spot the shared AltGr map falls back to when
  the nav block claims the German one.
- We prefer the English pound/Pound mnemonic, with the additional benefit of `'` and `#`
  landing on the same key, just as in the German standard. Thus, `§` has to move one to the left.
  (No problem, it's a character that I might otherwise even just drop from the keymap entirely.)
- We move `|` from the English position to keep its mnemonic, and also add `^` on the same key. The
  latter is suboptimal, if you need that often, but also a great mnemonic, because of ANSI's `6^`
  pairing.
- `\` pairs with the standard `/`.
- Claude insists on mentioning that there is a majuscule `ß` – but it doesn't have a practical use,
  so our mapping on the Shift level stands. (Also, feel free to add it on Shift+AltGr of that key
  which is still free!)
- `´` is the acute accent that is placed on the right of the number row originally, so this position
  is a short move. Originally it pairs with the backtick (grave accent), but we keep the latter in
  the English inherited position on the letter-area AltGr level, because it's actually used often in
  Markdown and TypeScript and other technical languages.

The German standard already has characters in the AltGr+digits, but those are already all placed
better in our technical base AltGr block, so we override them here. For the better!

The one thing this keymap glosses over is that the German standard has the accents `´^` and grave as
combining accent keys, while the technical use of two of them is non-combining. So you'll have to
decide which one you want or whether to map both in different positions. (I did it on one of my
personal keymaps, but that's too messy to reproduce here. I even added a combining tilde, just
because I can.)

So that's my proposal for a colloquial German Shift and AltGr level map, not fully mature, but a few
things really stand out:

- the Shift+digits make a well-rounded set: keeping six standard pairings and adding four really
  frequently used characters: `'`, `*`, `ß`, and `?`. All in mnemonic and practical positions.
- compatibility with the ANSI AltGr mapping shown above for English is very high: only `|` and
  `\` of the main block change position to keep their mnemonic. And changes in the "bonus"
  AltGr+digit characters of the ANSI keymap aren't a problem, given their low usage.

# [App] Implementation design and UX

## Making the bracket pairs appear together in keymaps

To make the pair of new bracket keys co-located on all keyboard layout models, we need to add some
layout-model-specific tweaking code. Fortunately, the positions where those keys are added lie
outside the flex mapping (at least for ansi30 and thumb30), so the layout model alone can move them.
(The moved `'"` and `-_` keys do land in flexible spots inside the letter area, though, so the
pretty relation between `+` and `-` can get lost.) On the big model-specific keymaps, however, we
can't use the same layout-model-based tweaking code. If I ever want that, I'll design something
flex-map specific. Out of scope for now.

## UX for the nav key replacements

The [Domain] sections describe mostly already implemented functionality and serve as a manual and
rationale. For the UX, the manual is the visible behavior of the app itself. Therefore, this section
only describes the new behavior that still needs to be implemented.

- There will be specific buttons for each nav pair and separately for the Delete and Insert keys.
  (Three buttons in total.)
- Each button has an 'on' and an 'off' state: when 'on', the nav or edit key is placed in the
  keymap.
- If a key or key pair is already on the board, its button will not be displayed.
- If there are no bracket pairs on the board, don't show any of the paired nav buttons.
- If none of the seven optional keys is on the board, don't display the nav button group at all.
- If a button is selected and all the optional keys are already assigned to other nav keys, unassign
  one (or an entire pair, never half of a pair) to assign the new one.
- Order of the keys to use:
    + for pairs, first `[]`, then `()`;
    + for singles, first `\|`, then backtick-tilde, then `=+`, and lastly `/?`; after the last one,
      use a key from a pair.

