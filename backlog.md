
======================== DONE ========================

- switch between keyboard layouts 
- highlight active keyboard layout 
- implement ANSI layout  
- remove duplicated code between Ansi and Harmonic 
- add narrow/wide option for ANSI
    - add second layout config 
    - refactor app to hold layout options closer to Keyboard layout component (maybe container components LayoutArea and MappingArea?)
    - mapping list, learning effort, colors 
- implement Ortho split layout; simply stagger bottom row to get thumb keys.
- list key mappings
- switch between mappings
- show mapping information: sourceUrl and diff to Qwerty
- calculated bigram effort
- change all the legends to display (weighted) counts (or percentage of strokes) in the colored boxes
  and show the scores as part of the legend text. (As is already done with the Learning Diff...).
- single key frequency viz
- angle viz
- URL #fragments for state parameters: layoutType, split, HarmonicType, vizType, ...
- add Unicode mappings for bottom row modifiers, so that FlexMappings can change them. Minimum affected keys are AltGr and what's to the right of it.
- add "FlexMapping.comparisonBase" so that Qwertz and Colemak can be chosen by layouts based on those.
- inner index column should not count as bigram conflict, because of nice alt-fingering.
- highlight all mappings that have the best typing scores among all layouts with the same learning effort or less
  (This is the same as the layouts with the lowest learning effort given their typing scores.)
    + One highlight color for layouts with thumb letter and another color for ones without.
    + Candidates are: Flip/Twist, Quipper, Colemak and Cozy Keyboard, Thumby Quipper, Thumby Colemak.
    + Yes, three of each seems like a good offering.
      We could add Qwerty with just the Thumb-E, but I think it's not a worthy choice except as a temporary experience.

- shows all mappings in the list and sets layout type and options when needed by the mapping.
    + don't show metrics in mapping list when mapping does not work with current layout type
    + set layout options for mapping and disable the checkbox if mapping only supports one setting

- switch to wide (on ANSI) whenever a layout with thumb letter is selected. 
   (And remove OrthoPlank to reduce maintenance. This layout is ergonomically unacceptable.)

- Outside the app: make a graph of the "efficiency frontier" with those six layouts and Qwerty — once for single and once for bigram scores.
  (Maybe add the minimum SFB layout from Oxley each with and without thumb letter use as the right fence post for the diagram.)
    done here ==> https://docs.google.com/spreadsheets/d/1E3uta8rgbxNcu7onwrg5y7bJaWY-TkvE0JlzE-3GAtY/edit?usp=sharing

- Ergoplank variants:
   - Ergoplank 60 aka "Katana max with ANSI bottom row": offsets 0.5, 0.25, 0, 0.5; Keys: 14, 14, 15, 14.
      (The difference to the original Katana is mostly in the bigger Shift keys, while unfortunately also Escape is big.)
   - original Katana with 力 icon, offsets: 0, 0.5, 0.25, 0. Keys: 15, 14, 14, 15.
