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

Todo in code:

- Model-specific permutations of the colloquial 32-flexkey mappings, where applicable.
- 32-flex key mappings for the Ergoslat numberless.
- Implement the Nav key replacements.
- Animate the toggling of the colloquial mapping for English. Only animate the base keys that are
  moving (as current animation logic already does), ignoring the other levels.
    + It seems this works already in one way. But it should work both ways.
- Maybe show some options of placing a left-hand AltGr key. Probably on the legacy CAPS key spot.
- Check some of my favorite English model-specific flex-maps: how do they look with colloquial Shift
  pairings? do I want to fix anything?

# Showing the Shift and AltGr level characters (and functions)

[Domain] Flex maps can place any character (or other key) on a layout, and frame mappings can do the
same. Maps of either kind make use of this to place unconventional characters. Since we don't want
to explode complexity by adding a perfectly matched Shift mapping for each combination, we restrict
ourselves to two conventional Shift maps (US ANSI and German Qwertz) plus several unconventional
ones. Rules and heuristics then decide which Shift mapping is shown for a given flex map and layout
model combination.

Our unconventional Shift pairings are mixing two goals:

- keep prosaic punctuation keys on the base and Shift level even on small keyboards that have few
  pure punctuation keys.
- offer a common punctuation mapping for other languages, so that we only need to develop one kind
  of "international" frame mapping and Shift pairing and use it with several languages.

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
carries it either — that would tie the whole layout model to German. A model-specific map for a
German alphabet that still has no `ß` gets the ANSI pairings, and rightly so: without the key it
draws ANSI punctuation such as `'` and `/`, which the German mapping does not pair at all.

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
confuses text rendering of this document itself. Those four keys are easy to handle, for two
reasons:

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

((TODO: One important point, not yet designed, is that the keyboard should have an AltGr modifier
key on each side, the same as the two Shift keys. We might later add some visuals and options for
that in the app. For now, we just highlight the AltGr key in the "Shift and AltGr Levels" view, so
that people who have never used one can relate it to the AltGr-level key labels shown in the same
color.))

## AltGr bonus characters for the number row

Since the above bracket block already places three AltGr characters in the number row, we may as
well fill the entire row. For mnemonic reasons we do this by character pairing and independent of
fingering:

       ¡  ¢  £  €  ‰  ^  |  [  ]  ¿
      1! 2@ 3# 4$ 5% 6^ 7& 8* 9/ 0?

(Sadly, one mnemonic is lost on the generation that reads `#` as "hash", while older people still
remember it as the "pound" character, which makes it perfect for the British pound sign.)

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

Finally, the `^` on `AltGr+6` also serves a German keymap – not the standard one, which has the
character on the base-level of key, but the German variant of our international colloquial keymap
that we'll see below.

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

Small keyboards might not have all the keys moved around by the above permutations. In that case, we
won't insert the new parenthesis keys, but instead the missing other punctuation key. For example,
in the minimal case of a frame mapping that has only digits, flex keys, and no further punctuation,
the spots of `;` and `/` will be filled with `'` and `-`. If one of those is already present, but no
`+`, then `+` will enter instead.

## Using redundant periphery character keys for other purposes

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
like on a legacy ANSI keyboard:

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

## Numberless keyboards

There's a lot of 3-row or "30 key plus thumb keys" keyboards on the market, and they need a much
more complicated layer system. I don't want to replicate this in this app, but we can follow our
"colloquial punctuation" strategy to give a glimpse at what a usable key map for such a board would
look like. To highlight that this is a different category of keyboard which comes with its own
firmware that offers layers and a lot of other features, we use a new Shaft key `⇩` instead of
AltGr. We also place it explicitly on both halves of the keyboard, like Shift `⇧`.

Design premises:

