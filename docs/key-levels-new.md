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

<<TODO>> One important point, not yet designed is that the keyboard should have an AltGr modifier
key on each side, same as the two Shift keys. We might later add some visuals and options for that
in the app. For now, we just highlight the AltGr key in the "Shift levels" view, so that people
who've never used one, can relate it to the AltGr level key labels shown in the same color.

## [Domain] Ergoslat numberless

Although I personally consider keyboards without number row impractical – there are just too many
new mappings on too many new layers to learn – there is one such keyboard in the app and given that
it already exists, I decided to add a very special Shift-level mapping to it. It has five keys with
the VIP defined below and since there are two more keys available on the board, I added four useful
characters that every other keyboard maps to the number row.

The set is: `,;`  `.:`  `-!`  `/?`  `'"`  `$%`  `&+`

And the arrangement can be seen in the app. How it maps to the flex map's punctuation is a hard-code
heuristic, easy enough since most keys have a natural pairing with the flex map character set. (As a
fun fact, this is the only layout model that has a modified / centralized Shift pairing independent
of the base mapping's language. It's also not configurable, since the default punctuation keys don't
make sense without the number-row characters.)

# Options for ergonomic keyboard layout models

What follows in this section is applied to the English keymaps only, because it goes into quite some
detail and the German/international punctuation isn't strictly defined in the app.

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
11 partners of those keys plus the 10 shifted digits). I don't want to list all of them, so let me
start by calling out four punctuation keys that I consider highly "technical", that is not for
writing simple English texts and messages, and those are `[{`, `]}`, `\\|`, and the backtick-tilde
`` `~ `` which I call by name, because the backtick itself is Markdown syntax that sometimes
confuses text rendering. Those four keys are easy to handle for two reasons:

- they are already on the edge of the keyboard, so we can remove them and the board is smaller
  without leaving a gap.
- since their characters are so technical, we can directly move them to the AltGr level without
  thinking about some Shift-level rearrangements.
- and as a sweet extra, the backtick-tilde key is exactly where keyboards without a function row
  like to put their Escape key.

### The core of the AltGr level key map

Starting from those 8 characters, 4 of which being brackets, it seems reasonable to collect all of
ANSI's brackets on the AltGr level. Indeed, you might say "the plain parentheses () are actually
used a lot in plain, non-technical text", but I have a surprise for you: we can map `(`
and `)` to and AltGr level home row position: then they will be even easier to access than via Shift
plus a reach to the number row! And a similar trick applies to the angled brackets `<` and
`>`: Their normal position is on very easily reachable keys on the Shift level, positions too good
for characters not used in prose. So we move them to the AltGr level instead, but leave them on the
same keys. We can then build a logical AltGr level keymap by starting from those keys, which are
typed by the longest two fingers: middle and ring finger. Let's see the mapping:

        |   [   ]
          \   {   }   ~
           +   (   )   `
             =   <   >

The diagram represents the staggered rows of the right-hand side of an ANSI/ISO keyboard. This
mapping has numerous mnemonical advantages:

- All brackets are typed with the middle finger (opening) and ring finger (closing).
- `<>` sit on the same keys as in standard ANSI – so the keycaps are still valid.
- `()` sit on the same fingers as they do in the German and other keymaps – so one could get keycaps
  from there or just enjoy the mnemonic.
- `[]` are literally on the same position – AltGr level and keys – as in the German keymap.
- `|` is on the `7&` key, hinting at `&` and `|` being 'and' / 'or' in programming languages.
- The backtick is close to the apostrophe in Standard ANSI (and often ends up on the actual same
  key, see below). The tilde is close to where the German keymap has it: same level, same finger,
  same row, but closer to reach!
- We offer a special place to `=` which was yet unmentioned, because it being on the same key level
  as `<>` makes bigrams like `<=` and `==>` so much easier to type.
- Also note that most of the characters that once shared a key on two different levels are now in
  the same column on neighboring rows. This is why I just had to add the `+` character as well. Just
  for good completeness!

Now that both `=` and `+` have found a place on our AltGr keymap, we can already consider the
`=+` key as optional. We have thus made five ANSI punctuation keys optional, getting down from 11 to

