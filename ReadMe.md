# Casual Keyboard Layout and Mapping Visualizer

This visualizes and compares several "casual" (that is easy-to-learn instead of fully optimized) keyboard mappings on different layouts of keyboards.

Key mappings are shown for four different layout types:
 1. the ancient typewriter-based keyboard layout (used in virtually every laptop that was ever made) with its irregular row-staggering, 
 2. an orthogonal layout (which for key mapping purposes also stands in for most column-staggered layouts), and 
 3. two symmetrically row-staggered layouts:
    * the Harmonic Keyboard: has a regular 0.5u stagger
    * the Ergoplank/Katana: has a mixed 0.25 and 0.5u stagger 

All new keyboard layouts are further improved by:
 * wide hand position for better ergonomics (relaxed and open shoulders)
 * split space bar (with two easy-to-press thumb keys per side)
 * fewer different key sizes to minimize waste of space and facilitate keycap swapping to create custom keymaps.

While mostly "60% keyboards" are shown, all the letter mappings and many other concepts here also apply to bigger keyboards, with or without numpad or F-keys or nav keys.
The Harmonic and Ergoplank family of keyboards manage to fit in some of the nav keys into the same space that an ANSI keyboard needs just for character keys and its oversized edge keys. 
And my favorite of all boards is the Ergoboard 16/5 which is the same size as "65% keyboards" (one column of keys more than the 60%ers) and cleverly uses that width to improve hand distance by putting some of the nav keys in the center instead of the right edge.


## Terminology and Background 

Layout = physical shape, size, and position of keys.

Mapping = assigning keys to functions such as what character to insert.

"Layout Mapping" = assignment of basic keys (non-character keys) that is predefine by the layout. 
This should make it easier to port character-mappings between layouts. 

"Flex Mapping" = assignment of letters and punctuation to "free" positions in the keyboard layout. 
This is a bit like the "international layout" that Operating Systems allow to redefine.
(Although optimizing for ergonomics makes me want to change a few more keys...)

Note that this differs from most of the world's terminology when the Mapping is instead called "Layout" and there is no nice and clear term for the actual layout of hardware keyboards. 
(Historic note: this is probably because the whole world copied the US ANSI keyboard shape and just changed the mapping of characters. 
This went on for many decades until more ergonomically shaped keyboards started to gain traction. 
I say, "gain traction," because some ergonomic keyboards such as the Kinesis and Maltron are also ancient by modern standards.
(My definition of "ancient" is "before most of us were born."))

Names I use for the keyboard rows:
 - Number row (or top row)
 - Upper (letter) row
 - Home row
 - Lower (letter) row
 - Bottom row

In the source code, those are numbered from the top starting with 0, because those are the indices into arrays of rows.
All my documentation refers to the rows by name and even in code, I use the `enum KeyboardRows` everywhere.

### "Casual" key maps: easy to learn and switch from and back to qwerty.

Most keyboard mapping comparisons today focus on thoroughly optimized mappings of letters which have no resemblance to 
the ancient qwerty mapping found on most commercial keyboards and known by most humans today.
Despite existing for decades and providing many benefits in terms of typing speed and comfort, adaption of such layouts has been low.

Therefore, this app focuses on optimized key mappings that preserve ancient muscle memory by making just a few changes to the qwerty mapping. 
We aim to get 80% of typing comfort benefits for less than 20% of the learning effort. 
(And while typing speed may also improve, this is not the main goal.)
Since typing comfort and ergonomics are prioritized over raw speed and anyone can switch to such a layout 
(and back, when faced with an ancient-type keyboard), we call them "casual" keyboard mappings.
A casual typist is one who uses the keyboard regularly (and might want to relieve or prevent repetitive strain injury and other pains), 
but who is not fanatic about optimizing their typing or training for speed "like a pro."

### Shift key position strategies

