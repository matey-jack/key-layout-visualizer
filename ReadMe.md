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
 * split space bar (with two easy to press thumb keys per side)
 * fewer different key sizes to minimize waste of space and facilitate keycap swapping to create custom keymaps.

While only "60% keyboards" are shown, all the letter mappings and many other concepts here also apply to bigger keyboards, with or without numpad or F-keys or nav keys.


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

See [AGENTS.md](AGENTS.md) :-P 

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


