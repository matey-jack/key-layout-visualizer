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

    White space and other keyboard specials: ⍽ ↵ ↹ ⎋ ⇧ ⇪ ⌫ ⌦ 🖰
    Navigation keys: ↑ ↓ ← → ⇤ ⇥ ⇞ ⇟ ↞ ↠ ⇱ ⇲

    Useful printable characters: € $ ¢ £ ¥ µ × – ¿ ¡ § % ‰

    Some characters are treated specially, see mergeMapping() for details!

 */

import {FlexMapping} from "../base-model.ts";

export const qwertyMapping: FlexMapping = {
    name: "Qwerty – US and world-wide standard",
    techName: "QWERTY",
    description: `This ancient typewriter-born key mapping is so ubiquitous today that many people might never have seen 
    a different mapping in their whole life. At the same time it is also extra-ordinary bad for touch-typing, 
    because frequently used letters are not in the center. `,
    sourceUrl: "https://en.wikipedia.org/wiki/QWERTY",
    mapping30: [
        "qwert" + "yuiop",
        "asdfg" + "hjkl;",
        "zxcvb" + "nm,./",
    ],
    // Keep the \| and J keys in place because of different shape and because F and J key caps often cannot be swapped
    // on the physical keyboard.
    // We also pair [] and +- vertically and close, instead of horizontally and split,
    // which brings the frequently used hyphen into a better position.
    // A lot of muscle memory is preserved because + and - stay on the same finger and in the same direction of movement.
    mappingAnsiWide: [
        "[=",
        "qwert" + "]" + "yuiop-\\",
        "asdfg" + ";" + "jnkl'",
        "zxcvb" + "/" + "hm,.",
        "⌥≡",
    ],
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
        "yxcvb" + "nm,.-",   // and <> on the ISO key here
        "⌥≡"
    ],
    mappingAnsiWide: [
        "´ß",
        "qwert" + "+" + "zuiopüä",
        "asdfg" + "#hjklö",  // there is ä on the ISO key here
        "yxcvb" + "-nm,.",   // and <> on the ISO key here
        "⌥≡"
    ],
    // We have one less key above the bottom on the Harmonic 14T than on ANSI, and one taken up by Escape,
    // but we have two character keys in the bottom, so it checks out to 100% coverage!
    mappingHarmonic14t: [
        "ß",
        "qwert" + "+z" + "uiopüä",
        "asdfg" + "#" + "hjklö",
        "yxcvb" + "-" + "nm,.",
        "^⌥´≡"
    ]
}

export const colemakMapping: FlexMapping = {
    name: "Colemak",
    description: "Released in the year 2006, the Colemak layout started a new world-wide interest in better letter mappings. " +
        "It also pioneered the idea of leaving some crucial-for-shortcuts keys in their place. " +
        "Colemak places a strong emphasis on avoiding single-finger bigram conflicts at the cost of many letters changing fingers. ",
    sourceUrl: "https://colemak.com/",
    mapping30: [
        "qwfpg" + "jluy;",
        "arstd" + "hneio",
        "zxcvb" + "km,./",
    ],

    // This is the first published version of any wide mapping that I know of.
    // It originated the idea of flipping the right-hand column of symbols to the center.
    mappingAnsiWide: [
        "=-",
        "qwfpg" + "[" + "jluy;'\\",
        "arstd" + "]" + "hneio",
        "zxcvb" + "/" + "km,.",
        "⌥≡"
    ],
}

export const colemakDhMapping: FlexMapping = {
    name: "Colemak DH",
    description: "A 2014 variant of Colemak that places the letters D and H in better positions. " +
        "Apparently the original Colemak assumed that the \"home row\" is the easiest to type in any position, " +
        "but actually fingers move up and down more easily than left and right. " +
        "Thus Colemak-DH puts less frequently used keys in the center column. " +
        "(Note that the Colemak-DH authors prefer the ISO keyboard to achieve better staggering in the bottom row. " +
        "That idea is valid, but the resulting tiny and much further away shift key is a no-go for me. " +
        "Shown here is the version for the ANSI keyboard which additionally moves Z to the middle column.) ",
    sourceUrl: "https://colemakmods.github.io/mod-dh/",
    mapping30: [
        "qwfpb" + "jluy;",
        "arstg" + "mneio",
        "xcdvz" + "kh,./",
    ],

    mappingAnsiWide: [
        "=-",
        "qwfpb" + "[" + "jluy;'\\",
        "arstg" + "]" + "mneio",
        "xcdvz" + "/" + "kh,.",
        "⌥≡"
    ],

    // Due to Angle Mod, the Ortho version has a flip: https://colemakmods.github.io/mod-dh/keyboards.html
    mappingSplitOrtho: [
        "",
        "qwfpb" + "jluy;-",
        "arstg" + "mneio'",
        "zxcdv" + "kh,./",
        "⇤\\=⇥",
    ]
}