- Ergoboard variants (all my 65% type variants don't look like a simple Plank anymore, therefore "board".) 
 - EB Mid Enter and Big Enter
 - EB MidShift with horizontal and vertical Enter
 - Note the slightly confusing wording: "mid shift" refers to the middle row, whereas "mid enter" refers to a medium size and to a key position not at the edge. 
 - EB MidShift vertical Enter (and 1.75u backspace)

- Apple mode for the ANSI keyboard and a new Layout-Viz layer to count the different keycap sizes

- prettier coloring of the "edge keys / command keys":
    + Allow layouts to highlight keys or change the rules on coloring. (Needed for ErgoPlanck to make its Return key visible.)
- home key marker in the key size viz
- refactor URL generation/parsing to be type-specific
- Ergoplank / Katana layout options have sub-options for the variants below the variant. 
- refactored to awesome keyWidth functions which automatically calculate the gaps for symmetrically staggered keyboards.
  Wasted a whole day without adding user-visible content. But was fun to do and I am proud of the new-found simplicity!


bugs fixed:
- Learnability Score for Wide ANSI in Mapping List is changing when I select different mappings =:-[]
- Frequency for Thumby bigrams should be counted, even if there is no wide layout.
- validate mapping/layout/options combination from URL data, so that the app doesn't crash
- handle Harmonic variants without a matching mapping:
  + when switching to the Harmonic layout with an unsupported mapping already set
  + when switching the Harmonic variant



======================== TODO ===============================

refactorings:
 - instead of the current keyboard-specific keymaps, keep only thirty and thumbThirty, and put all the rest into a list of pairs [keyboardLayout, specificMapping]. 
    This should make it much easier to select the next-best layout if the current one does not support the keymap: we can simply "walk up the variant tree". 
    Similarly, when switching layout or layout options, we can do a similarity search (by the first word of the keymap name) for a matching keymap.

 - Turns out that the key/finger/effort matrix is easier to edit by hand than write in abstractions. Copy, paste, adapt, ... and win!
    Maybe for a good start: write a helper function to generate an initial finger and effort matrix given a layout (by key matrix, keyWidths, and index finger columns).
    That would be fun to write and be a neat documentation of my fingering and effort theory. But also useless at the moment, since I don't plan to add any new layouts besides HHKB, which will simply copy from ANSI.

 - "ANSI wide" is the only layout option which influences how keymap metrics are calculated and which keymaps apply.
   But all the Harmonic and Ergo(Plank|Board) options are filtered through the setLayout mechanism. Is that what we want?

missing core features:
- Ergoplank and Katana logos to fill the gap, especially Ergoboard 65 Midshift with a nice connection between both gaps.
- Rectangle around the keyboard to signify the 60% or 65% box.
- AHKB should be minimal: just Apple layout with both Shift keys begetting a 1u external key. Or even a 1.25 to be used as Ctrl/Cmd?!
- new name for current AHKB ==> AHKB-Wide?!

- add some more explanations, especially for:
  + the "wide" mappings
  + Harmonic and Ortho general texts (maybe (i) icon in layout bar). But still repeat that text under the H and O variants.

- check consistency of all mappings:
   + variants for different layouts should be consistent (only have differences clearly attributed to the layout)
   + maybe check if some full-mappings can be omitted, because thumb30 and 3×10 do the job well enough?
   + related thumby variants should be consistent (only have the intended differences)
     * especially Thumby-KU

bugs:
- select AHKB, then select qwerty wide. crash!

- fullLayout on ANSI doesn't work with HHKB and AHKB – function setLayout needs to be adapted to switch to IBM or Apple in this case!
- when switching mappings we correctly set options (which only affects ANSI), but we don't switch Layouts, because there are so many variants to iterate through. But needs to be done at some point.
- the comparisonBase mapping needs to have definitions on all layouts, thus at least a mapping30 (which is supported everywhere).
   Add that for qwertz and maybe add a full mapping for the ortho board to make the comparison more meaningful.
- on Thumby / Cozy Keyboard English variant, the apostrophe is counted as "changed on same finger" on the ortho layout, 
  but not on ANSI wide, although it's on the same position.
  It should not be counted as changed on either, because the change is due to the wide layout, not the letter mapping.
- fix altFinger configuration for Harmonic variants AND show it in finger viz ==> or remove Alt-finger stuff from app

refactoring:
- remove home finger properties; use keyEffort==Home instead.

better visual design:
   - scoring and description of learning/single key/bigram classes
   - Mapping Name not be centered when it wraps to two lines.
   - Enter and Space as a lighter shade of the special-key background (will change when a letter is mapped to the key)
   - show both special-key background and finger assignment / effort score colors: 
     + either use SVG pattern to create stripes in both colors.
     + or use the finger/score color in combination with a thick border around the key. (As we do with the home row in the fingers viz.)
   - Change description fields of layout and mapping data to JSX.Component (or markdown)

optional features:
- mouse hover in bigram viz to only show lines in/out of one key. 
  + Create a specific detail view to show the frequency of 
- 'frame layout' options for nav/del keys
- Alternatively, offer an option to hide all keys outside the core 30 mapping (labeled "show only letters and prose punctuation").
  (Especially split ortho keyboards have too many permutations that people are using.)
- add "specialized" column to mapping list and mention the meaning in the mapping description in the Details Area.
  + when a mapping has both core and full mappings defined for a layout, show both in the list!
- hex-shaped keys
- let AI generate a few more unit tests
- only deduct half the learning points for changed punctuation keys. (Relevant only for `;`, since `-` is out of the box and others aren't moved.)


research option:
- can we redefine thumb30 in a way that omits ;- from its character set and let's the frame map all punctuation? (Except , and . which are constant in all our variants.)
- can we make a data model for the Harmonic that allows us to simply scale the layout for a width of 14, 13, and 12 keys?
   * 12 only works as "balanced" (full-width home row, lower shift), 14 as "traditional" and "balanced", 13 as balanced and "mid-shift".
   * for the layout itself it should be easy, but defining really sensible punctuation depends on the exact number and position of keys available!
   * some options for the bottom row should be available, although H12 only supports 1U space, for H13 I prefer the current alignment, only H14 can choose between having more 1u keys or some 1.5u keys.
- variants of Harmonic bottom row, including a 2u central space bar ()

Postponed:
- nav keys and AltGr layer – this fits better into an app/page focused on the Harmonic keyboard. There's already enough info on layers on the 'net, so let's keep this app focused on the themes of casual mappings, thumb-E, and the alt-fingering aspect of staggering.  

discarded ideas:
- have thumb30 mapping include placeholders for punctuation characters, so that the frame layout can set them!
  -> won't help, because a consistent arrangement of punctuation depends on where those are actually mapped
  (Both parenthesis and nav keys are pairs, and also +- ideally are a pair, and maybe even /\.)



building usable things:
 - actual Windows implementation of ANSI-Thumby, including a few useful options of using CapsLock sensibly and what key to swap with AltGr so that it can be mapped to E. (Maybe some ISO key not used on ANSI board or the other way round.)

possible additions:
http://www.michaelcapewell.com/projects/keyboard/#The_QWERF_Layout
strangely changes mostly the right hand.

https://mk.bcgsc.ca/carpalx/?partial_optimization – makes only 5 or 10 swaps, but doesn't respect hand or finger position. 10 swaps without those restrictions is already a completely unrecognizable new layout.

https://mk.bcgsc.ca/carpalx/?keyboard_layouts this page shows c-qwerty and variants, that swap ED UJ IK OL and some other pairs. I might include one of them in my app.

But with thumb-E everything changes! The layout with the least changes is simply the thumb-E-B-hyphen swap. (Of course even simpler without B, but with B is what I have been using for 11 years now.) When adding D and R in the swap, T and F are just begging to join as well. Adding G is a matter of taste. But then the ring is definitely closed.
Ironically, on the right hand, all swaps are independent NJ, IK, OL, H;, with the exception of UK (if used) and YJ; (needed in Harmonic). 

