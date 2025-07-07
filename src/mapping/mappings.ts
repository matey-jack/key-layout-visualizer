/*
    Most letter mapping discussions on the Internet talk only about mapping of the 26 letters and sometimes also the four
    punctuation keys that on the ANSI/Qwerty layout/mapping fall into the central 3×10 field of the keyboard.
    Such a restricted mapping has the advantage that it maps to different (physical) keyboard layouts that don't have
    equivalents for all the ANSI keys.
 */

import {FlexMapping} from "../base-model.ts";

export const qwertyMapping: FlexMapping = {
    name: "Qwerty",
    description: "This ancient typewriter-born key mapping is so ubiquitous today that many people might never have seen a different mapping in their whole life. " +
        "At the same time it is also extra-ordinary bad for touch-typing, because frequently used letters are not in the center.",
    sourceUrl: "https://en.wikipedia.org/wiki/QWERTY",
    mapping30: [
        "qwert" + "yuiop",
        "asdfg" + "hjkl;",
        "zxcvb" + "nm,./",
    ]
}

export const colemakMapping: FlexMapping = {
    name: "Colemak",
    description: "Released in the year 2006, the Colemak layout started a new world-wide interest in better letter mappings. " +
        "It also pioneered the idea of leaving some crucial-for-shortcuts keys in their place. ",
    sourceUrl: "https://en.wikipedia.org/wiki/QWERTY",
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
    sourceUrl: "https://github.com/binaryphile/www.minimak.org/blob/master/media/minimak_4_key.png",
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
    name: "Minimak 8-key",
    sourceUrl: "https://github.com/binaryphile/www.minimak.org/blob/master/media/minimak_8_key.png",
    description: minimak4Mapping.description,
    mapping30: [
        "qwdrk" + "yuilp",
        "astfg" + "hneo;",
        "zxcvb" + "jm,./",
    ]
}

export const minimakFullMapping = {
    name: "Minimak Full (12-key)",
    sourceUrl: "https://github.com/binaryphile/www.minimak.org/blob/master/media/minimak.png",
    description: minimak4Mapping.description,
    mapping30: [
        "qwdfk" + "yuil;",
        "astrg" + "hneop",
        "zxcvb" + "jm,./",
    ]
}

// I omit the plain "flip" version, because I think that the JN swap is essential.
// Nobody should waste time with a UN swap!
export const qwertyFlipTwistMapping = {
    name: "Qwerty Flip/Twist",
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
    sourceUrl: "https://sourceforge.net/p/qwpr/wiki/Home/",
    description: "By placing 'e' on the right pinky, this mapping avoids a lot of bigram conflicts, " +
        "since no other letter is on that finger. ",
    mapping30: [
        "qwprf" + "yukl;",
        "asdtg" + "hnioe",
        "zxcvb" + "jm,./",
    ]
}

export const cozyMapping = {
    name: "The Cozy Keyboard",
    description: "Based on my daily use of a similar mapping for the German language. " +
        "It's meant to work with the \"wide\" version of the ANSI keyboard or a split ortho keyboard. " +
        "Using the thumb for typing E is very unconventional, but works great in practice. " +
        "This is the way to actually have 9 home keys and thus avoid having to move around more letters to make room. " +
        "Note that when counting only changed letters, it's stats are 7/3/2, which is less than Norman's 10/2/2 and Flip/Twist's 13/0/0.",
    sourceUrl: "https://github.com/matey-jack/gemuetliche-tastatur",

    // The current model doesn't let us remap keys with labels longer than one character.
    // Therefore, I am using ⌥ for AltGr.
    // Note that this is written for classic Ansi hand home position.
    // But it transposes correctly to the wide layout and this is how I recommend using it.
    // While it looks like = changed position, the change actually serves to keep it on the same finger in the wide layout,
    // instead of spilling over to the middle column.
    mappingAnsi: [
        "=\\",
        "qwbf" + "-y" + "kulp[]",
        "asdrg" + "hniot'",
        "zxcv" + ";" + "jm,./",
        "e⌥"
    ],

    // maybe a bit superficial, just to have the brackets appear in the 'right' order. ;-)
    ansiMovedColumns: [5, 5, 5, 4],

    // This is just as hypothetic as the entire concept for a Harmonic keyboard.
    // I didn't spend too much time on this... and won't until I actually build such a keyboard one day.
    mappingHarmonic14: [
        "=",
        "qwbf;" + "[]" + "jkulp'",
        "asdrg" + "`" + "hniot",
        "zxcv" + "-/" + "ym,.",
        "\\e"
    ],

    // Bottom left thumb key could alternatively be used for Delete, as on my Iris. And [] as Home/End keys.
    // (But adding PgUp/PgDn would mean more refactoring and a more complicated AltGr layer.)
    mappingHarmonic13c: [
        "[]",
        "qwbf" + ";j" + "kulp",
        "-asdrg" + "`" + "hniot'",
        "zxcv" + "=/" + "ym,.",
        "\\e"
    ],

    mappingSplitOrtho: [
        "",
        "qwbf-" + "ykulp\\",
        "asdrg" + "hniot'",
        "zxcv;" + "jm,./",
        "⇤⇥e`"
    ],
    /*
        Alternative to mapping [], we can have Home/End, PgUp/PgDn, or Copy/Paste.
        Unicode symbols, just in case.
        Copy: 🗐, ⎘
        Paste: 📋
        Cut: ✂(✂️), ✄, ✀
     */
}

