/*
    Most letter mapping discussions on the Internet talk only about mapping of the 26 letters and sometimes also the four
    punctuation keys that on the ANSI/Qwerty layout/mapping fall into the central 3×10 field of the keyboard.
    Such a restricted mapping has the advantage that it maps to different (physical) keyboard layouts that don't have
    equivalents for all the ANSI keys.

    But once we add the Thumb-E and have non-ANSI keyboards with very different key positions for the remaining punctuation
    characters, we'll often need to provide a full mapping. In particular, this can create a logical positioning of characters
    inside and outside the core set. (For example / and \ when using the classic 3×10 core, - and = (with +) when using the
    thumb30 core, or any of the two when we want to put [] in adjacent center columns, where belongs to the flex mapping and
    the other doesn't.

    Here are some useful Unicode characters that you can use in your mappings:
    ⌥ – will be spelled out as "AltGr"

    All others will be shown on the keyboard as is:
    Navigation keys:

    White space and other keyboard specials: ⍽ ↵ ↹ ⎋ ⇧ ⇪ ⌫ ⌦ 🖰
    Navigation keys: ↑ ↓ ← → ⇤ ⇥ ⇞ ⇟ ↞ ↠ ⇱ ⇲

    Useful Unicode characters: € $ ¢ £ ¥ µ × – ¿ ¡ § % ‰

 */

import {FlexMapping} from "../base-model.ts";

export const qwertyMapping: FlexMapping = {
    name: "Qwerty – US and world-wide standard",
    techName: "QWERTY",
    description: "This ancient typewriter-born key mapping is so ubiquitous today that many people might never have seen a different mapping in their whole life. " +
        "At the same time it is also extra-ordinary bad for touch-typing, because frequently used letters are not in the center.",
    sourceUrl: "https://en.wikipedia.org/wiki/QWERTY",
    mapping30: [
        "qwert" + "yuiop",
        "asdfg" + "hjkl;",
        "zxcvb" + "nm,./",
    ]
}

export const qwertzMapping: FlexMapping = {
    name: "Qwertz – German Standard",
    techName: "QWERTZ",
    description: "Qwerty, but with z/y swapped and three more letters added instead of extended punctuation.",
    sourceUrl: "https://en.wikipedia.org/wiki/QWERTZ",
    mappingAnsi: [
        "ß´",
        "qwert" + "zuiopü+#",
        "asdfg" + "hjklöä",  // there is # on the ISO key here
        "yxcvb" + "nm,./",   // and <> on the ISO key here
        "⌥ "
    ],
    // TODO: this would be interesting to see on H14T or maybe even H14-Wide, because it can actually make use of all those keys!
    //       especially the ß!
}

export const colemakMapping: FlexMapping = {
    name: "Colemak",
    description: "Released in the year 2006, the Colemak layout started a new world-wide interest in better letter mappings. " +
        "It also pioneered the idea of leaving some crucial-for-shortcuts keys in their place. " +
        "Colemak places a strong emphasis on avoiding single-finger bigram conflicts at the cost of many letters changing fingers. " +
        "TODO: is there a layout which achieves the same, but better, by including E on a thumb key?",
    sourceUrl: "https://colemak.com/",
    mapping30: [
        "qwfpg" + "jluy;",
        "arstd" + "hneio",
        "zxcvb" + "km,./",
    ]
}

export const normanMapping = {
    name: "Norman",
    sourceUrl: "https://normanlayout.info/index.html",
    description: "Norman has the heaviest focus on minimizing finger movement among all the mappings in this comparison. " +
        "However, at the time of its creation, the notion of minimizing learning effort was still new and Norman did a great job of balancing the two. " +
        "One could apply the Minimak principle of step-wise learning to Norman by starting with the pair-swaps DE and LO, " +
        "then adding the ring-swap FTKRI, and finally the ring swap NJPYH;",

    // I think this would be prettier (and one less letter change to learn) with `p` in its ancient position and `;`
    // where `p` is here. But Norman's creator considers the new `p` position to be 25% easier to reach and thus the move.
    mapping30: [
        "qwdfk" + "jurl;",
        "asetg" + "ynioh",
        "zxcvb" + "pm,./",
    ]
}

export const minimak4Mapping = {
    name: "Minimak 4-key",
    techName: "Minimak-4",
    sourceUrl: "https://github.com/binaryphile/www.minimak.org/blob/master/media/minimak_4_key.png",
    sourceLinkTitle: "GitHub: binaryphile/www.minimak.org",
    description: "Minimak partitions its key remapping in three steps, so that you can learn the layout incrementally. " +
        "Thanks to the many same-finger changes this trick actually works with all of the layouts in this app, " +
        "but Minimak get credit for making it explicit.",
    mapping30: [
        "qwdrk" + "yuiop",
        "astfg" + "hjel;",
        "zxcvb" + "nm,./",
    ]
}

