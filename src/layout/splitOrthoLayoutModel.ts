import {KeymapTypeId, type FrameMapping, type LayoutModel} from "../base-model.ts";
import {permute} from "./permutation-functions.ts";

// I arbitrarily decide that the top (number) row shall not be changed by the flex mapping.
// But there has to be an empty list in the mapping to keep the format consistent with the algorithms.
const fullMapping = [
    ["Esc", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "⌫"],
    ["↹", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    ["⇧", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "⇧"],
    ["Ctrl", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "Ctrl"],
    ["Alt", 0, 1, "Cmd", 2, "⏎", "␣", 3, "AltGr", 4, "Fn", "Cmd"],
];

/*
  Generally Ansi30 and Thumb30 have three character keys in the bottom row, while Ansi32 and Thumb32 have four.
  Apart from the two removed keys to make space for the larger flex mapping (and the '-' vs '/' difference, only on Ansi30)
  all the frame mappings should have the same keys.
  (This is different from ANSI, where I reflect more differences between standard ANSI and German keymaps.)
 */
const ansi30Base: FrameMapping = [
    // Mapping Enter as a thumb key allows `'` to stay in its Qwerty position.
    // We use the freed space to improve `-` position, since this is the third most frequently used punctuation character.
    ["Esc", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "⌫"],
    ["↹", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "'"],
    ["⇧", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "⇧"],
    ["Ctrl", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "Ctrl"],
    ["Alt", "`", "\\", "⌦", "Cmd", "⏎", "␣", "Fn", "AltGr", "+", "-", "☰"],
];

const thumb30Base: FrameMapping = [
    ["Esc", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "⌫"],
    ["↹", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "'"],
    ["⇧", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "⇧"],
    ["Ctrl", 0, 1, 2, 3, 4, 5, 6, 7, 8, "/", "Ctrl"],
    ["Alt", "⌦", "+", "Cmd", 0, "⏎", "␣", "Fn", "AltGr", "\\", "`", "☰"],
];

const ansi32Base: FrameMapping = [
    ["Esc", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "⌫"],
    ["↹", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    ["⇧", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "⇧"],
    ["Ctrl", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, [2, 10]],
    ["Alt", "/", "`~", "⌦", "Cmd", "⏎", "␣", "Ctrl", "AltGr", "'", "+", "Fn"],
];

const thumb32Base: FrameMapping = [
    ["Esc", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "⌫"],
    ["↹", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    ["⇧", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "⇧"],
    ["Ctrl", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "'"],
    // now = is right again, where German and other key maps have the -_
    ["Alt", "⌦", "`~", "Cmd", 0, "⏎", "␣", "Ctrl", "AltGr", "/", "+", "Fn"],
];

// thumbShift cycles: ⇧ moves to the second thumb key from center on each side.
// Left side: <S → Cmd/flex-letter spot, Cmd/flex-letter → ⌦ spot, ⌦ → <S spot.
const SO_LEFT_TS_ANSI = "<SC⌦";    // for Ansi30 and Ansi32
 // for Thumb30 and Thumb32

export const splitOrthoLayoutModel = (thumbShift: boolean) : LayoutModel => ({
    name: "Split Ergonomic" + (thumbShift ? " Thumb-Shift" : ""),
    description: `The Ortholinear key layout is especially popular with two-piece keyboards. 
    This allows to position and rotate the two keyboard halves to make columns line up exactly with your finger's natural extension movement. 
    Most split models include between two and four thumb keys on each side that users can map to any function they want. 
    Examples: The ZSA Voyager has two per side; 
    the Corne has three; the Iris has four; the Sofle and Lily58 have four thumb keys and one extra bottom key, 
    and finally the MoErgo Go60 has four thumb keys and two further bottom-row keys per side, which corresponds to the picture shown here. (Don't confuse the Go60 with the Glove80, which is a much bigger keyboard. 
    Similarly large is the Ergodox with 76 keys; too complicated to show here and not an interesting challenge in creating a compact key map!)
    We thus need to keep in mind that a keymap which works on all of those keyboards, 
    the characters in the bottom row need to be mapped redundantly on the AltGr level.`,
    // more splitties here: https://jhelvy.shinyapps.io/splitkbcompare/
    // if it's down, you can run it locally: https://github.com/jhelvy/splitKbCompare

    rowIndent: [0, 0, 0, 0, 2],
    keyWidths: fullMapping!.map((row) => row.map((_) => 1)),
    splitColumns: [6, 6, 6, 6, 6],

    leftHomeIndex: 4,
    rightHomeIndex: 7,

    staggerOffsets: [0, 0, 0, 0],
    symmetricStagger: true,

    mainFingerAssignment: [
        [1, 1, 2, 2, 3, 3, 6, 6, 7, 7, 8, 8],
        [0, 0, 1, 2, 3, 3, 6, 6, 7, 8, 9, 9],
        [0, 0, 1, 2, 3, 3, 6, 6, 7, 8, 9, 9],
        [0, 0, 1, 2, 3, 3, 6, 6, 7, 8, 9, 9],
        [0, 1, 2, 4, 4, 4, 5, 5, 5, 7, 8, 9],
    ],

    singleKeyEffort: [
        [NaN, 3.0, 2.0, 2.0, 3.0, 3.0, 3.0, 3.0, 2.0, 2.0, 3.0, NaN],
        [NaN, 1.5, 1.0, 1.0, 1.5, 1.5, 1.5, 1.5, 1.0, 1.0, 1.5, 2.0],
        [NaN, 0.2, 0.2, 0.2, 0.2, 1.0, 1.0, 0.2, 0.2, 0.2, 0.2, 1.5],
        [NaN, 1.0, 1.5, 1.5, 1.0, 2.0, 2.0, 1.0, 1.5, 1.5, 1.0, NaN],
        [NaN, 2.0, 2.0, 1.5, 0.2, 0.2, 0.2, 0.2, 1.5, 2.0, 2.0, NaN],
    ],

    colloquialCycles: thumbShift ? {
        [KeymapTypeId.Ansi30]: ["\\(", "`)"],
        [KeymapTypeId.Thumb30]: ["(\\`"],
    } : {
        [KeymapTypeId.Ansi30]: [")("],
        [KeymapTypeId.Thumb30]: ["\\(", "`)"],
    },

    // thumbShift right cycles:
    //   fullMapping:    swaps ⇧ with the flex letter at the second-from-center thumb key on each side
    //   Ansi30/Thumb30: Fn → ' spot, ' → >⇧ spot, >⇧ → Fn spot
    //   Ansi32:         >⇧ → >Ctrl spot, >Ctrl → {2:10} spot, {2:10} → >⇧ spot (becomes flex key 10 on row 2)
    //   Thumb32:        >Ctrl → ' spot, ' → >⇧ spot, >⇧ → >Ctrl spot
    frameMappings: thumbShift ? {
        [KeymapTypeId.SplitOrtho]: permute(fullMapping, "<S{4:2}⏎>^F{4:1}", ">S{4:3}"),
        [KeymapTypeId.Ansi30]:     permute(ansi30Base,  SO_LEFT_TS_ANSI,  "F+-'>S"),
        [KeymapTypeId.Thumb30]:    permute(thumb30Base, "<S{4:0}⏎>^\\⌦", ">SF`'"),
        [KeymapTypeId.Ansi32]:     permute(ansi32Base,  SO_LEFT_TS_ANSI,  ">S>^{2:10}"),
        [KeymapTypeId.Thumb32]:    permute(thumb32Base, ">S>^/⌦<S{4:0}⏎'"),
    } : {
        [KeymapTypeId.SplitOrtho]: fullMapping,
        [KeymapTypeId.Ansi30]:     ansi30Base,
        [KeymapTypeId.Thumb30]:    thumb30Base,
        [KeymapTypeId.Ansi32]:     ansi32Base,
        [KeymapTypeId.Thumb32]:    thumb32Base,
    },
});
