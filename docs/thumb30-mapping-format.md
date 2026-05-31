Context
=======

We want to display different letter mappings (usually including the most important prose punctuation, IPP) on keyboards with different shapes and different number and position of keys. 
We are already using a model with a two-stage mapping, where the letters (and the traditional 4 IPP characters `,./;`) are mapped to some "virtual position" in a 3 rows by 10 columns matrix. 
This inner part is called the "flex mapping". 
Each keyboard then provides a "frame mapping" which describes how that 3×10 matrix maps to the actual keys of the board.
The same frame mapping also describes how the remaining keys are labeled. 

Goal: define a set of keys that exist in the same relative-to-hand-home position on all three major keyboard layouts 
(ANSI, Harmonic, Ortho incl. column-staggered). Also define the set of characters which the flex mapping should contain. 
(This has to be the same set on all keyboard layouts, since the layout's "frame mapping" needs to map characters that are not in this set.)

Constraints:
 - There should be one thumb to be used by a letter (usually E) or punctuation character. (Cases without E on thumb are mostly for demonstration purposes or incremental learning, but they still need to be workable layouts.)
 - It should map to the 8 / 12 / 8 column rows of Harmonic wide, as well as the 11 / 10 / (11 or 10) column rows of Harmonic narrow in addition of the typical 3×10 of ANSI and Ortho layouts.
 - Especially on ANSI and Harmonic (which have similar staggering), the flex-mapped keys should fit in the same relative staggering position regarding each finger. This affects all 26 letters plus comma, point, and the apostrophe. It is not important for the semicolon, since even the simplest of mapping improvements moves that away from the home row, and also not important for the slash `/`, because all the wide layouts (even on ANSI) move that away.
 - Ideally, we want to be able to represent the Qwerty mapping as one of the many mappings. This means that the set of keys to be included and the set of characters must align in the Qwerty mapping.

Building the Solution
=====================

Some learnings from using the 3×10 flex mapping with the harmonic layout:
 - Harmonic Wide is my preferred variant, and it only has 8 "neighbor of home" keys in the upper row, plus the one central key (which ANSI also has). But since the Harmonic Wide home row has a key more than ANSI on the left, we can just "wrap" one character down into this position. This keeps the relative motion of the pinky finger to this key very similar: left instead of up-left. Using this trick we can "virtually fit" 10 columns in the top row of every layout, which means we can. (All casual mappings have Q on this key, but the wrapping is generic and also works for different characters in that position of the flex mapping.)
 - Home row with 10 characters fits all layouts. Some (like ANSI and H-wide) have an additional key for `'` on the left. The others have this space in the upper row, so that `'` fits in a similar relative pinky motion on all of them. In all the layouts, the positions of `'` is ideal, so it makes sense to fix it in the frame mapping and exclude it from the flex mapping. 
 - The wide layouts (including ANSI) flip `/` to the center to keep the relative position of the right bottom row the same in regard to the hand home position. Unfortunately, the Harmonic 12 (wide) does not have a free spot in the center and needs to move somewhere entirely unrelated. But fortunately, none of our casual flex mappings, change the position of `/`, so we can just exclude it from the flex mapping.
 - This means that only 9 spots will be needed in the lower row, which matches the 8 neighbor-of-home keys plus one central key that all layouts have as a minimum.
 - None of the casual mappings change the positions of comma, point, and a few letters (such as the intentional ZXCV and W, as well as the incidental ASMQ). We could exclude those from the flexmapping, but there's no strong reason to do that and we might want the flexibility at some point. And it's nicer to have somewhat symmetrical solution.
 - Most of my mappings bring the hyphen `-` into a closer-to-home position than it has on Qwerty. Since the hyphen is one of the most frequent punctuation characters in English, even more frequent than some letters, this move is a very smart one. Of course, we could leave it to the frame mappings to improve the hyphen's position, but then we'd need to find another punctuation character to take up the thumb key or whatever key is freed in the core rows when E moves to the thumb key.

Some conclusions that follow from the constraints and the learnings:
 - Candidates for the "joker" punctuation character that can be assigned to the thumb key or whatever key is freed in the core are thus semicolon, hyphen, and slash. Semicolon is out of question, because, to represent qwerty, neither it nor E can be on the thumb key. Actually, the same applies to slash. (Plus, we already noticed the advantages of not even including it in the character set.) On the other hand, hypen's position in qwerty is very bad for such an important character, it's also hard to type without looking, thus less of a loss of reusable muscle memory when it moves. And thus we choose the hyphen to be included in the flex mapping set! 
 - The semicolon needs to be included in the flex-mapped character set, because its on a home position that needs to be remappable and because we want to be able to represent layouts that don't remap it. (Again, mostly for demo and incremental learning purposes, but still.)

To sum up, the current suggestion is to include the semicolon, comma, point, and hyphen in the flex-mapping set. (And thus excluding slash and apostrophe.) This creates a flex-mapping set with 26 letters plus 4 punctuation characters. On the other hand, we counted 10+10+9 keys in the three core rows plus one thumb key. Both characters and keys sum up to 30. So let's draw it out in detail to see if it fits!

Selected Solution
=================

"Thumb30" mapping: 10, 10, 9 keys per row, plus the thumb.

Includes: 26 letters, `,.;-`.

This trivially maps to the ANSI (wide and narrow), Ortholinear, and Harmonic narrow layouts, because they have enough keys in those rows. 
For Harmonic wide it can easily fit by "wrapping" the first letter from the top row onto the left-of-pinky home row position.

Since Y and B are in the exact center, they need to be assigned sides when inserting more characters in the middle.
Following the traditional cut of split keyboards, I assign Y to the right and B to the left.

For ANSI, Ortho, and Harmonic Midshift, there is also the lower row pinky position available to map `/` in the frame. (Other Harmonic variants assign this to other keys.)
In all the layouts, either the right-of-pinky position (traditional `'`) or diagonal up from there can be used to map apostrophe `'` via the frame mapping.

## Mappings in detail

 - `x` in the diagrams is a key from the flex mapping.
 - `X` is a key from the flex mapping in a position that requires >0.5u lateral movement.
    I use it both for orientation and to show the difficult-to-hit keys.

### ANSI

     x x x x x X x x x x [
      x x x x X X x x x x ' ENT
    SH x x x x X x x x x / SH

### Harmonic Wide

top left x wraps down, ' stays, [ and / are moved somewhere else in the frame.

    TB x x x x X x x x x BS
    X x x x x X X x x x x '
    SH x x x x X x x x x SH

### Harmonic Narrow 
' replaces [, all other keys stay.

midshift:

     * x x x x x X x x x x ' *
     SH x x x x X X x x x x SH
     * * x x x x X x x x x / *

This is the only Harmonic layout that allows the Angle-mod for the lower left row. 
It has the advantage of bringing the central key into a neighbor-of-home position!
And unlike on ANSI, there is no need to flip one of the core 30 keys for this, only a key from the frame layout.

bigshift (aka traditional):

    * * x x x x x * X x x x x ' *
     MAG x x x x X * X x x x x ENT
    SHIFT x x x x X * x x x x SHIFT


### Ortholinear

     x x x x X   X x x x x '
     x x x x X   X x x x x ENT
     x x x x X   X x x x / SH

To express both thumb-e and other mappings in this format, 
we'd have to agree to put `-` on the thumb key in those other mappings.

## Conclusions

Upsides:
 - thumb30 can express the qwerty letter mapping on Harmonic and Ortho boards with `-` 
   mapped to the thumb key. Thus, we can use it to show intermediate mappings that move E to thumb, 
   without also moving around Y (or not even B if not desired).
 - the position of Y on Harmonic is probably not as bad as it seems. Definitely better than B! So it's good to have the option to keep it.
 - Harmonic and Ortho boards have to move around punctuation a lot in any case. So it's also fine to have `-` on the thumb by default.
 - For showing a Thumby-Layout-Progression on ANSI we'll probably want to use fullMappings, so that we can keep all the punctuation in the usual places.
   Only in advanced stages we'll add Del or Nav keys to the ANSI core... just because there is space :-D.
 - To represent traditional casual mappings, we still need a flex-mapping format that excludes the thumb key. But that's fine, it was implemented already, and it's not as much duplication as having to represent all Thumby variants individually using full mappings.

Downsides:
 - Mapping the core-30 characters separately from the remaining (framing) punctuation and other keys, 
   makes it hard to properly form pairs of +- or /\ or [].  Maybe it would be more sensible to use an "empty frame"
   or at least no outside punctuation keys to focus on the change of lettering only...
 - When creating a full keyboard mapping for a beloved letter mapping (such as my Thumby Nine) and only creating a core mapping 
   for its variants (merely to compare metrics), comparing both on a given layout will result in non-core punctuation shifting around.
 - It seems that the easiest workaround for this (despite all my hard thinking here) is to actually duplicate the full mapping for the variants...