export const minimak8Mapping = {
    ...minimak4Mapping,
    name: "Minimak 8-key",
    techName: "Minimak-8",
    sourceUrl: "https://github.com/binaryphile/www.minimak.org/blob/master/media/minimak_8_key.png",
    mapping30: [
        "qwdrk" + "yuilp",
        "astfg" + "hneo;",
        "zxcvb" + "jm,./",
    ]
}

export const minimakFullMapping = {
    ...minimak4Mapping,
    name: "Minimak Full (12-key)",
    techName: "Minimak-12",
    sourceUrl: "https://github.com/binaryphile/www.minimak.org/blob/master/media/minimak.png",
    mapping30: [
        "qwdfk" + "yuil;",
        "astrg" + "hneop",
        "zxcvb" + "jm,./",
    ]
}

// I omit the plain "flip" version, because I think that the JN swap is essential to avoid a lot of vertical 
// bigram conflicts. 
// (Most typing is on home and upper row, often even both ahead and after the N, for example, double upper-row neigbors
// mINUte, commUNIty, UNIversal, contINUe, ecONOmic, traINIng. The lateral movement to Qwerty N even moves the hand away from 
// home row letters, see ONLy, thINK, KNOw, ONLine, ...)
// Nobody should waste time with a UN swap! (Especially, since U's position on the upper row is quite befitting for its frequency!)
export const qwertyFlipTwistMapping = {
    name: "Qwerty Flip/Twist",
    techName: "Qwerty-FlipTwist",
    sourceUrl: "https://nick-gravgaard.com/qwerty-flip/",
    description: "The genius mapping that anyone can remember after seeing it only one time. " +
        "Absolutely minimal learning; much better typing than Qwerty; and anyone can still use your relabled keyboard, " +
        "because flipped keys are so close to where people look for them. ",
    mapping30: [
        "qwdfg" + "yukl;",
        "asert" + "hniop",
        "zxcvb" + "jm,./",
    ]
}

export const qwertyFlipTwistSpinMapping = {
    name: "Qwerty Flip/Twist/Spin",
    techName: "Qwerty-FlipTwistSpin",
    sourceUrl: "https://nick-gravgaard.com/qwerty-flip/",
    description: "A nice spin on the Flip/Twist mapping which improves typing a bit more.",
    mapping30: [
        "qwdfg" + "yukp;",
        "asert" + "hniol",
        "zxcvb" + "jm,./",
    ]
}

export const etniMapping = {
    name: "ETNI",
    sourceUrl: "https://stevep99.github.io/etni",
    description: "A hot take which takes the home positions for the longer fingers on the upper letter row " +
        "(while keeping Index and Pinky finger home on the middle row). " +
        "Earns the prize for least changes to learn for people that are already touch-typing. " +
        "Judge yourself if this is comfortable for you. ",
    mapping30: [
        "qwefp" + "yuio;",
        "asdtg" + "hnklr",
        "zxcvb" + "jm,./",
    ]
}

export const quipperMapping = {
    name: "Quipper aka Qwpr",
    techName: "Qwpr",
    sourceUrl: "https://sourceforge.net/p/qwpr/wiki/Home/",
    description: "By placing 'e' on the right pinky, this mapping avoids a lot of bigram conflicts, " +
        "since no other letter is on that finger. ",
    mapping30: [
        "qwprf" + "yukl;",
        "asdtg" + "hnioe",
        "zxcvb" + "jm,./",
    ]
}

export const thumbyZero = {
    name: "Thumby Zero",
    description: "Simply puts E on the best key of the board and rescues B from the worst key of the board. ",
    mappingThumb30: [
        "qwbrt" + "y" + "uiop",
        "asdfg" + "hjkl;",
        "zxcv" + "-" + "nm,.",
        "e",
    ],
    mappingAnsi: [
        "=\\",
        "qwbrt" + "yuiop[]",
        "asdfg" + "hjkl;'",
        "zxcv-" + "nm,./",
        "e⌥",
    ],
}

