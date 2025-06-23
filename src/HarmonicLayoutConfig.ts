import {KeyboardRows} from "./model.ts";
import {LayoutMapping} from "./mapping-functions.ts";

export const harmonicMapping: LayoutMapping = [
    ["Esc", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "="],
    ["↹", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "⌫"],
    ["`~", 10, 11, 12, 13, 14, "", 15, 16, 17, 18, 19, 30],
    // The move of key 29 to the middle is a change required to keep the finger assignments of keys 25..28 the same as on the ANSI layout.
    // This is caused by moving the right home row to the right where the Enter key is removed.
    // But below, Shift is still there.
    ["⇧", 20, 21, 22, 23, 24, 29, 25, 26, 27, 28, "⇧"],
    ["Ctrl", "Cmd", "Alt", "", "⍽", "⏎", "", "AltGr", "Fn", "Ctrl"],
]
// Maybe offer a boring option where \| and {} keys are placed on the three free spots –
// especially {} in the symmetric bottom positions does at least look cute.

export const harmonicRowStart = (row: number) =>
    (row == KeyboardRows.Bottom) ? 0.5 : 0;

export const harmonicKeyWidth = (row: number, col: number) => {
    // outer edge keys
    if ((row == KeyboardRows.Upper || row == KeyboardRows.Lower || row == KeyboardRows.Bottom) &&
        (col == 0 || col == harmonicMapping[row].length - 1)) return 1.5;
    // space and enter
    if (row == KeyboardRows.Bottom && (col == 4 || col == 5)) return 1.5;
    // all others
    return 1;
}

export const HarmonicKeyboardPitch = "The Harmonic keyboard layout has a fully symmetric keyboard with only two key sizes to allow for flexible changes to the key mapping. " +
    "Its regular row stagger allows for many keys to be comfortably typed by two fingers, which let's you intuitively avoid the awkward same-finger bigrams that make new key mappings feel so awkward. " +
    "Smaller keys make the board slightly narrower than an ANSI-based 60% keyboard, yet the hand home position is one key further apart, allowing for arms to relax and shoulders to open. " +
    "This also puts a bit of typing load on the index fingers and less on the pinkies. " +
    "The layout intentionally removes CapsLock and three \"programmer punctuation\" characters from the main layer and maps them onto the AltGr layer. " +
    "Users are encouraged to map the remaining keys to something personally useful for them. (Even the \"programmer punctuation\", if so desired.) ";