export const colemakThumbyDMapping: FlexMapping = {
    name: "Colemak Thumby D",
    description: "Colemak with E on the thumb key and D taking E's home position. " +
        "I like this variant the most, because it combines low typing effort with the lowest diff to Qwerty. " +
        "(It' s fun to see how it undoes a lot of the shuffling which Colemak-DH introduced.) ",
    sourceUrl: "https://colemak.com/",
    mappingThumb30: [
        "qwfpg" + "jluy;",
        "arst-" + "mndio",
        "zxcvb" + "kh,.",
        "e"
    ]
}

export const colemakThumbyHMapping: FlexMapping = {
    name: "Colemak Thumby H",
    description: `Slightly modified version of Colemak-DH that places E on the thumb key and H on an actual home key. 
    Unlike Thumby Zero, there is no need to rescue the letter from "the worst position of the board", 
    because Colemak already places a very rare letter there. 
    TODO: make a custom version of this for the Harmonic 13 MidShift, because that's the only board to properly represent the angle mod. 
    And a custom version for ortho, same reason.`,
    // comparisonBase: colemakDhMapping,
    mappingThumb30: [
        "qwfpb" + "jluy;",
        "arstg" + "-nhio",
        "xcdvz" + "km,.",
        "e"
    ]
}

export const colemakThumbyNMapping: FlexMapping = {
    name: "Colemak Thumby N",
    description: `Slightly modified version of Colemak-DH that places E on the thumb key and H on an actual home key. 
    Since N is more frequent than H, we move N to the middle finger where it causes less bigram conflicts.  
    TODO: make a custom version of this for the Harmonic 13 MidShift, because that's the only board to properly represent the angle mod. 
    And a custom version for ortho, same reason.`,
    // comparisonBase: colemakDhMapping,
    mappingThumb30: [
        "qwfpb" + "jlyu;",
        "arstg" + "-hnio",
        "xcdvz" + "km,.",
        "e"
    ]
}

