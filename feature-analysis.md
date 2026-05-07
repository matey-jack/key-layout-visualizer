Problem: The learning score for localMaximum-mappings varies for incidental reasons. 
A. using the left or right thumb for a letter, which makes a big difference. 
B. using mid-shift leaves one less character key for the fingers and creates a "same finger" learning score for the apostrophe.

Part A needs to be solved rigorously, since the ANSI keyboard only has a right thumb key, thus the generic thumb30 flexmap type always has to use that. So keymaps that prefer a left-hand thumb letter to improve their learning score need to provide a special splitOrtho mapping. No way around that!
I'll also change the thumb30 frame for this layout to a left-hand letter and right-hand space, because that's the smaller change when coming from a non-wide ANSI keyboard. (Hitting the big space bar with the right hand and using E, R, or T from the left hand as the thumb-letter. Thankfully, this is a frame-only change and I don't need to go and change a lot of mappings.) 
But we'll do that after fixing B, since that changes the shape of the splitOrtho keymap type!


Part B is currently implemented weirdly: 
Ansi30 keymap has low-shift (kinda logical) 
Thumb30 keymap has mid-shift (also kinda logical, since more ergonomic)
Full mapping has low-shift, which is the weird part.

Solution options:
 B1. make shift position a layout option; then it will change the scores of all keymaps when flipped between mid and low.
 B2. use mid-shift for the full mapping so that all the keymaps with thumb-letters are compared equally.

The layout option should work well for the x30 map types because their off-pinky characters are set by the frame layout. But it would not work well for the full mapping. 
So I think we should go with B2, which means a small change to the frame mappings and then changing all the 10 flexMappings which have a splitOrtho keymap.

In total, those changes will remove the worst of the incidental differences.
The scores for those casual keymaps should then be pretty similar on all three keyboard types: ANSI (wide), Ergoplank (and variants), and Split Ortho.

This brings up the question of how to arrange the bottom row. 
Since that is not the focus of today's work, I propose a simple mechanical swap: the frame mapping removes a flex spot in the middle row, and we add one back in the lower row. 
So the set of mapped characters in the FlexMappings doesn't change; we merely need to rearrange them.
I could even do that manually only for the localMaximum mappings and have AMP's NOT smart / rush mode do the rest.

Mid-Shift fix log:
 - Maltron and rstdh: also moved the thumb letter to the left hand. (Doesn't effect the metrics as much as it does for casual layouts, but leads to more alignment overall.)
 - Colemak DH (has a split-ortho version because of the angle-mod). Colemak Thumby doesn't need the split-ortho specific version!
 - two Cozy variants
 - top9 English (and two obsolete variants. notably the 'left thumb' is obsolete, because we make that the default on all keyboards except ANSI. This reflects that I don't consider ANSI-compatibility for thumb-letters important any more.) 
