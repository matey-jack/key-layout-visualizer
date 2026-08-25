# Feature: 

Status: planning

## Background and Motivation

The US ANSI keyboard layout has character 47 keys, each assigned two different characters.
One when pressing the key without holding Shift and the other with holding Shift.
Thus, there are 94 characters assigned in the layout.

The ISO keyboard layouts introduce two more "levels" for character mapping: 
holding AltGr while pressing the key (third layer), another while holding AltGr and Shift. 
This allows mapping 94 more characters, but only a few of them are actually used, 
depending on the national layout in place. 
(It also has one more character key, thus getting to 4 × 48 = 192 assignable positions in total.)
We call the levels base, Shift (second), and AltGr (third), and will not use the fourth level.

Now, some keyboards have less than 47 keys available to map characters. 
This can easily be compensated by mapping those characters on unused spots of the AltGr level.
(The harder to access AltGr+Shift level doesn't even need to be used!)

But to create a comfortable and effective key map, we should take into account that the Shift level is easier to access than the AltGr level – both physically because of the large and well-positioned Shift keys and mentally, because we are already used to using Shift for accessing puntuation during typing.
Therefore we want to map prose punctuation characters – those that appear as part of text that users can type in a fast flow – to be mapped on the base and Shift levels.

As in the other layout work in this app, we also consider easy learnability by minimizing the changes compared to the standard ANSI keymap. We also take some inspiration from European keymaps, especially regarding 
- the placement of `?` in the number row,
- `-` next to `,` and `.`,
- breaking the `;:` character pair and using that home-finger position for a letter – or in the case of English, the apostrophe, which is used inside words like a letter.


## Key Mapping Concept 

The default small keyboard (Split Ortho, Thumbs Up 13, Ergoslat) has 5 punctuation keys (among a total of 26 letters + 10 digits/punctuation + 5 punctuation = 41 keys) instead of 11 on the US ANSI. 
US ANSI thus has 11 punctuation characters mapped on the base level and 21 on the Shift level.
A small keyboard with 41 character keys thus has 5 punctuation characters on the base level, 15 on the shift level, and 12 on the AltGr level.

We consider the following 10 punctuation characters as essential for writing prose:

    ,.;:!?-/'"

Five of those should go to the base level. Luckily `,.-/'` are already base characters in US ANSI.

We also consider the following 10 levelas mostly technical:

    `~\|{}[]<>
    
Those 10 are moved to the AltGr level and since there are already three pairs of parentheses/brackets in this group, we'll also move the pair `()` to the AltGr level – thus the 12 characters on that level are already fixed.

Here's a sample solution for a keyboard that has 1, 1, and 2 positions for punctuation keys in each of its rows:

    1! 2@ 3# 4$ 5% 6^ 7& 8* 9+ 0?
                                  /=
                               '" 
                         ,; .: -_    

This creates one new character pairing (key label) with the `/=` key. 
We can change the mapping to reuse the existing `/?` of `=+` key label. 
We need to weigh the following trade-offs:
 - keeping the `/?` pair, we loose the symmetry of the `1!` and `0?` keys,
 - keeping the `=+` pair, we loose the base mapping for the `/` key which breaks keyboard shortcuts in some applications when the keymap is defined using a national layout mechanism. But in a firmware mapping (like with [QMK's user module]), this will work without disadvantages, which is why it's the mapping I personally use.

[QMK's user module]: https://getreuer.info/posts/keyboards/custom-shift-keys/index.html

### AltGr Mapping

Stack of parentheses on the ring and middle fingers. Mapping `()` in the home row and `<>` on the same keys where ANSI maps them.

Since the AltGr key is on the right side, we should map all the characters on the left. 
Thus `<>` will not actually be on the same keys, but at least on the same row and same fingers on the other hand.

On a German ISO keyboard, we can use the extra ISO key as a second AltGr on the left keyboard side and thus map all parentheses on the right, which conveniently maps `[]` in the same positions that they have in the default German layout.

The remaining characters 

   |\\`~ 
   
are mapped on the index finger with `|` on the same key as `&`, reflecting their relationship in programming languages, and the other characters in sequence below.

Again, the `7&|` triplet only works on ISO keyboards or another way to add a left AltGr key (instead of CapsLock , for example). We lose this nice mnemonic when mapping the AltGr characters on the left-hand side.

In the case of Split Ortho, we can map the AltGr on the left side from the start if we want the mnemonical right-side mapping. Let's see how we solve it on the other boards. Start with the right-side only mapping for the initial version of the feature.

## App UX

Design decision:
 - should there be a new layout visualization type named "Shift and AltGr" layers or rather be a checkbox on one of their other layers?

How do we make it work for a the flex layouts? Decision: we only configure the levels globally (for all layouts and mappings), but in two different ways:
 - for the Shift level, we define it via a list of pairings. This list can include more characters on the base level than are actually in the present layout; those will be ignored.
 - for the AltGr level we define it via the fingers and map it onto the physical layout independent of what the keys show on the other levels.

How it looks on the keyboard SVG:
 - all digit and punctuation keys should show the base mapping below, shift mapping above, in the same color.
 - AltGr mapping of the key should be in a different color (maybe start with blue); the AltGr should also highlighted with a blue background to make the relationship clear. This should only happen when the key levels mode is actually active.

## Out of scope

Keyboards without a number row have a much more limited space that I don't want to solve for completely. 
In that case, we'll only define the Shift level and not AltGr. It's also a separate work item.
Possible Shift pairings: ,;  .:  -!  /?  +$
(Probably one would also need more than three levels – and that's definitely out of scope!)

