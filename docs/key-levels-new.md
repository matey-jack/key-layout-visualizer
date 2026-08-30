Like many features in this app, key levels have an easy and a hard part to them. The easy part is to
simply show the Shift and AltGr characters and Nav keys in the keyboard visualization. The hard part
is to fine-tune it to all keyboard layout models and flex key maps and to provide a few sensible
additional options for the key maps. All new functionality is accessed via a new "mapping
visualization" in the app called "Shift levels", so that all this new information doesn't clash with
the existing.

This document has both purely domain descriptions (that is, implementation-independent design and
rationale of keymaps)
and app-specific descriptions (that is, what is shown where and how in the app). I try to keep both
separate, but since each informs the other, boundaries sometimes blur. For sections that are mostly
about one or the other I use the tags [domain] and [app], so readers can orient themselves.

# [App] Showing the Shift and AltGr level characters (and functions)

The Shift level character is purely defined as a pairing from base characters, so it automatically
follows the different flex maps and layout model's frame maps. The app has pairings for English and
German, where the latter stands as an example for many Latin alphabet based languages: all of them
place more characters on the keyboard than the 94 of the ANSI English keyboard. (47 character keys
each with two characters. At least this character count is independent of the many variations in
modifier and other key counts that various keyboards have.)

The only slightly complicated part here is to tell the difference between English and German (or
another language with a similar punctuation mapping, even if the extra letters are different). To be
independent of the German alphabet, we'll use the ANSI `;:` as a marker, because most European
keyboards do not have `;` as a base label. ((TODO: this needs to be changed in the source code.))
(An even better way to recognize a non-ANSI keymap is to look for the `?` on the Shift level of the
number row, but our base key maps don't have Shift levels to look at.)

There is just one more little nag. To make keymaps and keycaps look prettier, I sometimes labeled a
key like `=+` (whose base character is `=`) instead with the Shift-level character, here `+`.
([Domain] in this case it was to highlight the symmetry between `+` and `-`. The latter is already a
base character. A similar example is the German `#'` key which I label as `'`.) And for the
back-tick character, I actually included it's Shift-level character (the tilde `~`) on the frame
mappings, because it would otherwise be hard to see. So the app needs to work around both those
cases and recognize what key the base label actually denotes. In the "Shift levels" visualization
all those keys will be normalized to correspond to the base/Shift pair for the auto-selected
language.

## [App] AltGr level

To define the character-placement for the AltGr level, we use a dual approach. For the number row we
use the same base-key indexing as for Shift, because a lot of the characters here form nice
mnemonics with the Shift-level keys. For the letter area, we use a positional approach instead,
because the AltGr characters there have a meaningful relationship among each other and don't relate
to the letters "below". (This "below" is referring to base being level 1, Shift level 2, and AltGr
level 3 all stacked above each other.)
The positional approach is especially sensible for the navigation keys which are highly mnemonic in
their positions, as we will see.

One important point, not yet designed is that the keyboard should have an AltGr modifier key on each
side, same as the two Shift keys. We might later add some visuals and options for that in the app.
For now, we just highlight the AltGr key in the "Shift levels" view, so that people who've never
used one, can relate it to the AltGr level key labels shown in the same color.

## [Domain] Ergoslat numberless

Although I personally consider keyboards without number row impractical – there are just too many
new mappings on too many new layers to learn – there is one such keyboard in the app and given that
it already exists, I decided to add a very special Shift-level mapping to it. It has five keys with
the VIP defined below and since there are two more keys available on the board, I added four useful
characters that every other keyboard maps to the number row.

The set is: `,;`  `.:`  `-!`  `/?`  `'"`  `$%`  `&+`

And the arrangement can be seen in the app. How it maps to the flex map's punctuation is a hard-code
heuristic, easy enough since most keys have a natural pairing with the flex map character set. (As a
fun fact, this is the only layout model that has a modified / compressed Shift pairing independent
of the base mapping's language. It's also not configurable, since the default punctuation keys don't
make sense without the number-row characters.)

# Options for ergonomic keyboard layout models

What follows in this section is applied to the English keymaps only, because it goes into quite 
some detail and the German/international punctuation isn't strictly defined in the app.

## [Domain] Motivation and Background

There's a "one key from home" movement among keyboard nerds that has leaked into the industry, and
it applies both to small keyboards and to larger ones. The smallest keyboards literally remove every
key that is not a finger's home key or neighbor thereof. Most still count diagonal neighbors, so
they have at least 6×3 keys per hand. For our purpose we'll also allow the number row to get 6×4
keys per hand, plus some thumb keys. All characters and other functions of those keys will have to
be mapped to the AltGr level (for characters) and often further layers (like the one on laptops,
activated by the "Fn" key). The shorter distance allows more comfortable typing and can reduce
typos, because hands won't lose their home position after hitting a far-away key. (Compared to
legacy ANSI and ISO keyboards it also reduces strain on the right pinky finger... at least for
people who are crazy enough to follow formal typing practice on those keyboards.)