export const thumbyNero = {
    name: "Thumby Nero",
    description: "This is like Thumby Zero, a minimal dip into Thumby-land, but this time only containing the NJ swap. " +
        "This makes it possible to try out using just ordinary KLC layouts, no other tools or manual registry changes required. " +
        "I think that this swap is the most effective single change to Qwerty, because it also improves all the bigrams " +
        "between N and the upper row right hand vowels (UIO) as well as nk/kn. ",
    mapping30: [
        "qwert" + "yuiop",
        "asdfg" + "hnkl;",
        "zxcvb" + "jm,./",
    ],
}

export const thumbyEntry = {
    name: "Thumby Entry (or EN-try!)",
    description: "Combines Thumby Zero + Nero to fix Qwerty's two biggest flaws. " +
        "Additionally provides synergy, because the common EN/NE bigrams don't require you to pinch your hand. ",
    // Writing upper and lower row as three strings emphasizes the center columns of the Harmonic and ANSI keyboards.
    // On Ortho and Harmonic Narrow, it will just be 5 + 5 on each side.
    mappingThumb30: [
        "qwbrt" + "y" + "uiop",
        "asdfg" + "hnkl;",
        "zxcv" + "-" + "jm,.",
        "e",
    ],
    // TODO: we should provide this as ANSI full mapping to minimize insignificant differences in punctuation and modifier keys.
}

export const thumbyNine = {
    name: "Thumby Nine",
    description: "Puts the nine most frequent letters of English into home key positions, " +
        "keeping most of them on the same finger. " +
        "When using the \"ANSI wide\" home position, you suddenly realize how easy it becomes " +
        "for your thumb to hit the key to the right of the space bar. " +
        "Thus is born the idea of adding a nineth home key, which changes everything. " +
        "Notably it leads to a ring swap EDRFTB at the end of which one more character can be inserted onto the main area of the keyboard. " +
        "Note that R shows as a changed finger, but probably most people already type R with their middle finger " +
        "when typing the RT bigram on Qwerty. " +
        "The remaining swaps in the layout are the same as in other casual mappings. " +
        "With its few differences to Norman, it could be a great upgrade for anyone currently using Norman. " +
        "We could even call it  \"Norman-Nine\". ",
    // Note that the full mappings below might not be consistent with this. We'll deal with that later.
    mappingThumb30: [
        "qwdfb" + "-" + "uklp",
        "asrtg" + "ynioh",
        "zxcv" + ";" + "jm,.",
        "e",
    ],

    // I would move - to the core board instead of =, but since this mapping is meant to show the lowest-practical Qwerty-diff
    // for any Thumby-variant, we leave - unmoved.
    // We could make achieve an even lower learning diff by leaving D on the home row (it's the 10th most frequent letter).
    // That's basically what Thumby Bilingual is doing!
    // TODO: consider swapping ; and J to have all punctuation in the bottom row.
    mappingAnsi: [
        "-=",
        "qwdfb" + "y" + "uklp[]",
        "asrtg" + ";nioh'",
        "zxcv" + "\\" + "jm,./",
        "e⌥",
    ],
    ansiMovedColumns: [4, 5, 5, 4],

    mappingSplitOrtho: [
        "",
        "qwdfb" + "yuklp-",
        "asrtg" + "=nioh'",
        "zxcv;" + "jm,./",
        "⇤\\e⇥",
    ],

    // this additionally swaps JY; because the Harmonic qwerty Y position is further away from the index finger's home.
    mappingHarmonic13wide: [
        "[]",
        "wdfb" + "-=" + "uklp",
        "qasrtg" + ";" + "jnioh'",
        "zxcv" + "\\/" + "ym,.",
        "`e",
    ],
    mappingHarmonic14: [
        "`",
        "qwdfb" + "-=" + "uklp'\\",
        "asrtg" + ";" + "jnioh",
        "zxcv" + "[]" + "ym,.",
        "⌦e/",
    ],
}

export const thumby9ku = {
    name: "Thumby Nine-KU",
    description: "Adding the K-U swap to Thumby Nine not only makes the relatively frequent U easier to type, " +
        "but also removes the same-finger conflict of the UN bigram. ",
    // Note that the full mappings below might not be consistent with this. We'll deal with that later.
    mappingThumb30: [
        "qwdfb" + "ykulp",
        "asrtg" + "-nioh",
        "zxcv;" + "jm,.",
        "e",
    ],

    mappingAnsi: [
        "⇤⇥",
        "qwdfg" + "=" + "kulp-\\",
        "asrtb" + "ynioh'",
        "zxcv" + ";" + "jm,./",
        "e⌥",
    ],
    ansiMovedColumns: [4, 6, 5, 4],
    mappingHarmonic13wide: [
        "⇞⇟",
        "wdfg" + "-=" + "kulp",
        "qasrtb" + ";" + "ynioh'",
        "zxcv" + "⇤⇥" + "jm,.",
        "/e",
    ],
    mappingHarmonic14: [
        "=",
        "qwdfg" + "-'" + "kulp⇞⇟",
        "asrtb" + ";" + "jnioh",
        "zxcv" + "⇤⇥" + "ym,.",
        "⌦e/",
    ],
    mappingSplitOrtho: [
        "",
        "qwdfb" + "ykulp-",
        "asrtg" + ";nioh'",
        "zxcv=" + "jm,./",
        "⇤\\e⇥",
    ],
}

