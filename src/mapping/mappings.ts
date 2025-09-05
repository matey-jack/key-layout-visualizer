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

    Terminology:
        - Swap means two characters change position in general.
        - Flip means a swap on the same finger.
        - Fling means a swap to the other hand. Many of the Qwerty-derived mappings have exactly one of that!
          E or R or T to the right pinky! (Or another finger in case of mappings like Colemak which have a lot of finger swaps.)
        - No specific term for finger-swaps.

    For some time, I used the name "Thumby" for the "English Top Nine" straw man mapping below.
    But later I separated both terms, using "Top Nine" for variants based on the ASRT NIOH home row,
    and Thumby for selected mappings that combine a good base mapping with a Thumb key: especially Thumby Colemak and Thumby Quipper.
    An exception is The Cozy Keyboard, which is the Thumby variant of Qwerty Flip/Twist/Fling, a name being just too long to add another prefix to it. 😅

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
}

export const qwertyWideMapping: FlexMapping = {
    name: "Qwerty Wide",
    description: `Small changes to Qwerty for a wide hand position. 
    It's actually a gateway drug to more layout changes, because it makes it feel good to have N on a home key 
    and weird to not have more frequent letters there, too.
    I think that the next step would logically be Flip/Twist, Quipper, Colemak, or a Cozy/Thumby version of those.`,
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

    // needed for compatibility with the code.
    mapping30: [
        "qwert" + "yuiop",
        "asdfg" + "jnkl;",
        "zxcvb" + "hm,./",
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

export const normanMapping = {
    name: "Norman",
    sourceUrl: "https://normanlayout.info/index.html",
    description: "Norman has the heaviest focus on minimizing finger movement among all the mappings in this comparison. " +
        "Because Norman does this while also minimizing the learning difference to the Qwerty layout," +
        "it ends up with the very worst SFB scores as well. " +
        "Especially the RI bigram and several of the right-index finger bigrams would certainly drive me crazy. " +
        "So Norman serves as a good example that not-measured metrics will usually suffer when optimizing very hard for some other metric. " +
        "This is why I stick so much with minimal modifications: it avoids unintended side-effects. ",

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
    localMaximum: true,
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

export const qwertyFlipTwistThumbMapping = {
    name: "Qwerty Flip/Twist + Thumb",
    techName: "Qwerty-FlipTwist-Thumb",
    sourceUrl: "",
    description: `We build on the genius of Qwerty Flip and make it into a real ten-finger mapping 
    by moving E to the thumb and B in E's old spot. 
    As a consequence, D can stay on the home row. 
    This layout changes no more letters than Qwerty Flip/Spin, but has much better metrics that can also be felt in practice. 
    It has great bigram metrics, but it's single key metrics depend a lot on how one values the central home columns. 
     (Currently on my split ortho keyboard they feel just as easy to reach as the best non-home keys...)`,
    mappingThumb30: [
        "qwbfg" + "yukl;",
        "asdrt" + "hniop",
        "zxcv" + "-" + "jm,.",
        "e"
    ]
}

export const qwertyFlipTwistThumbFlingR = {
    name: "Qwerty Flip/Twist + Thumb + Fling R",
    techName: "Qwerty-FlipTwist-Thumb-Fling-R",
    sourceUrl: "",
    description: `Instead of Qwerty Flip/Twist's OLP "Spin" to improve right pinky use, we do a hand-swap (aka "fling") of R 
    which brings all top nine letters to a home key and simultaneously removes a lot of SFBs. `,
    mappingThumb30: [
        "qwbf;" + "yuklp",
        "asdtg" + "hnior",
        "zxcv" + "-" + "jm,.",
        "e"
    ]
}

export const qwertyFlipTwistThumbFlingT = {
    name: "Qwerty Flip/Twist + Thumb + Fling T",
    techName: "Qwerty-FlipTwist-Thumb-Fling-T",
    sourceUrl: "",
    description: `Instead of Qwerty Flip/Twist's OLP "Spin" to improve right pinky use, we do a hand-swap (aka "fling") of T 
    which brings all top nine letters to a home key and simultaneously removes a lot of SFBs. 
    We can see how the Cozy Keyboard mapping derives from this one...`,
    mappingThumb30: [
        "qwbf;" + "yuklp",
        "asdrg" + "hniot",
        "zxcv" + "-" + "jm,.",
        "e"
    ]
}

export const qwertyFlipTwistThumbT = {
    name: "Qwerty Flip/Twist + Thumb-T",
    techName: "Qwerty-FlipTwist-Thumb-T",
    sourceUrl: "",
    description: `We build on the genius of Qwerty Flip and make it into a real ten-finger mapping. 
    This alternative moves T to the thumb to break the overuse of the index finger and the RT bigram conflict. 
    This layout changes no more letters than Qwerty Flip/Spin, but has much better metrics that can also be felt in practice. 
    Good single-key metrics and bad SFBs from E on its Qwerty finger. 
    This could be improved by swapping E to the right pinky... and that is basically the Qwpr layout. `,
    mappingThumb30: [
        "qwdfb" + "yukl;",
        "aserg" + "hniop",
        "zxcv" + "-" + "jm,.",
        "t"
    ]
}

export const qwertyFlipTwistThumbR = {
    name: "Qwerty Flip/Twist + Thumb-R",
    techName: "Qwerty-FlipTwist-Thumb-R",
    sourceUrl: "",
    description: `We build on the genius of Qwerty Flip and make it into a real ten-finger mapping. 
    This alternative moves R to the thumb to break the overuse of the index finger and the RT bigram conflict. 
    This layout changes no more letters than Qwerty Flip/Spin, but has much better metrics that can also be felt in practice. '`,
    mappingThumb30: [
        "qwdfb" + "yukl;",
        "asetg" + "hniop",
        "zxcv" + "-" + "jm,.",
        "r"
    ]
}

/**
    Full list of flip/fling layouts with one thumb key letter and hand swap.
    Nine Home Keys:
     - A S D always stay in place
     - NIO always flips to home row on same finger
     - E moves to the thumb key or the right pinky
     - R or T takes the other of (thumb key, right pinky), while the remaining T or R stays on left index home position.

    This yields four different variants, two of which analyzed below as Flip/Twist/Thumb/Fling and finally the Cozy Keyboard.
    The other two are Thumby Quipper variants.

    Outside of Home Keys:
     - always swap KU because of SFBs with N (and H) as well as better U position.
     - in the case of pinky-E, also fling P to the left hand.

    Basically, there are two winning variants out of many sub-variants and those are The Cozy Keyboard and Thumby Quipper,
    with surprisingly similar scores!

    Basically, to beat those scores, one needs to diverge much more from Qwerty.
    Colemak does that with noticeably lower SFBs.
    (But comparing the relative improvement in typing effort vs learning effort, the lower hanging fruit also offer more gain!)
 */

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
    localMaximum: true,
    sourceUrl: "https://sourceforge.net/p/qwpr/wiki/Home/",
    description: "By placing 'e' on the right pinky, this mapping avoids a lot of bigram conflicts, " +
        "since no other letter is on that finger. ",
    mapping30: [
        "qwprf" + "yukl;",
        "asdtg" + "hnioe",
        "zxcvb" + "jm,./",
    ]
}

export const quipperThumbRMapping = {
    name: "Quipper with Thumb-R",
    techName: "Qwp-Thumb-R",
    description: `We super-charge Quipper by placing R on the thumb and B in R's old spot. 
    This means that the Quipper Home-Row stays unchanged, 
    making it a super-easy upgrade with a lot of benefits both in single-key effort and avoided bigram conflicts. 
    Interestingly, we end up with very similar metrics to The Cozy Keyboard, despite rotating the very frequent letters E, T, and R. `,
    mappingThumb30: [
        "qwpbf" + "yukl;",
        "asdtg" + "hnioe",
        "zxcv" + "-" + "jm,.",
        "r"
    ]
}

export const quipperThumbTMapping = {
    name: "Quipper with Thumb-T",
    techName: "Qwp-Thumb-T",
    description: `We super-charge Quipper by placing T on the thumb, R on T's home spot, and B in R's old spot. 
    This means that the Quipper Home-Row stays unchanged, 
    making it a super-easy upgrade with a lot of benefits both in single-key effort and avoided bigram conflicts. 
    Interestingly, we end up with very similar metrics to The Cozy Keyboard, despite rotating the very frequent letters E, T, and R. `,
    mappingThumb30: [
        "qwpbf" + "yukl;",
        "asdrg" + "hnioe",
        "zxcv" + "-" + "jm,.",
        "t"
    ]
}

export const quipperThumbyMapping = {
    name: "Quipper Thumby",
    localMaximum: true,
    description: `With the Thumb T and the KU swap, Quipper Thumby is an excellent well-rounded layout. 
    Great typing metrics for little learning effort! (Disclaimer: I haven't actually typed with this layout.)`,
    mappingThumb30: [
        "qwpbf" + "ykul;",
        "asdrg" + "hnioe",
        "zxcv" + "-" + "jm,.",
        "t"
    ]
}


export const cozyEnglish = {
    name: "The Cozy Keyboard, English variant",
    techName: "cozy-english",
    localMaximum: true,
    description: `A simple continuation of Qwerty Flip/Twist/Thumb (with a Fling instead of the Spin 😅), 
    although I didn't know of Qwerty Flip when first designing this layout. 
    We swap T to the right hand and suddenly get very good metrics given very little changes from the original Qwerty.
    There's also an additional KU swap which makes U easier to type and more importantly removes NU and HU SFBs 
    which could be alt-fingered in Qwerty, but become annoyingly noticeable once the N is so easy to type. `,
    mappingThumb30: [
        "qwbf;" + "y" + "kulp",
        "asdrg" + "hniot",
        "zxcv" + "-" + "jm,.",
        "e",
    ]
}

export const cozyGerman = {
    name: "The Cozy Keyboard, German variant",
    techName: "cozy-german",
    sourceUrl: "https://github.com/matey-jack/gemuetliche-tastatur",
    description: "German and English have very similar letter frequencies. " +
        "I am writing a lot in both languages, and so I optimized for both. " +
        "The result is a Cozy variant with just two changes: O and L stay as in Qwerty" +
        "and Y and Z stay as in the standard German Qwertz. " +
        "This reflects German letter frequencies and also makes it a bit easier to switch " +
        "from the legacy Qwerty/Qwertz layout. ",
    mappingThumb30: [
        "qwbf-" + "z" + "kuop",
        "asdrg" + "hnilt",
        "yxcv" + ";" + "jm,.",
        "e",
    ]
}

export const cozyPlusP = {
    name: "Cozy plus P",
    description: `Trying out Qwpr's P-Fling which also keeps B on the traditional finger. 
    Qwpr needs this swap because of the PE bigram, but for Thumby it has no benefits.`,
    mappingThumb30: [
        "qwpfb" + "y" + "kul;",
        "asdrg" + "hniot",
        "zxcv" + "-" + "jm,.",
        "e",
    ]
}

export const cozyPlusC = {
    name: "Cozy plus C",
    description: `Swapping C to a better position on its traditions finger improves the single-key metrics 
    and also keeps B on the traditional finger. `,
    mappingThumb30: [
        "qwcfb" + "y" + "kulp",
        "asdrg" + "hniot",
        "zx;v" + "-" + "jm,.",
        "e",
    ]
}

export const cozyPlusCH = {
    name: "Cozy plus C and H",
    description: `Swapping C and H on same finger to better positions improves the single-key metrics, 
    but doesn't have significant impact in practical experience. 
    Especially on my ortho keyboard, the old and new H positions are similarly easy to reach. `,
    mappingThumb30: [
        "qwcfb" + "y" + "kulp",
        "asdrg" + "mniot",
        "zx;v" + "-" + "jh,.",
        "e",
    ]
}

export const cozyFlingH = {
    name: "Cozy, fling H",
    description: `(Just an experiment, NOT a recommended variant.) 
    The Cozy Keyboard has great bigram conflict avoidance due to flipping T to the right hand. 
    This variant tries improving H's position without having to move D or S as Top Nine does. 
    It's a nice try, but neither single nor bigram score approaches the values of Top Nine RST.`,
    mappingThumb30: [
        "qwfhb" + "y" + "kulp",
        "asdrg" + ";niot",
        "zxcv" + "-" + "jm,.",
        "e",
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

export const topNine: FlexMapping = {
    name: "English Top Nine",
    techName: "top-nine",
    description: `This mapping started as a straw man experiment to determine what would be the best single key effort score
    achievable under similar conditions as Colemak. 
    (Which in particular means not changing C's position which among the Colemak fixed letters is the worst-placed one.)
    
    The mapping is built by putting the English Top 9 most frequent letters on home keys, which seems very sensible, 
    since the Top 9 in English have sort-of a gap before the top 10 letter. 
    Anyway, the next most frequent letters are D, L, and U, which are placed in second-best positions on the strongest and 
    longest finger upper row.
    This not just yields a great single key metric, but also pleasantly little changes compared to the Qwerty mapping,
    thus nice learnability not just from Qwerty, but also derived layouts, like in particular Norman which it resembles.
    
    However, the price to pay is some very annoying SFBs involving R. 
    Those can be fixed with more letter swaps, yielding many variants, lots of confusion, but no clear winner.
    And the over-focus on English also reduces the scores for German.
    But at least the straw man allows us to see that the actual winning (well-rounded) layouts are not so far away from
    the theoretical optimum! Which is what the experiment was all about! `,

    mappingThumb30: [
        "qwdfb" + "y" + "kulp",
        "asrtg" + "-nioh",
        "zxcv" + ";" + "jm,.",
        "e",
    ],
    mappingAnsiWide: [
        "=\\",
        "qwdfb" + "-y" + "kulp'",
        "asrtg" + "/;nioh",
        "zxcv" + "[]" + "jm,.",
        "e⌥",
    ],
    mappingSplitOrtho: [
        "",
        "qwdfb" + "y" + "kulp=",
        "asrtg" + "-nioh'",
        "zxcv" + ";" + "jm,./",
        "⇤\\e⇥",
    ],
    mappingHarmonic13wide: [
        "[]",
        "wdfb" + "-=" + "kulp",
        "qasrtg" + ";" + "jnioh'",
        "zxcv" + "\\/" + "ym,.",
        "`e",
    ],
    mappingHarmonic14t: [
        "`",
        "qwdfb" + "-=" + "kulp'\\",
        "asrtg" + ";" + "jnioh",
        "zxcv" + "[]" + "ym,.",
        "/e⌥≡",
    ],
}

export const topNineLeftThumb: FlexMapping = {
    name: "Top Nine Left",
    description: `This is Top Nine, but the left thumb types the letter E. 
    On the ancient ANSI keyboard, it's weird to use the space bar for a letter, 
    but on any modern Ortholinear or harmonically staggered keyboard, left and right are equally usable. 
    And Top Nine Left uses this symmetry to provide a highly performant layout where all the letters 
    are on the same hand as in Qwerty. 
    (Unlike shown on the keyboard above, the space bar should be on the other thumb.) `,
    mappingSplitOrtho: [
        "",
        "qwdfb" + "ykulp-",
        "asrtg" + "=nioh'",
        "zxcv;" + "jm,./",
        "⇤e\\⇥",
    ],
    mappingHarmonic13wide: [
        "[]",
        "wdfb" + "-=" + "kulp",
        "qasrtg" + ";" + "jnioh'",
        "zxcv" + "\\/" + "ym,.",
        "e`",
    ],
    // TODO: add a flex slot for the space bar on ANSI?
}

export const top9t = {
    name: "Top Nine T",
    description: "Swapping the order of RT (from Qwerty) to TR improves the RD and RT bigrams, " +
        "but brings new problems with RF, RB, RG, and CT.",
    mappingThumb30: [
        "qwdfb" + "y" + "kulp",
        "astrg" + "-nioh",
        "zxcv" + ";" + "jm,.",
        "e",
    ],
};

export const top9u = {
    name: "Top Nine U",
    description: "Instead of swapping UK to improve the UN bigram, we swap UY. " +
        "This is a same-finger swap generally, but allows alt-fingering the UN bigram. ",
    mappingThumb30: [
        "qwdfb" + "u" + "yklp",
        "asrtg" + "-nioh",
        "zxcv" + ";" + "jm,.",
        "e",
    ],
};

export const topNineDifferentSymbols: FlexMapping = {
    name: "Top Nine variant",
    description: `TODO: check what's actually different here.`,
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

    // The following are unrelated to the Top Nine variant; just brainstorming some ideas about better use of keys for navigation instead of tech punctuation.
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

export const top9rst: FlexMapping = {
    name: "Top Nine RST",
    description: "(Just an experiment, NOT a recommended variant.) " +
        "Top Nine's DR conflict is especially painful for Qwerty users, so we sacrifice the otherwise unchanged position of S to improve this. " +
        "(And yep, somewhat ironically, we obtain Colemak' s left-hand home row.) ",
    mappingThumb30: [
        "qwdfb" + "ykulp",
        "arstg" + ";nioh",
        "zxcv-" + "jm,.",
        "e",
    ],
};

export const top9kul = {
    name: "Top Nine KU-L",
    description: "(Just an experiment, NOT a recommended variant.) " +
        "One more finger swap to remove the strong ol/lo bigram conflict. " +
        "I wouldn't want to actually use this, so it's just there to show the improvement in bigram scores. ",
    mappingThumb30: [
        "qwdfb" + "yku-p",
        "asrtg" + "lnioh",
        "zxcv;" + "jm,.",
        "e",
    ],
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
    description: "Full mapping of The Cozy Keyboard, German variant. " +
        "Shows how I map Umlauts and punctuation on ANSI keyboards and the Ergodox. " +
        "(On Iris I use combinding diaeresis key, because I could't fit all three Umlaut letters. ",
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
         TODO: align those layouts with modifications made on other variants. In particular the Q overspill to the home row.
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

export const colemakMapping: FlexMapping = {
    name: "Colemak",
    localMaximum: true,
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
    name: "Colemak Thumby",
    localMaximum: true,
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
    Note that this slightly beats Colemak Thumby D on staggered keyboards where the left-bottom conflicts can be alt-fingered,
    but it's noticeably worse on Ortho boards. And all that for having more changes to Qwerty.
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

export const allMappings: FlexMapping[] = [
    qwertyMapping,
    qwertyWideMapping,
    // qwertzMapping,
    qwertyFlipTwistMapping,
    qwertyFlipTwistSpinMapping,
    qwertyFlipTwistThumbMapping,
    qwertyFlipTwistThumbFlingR,
    qwertyFlipTwistThumbFlingT,
    cozyEnglish,
    cozyGerman,
    cozyFlingH,
    // cozyPlusP,
    cozyPlusC,
    cozyPlusCH,
    // next two excluded, because Qwp-Thumb{RT} is the better version of the same idea.
    // qwertyFlipTwistThumbR,
    // qwertyFlipTwistThumbT,
    // etniMapping, // excluded, because the weird home finger position isn't reflected in our metrics (and no useable to me in practice).
    quipperMapping,
    quipperThumbRMapping,
    quipperThumbTMapping,
    quipperThumbyMapping,
    // thumbyZero, // aka Qwerty Thumb-E
    // thumbyNero,
    // thumbyEntry,
    topNine,
    topNineLeftThumb,
    // topNineDifferentSymbols,
    top9rst,
    top9u,
    top9kul,
    top9t,
    // minimak4Mapping,
    // minimak8Mapping,
    minimakFullMapping,
    colemakMapping,
    colemakDhMapping,
    colemakThumbyDMapping,
    colemakThumbyHMapping,
    colemakThumbyLMapping,
    colemakThumbyNMapping,
    normanMapping,
    // gemuetlichesMapping,
]
