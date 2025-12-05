
Feature: animate changes in the keyboard layout or mapping. 
More precisely: whenever the display of the keyboard (component RowBasedKeyboard) changes, move keys from their present to their new position.
If the old or new position is non-existing (new or disappearing key), assume this position to be outside the SVG boundard on a line from the keyboard center and through the key's existing position.

We do this by replacing the KeyPosition[] array with a KeyMovement[] array that has both old and new positions.
The animation itself is pure SVG/CSS, and the disappearing keys will just stay in the DOM outside the visible area until the display changes again.


Implementation:
 - Change the KeyPosition class to have old and new positions for each key. Note that row and colPos are the display position for a key, while 'col' is the key's logical position (how many keys and gaps are to the left of it) on the row.
 - Pass to KeyboardSvg a list of KeyPositions which includes both the old and new keys, identified by their label:
   - Keys (by label) that are in both the old and new layout (FYI that should be most of them) will have an old and new position.
   - Keys that are only in the old or new layout only have one of the two positions.
 - KeyboardSvg then places elements for all the keys in the SVG and adds the <animate> or <animateTransform> tags with the old and new positions.
   - For missing positions it will put coordinates outside the SVG frame on a line which starts at the keyboard center and passes through the key's given position. (Thus, the key will move in or out along a radial axis.)

TODO list:
 - [x] Define interface KeyMovement and adapt KeyPosition
 - [ ] Add previousLayoutModel to appState (initialize it to be the same as current to avoid having to handle null in a lot of code)
        Update it whenever the layoutModel is updated.
 - [ ] create a function getKeyMovements which calls getKeyPositions for previous and current appState and merges the results.
 - [ ] adapt the RowBasedKeyboard component to accept a list of key movements and forward each element to the Key component.
      Key() should add an <animate> or <animateTransform> tag into all the elements generated