export const thumbyBilingual = {
    name: "Thumby Bilingual",
    description: "German and English have very similar letter frequencies. " +
        "I am writing a lot in both languages, and so I optimized for both. " +
        "The result is Thumby Nine, but without the OL swap. " +
        "Since L in German is much more frequenty than O, we can just leave both in the Qwerty position and there by make it easier to learn and switch. ",
    mappingThumb30: [
        "qwdfb" + "y" + "kuop",
        "asrtg" + "-nilh",
        "zxcv" + ";" + "jm,.",
        "e",
    ]
}

/*  Port of my personal German layout.
    Note that this supposes a mixed German/ANSI shift-pairing with notably `;:` mapped on `,.` and `=` on `0`.
    Other Shift-mappings can vary, as well as the AltGr mappings, although it seems wise to swap Cmd/AltGr keys because
    most of the German AltGr mappings are on the right hand. This way, we can actually move all of them to the right hand
    (maybe with some compatibility alternatives like @ and € staying on the left as a second/alternative mapping), and thus
    we'd only need one exclusive AltGr key. (A secondary AltGr could be tap/hold on `+` which is rare enough not to lead to
    confusion. Similarly, a secondary tap/hold Fn on the Esc key. This would be so much better than my overloadings of `öy-`
    on the Iris at the moment.)
 */
export const gemuetlichesMapping = {
    name: "Die Gemütliche Tastatur",
    description: "This is basically Thumby Min, but applied to the German Qwertz mapping as a base. ",
    sourceUrl: "https://github.com/matey-jack/gemuetliche-tastatur",
    sourceLinkTitle: "GitHub: matey-jack/gemuetliche-tastatur",

    // I actually used this layout on an ISO keyboard, so the right pinky keys are a bit different!
    mappingAnsi: [
        "ß´",
        "qwbfö" + "zkuopüä",
        "asdrg" + "hnilt'",
        "yxcv/" + "jm,.-",
        "e⌥"
    ],

    mappingSplitOrtho: [
        "",
        "qwbf'" + "zkuopü",
        "asdrg" + "hniltä",
        "yxcv/" + "jm,.-",
        "ö⌦" + "e+"
    ],

    // TODO: We could define a "base for diffing" field here that contains the default German Qwertz mapping.
    //       Then the diff counts should be correct. (We'll have to contort it to ANSI though, because this app will not implement ISO.)
    /*
         The Harmonic port of this layout changes less than Qwerty, because it is already made for a wide home position.
         Changed chars are üzj+
         ü sends away + because there is one less physical key on the upper row.
         J and - simply swap places, both keep their finger and direction assignment.
         (Alternatively swap also Q and J to improve the positioning for frequency.)
         Finally, with `Z` I am not completely sure: it's still a bit awkward to think about this "new" left off-home position
         although the symmetric position on the right has always been a character key in ANSI, even a letter in German.
         TODO: align those layouts with modifications made on Thumby. In particular the Q overspill to the home row.
     */
    mappingHarmonic13wide: [
        "´ß",
        "qwbf" + "öü" + "kuop",
        "zasdrg" + "'" + "hniltä",
        "yxcv" + "/-" + "jm,.",
        "+e"
    ],
    mappingHarmonic14: [
        "ß",
        "qwbfö" + "´ä" + "zkuopü",
        "asdrg" + "'" + "hnilt",
        "yxcv" + "/-" + "jm,.",
        "\\e+"
    ],
}

export const allMappings: FlexMapping[] = [
    qwertyMapping,
    qwertzMapping,
    colemakMapping,
    normanMapping,
    minimak4Mapping,
    minimak8Mapping,
    minimakFullMapping,
    qwertyFlipTwistMapping,
    qwertyFlipTwistSpinMapping,
    etniMapping,
    quipperMapping,
    thumbyZero,
    thumbyNero,
    thumbyEntry,
    thumbyNine,
    thumby9ku,
    thumbyBilingual,
    gemuetlichesMapping,
]
