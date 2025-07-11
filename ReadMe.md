# Casual Keyboard Layout and Mapping Visualizer

This visualizes and compares several "casual" (that is easy-to-learn instead of fully optimized) keyboard mappings on different layouts of keyboards.

Key mappings are shown for three different layout types:
 1. the ancient typewriter-based keyboard layout (used in virtually every laptop that was ever made) with its irregular row-staggering, 
 2. an orthogonal layout (which for key mapping purposes also stands in for most column-staggered layouts), and 
 3. (as a novelty) the Harmonic Keyboard layout which features a regular row-stagger, uniform key sizes, 
    and some other modern details like a split space bar, wide home position, and more options for tying with one's thumbs. 

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

I will not consider extensions above the described feature set until most of that is implemented.
This is to get a basic architecture in place that makes the right things easy.

One thing I don't want, though, is adding the ISO layout with its tiny left shift key.
Because that key is an ergonomic no-go. It brought me so much pain. 
(Not just because German has a lot of capitalized words, but also because as a programmer I use 
a lot of punctuation on the Shift layer. 
And then all that pressing of Shift+nav-keys to select text.
Or Shift+other-modifier for shortcuts.
Anyway, you see it adds up. Shift needs to be close to home.)

## Related Work

https://oxey.dev/playground/index.html
 * actually this was my main inspiration. I just wanted to show more visuals and less numbers!

https://cyanophage.github.io/playground.html?layout=vmlcpxfouj-strdy.naei%2Fzkqgwbh%27%3B%2C%5C%5E&lan=english&mode=ergo



# Development

I use `bun` as package manager and to run `vite`, but `node` should also work.

For `vitest`, however, only `node` is working at the moment!




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


