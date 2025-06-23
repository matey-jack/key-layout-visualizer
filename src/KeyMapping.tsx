/*
    To keep the data model easy, we initially allow remapping only 31 keys,
    consisting of the inner square of 3 rows by 10 columns plus an extra right pinky key.
    (This latter is on the upper letter row for ISO and Iris layouts,
    and it's on the home row for the Harmonic.)
    The mapping is just modeled as a list of 31 elements, with the extra pinky key going last.
    (That's never its real position, but makes coding easier.)

    Next steps: since all our layouts have a wide hand position,
    we could actually add the key to the right of the space bar to the mapping model.
    As for keys to place äö and ~ we'll see later.
    Easy way to make it extensible: since most mappings only affect 30 core keys,
    just add other keys at the end and give them default values :D.

    Escape, Backspace, Tab, two Shift keys, Enter, and Space will be labeled, but are fixed in the layout.
    + and - are also fixed on ISO and Harmonic layouts.
    Remaining punctuation, we'll see.
 */

interface KeyMapping {
    name: string;
    sourceUrl: string;
    mapping: string; // 31 characters, see above.
}

// interface MappingDiff {
//     // number of changes compared to qwerty
//     sameFinger: number;
//     sameHand: number;
//     swapHands: number;
// }

export const QwertyMapping = {
    name: "Qwerty",
    sourceUrl: "https://en.wikipedia.org/wiki/QWERTY",
    mapping: 
        // we use double quotes consistently so that ' key can go anywhere in the strings.
        "qwert" + "yuiop" +
        "asdfg" + "hjkl;" +
        "zxcvb" + "nm,./'",
}

// I omit the plain "flip" version, because I think that the JN swap is essential.
// Nobody should waste time with a UN swap!
export const QwertyFlipTwistMapping = {
    name: "Qwerty Flip/Twist",
    sourceUrl: "https://nick-gravgaard.com/qwerty-flip/",
    mapping: 
        "qwdfg" + "yukl;" +
        "asert" + "hniop" +
        "zxcvb" + "jm,./'",
}

export const QwertyFlipTwistSpinMapping = {
    name: "Qwerty Flip/Twist/Spin",
    sourceUrl: "https://nick-gravgaard.com/qwerty-flip/",
    mapping: 
        "qwdfg" + "yukp;" +
        "asert" + "hniol" +
        "zxcvb" + "jm,./'",
}

export const EtniMapping = {
    name: "ETNI",
    sourceUrl: "https://stevep99.github.io/etni",
    mapping: 
        "qwefp" + "yuio;" +
        "asdtg" + "hnklr" +
        "zxcvb" + "jm,./'",
}

export const QuipperMapping = {
    name: "Quipper aka Qwpr",
    sourceUrl: "https://sourceforge.net/p/qwpr/wiki/Home/",
    mapping: 
        "qwert" + "yuiop" +
        "asdfg" + "hjkl;" +
        "zxcvb" + "nm,./'",
}

export const NormanMapping = {
    name: "Norman",
    sourceUrl: "https://normanlayout.info/index.html",
    mapping: 
        "qwdfk" + "jurl;" +
        "asetg" + "ynioh" +
        "zxcvb" + "pm,./'",
}

export const Minimak4Mapping = {
    name: "Minimak 4-key",
    sourceUrl: "https://github.com/binaryphile/www.minimak.org/blob/master/media/minimak_4_key.png",
    mapping: 
        "qwdrk" + "yuiop" +
        "astfg" + "hjel;" +
        "zxcvb" + "nm,./'",
}

export const Minimak8Mapping = {
    name: "Minimak 8-key",
    sourceUrl: "https://github.com/binaryphile/www.minimak.org/blob/master/media/minimak_8_key.png",
    mapping: 
        "qwdrk" + "yuilp" +
        "astfg" + "hneo;" +
        "zxcvb" + "jm,./'",
}

export const MinimakFullMapping = {
    name: "Minimak Full (12-key)",
    sourceUrl: "https://github.com/binaryphile/www.minimak.org/blob/master/media/minimak.png",
    mapping: 
        "qwdfk" + "yuil;" +
        "astrg" + "hneop" +
        "zxcvb" + "jm,./'",
}

export const CozyMapping = {
    name: "The Cozy Keyboard",
    sourceUrl: "todo",
    // This is based on the German "Gemütliches Layout" which has no semicolon key.
    // Maybe there are better ways to distribute the punctuation,
    // Such as moving `;` to the right, swapping `'` to the left hand.
    // Moving the hyphen down from the number row is great, because it is probably
    // the most-used punctuation character not on the main-31 key field.
    // `-`s number-row position could be used by the tilde key
    // when it makes space for the Escape key. Or we put that key into the 31-core ...
    mapping: 
        "qwbf;" + "zkuop" +
        "asdrg" + "hnklt" +
        "zxcv-" + "nm,./'" +
        "e",
}



export const AllMappings: KeyMapping[] = [
    QwertyMapping,
    QwertyFlipTwistMapping,
    QwertyFlipTwistSpinMapping,
    EtniMapping,
    QuipperMapping,
    NormanMapping,
    Minimak4Mapping,
    Minimak8Mapping,
    MinimakFullMapping,
    CozyMapping,
]



// Colemak changes 17 keys, many without good reason, which is not at all casual.
// Which is why it's omitted for now.
// But being so popular, I know it will creep up some day :-D


// TODO reconsider this when the app is a bit stable
// https://github.com/matey-jack/gemuetliche-tastatur
// This is lacking ä and ö, but they are differently positioned on ISO and Iris,
// which our basic model doesn't support yet.
export const GemütlichesMapping = [
    "qwbf'" + "zkuop" +
    "asdrg" + "hnklt" +
    "zxcv/" + "nm,.-ü"
]

