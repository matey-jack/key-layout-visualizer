/*
    Most letter mapping discussions on the Internet talk only about mapping of the 26 letters and sometimes also the four
    punctuation keys that on the ANSI/Qwerty layout/mapping fall into the central 3×10 field of the keyboard.
    Such a restricted mapping has the advantage that it maps to different (physical) keyboard layouts that don't have
    equivalents for all the ANSI keys.
 */

import {FlexMapping} from "./mapping-model.ts";

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

export const normanMapping = {
    name: "Norman",
    sourceUrl: "https://normanlayout.info/index.html",
    description: "Norman has the heaviest focus on minimizing finger movement among all the mappings in this comparison. " +
        "However, at the time of its creation, the notion of minimizing learning effort was still new and Norman did a great job of balancing the two. ",

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
        "⌥asdrg" + "hniot'",
        "zxcv" + ";" + "jm,./",
        "e⌥"
    ],

    ansiMovedColumns: [5, 5, 5, 4],

    // This is just as hypothetic as the entire concept for a Harmonic keyboard.
    // I didn't spend too much time on this... and won't until I actually build such a keyboard one day.
    // Bottom left thumb key could alternatively be used for Delete, as on my Iris. And [] as Home/End keys.
    // (But adding PgUp/PgDn would mean more refactoring and a more complicated AltGr layer.)
    mappingHarmonic: [
        "[]",
        "qwbf" + ";j" + "kulp",
        "-asdrg" + "`" + "hniot'",
        "zxcv" + "=/" + "ym,.",
        "\\e"
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
    // but it doesn't improve ease of typing and has requires `y` to be trained on a different finger.
    mappingAnsi: [
        "=\\",
        "qwbf-" + "j" + "hulp[]",
        "⌥asdrg" + "kniot'",
        "zxcv" + ";" + "ym,./",
        "e⌥"
    ],
};

/* Port of my personal German layout. It changes less than Qwerty, because it is already made for a wide home position.
     Changed chars are üzj+
     ü sends away + because there is one less physical key on the upper row.
     J and - simply swap places, both keep their finger and direction assignment.
     (Alternatively swap also Q and J to improve the positioning for frequency.)
     Finally, with `Z` I am not completely sure: it's still a bit awkward to think about this "new" left off-home position
     although the symmetric position on the right has always been a character key in ANSI, even a letter in German.

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
    description: "A few letter swaps and a thumb E. I used the ANSI version of this for more than ten years daily. " +
        "Currently using the Ortho version on my Iris CE.",
    sourceUrl: "https://github.com/matey-jack/gemuetliche-tastatur",

    // I actually used this layout on an ISO keyboard, so the right pinky keys are a bit different!
    mappingAnsi: [
        "ß´",
        "qwbfö" + "zkuopü+ä",
        "⌥asdrg" + "hnilt'",
        "yxcv/" + "jm,.-",
        "e⌥"
    ],
    // TODO: We could define a "base for diffing" field here that contains the default German Qwertz mapping.
    //       Then the diff counts should be correct. (We'll have to contort it to ANSI though, because this app will not implement ISO.)
    mappingHarmonic: [
        "´ß",
        "qwbf" + "öü" + "kuop",
        "zasdrg" + "'" + "hniltä",
        "yxcv" + "/j" + "-m,.",
        "+e"
    ],
}

export const allMappings: FlexMapping[] = [
    qwertyMapping,
    normanMapping,
    minimak4Mapping,
    minimak8Mapping,
    minimakFullMapping,
    qwertyFlipTwistMapping,
    qwertyFlipTwistSpinMapping,
    etniMapping,
    quipperMapping,
    cozyMapping,
    cozyPlusMapping,
    gemuetlichesMapping,
]



// Colemak changes 17 keys, many without good reason, which is not at all casual.
// Which is why it's omitted for now.
// But being so popular, I know it will creep up some day :-D

