import {type FlexMapping, KeymapTypeId} from '../base-model.ts';
import {qwertyFlipTwistMapping} from './flipMappings.ts';

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
    thus nice learnability not just from Qwerty, but also derived mappings, like in particular Norman which it resembles.
    
    However, the price to pay is some very annoying SFBs involving R. 
    Those can be fixed with more letter swaps, yielding many variants, lots of confusion, but no clear winner.
    And the over-focus on English also reduces the scores for German.
    But at least the straw man allows us to see that the actual winning (well-rounded) mappings are not so far away from
    the theoretical optimum! Which is what the experiment was all about! `,
    fallback: qwertyFlipTwistMapping,

    mappings: {
        [KeymapTypeId.Thumb30]: [
            "qwdfb" + "y" + "kulp",
            "asrtg" + "-nioh",
            "zxcv" + ";" + "jm,.",
            "e",
        ],
        [KeymapTypeId.AnsiWide]: [
            "=\\",
            "qwdfb" + "-y" + "kulp'⌫",
            "asrtg" + "/;nioh",
            "zxcv" + "[]" + "jm,.",
            "e⌥",
        ],
        [KeymapTypeId.SplitOrtho]: [
            "qwdfb" + "ykulp=",
            "asrtg" + "-nioh'",
            "zxcv;" + "jm,./",
            "⇤\\e⇥",
        ],
        [KeymapTypeId.Harmonic13Wide]: [
            "[]",
            "wdfb" + "-=" + "kulp",
            "qasrtg" + ";" + "jnioh'",
            "zxcv" + "\\/" + "ym,.",
            "`e",
        ],
        [KeymapTypeId.Harmonic14T]: [
            "`",
            "qwdfb" + "-=" + "kulp'\\",
            "asrtg" + ";" + "jnioh",
            "zxcv" + "[]" + "ym,.",
            "/e⌥≡",
        ],
    }
}

export const topNineLeftThumb: FlexMapping = {
    name: "Top Nine Left",
    description: `This is Top Nine, but the left thumb types the letter E. 
    On the ancient ANSI keyboard, it's weird to use the space bar for a letter, 
    but on any modern Ortholinear or harmonically staggered keyboard, left and right are equally usable. 
    And Top Nine Left uses this symmetry to provide a highly performant mapping where all the letters 
    are on the same hand as in Qwerty. 
    (Unlike shown on the keyboard above, the space bar should be on the other thumb.) `,
    mappings: {
        [KeymapTypeId.SplitOrtho]: [
            "qwdfb" + "ykulp-",
            "asrtg" + "=nioh'",
            "zxcv;" + "jm,./",
            "⇤e\\⇥",
        ],
        [KeymapTypeId.Harmonic13Wide]: [
            "[]",
            "wdfb" + "-=" + "kulp",
            "qasrtg" + ";" + "jnioh'",
            "zxcv" + "\\/" + "ym,.",
            "e`",
        ],
    },
    fallback: topNine,
}

export const top9t: FlexMapping = {
    name: "Top Nine T",
    description: "Swapping the order of RT (from Qwerty) to TR improves the RD and RT bigrams, " +
        "but brings new problems with RF, RB, RG, and CT.",
    mappings: {
        [KeymapTypeId.Thumb30]: [
            "qwdfb" + "y" + "kulp",
            "astrg" + "-nioh",
            "zxcv" + ";" + "jm,.",
            "e",
        ]
    },
    fallback: topNine,
};

export const top9u: FlexMapping = {
    name: "Top Nine U",
    description: "Instead of swapping UK to improve the UN bigram, we swap UY. " +
        "This is a same-finger swap generally, but allows alt-fingering the UN bigram. ",
    mappings: {
        [KeymapTypeId.Thumb30]: [
            "qwdfb" + "u" + "yklp",
            "asrtg" + "-nioh",
            "zxcv" + ";" + "jm,.",
            "e",
        ]
    },
    fallback: topNine,
};

export const topNineDifferentSymbols: FlexMapping = {
    name: "Top Nine variant",
    description: `TODO: check what's actually different here.`,
    mappings: {
        [KeymapTypeId.Thumb30]: [
            "qwdfb" + "ykulp",
            "asrtg" + ";nioh",
            "zxcv-" + "jm,.",
            "e",
        ],
        [KeymapTypeId.AnsiWide]: [
            "[`",
            "qwdfb" + "]y" + "kulp'\\",
            "asrtg" + "=" + ";nioh",
            "zxcv" + "-/" + "jm,.",
            "e⌥",
        ],
        // The following are unrelated to the Top Nine variant; just brainstorming some ideas about better use of keys for navigation instead of tech punctuation.
        [KeymapTypeId.Harmonic13Wide]: [
            "⇞⇟",
            "wdfb" + "-=" + "kulp",
            "qasrtg" + ";" + "ynioh'",
            "zxcv" + "⇤⇥" + "jm,.",
            "/e",
        ],
        [KeymapTypeId.Harmonic14T]: [
            "=",
            "qwdfb" + "-'" + "kulp⇞⇟",
            "asrtg" + ";" + "jnioh",
            "zxcv" + "⇤⇥" + "ym,.",
            "/e⌥≡",
        ],
        [KeymapTypeId.SplitOrtho]: [
            "qwdfb" + "ykulp-",
            "asrtg" + ";nioh'",
            "zxcv=" + "jm,./",
            "⇤\\e⇥",
        ],
    },
    fallback: topNine,
}

export const top9rst: FlexMapping = {
    name: "Top Nine RST",
    description: "(Just an experiment, NOT a recommended variant.) " +
        "Top Nine's DR conflict is especially painful for Qwerty users, so we sacrifice the otherwise unchanged position of S to improve this. " +
        "(And yep, somewhat ironically, we obtain Colemak' s left-hand home row.) ",
    mappings: {
        [KeymapTypeId.Thumb30]: [
            "qwdfb" + "ykulp",
            "arstg" + ";nioh",
            "zxcv-" + "jm,.",
            "e",
        ]
    },
    fallback: topNine,
};

export const top9kul: FlexMapping = {
    name: "Top Nine KU-L",
    description: "(Just an experiment, NOT a recommended variant.) " +
        "One more finger swap to remove the strong ol/lo bigram conflict. " +
        "I wouldn't want to actually use this, so it's just there to show the improvement in bigram scores. ",
    mappings: {
        [KeymapTypeId.Thumb30]: [
            "qwdfb" + "yku-p",
            "asrtg" + "lnioh",
            "zxcv;" + "jm,.",
            "e",
        ]
    },
    fallback: topNine,
}
