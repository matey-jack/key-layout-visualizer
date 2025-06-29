/*
    Most letter mapping discussions on the Internet talk only about mapping of the 26 letters and sometimes also the four
    punctuation keys that on the ANSI/Qwerty layout/mapping fall into the central 3×10 field of the keyboard.
    Such a restricted mapping has the advantage that it maps to different (physical) keyboard layouts that don't have
    equivalents for all the ANSI keys.
 */

import {FlexMapping} from "./mapping-model.ts";

export const qwertyMapping: FlexMapping = {
    name: "Qwerty",
    sourceUrl: "https://en.wikipedia.org/wiki/QWERTY",
    mapping30: [
        "qwert" + "yuiop",
        "asdfg" + "hjkl;",
        "zxcvb" + "nm,./",
    ]
}

// I omit the plain "flip" version, because I think that the JN swap is essential.
// Nobody should waste time with a UN swap!
export const qwertyFlipTwistMapping = {
    name: "Qwerty Flip/Twist",
    sourceUrl: "https://nick-gravgaard.com/qwerty-flip/",
    mapping30: [
        "qwdfg" + "yukl;",
        "asert" + "hniop",
        "zxcvb" + "jm,./",
    ]
}

export const qwertyFlipTwistSpinMapping = {
    name: "Qwerty Flip/Twist/Spin",
    sourceUrl: "https://nick-gravgaard.com/qwerty-flip/",
    mapping30: [
        "qwdfg" + "yukp;",
        "asert" + "hniol",
        "zxcvb" + "jm,./",
    ]
}

export const etniMapping = {
    name: "ETNI",
    sourceUrl: "https://stevep99.github.io/etni",
    mapping30: [
        "qwefp" + "yuio;",
        "asdtg" + "hnklr",
        "zxcvb" + "jm,./",
    ]
}

export const quipperMapping = {
    name: "Quipper aka Qwpr",
    sourceUrl: "https://sourceforge.net/p/qwpr/wiki/Home/",
    mapping30: [
        "qwprf" + "yukl;",
        "asdtg" + "hnioe",
        "zxcvb" + "jm,./",
    ]
}

export const normanMapping = {
    name: "Norman",
    sourceUrl: "https://normanlayout.info/index.html",
    mapping30: [
        "qwdfk" + "jurl;",
        "asetg" + "ynioh",
        "zxcvb" + "pm,./",
    ]
}

export const minimak4Mapping = {
    name: "Minimak 4-key",
    sourceUrl: "https://github.com/binaryphile/www.minimak.org/blob/master/media/minimak_4_key.png",
    mapping30: [
        "qwdrk" + "yuiop",
        "astfg" + "hjel;",
        "zxcvb" + "nm,./",
    ]
}

export const minimak8Mapping = {
    name: "Minimak 8-key",
    sourceUrl: "https://github.com/binaryphile/www.minimak.org/blob/master/media/minimak_8_key.png",
    mapping30: [
        "qwdrk" + "yuilp",
        "astfg" + "hneo;",
        "zxcvb" + "jm,./",
    ]
}

export const minimakFullMapping = {
    name: "Minimak Full (12-key)",
    sourceUrl: "https://github.com/binaryphile/www.minimak.org/blob/master/media/minimak.png",
    mapping30: [
        "qwdfk" + "yuil;",
        "astrg" + "hneop",
        "zxcvb" + "jm,./",
    ]
}

export const cozyMapping = {
    name: "The Cozy Keyboard",
    description: "A few letter swaps, off-home row hyphen, and a thumb E. I used a German derivate of this for more than ten years daily.",
    sourceUrl: "https://github.com/matey-jack/gemuetliche-tastatur",

    // The current model doesn't let us remap keys with labels longer than one character.
    // Therefore, I am using ⌥ for AltGr.
    // Note that this is written for classic Ansi hand home position.
    // But it transposes correctly to the wide layout and this is how I recommend using it.
    mappingAnsi: [
        "=\\",
        "qwbf" + ";y" + "kuop[]⌦",
        "⌥asdrg" + "hnilt'",
        "zxcv" + "-" + "jm,./",
        "e⌥"
    ],

    // This is just as hypothetic as the entire concept for a Harmonic keyboard.
    // I didn't spend too much time on this... and won't until I actually build such a keyboard one day.
    // Bottom left thumb key could alternatively be used for Delete, as on my Iris. And [] as Home/End keys.
    // (But adding PgUp/PgDn would mean more refactoring and a more complicated AltGr layer.)
    mappingHarmonic: [
        "[]",
        "qwbf" + ";j" + "kuop",
        "-asdrg" + "`" + "hnilt'",
        "zxcv" + "=/" + "ym,.",
        "\\e"
    ],
}


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
    qwertyFlipTwistMapping,
    qwertyFlipTwistSpinMapping,
    etniMapping,
    quipperMapping,
    normanMapping,
    minimak4Mapping,
    minimak8Mapping,
    minimakFullMapping,
    cozyMapping,
    gemuetlichesMapping,
]



// Colemak changes 17 keys, many without good reason, which is not at all casual.
// Which is why it's omitted for now.
// But being so popular, I know it will creep up some day :-D