- Completely abandon the generic AltGr level mapping from our other keyboards, because that relies
  on having four rows. We outright remove the technical punctuation `[]{}<>|\` from the visible
  layers. (You might imagine that there are further layers not shown or that the keyboard is for use
  with phones and tablets where no programming work is done anyway.)
- Use the colloquial Shift pairings `,;` and `.:`, but keep the `/?` key in play, so that `?`
  stays a shifted character. Introduce the new `-!` shift pairing, so that `!` also stays a shifted
  character. (We can swap `!` and `_` or map another character on that spot.)
- Following a common practice, map the digit row and its shifted punctuation characters
  position-based to the upper and lower letter-area rows of the AltGr level. Basically, each digit
  and punctuation character will still be typed by the same finger.
- Place the navigation in the home-row of the AltGr level, using an "in-line" system with
  `←  ↑  ↓  →`  on one hand and `⇤  ⇞  ⇟  ⇥` on the other. This can use the exact home positions of
  the fingers. The middle has three spots for other non-character keys, we could place Delete in
  one, if it weren't on the board already.

Consequences of those premises: `()` stays mapped between the other "shifted digit punctuation"
characters in the Shaft layer. In total, this has 22 out of ANSI's 32 punctuation characters on its
three levels: 6 on base, 6 on Shift, 10 on Shaft. It covers all the 18 punctuation characters that
our colloquial 40 character key map has on its base (4) and Shift (4 + 10) levels.

# [Domain] Going international

## Different, but same purpose of the AltGr level mappings

For the ANSI character set, our AltGr level already serves several purposes:

- make technical punctuation more easily accessible by placing the characters on or closer to the
  home keys.
- use the same keymap on smaller keyboards, down to a size of 40 character keys, simply by omitting
  keys whose characters are redundantly mapped on the AltGr level.
- finally, bring some navigation and other keys closer to the hand position (and on fixed spots, as
  opposed to the variable placement on many laptops) – again, by remapping redundant keys.

When international character sets come into play, these advantages extend naturally, because most
international keymaps already place some of the technical punctuation on the AltGr level. This means
that we cannot remove as many keys when mapping smaller keyboards, but it also means that we can use
the exact same AltGr level mappings for all languages! For our generic 32-flex-key approach this
means that we can place 3 extra letters (or generally 6 extra characters) and use keyboards with a
minimum of 43 character keys. (Any surplus is usable as redundant characters or navigation keys,
just as in the ANSI English case.)

Note, however, the premise of this work: many international keymaps also introduce new punctuation
characters, such as the negation sign `¬` and broken pipe `¦` on the UK English, or the section `§`
and degree `°` signs on the German one. Our app doesn't show how those could be mapped.

Instead of following localized punctuation, we prioritize the ANSI character set and that has two
big advantages:

- programming languages are the same all over the world (including low-code usages such as `$`
  for relative cell references in Excel) and they all use the ANSI punctuation. Programmers now can
  also work the same way and still have their national letters on the keyboard.
- keyboard shortcuts are also usually based on the ANSI keyboard mapping. Some keyboard mappings
  don't even work in nationalized keymaps for this reason. Using the same punctuation map in many
  languages partly or wholly fixes this.

## A generic international Shift pairing for punctuation

Since the colloquial English Shift pairings are already inspired by the punctuation keys of some
European keymaps, we can extend them to our 32-key flex maps. This doesn't yield a perfect keymap
for each language, but at least something non-stupid that the app can show.

Some facts:

- the 32-flexkey character set never contained the `;` key, so this part of our colloquial Shift
  pairing (`,;` and `.:`) has to be permanent, even when the "colloquial Shift pairing"
  mode is inactive. (`<>` are already permanently available on AltGr.)
- When there are 47 character keys and three extra letter, one of the letters replaces `,;` and the
  others replace `[{` and `]}` – that's no problem, because they are also on our default AltGr
  layer. (Some of our fictional keyboards actually have 49 character keys, unlike any standard board
  you can buy. Those can show the three international letters and all ANSI characters except `<>` on
  the base and Shift level only.)
- The minimum keyboard space for character keys using this mapping is 43: ten digits, 32 flex spots,
  and the `'"` key placed outside the flex map. (If a keyboard has one more spot, I recommend
  placing `=+`, for the same reasons as in the colloquial English key map.)

