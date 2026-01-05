Goal:
 - Let the user download a .klc file for the selected keymap. (Note that KLC = (Microsoft) Keyboard Layout Creator, 
   but actually it describes keymaps only. The layout is whatever keyboard the user has.)

Constraints and Rough Plan:
 - Since the KLC format supposes an ANSI or ISO keyboard, we only offer the export for the ANSI and Apple keyboard layouts.
 - The app only manages the "base level" of each key (when Shift is not pressed). 
   All other data of a key should be mapped together with it's base character. (That is, Shift+1 is always "!" and so on.)
 - Our first task is to map the "scan codes" used by KLC to the matrix positions in our app. 
   We can do that by pre-calculating a matrix, which contains the scancodes in the position where the key actually is...
   And for good readability leave the key name for the positions that can't be remapped using KLC.

Export algorithm:
 - for each position in msKlcScancodes that is a scancode (a number) `sc`, get the character from the merged mapping.
 - then find the line for that character in the base .klc file and generate an output line with the scancode `sc` and the found line (except its scancode)
 - write the output file using the header and footer from base, only replacing all the scancode lines found and created above.

TODO: define id for the KLC file