6.

### Removing non-technical punctuation keys

The move of `<>` to the AltGr level also prepares for a power-move that makes our punctuation map
both prettier, and more practical, and brings the ANSI keymap closer to international ones. I call
it the dissolution of the `;:` key. We simply move the characters to the freed Shift-level spots and
thus create the `,;` and `.:`. Very logical pairing, keycaps available from other countries, and no
addition to the AltGr level needed! I think that this is a great move, also because `;:` occupied a
home-row spot in the main letter area: we can make better use of that spot by putting the `'"` key
there! Since the single quote is also used as the apostrophe inside of words, just like a letter,
this change is actually also an improvement in finger movement for typing English texts.

Now the pure-punctuation keys that we are left with are actually few enough to be enumerated: `,;
`, `.:`, `'"`, `/?`, and (the only one still outside the letter area) `-_`. Now the common wisdom is
to remove the `-_` and map its characters on the AltGr level. But thanks to our mighty stack of
brackets, we additionally have the option to map two more characters onto the Shift level, where
`()` used to be. For sure, we could do that with `-` and `_` although it would make more sense to
put `+` and `-` together on the Shift level, and `_` (a rather technical character)
on the AltGr level.

But I suggest a nicer move: `/` and `?` to the Shift level, and the `-_` key taking the former's
spot. There are again mnemonical, international, and practical advantages:

- it's practical to type /* and */ if you are a programmer and still write code without AI.
- `?` lands symmetrical to `!` on the other side of the number row. That's really sweet and
  incidentally something that a lot of other languages also do.
- `-` is actually a much used character, maybe more so than `/` – maybe depends on your writing
  style / personality. (Note the punctuation characters in that last half-sentence!)
- And yes, the `-_` key is placed in that exact spot in the German and some other keymaps.

And thus we have reduced our keymap to 40 keys (including 4 punctuation keys) without moving any
prosaic punctuation key to the AltGr layer. The minimal set now looks like this:

    1!  2@  3#  4$  5%  6^  7&  8*  9/  0?
    '"  ,;  .:  -_  