Now let's introduce "standard" and "colloquial" Shift pairings:

- The only difference in Shift pairings is that standard mode has Shift pairings `9(` and `0)`
  while colloquial mode has `9/` and `0?`. All other pairings are as in the ANSI colloquial mode.
- If the keymap doesn't have a `/` key at all, then the colloquial mode will automatically be
  selected and "standard" will be disabled in the UI. (We still show the buttons, to show the
  current mode to the user.)
- If the frame has a `/` key and another redundant character key, then colloquial mode can replace
  it with the new "mixed" parenthesis keys `(<` and `)>`. The other key selected for this swap is
  `\|`, backtick-tilde, or `=+` in this order of precedence. (Note that the latter can show as
  either `+` or `=` on a merged base map.)
- If the frame has a `/` key and no other redundant key, then colloquial mode simply replaces `/`
  with `+`.

We make one small exception: when a German flex map (recognizable by its `ä`) is involved, the
pairings of the digits `6` to `0` become `6& 7/ 8* 9ß 0?` to accommodate the letter `ß` and to move
`&` and `/` to their conventional German spots. (`8*` stays unchanged.) Those overrides happen to
cover the two digits the standard and the colloquial mapping disagree about, so a German map has one
Shift level either way: there the mode switch only moves the two keys.

Rejected alternative for reducing the footprint to 42 characters keys while still keeping the quotes
`'"` on the Shift level: map them onto the `3` and `6` keys, moving the present Shift occupants `#`
and `^` to the AltGr layer. This conflicts with the German special case, but could still be done as
a variant for other languages.

## When the standard pairing is not on offer (TODO: move this section up to English and reword)

`'"-_;:/?` are the characters our AltGr level does not carry, on any of the boards. Each of them is
therefore only ever on the one key its Shift pairing puts it on, and a keymap that has no such key
cannot be typed completely. Where that happens the app disables the "standard" mode and shows the
colloquial pairing alone – on the international mapping above whenever the board draws no `/` key,
and on an English one that would be short of `'`, `-`, `/` or `;`. It is the colloquial mapping's
whole purpose to make those keymaps work, so it always has a home for all eight.

## Summary of when each Shift pairing is active

- Highest priority is the pure German Shift pairing, which is active for any keymap that contains a
  letter `ß`. (Those are rare, because only layout-model-specific keymaps have space for all of
  `äöü` and `ß`.) This is the only Shift pairing that doesn't offer a colloquial mode. We still 
  show the mode switch for completeness and disable the "colloquial" button.

- Next highest priority is the English ANSI Shift pairing, which is active any keymap that contains
  a letter `;`. This automatically includes all the 30-flex-key mappings, but also works for 
  layout-model-specific keymaps. 
 
- All the remaining keymaps receive the international Shift pairing (possibly with the German 
  modification).

As explained above, the "standard" mode of English and international Shift pairings will not be 
available on smaller keyboards, but the colloquial mode is always available.


## Numberless international

Three pure punctuation keys (coming from the flexmap): `,;`, `.:`, and `-_`.

Shaft layer like the ANSI English numberless, but the punctuation row follows the colloquial set
from keyboards with a number row: `! @ # $ % ^ & * / ?`. While it would be nice to have `!` and
`?` and possibly even `/` on the base and Shift layer, having to remap and relearn all three shifted
key pairs doesn't seem worth it. Especially since the characters `;` and `:` are also very common in
prosaic writing.

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

## Details Area texts

The details area (bottom right of the app) for the Shift level doesn't need a legend. But it should
say which is the current Shift mapping that applies. It should never describe the mapping letter by
letter, because that is already obvious from the Keyboard SVG. Instead, it should highlight the
advantage of the current mapping and the purpose that it was made to serve.

The names and the explanations themselves are in `ShiftPairingParagraph`
(details/DetailsArea.tsx): user-facing prose belongs in the app.
