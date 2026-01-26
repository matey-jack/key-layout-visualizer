import {type FlexMapping, KeymapTypeId} from '../base-model.ts';
import {qwertyMapping} from './baseMappings.ts';

export const qweertyMapping: FlexMapping = {
    name: "Qweerty",
    description: `This mapping does not move any key, but simply provides an additional key mapping for E on a thumb key. 
        It is not made for practical use, but simply to show the effect of the thumb key on the typing metrics.
        Or for people to just try how a thumb key would feel. `,
    mappings: {
        [KeymapTypeId.Thumb30]: [
            "qw-rt" + "yuiop",
            "asdfg" + "hjkl;",
            "zxcvb" + "nm,.",
            "e"
        ],
    },
    fallback: qwertyMapping,
}

export const enTryMapping: FlexMapping = {
    name: "Thumby Entry (or EN-try!)",
    description: "Thumb-E plus a home-row N as low-key way to feel into optimized letter mappings. " +
        "Additionally provides synergy, because the common EN/NE bigrams don't require you to pinch your hand. ",
    // Writing upper and lower row as three strings emphasizes the center columns of the Harmonic and ANSI keyboards.
    // On Ortho and Harmonic Narrow, it will just be 5 + 5 on each side.
    mappings: {
        [KeymapTypeId.Thumb30]: [
            "qwbrt" + "y" + "uiop",
            "asdfg" + "hnkl;",
            "zxcv" + "-" + "jm,.",
            "e",
        ],
    },
    fallback: qwertyMapping,
}

export const ergoFix: FlexMapping = {
    name: "ErgoFix",
    description: `The changed stagger on the left-hand side of the Ergoplank keyboard layout 
    makes the Qwerty letters B and T even harder to access than they already are on Qwerty. 
    Users that are not touch-typing will not notice this small shift in position, 
    but for touch-typists the change is so noticeable and big, that we can as well place the letters somewhere else.
    So we swap the triple "TB;" which also make the keymap cleaner to look at with punctuation characters in the bottom row.
    The move of T creates a lateral stretch for the NT bigram, so let's use that as an excuse to also swap J and N.
    The J-N swap also removes the worst scissor-movements of the Qwerty letter map and allows the hands to be much more centered,
    since all the 11 most frequent letters in English texts are now on the home row or above.`,
    // if someone now feels that the UN single-finger bigram is annoying, they can go all the way to right-hand Cozy
    // by also swapping KUI and OL.
    mappings: {
        [KeymapTypeId.Ansi30]: [
            "qwerb" + "yuiop",
            "asdfg" + "hnklt",
            "zxcv;" + "jm,./",
        ],
    },
}

// I omit the plain "flip" version, because I think that the JN swap is essential to avoid a lot of vertical
// bigram conflicts.
// (Most typing is on home and upper row, often even both ahead and after the N, for example, double upper-row neigbors
// mINUte, commUNIty, UNIversal, contINUe, ecONOmic, traINIng. The lateral movement to Qwerty N even moves the hand away from
// home row letters, see ONLy, thINK, KNOw, ONLine, ...)
// Nobody should waste time with a UJ swap! (Especially since U's position on the upper row is quite befitting for its frequency!)
export const qwertyFlipTwistMapping: FlexMapping = {
    name: "Qwerty Flip/Twist",
    techName: "Qwerty-FlipTwist",
    localMaximum: true,
    klcId: "flip",
    sourceUrl: "https://nick-gravgaard.com/qwerty-flip/",
    description: "The genius mapping that anyone can remember after seeing it only one time. " +
        "Absolutely minimal learning; much better typing than Qwerty; and anyone can still use your relabled keyboard, " +
        "because flipped keys are so close to where people look for them. ",
    mappings: {
        [KeymapTypeId.Ansi30]: [
            "qwdfg" + "yukl;",
            "asert" + "hniop",
            "zxcvb" + "jm,./",
        ]
    }
}

export const qwertyFlipTwistThumbMapping: FlexMapping = {
    name: "Qwerty Flip/Twist + Thumb",
    techName: "Qwerty-FlipTwist-Thumb",
    sourceUrl: "",
    description: `We build on the genius of Qwerty Flip and make it into a real ten-finger mapping 
    by moving E to the thumb and B in E's old spot. 
    As a consequence, D can stay on the home row. 
    This mapping changes no more letters than Qwerty Flip/Spin, but has much better metrics that can also be felt in practice. 
    It has great bigram metrics, but it's single key metrics depend a lot on how one values the central home columns. 
     (Currently on my split ortho keyboard they feel just as easy to reach as the best non-home keys...)`,
    mappings: {
        [KeymapTypeId.Thumb30]: [
            "qwbfg" + "yukl;",
            "asdrt" + "hniop",
            "zxcv" + "-" + "jm,.",
            "e"
        ]
    },
    fallback: qwertyFlipTwistMapping,
}

export const qwertyFlipTwistThumbFlingR: FlexMapping = {
    name: "Qwerty Flip/Twist + Thumb + Fling R",
    techName: "Qwerty-FlipTwist-Thumb-Fling-R",
    sourceUrl: "",
    description: `Instead of Qwerty Flip/Twist's OLP "Spin" to improve right pinky use, we do a hand-swap (aka "fling") of R 
    which brings all top nine letters to a home key and simultaneously removes a lot of SFBs. `,
    mappings: {
        [KeymapTypeId.Thumb30]: [
            "qwbf;" + "yuklp",
            "asdtg" + "hnior",
            "zxcv" + "-" + "jm,.",
            "e"
        ]
    },
    fallback: qwertyFlipTwistMapping,
}

