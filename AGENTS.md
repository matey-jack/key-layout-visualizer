# System documentation

This is a TypeScript/Vite/React project with the conventional folder structure and build scripts documented in package.json.

It is a single page application which shows a keyboard (rendered via SVG by @layout/KeyboardSvg.tsx) at the top, a list of keymaps on the bottom left, and some detail information on the bottom right.

There are several different visualizations (called "vizzies" from here on) which show different information on the keyboard diagram. 
Some vizzies show information only related to the keyboard layout (like key size statistics, finger assignment, key effort assignment, ...) and others show information about the selected keymap.
For most visualizations, key labels are shown according to the keymap which is selected in the bottom left list.

The data model consists of:

* keyboard layouts (instances of class RowBasedKeyboardLayout) which define the number, size, and position of available keys. 
  Keyboards layouts also have data on which finger is used to type which key and how much effort this takes.
  This data is used to evaluate keymaps.

* key maps (instances of class FlexMapping): define which key label (letter or key function) goes where on a keyboard layout. 
   - There are layout-independent "letter maps" which contain only 30 characters. 
     Each keyboard layout defines which keys will receive those 30 characters (usually the 30 keys easiest to reach) and what is mapped to the remaining keys.
   - And there are Layout-specific mappings which map all 26 letter and 11 punctuation keys plus some more keys, but still not all the keys, so that each specific keymap can still cover several layouts that are variants of each other, each specifying what's mapped to the remaining keys.

* Letter and bigram frequency data for different languages which is used to calculate weighted typing effort for those languages and each mapping for the selected keyboard layout.

## Testing

The local app runs under http://localhost:3000 (or whichever port [vite.config.ts](vite.config.ts) says.)

- `npm test` - Runs tests, can be called by AI agents.
- `npm run e2e` - Run all Playwright tests.
- `npm run e2e:ui` - Run tests with UI mode for debugging, only for human use!

The Playwright tests are in the `e2e/` directory. 

