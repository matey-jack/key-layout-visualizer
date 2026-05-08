This is of historic value after features have been implemented.

## Which keyboards should get a mid-shift option?

ANSI and Apple, because their large Shift key makes a nice Return key!
Not HHKB or XHKB (Thumbs Up), because their split Shift key does not make a nice Return key.
==> We are not trying to provide comprehensive coverage off all theoretical variants, but simply show off some attractive ones to get people thinking.

This would be easy to implement if we didn't already have a lot other options for those layouts. 
Let's provide it only as a sub-option when "wide" is selected (since otherwise right shift is not a pinky-neighbor).
Maybe this will also make the implementation simpler, since only the ANSI-Wide needs to change.

Ergoslat:
 - great fit, since Enter can be on the longer lower row key and the 1u key freed for a character.
 - on the left side, Ctrl can be on the lower row, like on my split ortho keymaps
 ==> implement this first, via a simple checkbox option. Make a LayoutModel variant and then let Claude add the UI and switching logic.

Ergoplank:
 - has a lot of potential for different mappings!
 - one would be to have only 1u keys in the lower row, so that / on the right need not flip and the left side could be used for a physical angle mod (like the extra-wide Ergoboard) => this should replace the current (mapping-only) angle-mod!

 - another would be lower-row Return and putting the delete key in the upper row, right under backdelete! (Left side would be like Ergoslat.) => this is purely a mapping change.

 - This gives a total of three variants here. And since flipRetRub doesn't make sense with any of the three, let's just make an option-switch labeled "low-shift" and "mid-shift" and the latter having a sub-option "angle mod". It's slightly weird, that only the sub-option changes the actual key sizes, but still low-shift vs mid-shift is the bigger change that separates the options. 

Ergoboard: already has low-shift and mid-shift variants which have different key sizes.

Split Ortho:
 - we currently have mix-shift here. Unlike the Ergoboard family, there are also layout-specific keymaps, which depend on where the Shift key is located. (After all, I just refactored this!)
 - therefore best to have a "mid-shift" checkbox which only works when an ansi30 or thumb30 mapping is active.
 - on specific mappings, simply check and lock the box, just as is done with the "wide" box on ANSI.

Implementation order (easiest to hardest):
 - split ortho
 - ergoslat
 - ANSI and Apple
 - Ergoplank (only one that includes a small layout change, just two keys change size and indent appears).


## About fixing bugs discovered thanks to the learning-vs-effort diagram feature.

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