export const cozyPlusMapping = {
    name: "Cozy Plus",
    description: "Hypothetical Cozy variant with easier typing at the expense of more learning. " +
        "Inspired by the Norman layout, but adding the thumb-E. ",
    sourceUrl: "https://github.com/matey-jack/gemuetliche-tastatur",

    // We could have "Cozy Clean" which swaps `-` and `y` to have all punctuation in the bottom row,
    // but it doesn't improve ease of typing and requires `y` to be trained on a different finger.
    mappingAnsi: [
        "=\\",
        "qwbf-" + "j" + "hklp[]",
        "asdrg" + "uniot'",
        "zxcv" + ";" + "ym,./",
        "e⌥"
    ],
    ansiMovedColumns: [5, 5, 5, 4],
};

export const thumbyMin = {
    name: "Thumby Min",
    description: "Draft of casual mapping with a thumb key. Improves high-frequency letter positions. " +
        "When using the \"ANSI wide\" home position, you suddenly realize how easy it becomes " +
        "for your thumb to hit the key to the right of the space bar. " +
        "Thus is born the idea of adding a nineth home key, which changes everything. " +
        "Notably it leads to a ring swap EDRFTB at the end of which one more character can be inserted onto the main area of the keyboard. " +
        "Note that R shows as a changed finger, but probably most people already type R with their middle finger " +
        "when typing the RT bigram on Qwerty. " +
        "The remaining swaps in the layout are the same as in other casual mappings. " +
        "Only Norman also places H on the home row, but Thumby practically has to do that " +
        "because it can place all the nine most frequent letters there. " +
        "Thus, Thumby could be called \"Norman-Nine\". " +
        "With its few differences to Norman, it could be a great upgrade for anyone currently using Norman. ",

    // I would move - to the core board instead of =, but since this mapping is meant to show the lowest-practical Qwerty-diff
    // for any Thumby-variant, we leave - unmoved.
    // We could make achieve an even lower learning diff by leaving D on the home row (it's the 10th most frequent letter).
    // That's basically what Thumby Bilingual is doing!
    mappingAnsi: [
        "-=",
        "qwdfb" + "y" + "uklp[]",
        "asrtg" + ";nioh'",
        "zxcv" + "\\" + "jm,./",
        "e⌥",
    ],
    ansiMovedColumns: [4, 5, 5, 4],
    mappingHarmonic13c: [
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
    mappingSplitOrtho: [
        "",
        "qwdfb" + "yuklp-",
        "asrtg" + ";nioh'",
        "zxcv=" + "jm,./",
        "⇤\\e⇥",
    ],
}

export const thumbyPlus = {
    name: "Thumby Plus",
    description: "Draft of casual mapping with a thumb key. " +
        "Additionally improves the medium-frequency letter positions G, U, and Y. " +
        "Feel free to call it Thumby-GUY. " +
        "Note that to compensate for the Harmonic and Ortho layout differences, it's closer to Thumby Min on those layouts. " +
        "If you like customizations, some other variants can be created by combining Thumby Min and Plus. ",
    mappingAnsi: [
        "⇤⇥",
        "qwdfg" + "=" + "kulp-\\",
        "asrtb" + "ynioh'",
        "zxcv" + ";" + "jm,./",
        "e⌥",
    ],
    ansiMovedColumns: [4, 6, 5, 4],
    mappingHarmonic13c: [
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
    description: "Only changes letters that have similar frequency in German and English. " +
        "In particular, letters D and L have high-enough frequency in German to stay on the home row. " +
        "Thus, we are changing less letters in total. " +
        "Note that the Learnability score is high because of the changed position of ';', " +
        "but as a second-tier punctuation character this is much easier to get used to. ",
    mappingAnsi: [
        "⇤⇥",
        "qwbf=" + "ykuop-\\",
        "asdrg" + "hnilt'",
        "zxcv" + ";" + "jm,./",
        "e⌥",
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

    With the recent experience, I can imagine a "plus" version of this, which also improves G and H positions by swapping
    with (new) B and K. Since the latter are changing anyway, the learning is only half as much.
 */
export const gemuetlichesMapping = {
    name: "Die Gemütliche Tastatur",
    description: "This is basically Thumby Min, but applied to the German Qwertz mapping as a base. ",
    sourceUrl: "https://github.com/matey-jack/gemuetliche-tastatur",

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
    mappingHarmonic13c: [
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
    colemakMapping,
    normanMapping,
    minimak4Mapping,
    minimak8Mapping,
    minimakFullMapping,
    qwertyFlipTwistMapping,
    qwertyFlipTwistSpinMapping,
    etniMapping,
    quipperMapping,
    // cozyMapping,
    // cozyPlusMapping,
    thumbyMin,
    thumbyPlus,
    thumbyBilingual,
    gemuetlichesMapping,
]



// Colemak changes 17 keys, many without good reason, which is not at all casual.
// Which is why it's omitted for now.
// But being so popular, I know it will creep up some day :-D