export const colemakThumbyLMapping: FlexMapping = {
    name: "Colemak Thumby L",
    description: `Just a test to compare metrics. Turns out that moving L to the home row does not cause less bigram conflicts. `,
    // It's worse than Thumby-H, so we don't show it in the app :D
    // comparisonBase: colemakDhMapping,
    mappingThumb30: [
        "qwfpb" + "j-uy;",
        "arstg" + "mnlio",
        "xcdvz" + "kh,.",
        "e"
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
    // TODO: provide separate Ansi wide variant that can include some slight punctuation improvements.
    mappingAnsi: [
        "=\\",
        "qwbrt" + "yuiop[]_",
        "asdfg" + "hjkl;'",
        "zxcv-" + "nm,./",
        "e⌥",
    ],
}

export const thumbyNero: FlexMapping = {
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

export const thumbyEntry: FlexMapping = {
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
    // TODO: maybe provide this as ANSI full mapping to minimize insignificant differences in punctuation and modifier keys.
}

export const thumbyNine: FlexMapping = {
    name: "Thumby Nine",
    description: "Puts the nine most frequent letters of English into home key positions, " +
        "keeping most of them on the same finger. " +
        "When using the \"ANSI wide\" home position, you suddenly realize how easy it becomes " +
        "for your thumb to hit the key to the right of the space bar. " +
        "Thus is born the idea of adding a ninth home key, which changes everything. " +
        "Notably it leads to a ring swap EDRFTB at the end of which one more character can be inserted onto the main area of the keyboard. " +
        "Note that R shows as a changed finger, but probably most people already type R with their middle finger " +
        "when typing the RT bigram on Qwerty. " +
        "The remaining swaps in the layout are the same as in other casual mappings. " +
        "With its few differences to Norman, it could be a great upgrade for anyone currently using Norman. " +
        "We could even call it \"Norman-Nine\". ",
    mappingThumb30: [
        "qwdfb" + "y" + "uklp",
        "asrtg" + "-nioh",
        "zxcv" + ";" + "jm,.",
        "e",
    ],
    mappingAnsiWide: [
        "=\\",
        "qwdfb" + "-y" + "uklp'",
        "asrtg" + "/;nioh",
        "zxcv" + "[]" + "jm,.",
        "e⌥",
    ],
    mappingSplitOrtho: [
        "",
        "qwdfb" + "y" + "uklp=",
        "asrtg" + "-nioh'",
        "zxcv" + ";" + "jm,./",
        "⇤\\e⇥",
    ],
    mappingHarmonic13wide: [
        "[]",
        "wdfb" + "-=" + "uklp",
        "qasrtg" + ";" + "jnioh'",
        "zxcv" + "\\/" + "ym,.",
        "`e",
    ],
    mappingHarmonic14t: [
        "`",
        "qwdfb" + "-=" + "uklp'\\",
        "asrtg" + ";" + "jnioh",
        "zxcv" + "[]" + "ym,.",
        "/e⌥≡",
    ],
}

export const thumbyLeft: FlexMapping = {
    name: "Thumby Left",
    description: `This is Thumby Nine, but the left thumb types the letter E. 
    On the ancient ANSI keyboard, it's weird to use the space bar for a letter, 
    but on any modern Ortholinear or harmonically staggered keyboard, left and right are equally usable. 
    And Thumby Left uses this symmetry to provide a highly performant layout where all the letters 
    are on the same hand as in Qwerty. 
    (Unlike shown on the keyboard above, the space bar should be on the other thumb.) `,
    mappingSplitOrtho: [
        "",
        "qwdfb" + "yuklp-",
        "asrtg" + "=nioh'",
        "zxcv;" + "jm,./",
        "⇤e\\⇥",
    ],
    mappingHarmonic13wide: [
        "[]",
        "wdfb" + "-=" + "uklp",
        "qasrtg" + ";" + "jnioh'",
        "zxcv" + "\\/" + "ym,.",
        "e`",
    ],
    // TODO: add a flex slot for the space bar on ANSI?
}

export const thumby9t = {
    name: "Thumby Nine-T",
    description: "Swapping the order of RT (from Qwerty) to TR improves the RD and RT bigrams, " +
        "but brings new problems with RF, RB, RG, and CT.",
    mappingThumb30: [
        "qwdfb" + "y" + "kulp",
        "astrg" + "-nioh",
        "zxcv" + ";" + "jm,.",
        "e",
    ],
};

export const thumby9u = {
    name: "Thumby Nine-U",
    description: "Instead of swapping UK to improve the UN bigram, we swap UY. " +
        "This is a same-finger swap generally, but allows alt-fingering the UN bigram. ",
    mappingThumb30: [
        "qwdfb" + "u" + "yklp",
        "asrtg" + "-nioh",
        "zxcv" + ";" + "jm,.",
        "e",
    ],
};

export const thumby9ku: FlexMapping = {
    name: "Thumby Nine-KU",
    description: "Adding the K-U swap to Thumby Nine not only makes the relatively frequent U easier to type, " +
        "but also removes the same-finger conflict of the UN bigram and the KI bigram. ",
    // Note that the full mappings below might not be consistent with this. We'll deal with that later.
    mappingThumb30: [
        "qwdfb" + "ykulp",
        "asrtg" + ";nioh",
        "zxcv-" + "jm,.",
        "e",
    ],

    mappingAnsiWide: [
        "[`",
        "qwdfb" + "]y" + "kulp'\\",
        "asrtg" + "=" + ";nioh",
        "zxcv" + "-/" + "jm,.",
        "e⌥",
    ],

    // The following are unrelated to the Thumby variant; just brainstorming some ideas about better use of keys for navigation instead of tech punctuation.
    mappingHarmonic13wide: [
        "⇞⇟",
        "wdfb" + "-=" + "kulp",
        "qasrtg" + ";" + "ynioh'",
        "zxcv" + "⇤⇥" + "jm,.",
        "/e",
    ],
    mappingHarmonic14t: [
        "=",
        "qwdfb" + "-'" + "kulp⇞⇟",
        "asrtg" + ";" + "jnioh",
        "zxcv" + "⇤⇥" + "ym,.",
        "/e⌥≡",
    ],
    mappingSplitOrtho: [
        "",
        "qwdfb" + "ykulp-",
        "asrtg" + ";nioh'",
        "zxcv=" + "jm,./",
        "⇤\\e⇥",
    ],
}

export const thumby9rst: FlexMapping = {
    name: "Thumby Nine-RST",
    description: "Thumby's DR conflict is especially painful for Qwerty users, so we sacrifice the otherwise unchanged position of S to improve this. " +
        "(And yep, somewhat ironically, we obtain Colemak' s left-hand home row.) ",
    mappingThumb30: [
        "qwdfb" + "ykulp",
        "arstg" + ";nioh",
        "zxcv-" + "jm,.",
        "e",
    ],
};

export const thumby9kul = {
    name: "Thumby Nine-KU-L",
    description: "One more finger swap to remove the strong ol/lo bigram conflict. " +
        "I wouldn't want to actually use this, so it's just there to show the improvement in bigram scores. ",
    mappingThumb30: [
        "qwdfb" + "yku-p",
        "asrtg" + "lnioh",
        "zxcv;" + "jm,.",
        "e",
    ],
}

export const thumbyBilingual = {
    name: "Thumby Bilingual",
    description: "German and English have very similar letter frequencies. " +
        "I am writing a lot in both languages, and so I optimized for both. " +
        "The result is Thumby Nine, but without the OL swap. " +
        "Since L in German is much more frequent than O, we can just leave both " +
        "in the Qwerty position and there by make it easier to learn and switch. ",
    mappingThumb30: [
        "qwdfb" + "y" + "kuop",
        "asrtg" + "-nilh",
        "zxcv" + ";" + "jm,.",
        "e",
    ]
}

export const thumbyOldBilingual = {
    name: "Legacy Thumby Bilingual",
    description: `Since D is almost as frequent as H, this layout minimizes the difference to Qwerty, 
        by keeping D on the home row. It has several disadvantages compared with Thumby Bilingual: 
        first, it breaks apart the frequent RT bigram that Qwerty users roll all the time. 
        Second, it keeps H in worse position than D gets in Thumby.
        And third, T has to move hands, which is a bigger learning effort than D moving up on the same finger. `,
    mappingThumb30: [
        "qwbf;" + "y" + "kuop",
        "asdrg" + "hnilt",
        "zxcv" + "-" + "jm,.",
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
    comparisonBase: qwertzMapping,

    // I actually used this layout on an ISO keyboard, so the right pinky keys are a bit different!
    mappingAnsiWide: [
        "´ß",
        "qwbfö" + "+zkuopüä",
        "asdrg" + "'hnilt",
        "yxcv/" + "-jm,.",
        "e⌥"
    ],

    mappingAnsi: [
        "´ß",
        "qwbfö" + "zkuopü+'",
        "asdrg" + "hniltä",
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
    // qwertzMapping,
    colemakMapping,
    colemakDhMapping,
    colemakThumbyDMapping,
    colemakThumbyHMapping,
    colemakThumbyLMapping,
    colemakThumbyNMapping,
    normanMapping,
    // minimak4Mapping,
    // minimak8Mapping,
    minimakFullMapping,
    // qwertyFlipTwistMapping,
    qwertyFlipTwistSpinMapping,
    // etniMapping,
    // quipperMapping,
    // thumbyZero,
    // thumbyNero,
    // thumbyEntry,
    thumbyNine,
    thumbyLeft,
    thumby9ku,
    thumby9rst,
    thumby9u,
    thumby9kul,
    thumby9t,
    thumbyBilingual,
    thumbyOldBilingual,
    // gemuetlichesMapping,
]
