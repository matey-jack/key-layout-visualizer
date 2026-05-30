import {KEY_COLOR, KeyboardRows, KeymapTypeId, type LayoutMapping, type LayoutModel} from "../base-model.ts";
import {MonotonicKeyWidth, zeroIndent} from "./keyWidth.ts";

const keyWidth15 = new MonotonicKeyWidth(15, zeroIndent, "XHKB 15");

export const xhkb15LayoutModel: LayoutModel = {
    name: "Thumbs Up 15/4",
    description: `The Thumbs Up layout continues HHKB's idea of splitting large keys to a point that
    delivers a layout with ergonomically wider hand positions and some extra central keys that can be used for navigation 
    or any other purpose. And to top it off, let's also split the space bar to create two great thumb keys per side.
    Using only four keycap sizes, Thumbs Up is the most versatile keyboard with traditional typewriter row staggering 
    and the classic 60% box shape.
    It keeps the Typewriter tradition and visual aesthetic of Enter and Space being the largest keys, 
    yet reduces the assymetry between the keyboard halves to just 0.5u for a much better hand position.`,

    keyWidths: [
        keyWidth15.row(0, 1.5), // 14 keys
        keyWidth15.row(1, 1),   // 15 keys
        keyWidth15.row(2, 1.25),// 14 keys
        [1.75, ...Array(11).fill(1), 1.25, 1], // 14 keys
        // Center of keyboard is at 7.25 / 7.75.
        // Key sizes are 3 × 1.5u + 1.75u = 6.25u, which leaves an additional 1u key left and 1.5u key right.
        [1.5, 1.5, 1, 1.5, 1.75, 1.75, 1.5, 1.5, 1.5, 1.5],
    ],

    // set extra keys to 'null' finger, so the same map is still consistent when we add arrow keys in the bottom-right.
    mainFingerAssignment: [
        [1, 1, 1, 2, 2, 3, 3, 6, 6, 7, 7, 8, 8, 8],
        [1, 0, 1, 2, 3, 3, 3, 6, 6, 6, 7, 8, 9, 9, null],
        [0, 0, 1, 2, 3, 3, null, null, 6, 6, 7, 8, 9, 9],
        [0, 0, 1, 2, 3, 3, 3, 6, 6, 6, 7, 8, 9, null],
        [0, 1, 1, 4, 4, 5, 5, 7, 8, 9],
    ],

    singleKeyEffort: [
        [3.0, 3.0, 2.0, 2.0, 3.0, 3.0, 3.0, 3.0, 2.0, 2.0, 3.0, 3.0, 3.0, 3.0],
        [3.0, 2.0, 1.0, 1.0, 1.5, 1.5, 3.0, 3.0, 1.5, 1.5, 1.0, 1.0, 2.0, 2.0, null],
        [1.5, 0.2, 0.2, 0.2, 0.2, 2.0, null, null, 2.0, 0.2, 0.2, 0.2, 0.2, 1.5],
        [1.0, 2.0, 2.0, 1.5, 1.5, 3.0, 3.0, 3.0, 1.5, 1.0, 1.5, 1.5, 1.0, null],
        [2.0, 2.0, 2.0, 1.0, 0.2, 0.2, 1.0, 2.0, 2.0, 2.0],
    ],

    rowIndent: keyWidth15.rowIndent,

    // One might argue that B and ' and maybe also Y should also have dark color,
    // because they are as far from the home position as some edge keys, but I made the aesthetic decision as it is.
    // Left side has 5 'boring' keys per row; right side has 5, 6, 5, 4.
    keyColorClass(label: string, row: KeyboardRows, col: number) {
        if (label && "⏎↑↓←→".includes(label) || label === "Esc") return KEY_COLOR.HIGHLIGHT;
        if (row === KeyboardRows.Bottom) return KEY_COLOR.EDGE;
        if (col === 0) return KEY_COLOR.EDGE;
        if (col <= 5) return KEY_COLOR.BORING;
        if (col <= 7) return KEY_COLOR.EDGE;
        const rightEdge = [12, 13, 12, 11]
        if (col <= rightEdge[row]) return KEY_COLOR.BORING;
        return KEY_COLOR.EDGE;
    },

    splitColumns: [7, 7, 7, 7, 5],

    leftHomeIndex: 4,
    rightHomeIndex: 9,

    staggerOffsets: [-0.75, -0.25, 0, 0.5],
    symmetricStagger: false,

    frameMappings: {
        [KeymapTypeId.Ansi30]: [
            ["Esc", "1", "2", "3", "4", "5", "[", "]", "6", "7", "8", "9", "0", "⌫"],
            ["↹", 0, 1, 2, 3, 4, "-", "+", 5, 6, 7, 8, 9, "'", "⇞"],
            ["⌦", 0, 1, 2, 3, 4, "⇤", "⇥", 5, 6, 7, 8, 9, "⏎"],
            ["⇧", 0, 1, 2, 3, 4, "\\", 9, 5, 6, 7, 8, "⇧", "⇟"],
            ["Ctrl", "Cmd", "`~", "Alt", "⍽", "⍽", "AltGr", "CAPS", "Fn", "Ctrl"],
        ],
        // Note that / in the number row and - in the lower row is consistent with many European languages, such as German.
        // And that's what the 32-character set is about after all!
        [KeymapTypeId.Ansi32]: [
            ["Esc", "1", "2", "3", "4", "5", "\\", "/", "6", "7", "8", "9", "0", "⌫"],
            ["↹", 0, 1, 2, 3, 4, [2, 10], "'", 5, 6, 7, 8, 9, 10, "⇞"],
            ["⌦", 0, 1, 2, 3, 4, "⇤", "⇥", 5, 6, 7, 8, 9, "⏎"],
            ["⇧", 0, 1, 2, 3, 4, "+", 9, 5, 6, 7, 8, "⇧", "⇟"],
            ["Ctrl", "Cmd", "`~", "Alt", "⍽", "⍽", "AltGr", "CAPS", "Fn", "Ctrl"],
        ],
        [KeymapTypeId.Thumb30]: [
            ["Esc", "1", "2", "3", "4", "5", "[", "]", "6", "7", "8", "9", "0", "⌫"],
            ["↹", 0, 1, 2, 3, 4, "+", "`~", 5, 6, 7, 8, 9, "'", "⇞"],
            ["⌦", 0, 1, 2, 3, 4, "⇤", "⇥", 5, 6, 7, 8, 9, "⏎"],
            ["⇧", 0, 1, 2, 3, 4, "\\", "/", 5, 6, 7, 8, "⇧", "⇟"],
            ["Ctrl", "Cmd", "Ins", "Alt", 0, "⍽", "AltGr", "CAPS", "Fn", "Ctrl"],
        ],
        [KeymapTypeId.Thumb32]: [
            ["Esc", "1", "2", "3", "4", "5", "\\", "/", "6", "7", "8", "9", "0", "⌫"],
            ["↹", 0, 1, 2, 3, 4, "`~", "'", 5, 6, 7, 8, 9, 10, "⇞"],
            ["⌦", 0, 1, 2, 3, 4, "⇤", "⇥", 5, 6, 7, 8, 9, "⏎"],
            ["⇧", 0, 1, 2, 3, 4, "+", 9, 5, 6, 7, 8, "⇧", "⇟"],
            ["Ctrl", "Cmd", "Ins", "Alt", 0, "⍽", "AltGr", "CAPS", "Fn", "Ctrl"],
        ],
    },
}


