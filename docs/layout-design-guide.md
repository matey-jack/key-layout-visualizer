
Let's try to write down the design principles I used so that LLM-based agents can understand them and make sensible modifications to layout models.

# All keys are of size 1u, 1.25u, 1.5u, or 1.75u. 

- Larger than 1u keys are only used at the edge or center; 
- Ideally, those larger than 1u keys at the edge or center are used for non-character keys that are also larger than 1u on traditional keyboards: Space ⍽, Shift ⇧, Enter ⏎, Backspace ⌫, modifier keys, or non-character keys of similar function, like the (forward) delete key ⌦.
- Exceptionally, those special non-character functions can also be placed on larger than 1u keys not at the edge or center; or they can be placed on 1u keys.
- Characters, except for the space character (and newline and tab, if you count those as characters), should be placed on 1u keys.
  This makes them easier to exchange for a user's preferences or languages and is also much prettier. 

# Uniform symmetric row stagger

The row stagger should be 0.25u symmetric with the higher rows being staggered by that amount towards the center.
(Which reminds me to redefine that row-names enum so that higher rows actually have higher enum numbers.)
An exception can be made with a 0.5 stagger for the lowest row, because that leads to fewer gaps in the keyboard (and it's the conventional lower-row stagger since the invention of the typewriter).

The stagger reconciles in the middle of the keyboard either by leaving some 0.5u gaps, or adding a 1.5u key. 
Exceptionally, there could also be a 1.5u gap to avoid asymmetry; or two 1.25u keys if there are good options to map non-character keys unto them. 

Keys at the edge of a row usually fill the entire space created by the stagger, but there are reasons to put smaller keys there as well:
 - if the key is to be used as a character key it can be 1u
 - if the key would otherwise be the only one (or only pair) of this size
 - "chamfering" the corners of the bottom row, especially if it helps to create a regular size (or combination of sizes) for the keys in that row.

# Shift needs to be placed close to a home key

## Low-shift 

If Shift is in the traditional lower row outside position, then it needs to at least overlap the pinky finger's home key.
(Moving the home keys to the right as in the ANSI/Colemak wide mod works towards this and is the only option in all of the custom layouts.) 
We call this the "Low-shift". 
On orthogonally aligned layouts, there is no partial overlap between keys of different rows, thus the only acceptable position is the key directly below the pinky's home key. 
In both cases (ortho and row-staggered), the conventional position of `/` (in the US keymap) or `-` (in the German one) will conflict and that character has to move.
Similarly, on the left side, it prevents us from properly staggering `z` (and all its neighboring keys) a little outward to align the finger movement in a straight line when using symmetrical row-staggering.

## Mid-shift 

Another great position for the Shift key is just one key outside the pinky's position on the home row. 
This is very comfortable and has the advantage of allowing the same movement both on ortho and row-staggered keyboards, which is great if you use both of them regularly. 
The disadvantage is that this is hard to get working on a traditionally-shaped row-staggered keyboard. 
(Even if the keyboard is programmable, key sizes might not fit as nicely.)

## Thumb Shift

Since thumbs don't have much trained muscle memory from traditional keyboards, it's easy to assign them new duties.
Also, thumbs move more independently of the other fingers and Shift on a thumb can be used to get away with just using a single Shift key.
A side advantage compared to Mid-shift is that the apostrohe's muscle memory can be kept.

# Other important non-character keys

## Space

The traditional 6u space bar splits into at least 4 keys, since even 2u is too big to be useful.
But it's still useful to have very large keys in the center when the hand position is very wide, because then the thumbs can't reach close to the center anyway.
TODO: find and insert the text about centering two highly-comfortable thumb keys per side around the natural resting position of the thumbs.

## Backspace

The wide-hand principle and inward staggering have to fortunate consequences for the traditional top-right position of the Backspace key:
 1. the key will usually be relatively wide; for example with a 1u home-row edge-key and 0.25 of inward stagger, Backspace will be 1.5u wide.
 2. the right hand's home position will be so close to Backspace that the ring finger can hit it without moving one's hand much.

This, combined with existing muscle memory is good enough reason to always map Backspace in the top-right corner.

The only exception is when the home row edge key is wider than 1u and this combines with the staggering to make the key widths overflow. 
(Remember that we don't want 2u or larger keys on the board.)
In that case, we can simply map Backspace to the (then relatively wide key) in the upper-letter-row.
This even has the advantage of using this non-1u key for something other than a character key.

## Enter (Return)

A wide hand position naturally has the smallest edge keys in the home-row where the Enter key traditionally lives.
The inward stagger then creates the next-smallest edge key in the row above which is the closest available alternative spot for the Enter key.
Because Enter on small keys doesn't look good, and in particular 1u keys so close to the finger's home positions are better used for character keys, it's often best to simply map Enter to one of the new central bottom row keys. 

An exciting alternative opens in Mid-shift layouts: due to the staggering, the traditional, now freed, Shift key position ends up to be one of the wider keys on the board and is an excellent place to map Enter.
It's close to where people expect it and can be hit with one's thumb while using the mouse.
And being there in the lower row, maybe with a keycap that has a highlight color, it looks a bit like a lowrider car.

## Escape and Tab

A better name for Escape would be Exit; what a nice analogy with Enter, and the whole word would fit onto the cap without the need for an abbreviation.

Anyway, but Escape and Tab take any key size that they can get and usually it will be larger than 1u which is great for leaving the 1u keys for characters and navigation keys.

## CapsLock

This shouldn't be a primary key, since it can be activated by pressing both Shift keys together or be mapped on another layer.

And if you really want a base-layer Caps key, then I recommend to put it somewhere else and liberate its traditional position for some other function such as Mid-shift or Delete or even a character if it happens to be 1u key in the layout.

## Delete

This is one of the most useful keys that are not in the traditional 60% keyboard package.
Most improved keyboard designs will have a good place to map it and it's very much worth it.
Delete is also very useful to occupy a non-1u key that your layout needs to achieve the desired staggering.
Typical spots are: 
 - upper row right edge (where US ANSI has the backslash key occupying a 1.5u key)
 - left home row edge (traditional CapsLock)
 - any >1u key in the center (since those have no traditional use)

# Character and Navigation key pairs

Some keys are symmetric with each other and should sensibly be placed either close to each other or at least in proximity.

## Character pairs

It's obvious for the [] pair which is already mapped to neighboring keys in US ANSI.

It's a bit less obvious for the +- pair, who are US ANSI neighbors, but one of them lives on the Shift layer. 
In other keymaps, like the German one, they are both on the base layer, and at least on the same side of the keyboard.
Generally it's useful to keep them together or at least on one hand, so that the Ctrl and +- zoom function can be done while holding the Ctrl key with the other hand.

Another pair of similar keys is / and \, but since the former is used a lot in many contexts (even free-flowing prose) and the other is very technical, both keys have reasons to be in different, unrelated places. 
International keymaps might even ban \ to a higher layer. (Like the German one does.)

# Navigation key pairs

Home/End ⇤ ⇥  and Page Up/Down ⇞ ⇟ naturally go together with the added condition that Home should naturally be left of End and Page Up above Page Down.

Insert and Delete are traditionally paired as well, but since the Delete key is much more important and the Insert key barely has any use today, Delete will get a preferred spot (see above) and Insert might not even be a base layer key at all.
But one can pair them by mapping Insert onto a layer of the physical Delete key!

Note that Home and End are often used during typing (for example to go back to where one was writing after having made an edit a few words back in that line).
Therefore, it makes sense to have them mapped to the keyboard center to be reached with the index finger. (It's a wide reach, but at least your hands are not blocking the key from being seen.)
Placing them in the bottom row (underneath the hands) can also work, because one can memorize the finger curl to hit them pretty quickly. And it doesn't happen as often as typing characters, so it doesn't have to be that fast. In my experience, bottom row keys can be hit comfortably with a knuckle. That's much less straining than trying to move your fingertip there!

Page Up and Down, on the other hand, are more often used when reading only and therefore should be positioned towards the edge of the keyboard, so one's hand can rest completely on the table. Having them on the top (number) row is bad, because the hand would rest on the keyboard or have to stretch a lot to reach them. This is why the Ergoplank has them mapped in the center of the lower row while Ergoboard and Thumbs Up have them mapped on the right side of the keyboard, where the hand can rest next to the keyboard. Thumbs Up is the only one that actually maps Page Up above Page Down.

If there are no physical Page Up/Down keys (or even no physical Home/End) then it's a good mnemonic to map them on higher layers of each other or the arrow keys if those exist. 