export const qwertyFlipTwistThumbFlingT: FlexMapping = {
    name: "Qwerty Flip/Twist + Thumb + Fling T",
    techName: "Qwerty-FlipTwist-Thumb-Fling-T",
    sourceUrl: "",
    description: `Instead of Qwerty Flip/Twist's OLP "Spin" to improve right pinky use, we do a hand-swap (aka "fling") of T 
    which brings all top nine letters to a home key and simultaneously removes a lot of SFBs. 
    We can see how the Cozy Keyboard mapping derives from this one...`,
    mappings: {
        [KeymapTypeId.Thumb30]: [
            "qwbf;" + "yuklp",
            "asdrg" + "hniot",
            "zxcv" + "-" + "jm,.",
            "e"
        ]
    },
    fallback: qwertyFlipTwistMapping,
}

export const qwertyFlipTwistThumbT: FlexMapping = {
    name: "Qwerty Flip/Twist + Thumb-T",
    techName: "Qwerty-FlipTwist-Thumb-T",
    sourceUrl: "",
    description: `We build on the genius of Qwerty Flip and make it into a real ten-finger mapping. 
    This alternative moves T to the thumb to break the overuse of the index finger and the RT bigram conflict. 
    This mapping changes no more letters than Qwerty Flip/Spin, but has much better metrics that can also be felt in practice. 
    Good single-key metrics and bad SFBs from E on its Qwerty finger. 
    This could be improved by swapping E to the right pinky... and that is basically the Qwpr mapping. `,
    mappings: {
        [KeymapTypeId.Thumb30]: [
            "qwdfb" + "yukl;",
            "aserg" + "hniop",
            "zxcv" + "-" + "jm,.",
            "t"
        ]
    },
    fallback: qwertyFlipTwistMapping,
}

export const qwertyFlipTwistThumbR: FlexMapping = {
    name: "Qwerty Flip/Twist + Thumb-R",
    techName: "Qwerty-FlipTwist-Thumb-R",
    sourceUrl: "",
    description: `We build on the genius of Qwerty Flip and make it into a real ten-finger mapping. 
    This alternative moves R to the thumb to break the overuse of the index finger and the RT bigram conflict. 
    This mapping changes no more letters than Qwerty Flip/Spin, but has much better metrics that can also be felt in practice. '`,
    mappings: {
        [KeymapTypeId.Thumb30]: [
            "qwdfb" + "yukl;",
            "asetg" + "hniop",
            "zxcv" + "-" + "jm,.",
            "r"
        ]
    },
    fallback: qwertyFlipTwistMapping,
}

/**
 Full list of flip/fling mappings with one thumb key letter and hand swap.
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

export const qwertyFlipTwistSpinMapping: FlexMapping = {
    name: "Qwerty Flip/Twist/Spin",
    techName: "Qwerty-FlipTwistSpin",
    sourceUrl: "https://nick-gravgaard.com/qwerty-flip/",
    description: "A nice spin on the Flip/Twist mapping which improves typing a bit more.",
    mappings: {
        [KeymapTypeId.Ansi30]: [
            "qwdfg" + "yukp;",
            "asert" + "hniol",
            "zxcvb" + "jm,./",
        ]
    }
}

export const etniMapping: FlexMapping = {
    name: "ETNI",
    sourceUrl: "https://stevep99.github.io/etni",
    description: "A hot take which takes the home positions for the longer fingers on the upper letter row " +
        "(while keeping Index and Pinky finger home on the middle row). " +
        "Earns the prize for least changes to learn for people that are already touch-typing. " +
        "Judge yourself if this is comfortable for you. ",
    mappings: {
        [KeymapTypeId.Ansi30]: [
            "qwefp" + "yuio;",
            "asdtg" + "hnklr",
            "zxcvb" + "jm,./",
        ]
    }
}

export const thumbyZero: FlexMapping = {
    name: "Thumby Zero",
    description: "Simply puts E on the best key of the board and rescues B from the worst key of the board. ",
    mappings: {
        [KeymapTypeId.Thumb30]: [
            "qwbrt" + "y" + "uiop",
            "asdfg" + "hjkl;",
            "zxcv" + "-" + "nm,.",
            "e",
        ],
        [KeymapTypeId.AnsiWide]: [
            "[]",
            "qwbrt" + "=yuiop\\_",
            "asdfg" + "'hjkl;",
            "zxcv-" + "/nm,.",
            "e⌥",
        ]
    },
    fallback: qwertyMapping,
}

export const thumbyNero: FlexMapping = {
    name: "Thumby Nero",
    description: "This is like Thumby Zero, a minimal dip into Thumby-land, but this time only containing the NJ swap. " +
        "This makes it possible to try out using just ordinary KLC layouts, no other tools or manual registry changes required. " +
        "I think that this swap is the most effective single change to Qwerty, because it also improves all the bigrams " +
        "between N and the upper row right hand vowels (UIO) as well as nk/kn. ",
    mappings: {
        [KeymapTypeId.Ansi30]: [
            "qwert" + "yuiop",
            "asdfg" + "hnkl;",
            "zxcvb" + "jm,./",
        ]
    }
}

export const carpalxQMapping: FlexMapping = {
    name: "CarpalxQ",
    description: `This letter map minimizes the number of changed keys from Qwerty
    with less emphasis on keeping letters on the same finger.`,
    sourceUrl: "https://jumpedthesynapse.blogspot.com/2007/07/carpalxq.html",
    sourceLinkTitle: "Blog post",
    mappings: {
        [KeymapTypeId.Ansi30]: [
            "qwkrf" + "yulp;",
            "asdtg" + "hneio",
            "zxcvb" + "jm,./",
        ]
    }
}