Typewriters needed a big shift key, because pressing that key would physically shift (lift) the entire top part of the typewriter so that the lower part of each type pattern would hit the paper.
The ANSI/ISO keyboard layout kept this oversize and the position in the lower letter row. 
Thanks to the row staggering, this position is easy enough to reach for the pinky finger: the left hand doesn't even need to move, because Shift directly neighbors the pinky's home key.
(And on the right side, we can get as close by using a wide-mod keymap, but let's not digress...)

On split ergo keyboards, which are usually ortholinear or column-staggered, this typewriter-like position of the Shift key becomes problematic:
 - the Shift key in the lower row does not overlap with the pinky home key anymore. Instead, it's an awkward diagonal move.
 - this matters even more, since split ergo keyboards have a key arrangement that encourages less hand movement.
 - finally, since most split-ergo keyboards have uniform key sizes, there is no reason to keep Shift on its standard position. Many keyboards have it on a thumb key; others have it on the home row just next to the pinky's home position. That's what I call "Mid-shift".

Since the Shift key is used more often than some letters or other characters, it should definitely not get a harder-to-reach position than those letters and other characters. 
This is why the "Low-shift" (typewriter-like) position doesn't make any sense in an (ortho or col-stag) ergonomic keyboard.
And this raises a question for the "intermediate ergonomic" keyboards, that are still row-staggered: 
low-shift works on those, if there is enough overlap between the Shift and pinky-home keys. 
But Mid-shift actually always works on all kinds of keyboards.

Terminology used in this app:
 - Mid-shift and Low-shift as just explained: pinky-operated on the home row or below.
 - Mix-shift: when the keyboard layout has a different Shift-key position depending on the selected keymap for letters.
   (Currently no such layout exists, because I found it distracting.)
 - Switch-shift: when the app allows switching the Shift key position of a keyboard layout independently of the selected keymap. 

Observations and further work:
 - on the left hand, the CAPS key can be easily repurposed as Shift (which I did on my Laptops and my family can still use the laptop without problems, because the old Shift key is also Shift).
 - on the right hand, we can actually switch Shift and Return! On an ANSI keyboard with a wide-hand keymap, this is quite ergonomic and allows to transfer muscle-memory with a split ergo keyboard that has the same setup!
 - The right side of an ISO keyboard is less straight-forward because of the vertical Enter key and an intermediate 1u key between the pinky home (even in wide-mod) and Enter. Probably that 1u key should serve as Shift while the original Shift can take the lower-row character key that would otherwise flip to the center. And Enter stays Enter. 

## Character Set and Shift-Pairings

On the ANSI layouts I use the ANSI base character set for English keymaps and the German one for international keymaps.
On the creative layouts, I use a mix of both: `+` represents the ANSI `=+` key and at the same time the German `+*` key
and various `+` key pairs from other languages. 
The reason for this is to emphasize the relative positioning of `+` and `-` which are often used together with Ctrl for zooming
and possibly on a firmware layer for adjusting volume or brightness. 
Also, the layout looks better when `+` and `-` are arranged closely or at least somehow symmetrically, on the same hand, 
so that the other hand can keep pressing Ctrl (or a layer toggle).
(Note that both keys can't always be close, because `-` is one of the most common punctuation keys 
and thus mapped as part of the core 30 or 32 letters and punctutation keys.)
Similar symmetry applies to `/` and `\` although they are not used together in shortcuts.

Characters sacrificed to make space for the three additional letters on the larger alphabets are `[];`. 
The brackets are usually mapped on the AltGr layer of ISO key maps, 
while many languages map `;` and `:` to Shift `,` and `.`.
Most ISO key maps also replace `\` with another key (often a punctuation character like `#` that is on the number row in ANSI),
but since this is not standardized, I just kept `\`. 
Similarly, I kept the apostrophe `'` on the base layer, simply because a lot of people of all languages now also write a lot of English
as a second (or third) language. Thus, the apostrophe will be used a lot.

This does not constitute a serious attempt to standardize punctuation across all Latin-based European alphabets,
but doing such a thing would obviously help the hobby keyboardin community, because one could then reuse a lot of keycaps
across languages and would only have to provide a few extra keycaps for specific letters. 
Basically one slightly larger keycap set could cover all the languages! And bilingual people would have a much easier life, too!

## Keyboard layout variants vs Keymap variants

Keyboard layouts have different positions for the "command and control" type keys that are usually fit unto the keycaps
which are wider than 1u. Whatever keys are left will be used for letters and punctuation. 
(Numbers are fortunately very stable in their positioning.)
Flex key maps change the position of the letters and the most important punctuation characters, 
also leaving the remainin key for the remaining punctuation.

This means that on keyboards that have several "big key" alternatives, 
we need to provide frame mappings for each of the keymap types (depending on thumb letter use and alphabet size).
Since we want to create sensible total key maps in each case, 
we move the remaining punctuation around to keep more frequently used punctuation in easier to reach positions
and keep the remaining ones in logical positions, where applicable.

We try to keep the differences small between all the variants, for example, switching from English to German 
(except on the ANSI keyboard, where character sets are more traditinal) should not change more keys than needed.
(And this should be true in all variants of a keyboard layout.)
Similarly switching from Quipper to Quipper Thumby should not change more keys than needed.
(Although at least one key from the frame mapping needs to move from the bottom row up.)
Also switching between MidShift and LowShift should not change more than needed.

To visually verify this, you can switch back and forth between similar flex mappings on each keyboard variant
and also switch back and forth between keyboard variants on each of the flex mapping types. 
 - TODO: provide a small testing tool to list the differences for all those cases. 

## Scope

Original proposal document: https://docs.google.com/document/d/17ECEu8dVjO9I3P6492D3Q8luSBC8j6HAiPTDwPtMZJ8/edit?usp=sharing 
This should be outdated, once the app functionality speaks for itself.

TODO: put an info button and hover text on the "use wide key mapping" checkbox and link to https://colemakmods.github.io/ergonomic-mods/wide.html

I will not consider extensions above the described feature set until most of that is implemented.
This is to get a basic architecture in place that makes the right things easy.

### Modifier mapping for small split ortho keyboards

This is a big topic of which too little has been written. 
It does influence what keys are available for mapping punctuation – and also relates to typing a letter key with a thumb.
But the options are just too many to show them all in the app.

### Out of Scope
One thing I don't want, though, is adding the ISO layout with its tiny left shift key.
That key is an ergonomic no-go which brought me a lot of pain. 
(Not just because German has a lot of capitalized words, but also because as a programmer I use 
a lot of punctuation on the Shift layer. 
And then all that pressing of Shift+nav-keys to select text.
Or Shift+other-modifier for shortcuts.
Anyway, you see it adds up. Shift needs to be close to home.)

## Related Work

### key mapping visualizers

https://oxey.dev/playground/index.html
 * actually this was my main inspiration. I just wanted to show more visuals and less numbers!

https://cyanophage.github.io/index.html (and the [playground](https://cyanophage.github.io/playground.html?layout=vmlcpxfouj-strdy.naei%2Fzkqgwbh%27%3B%2C%5C%5E&lan=english&mode=ergo).)
 * On this page, all layouts starting from "maltron" down in the list have one letter on a thumb key. (The data model doesn't allow more.)

### articles about letters on thumb keys

https://precondition.github.io/pressing-e-with-the-thumb


# Development

I have committed my [AGENTS.md](AGENTS.md) and [CLAUDE.md](CLAUDE.md) to this repo, 
so if you run your own agents on this, make sure that you like what's in those files or simply delete them.
(They are in the repo only to sync them automatically through worktrees.)

After cloning the project and the typical `node install`, you can run `npm run dev` (or similar) to start the app.
That should be enough to make changes in the code and directly see the result in the browser.
This way, you can make small tweaks to mappings or colors without having to implement actual buttons and switches in the app itself.


## Notes to self

Isn't it funny, that JavaScript has Math.max(), but we need a library for sum(...)?
Reminder to always check https://youmightnotneed.com/ before searching for libraries.

And isn't it confusing that there are so many libraries out there that provide this function?
To make things worse, ChatGPT recommends libraries like https://github.com/angus-c/just and https://www.npmjs.com/package/micro-math
which do not even include the sum(...) function! 
And there is "just-sum" on npmjs.com, but it only sums two numbers, instead of a list. 

Now, I have prejudices towards first-gen JavaScript libraries like Underscore, Lodash, Ramda, 
because I think that they come with a lot of cruft and first-generation mistakes that are hard to fix.
Although I appreciate that they are often battle-tested and cover a lot of edge cases, I prefer "small and focused" as well as 
"typescript first" and ideally "es6 first", that is use named exports only.

    I looked at Rambda, Radashi, and Remeda.
    Upacked size (npmjs.com): 675 kB, 436 kB, 863 kB

Rambda doesn't advertise itself to be tree-shakable and also is designed to call all of its functions as part of R.pipe(...).

So that leaves Radashi and Remeda. Darn, I can't decide, I'll just use generated code for the function again. (As you might have noticed, most of the AI-generated code in this project is actually for stuff that should be some public library function or React component, but isn't.)