const keyWidth16 = new MonotonicKeyWidth(16, zeroIndent, "XHKB 16");

export const xhkb16LayoutModel: LayoutModel = {
    name: "Thumbs Up 16/5",
    description: `The Thumb Up 16/5 takes the legacy concept of the 65% keyboard into an ergonomic direction. 
        Tradition bolts ever more keys to the already overloaded right side of the keyboard, 
        whereas the Thumbs Up keyboard adds the navigation keys in the center of the board and exploits that fact
        to produce an even wider hands position than the Thumbs Up 15/4. 
        And it does all that while keeping 26 letters, 10 digits, the four most important punctuation keys,
        and all the command and control keys in exactly the same position relative to where you put your hands. `,

    rowIndent: keyWidth16.rowIndent,
    keyWidths: [
        keyWidth16.row(0, 1.5), // 15 keys
        keyWidth16.row(1, 1),   // 16 keys
        keyWidth16.row(2, 1.25),// 15 keys
        [1.75, 1, 1, 1, 1, 1, 0.5, 1, 0.5, 1, 1, 1, 1, 1, 1.25, 1], // 15 keys
        // The center between hand positions is at 7.75 vs 8.25.
        // Net of the arrows, that yields 6.25 and 6.75u of space to use.
        // And net of the space bars it's 4.5 and 5u.
        [1.5, 1.5, 1.5, 1.75, 1, 1, 1, 1.75, 1.25, 1, 1.25, 1.5]
    ],

    mainFingerAssignment: [
        [1, 1, 1, 2, 2, 3, 3, null, 6, 6, 7, 7, 8, 8, 8],
        [1, 0, 1, 2, 3, 3, 3, null, 6, 6, 6, 7, 8, 9, 9, null],
        [0, 0, 1, 2, 3, 3, null, null, null, 6, 6, 7, 8, 9, 9],
        [0, 0, 1, 2, 3, 3, null, null, null, 6, 6, 6, 7, 8, 9, null],
        [0, 1, 4, 4, null, null, null, 5, 5, 7, 8, 9],
    ],
    singleKeyEffort: [
        [3.0, 3.0, 2.0, 2.0, 3.0, 3.0, 3.0, 3.0, 3.0, 2.0, 2.0, 3.0, 3.0, 3.0, 3.0],
        [3.0, 2.0, 1.0, 1.0, 1.5, 1.5, 3.0, 3.0, 3.0, 1.5, 1.5, 1.0, 1.0, 2.0, 2.0, null],
        [1.5, 0.2, 0.2, 0.2, 0.2, 2.0, null, null, null, 2.0, 0.2, 0.2, 0.2, 0.2, 1.5],
        [1.0, 2.0, 2.0, 1.5, 1.5, 3.0, null, null, null, 3.0, 1.5, 1.0, 1.5, 1.5, 1.0, null],
        [2.0, 2.0, 2.0, 0.2, null, null, null, 0.2, 2.0, 2.0, 2.0, 2.0],
    ],

    frameMappings: {
        [KeymapTypeId.Ansi30]: [
            ["Esc", "1", "2", "3", "4", "5", "[", "`~", "]", "6", "7", "8", "9", "0", "⌫"],
            ["↹", 0, 1, 2, 3, 4, "-", "\\", "+", 5, 6, 7, 8, 9, "'", "⇞"],
            ["⌦", 0, 1, 2, 3, 4, "⇤", "Ins", "⇥", 5, 6, 7, 8, 9, "⏎"],
            ["⇧", 0, 1, 2, 3, 4, null, "↑", null, 9, 5, 6, 7, 8, "⇧", "⇟"],
            ["Ctrl", "Cmd", "Alt", "⍽", "←", "↓", "→", "⍽", "AltGr", "CAPS", "Fn", "Ctrl"],
        ],
        [KeymapTypeId.Thumb30]: [
            ["Esc", "1", "2", "3", "4", "5", "[", "`~", "]", "6", "7", "8", "9", "0", "⌫"],
            ["↹", 0, 1, 2, 3, 4, "+", "€", "\\", 5, 6, 7, 8, 9, "'", "⇞"],
            ["⌦", 0, 1, 2, 3, 4, "⇤", "Ins", "⇥", 5, 6, 7, 8, 9, "⏎"],
            ["⇧", 0, 1, 2, 3, 4, null, "↑", null, "/", 5, 6, 7, 8, "⇧", "⇟"],
            ["Ctrl", "Cmd", "Alt", 0, "←", "↓", "→", "⍽", "AltGr", "CAPS", "Fn", "Ctrl"],
        ],
        [KeymapTypeId.Ansi32]: [
            ["Esc", "1", "2", "3", "4", "5", "\\", "`~", "/", "6", "7", "8", "9", "0", "⌫"],
            ["↹", 0, 1, 2, 3, 4, [2, 10], "'", "+", 5, 6, 7, 8, 9, 10, "⇞"],
            ["⌦", 0, 1, 2, 3, 4, "⇤", "Ins", "⇥", 5, 6, 7, 8, 9, "⏎"],
            ["⇧", 0, 1, 2, 3, 4, null, "↑", null, 9, 5, 6, 7, 8, "⇧", "⇟"],
            ["Ctrl", "Cmd", "Alt", "⍽", "←", "↓", "→", "⍽", "AltGr", "CAPS", "Fn", "Ctrl"],
        ],
        [KeymapTypeId.Thumb32]: [
            ["Esc", "1", "2", "3", "4", "5", "\\", "`~", "/", "6", "7", "8", "9", "0", "⌫"],
            ["↹", 0, 1, 2, 3, 4, "'", "€", "+", 5, 6, 7, 8, 9, 10, "⇞"],
            ["⌦", 0, 1, 2, 3, 4, "⇤", "Ins", "⇥", 5, 6, 7, 8, 9, "⏎"],
            ["⇧", 0, 1, 2, 3, 4, null, "↑", null, 9, 5, 6, 7, 8, "⇧", "⇟"],
            ["Ctrl", "Cmd", "Alt", 0, "←", "↓", "→", "⍽", "AltGr", "CAPS", "Fn", "Ctrl"],
        ],
    },

    // Slightly adapted from the 15.
    keyColorClass(label: string, row: KeyboardRows, col: number) {
        if (label && "⏎↑↓←→".includes(label) || label === "Esc") return KEY_COLOR.HIGHLIGHT;
        if (row === KeyboardRows.Bottom) return KEY_COLOR.EDGE;
        if (col === 0) return KEY_COLOR.EDGE;
        if (col <= 5) return KEY_COLOR.BORING;
        if (col <= 8) return KEY_COLOR.EDGE;
        const rightEdge = [13, 14, 13, 13]
        if (col <= rightEdge[row]) return KEY_COLOR.BORING;
        return KEY_COLOR.EDGE;
    },

    leftHomeIndex: 4,
    rightHomeIndex: 10,

    staggerOffsets: [-0.75, -0.25, 0, 0.5],
    symmetricStagger: false,
}
