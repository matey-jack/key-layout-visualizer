
Feature: animate changes in the keyboard layout or mapping. 
More precisely: whenever the display of the keyboard (component RowBasedKeyboard) changes, move keys from their present to their new position.
If the old or new position is non-existing (new or disappearing key), we set the source or destination position of the animation outside the visible SVG as follows. The colPos (x value) constant. For row 0 and 1 move from/to row -2. For row 2, 3, and 4, move to row 6.

We do this by replacing the KeyPosition[] array with a KeyMovement[] array that has both old and new positions.
The animation itself is pure SVG/CSS, and the disappearing keys will just stay in the DOM outside the visible area until the display changes again.


Implementation:
 - [x] Change the KeyPosition class to have old and new positions for each key. Note that row and colPos are the display position for a key, while 'col' is the key's logical position (how many keys and gaps are to the left of it) on the row.

 - [x] Pass to KeyboardSvg a list of KeyPositions which includes both the old and new keys, identified by their label:
   - Keys (by label) that are in both the old and new layout (FYI that should be most of them) will have an old and new position.
   - Keys that are only in the old or new layout only have one of the two positions.

 - [ ] change the Key component as follows: 
    * remove all the <animate> tags.
    * remove the coordinates from all the SVG elements (or use 0,0), and instead add them via the 'style' attribute.
    * in app.css add a "transition" attribute to the CSS classes used by the Key component