Anyway, it turns out that typing characters and commanding navigation and other functions using two
keys (a modifier and the multi-leveled key) close to your hands can be much more comfortable than
having to reach further away. And this is why the same AltGr level mappings used on small keyboards
where many characters couldn't otherwise be accessed are actually useful on larger keyboards as
well! And even better: once we have defined a good AltGr key map, we can use the same on large and
small keyboards alike. This automatically gives us the option to support keyboards of many
in-between sizes! We simply define a core of 40 character-keys and create redundant AltGr mappings
for all the remaining keys. (The 40 keys is 5 columns and 4 rows per hand, leaving the 6th row and
thumb keys for non-character keys like Shift, AltGr, Return, Delete, etc. Most keyboards I have seen
actually have one character key in the sixth row, but this 41-key case is automatically covered by
our approach.)

The solution "move all characters from missing keys to a new keyboard layer" is what most
programmable keyboards do, but we are offering something on top of that: recognizing that the Shift
level is usually easier to reach, and we do it regularly while typing prosaic (meaning
non-technical) texts for capital letters and punctuation like `!`, `?`, and `:`, it makes sense that
any punctuation used in such writing is actually available as a base or Shift-level character. So
what we'll do is to remove some of the more technical characters from the Shift-level and place
prosaic ones instead! And to let people flexibly experiment with this solution, we'll map the
characters on AltGr redundantly. It's a bit of a puzzle, but the reward is that we can adapt all the
existing keymaps in this app to keyboards with anything from a tiny 4 to full 11 punctuation keys.
(Those numbers follow from the 40 and 47 total character keys and that we are not removing and
letter and digit keys.)

## [Domain] How to remove punctuation keys

US ANSI has 32 punctuation characters in total: 11 on the base level and 21 on the Shift level (the
11 partners of those keys plus the 10 shifted digits). I don't want to list all of them, so let 
me start by calling out four punctuation keys that I consider highly "technical", that is not 
for writing simple English texts and messages, and those are `[{`, `]}`, `\\|`, and the 
backtick-tilde `` `~ `` which I call by name, because the backtick itself is Markdown syntax 
that sometimes confuses text rendering. Those four keys are easy to handle for two reasons:
 - they are already on the edge of the keyboard, so we can remove them and the board is smaller 
   without leaving a gap.
 - since their characters are so technical, we can directly move them to the AltGr level without 
   thinking about some Shift-level rearrangements.
 - and as a sweet extra, the backtick-tilde key is exactly where keyboards without a function 
   row like to put their Escape key.

### The core of the AltGr level key map

Starting from those 8 characters, 4 of which being brackets, it seems reasonable to collect all 
of ANSI's brackets on the AltGr layer. Indeed, you might say "the plain parentheses () are 
actually used a lot in plain, non-technical text", but I have a surprise for you: we can map `(` 
and `)` to and AltGr level home row position: then they will be even easier to access than via 
Shift plus a reach to the number row! And a similar trick applies to the angled brackets `<` and 
`>`: Their normal position is on very easily reachable keys on the Shift level, positions too 
good for characters not used in prose. So we move them to the AltGr level instead, but leave 
them on the same keys. We can then build a logical AltGr layer keymap by starting from those 
keys, which are typed by the longest two fingers: middle and ring finger. Let's see the mapping:

        |   [   ]
          \   {   }   ~
           +   (   )   `
             =   <   >

The diagram represents the staggered rows of the right-hand side of an ANSI/ISO keyboard. This 
mapping has numerous mnemonical advantages:
 - All brackets are typed with the middle finger (opening) and ring finger (closing).
 - `<>` sit on the same keys as in standard ANSI – so the keycaps are still valid.
 - `()` sit on the same fingers as they do in the German and other keymaps – so one could get 
   keycaps from there or just enjoy the mnemonic. 
 - `[]` are literally on the same position – AltGr level and keys – as in the German keymap.
 - `|` is on the `7&` key, hinting at `&` and `|` being 'and' / 'or' in programming languages.
 - The backtick is close to the apostrophe in Standard ANSI (and often ends up on the actual 
   same key, see below). The tilde is close to where the German keymap has it: same level, 
   same finger, same row, but closer to reach! 
 - We offer a special place to `=` which was yet unmentioned, because it being on the same key 
   level as `<>` makes bigrams like `<=` and `==>` so much easier to type.
 - Also note that most of the characters that once shared a key on two different levels are now 
   in the same column on neighboring rows. This is why I just had to add the `+` character as 
   well. Just for good completeness!

Anyone designing their own keymap might want to map the backtick on the AltGr level of the 
quotes key, but since our AltGr has to fit many flex maps with different quotes key positions, 
we can't do that without conflict.

### Removing non-technical punctuation keys

The move of `<>` to the AltGr layer also prepares for a power-move that makes our punctuation 
map both prettier, and more practical, and brings the ANSI keymap closer to international ones.
I call it the dissolution of the `;:` key. We simply move the characters to the freed 
Shift-level spots and thus create the `,;` and `.:`. Very logical pairing, keycaps available 
from other countries, and no addition to the AltGr level needed!

### Using the optimized Shift level without removing any keys

If you type on a full-size keyboard with a redundant AltGr mapping for the far-away keys, you 
can get used to the comfort of having two different ways to type a character. When you are in 
typing flow, use the closer one with a modifier; when you are just editing text, maybe with one 
hand on the mouse, use the base layer character. (Many people can't properly type those 
unlabeled characters without first centering their hands on the keyboard and then following 
muscle memory.) It's also nice to use the same keymap on both small and large keyboards without 
having to mentally switch between them.

So here's a neat trick, and it works for both the `/?` and `=+` variation of the Shift map: you 
install the key