Out of those 14 keycaps 10 are pure US ANSI, 3 are obtainable from other languages, and only
`9/` is the odd one out. (Although I didn't check if it exists somewhere.)

A final note: because I use `Ctrl +` and `Ctrl -` so much for zooming text, I have included the 
`=+` key on my 41-key board. It's more logical that way, too, because `/?` is represented on the 
Shift level and thus more dispensible. But the nice thing is: you are free to choose which of 
the 7 redundant keys you want to keep; the keymap works regardless.


### Using the optimized Shift level without removing any keys

If you type on a full-size keyboard with a redundant AltGr mapping for the far-away keys, you can
get used to the comfort of having two different ways to type a character. When you are in typing
flow, use the closer one with a modifier; when you are just editing text, maybe with one hand on the
mouse, use the base level character. (Many people can't properly type those unlabeled characters
without first centering their hands on the keyboard and then following muscle memory.) It's also
nice to use the same keymap on both small and large keyboards without having to mentally switch
between them.

So here's a neat trick, and it works no matter which of the above variations of the Shift map you
chose. Consider that `;:` and another key have moved their characters to the Shift level, making
their original keys more than redundant, while the characters `()<>` have moved from the Shift level
to AltGr. We can use the super redundant key positions to re-introduce those characters to the base
and Shift level! We create two brand-new keys: `(<` and `)>`. With this trick we have optimized the
Shift level mappings for small and big keyboards alike. Here's how the punctuation keymap looks
like:

        1!  2@  3#  4$  5%  6^  7&  8*  9/  0?  (<  )>   ⌫⌫⌫
                                          o   p   [{  ]}  \|
                                       k   l   '"  =+   ↵↵↵↵  
                                 n   m   ,;  .:  -_   ⇧⇧⇧⇧⇧⇧

All of ANSI characters are still available on the base and Shift level. And from this keymap (with
the redundant AltGr map shown above) we can successively remove keys to create smaller keyboards
without having to do any adjustments in mappings or key position at all: the keys that we'll keep
are already in the letter area!

### Using the redundant keys as navigation keys instead

Now here's where advantages double-up! Once you got used of typing your technical punctuation using
the AltGr layer only, why not repurpose the unused keys just next to your keyboard's letter area?
Those keys are easier to reach than the explicit navigation keys further to the right. They are
especially easier to reach than the often tiny and cramped nav keys on laptops! And obviously, when
you have nav keys so close, you can as well get a more compact keyboard that doesn't have any of
those too-far away nav keys at all!

The replacement is obvious:

- one pair of brackets takes Home/End,
- the other takes PageUp/Down,
- and the oversized `\|` key becomes Delete (or Insert or Fn or whatever you like)
- optionally, if strongly desired, the `=+` key could also become Delete or Insert. (Especially on
  smaller boards, where `\|` already dropped off.)
- the same holds for the backtick-tilde key, in case that it hasn't become Escape.

You might say, hey, don't cool keyboards have a nav layer in their letter area? (Yes, see below.)
Why then, separate nav keys? – The answer that one often uses those nav (or other) keys while not
typing with the hands on the keyboard. For example, PageUp/Down will be used during reading, with
your hands anywhere comfortable. Or you might select something with the mouse and then use the
Delete key on that.

### The nav layer

Depending on the system used for actually implementing the key map, we can abuse the character
levels to create a **navigation layer** that keeps the hands in their typing position.

- Windows national layouts don't allow that
- xkb config allows it (using the term "levels")
- programmable keyboard firmware such as QMK and ZMK allows it (but using the term "layer" which is
  a more general concept)

I call it "hands down" navigation, because the hands don't leave the home row. In other places of
this repository we use "hands off" keys for those keys so far away from the home row that they
require taking the hands off. (But "hands off" navigation needs no layer/level key pressed, so it's
great for when the hands are already off the keyboard.)

Just like the letter-area AltGr character block above, the nav block is fixed by the physical
position, not by pairing with specific base layer keys. Its longest row is on the home row and
the ↑↓ keys are on the middle finger (which is the longest), which leaves the four cursor keys in
the familiar inverted-T shape, just moved onto the home row.

        ↞   ↑   ↠
     ⇤   ←   ↓   →   ⇥
       ⇞   ↟   ↡   ⇟

Four characters per key and the ANSI row stagger, same as the AltGr diagram above:
the block sits on the `wer`, `asdfg`, and `zxcv` keys of an ANSI keyboard.

Note that the `↟ ↡` denote mouse scrolls which can be mapped using keyboard firmware and possibly
some third-party tools, but probably not using xkb. In the case that `⇟` or `⇞` would fall on the
pinky and clash with the Shift key, we move the lower row of the Nav block by one key towards the
center.

## [App] How all of this looks in the app

TODO: in the UI and in code, rename the "compressed" Shift pairings to "centralized".

To actually make the pair of new bracket keys be co-located on all keyboard layout models, we need
to add some layout-model specific tweaking code. Fortunately, the positions where those are added
are outside the flex mapping (at least for ansi30 and thumb30) and thus the layout model alone can
move them. (Although the moved `'"` and `-_` keys land in flexible spots inside the letter area, so
that a pretty relation between `+` and `-` can get lost.)
This means that on the big model-specific keymaps, we can't use the same layout model-based tweaking
code. If I ever want this, I'll design something flex-map specific. Out of scope for now.

New UX for the Nav key replacements:

- There will be specific buttons for each nav pair and separately for the Delete and Insert keys.
  (Three buttons in total.)
- Each button has an 'on' and an 'off' state: when 'on' the nav or edit key is placed in the keymap.
- If a key or key pair is already on the board, its buttons will not be displayed.
- If there are no bracket pairs on the board, don't show any of the paired nav buttons.
- If there is none of the seven optional keys on the board, then don't display the nav button group
  at all.
- If a button is selected and all the optional keys are already assigned to other nav keys, unassign
  one (or an entire pair, never half of a pair) to assign the new one.
- Order of the keys to use:
    + for pairs, first `[]`, then `()`;
    + for singles first `\|`, then backtick-tilde, then `=+`, and lastly `/?`, and after the last
      use a key from a pair. 
