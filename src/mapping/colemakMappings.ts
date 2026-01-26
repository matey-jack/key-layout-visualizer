import {type FlexMapping, KeymapTypeId} from '../base-model.ts';

/**
    This file contains variants of the Colemak letter map
    and also some other letter maps inspired from Colemak or created around the same time.
 */


export const colemakMapping: FlexMapping = {
    name: "Colemak",
    localMaximum: true,
    klcId: "colmak",
    description: "Released in the year 2006, the Colemak letter map started a new world-wide interest in better keyboard mappings. " +
        "It also pioneered the idea of leaving some crucial-for-shortcuts keys in their place. " +
        "Colemak places a strong emphasis on avoiding single-finger bigram conflicts at the cost of many letters changing fingers. ",
    sourceUrl: "https://colemak.com/",
    mappings: {
        [KeymapTypeId.Ansi30]: [
            "qwfpg" + "jluy;",
            "arstd" + "hneio",
            "zxcvb" + "km,./",
        ],
        // This is the first published version of any wide mapping that I know of.
        // It originated the idea of flipping the right-hand column of symbols to the center.
        [KeymapTypeId.AnsiWide]: [
            "=-",
            "qwfpg" + "[" + "jluy;'\\",
            "arstd" + "]" + "hneio",
            "zxcvb" + "/" + "km,.",
            "⌥≡"
        ],
    },
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
    mappings: {
        [KeymapTypeId.Ansi30]: [
            "qwfpb" + "jluy;",
            "arstg" + "mneio",
            "xcdvz" + "kh,./",
        ],
        [KeymapTypeId.AnsiWide]: [
            "=-",
            "qwfpb" + "[" + "jluy;'\\",
            "arstg" + "]" + "mneio",
            "xcdvz" + "/" + "kh,.",
            "⌥≡"
        ],
        // Due to Angle Mod, the Ortho version has a flip: https://colemakmods.github.io/mod-dh/keyboards.html
        [KeymapTypeId.SplitOrtho]: [
            "qwfpb" + "jluy;-",
            "arstg" + "mneio'",
            "zxcdv" + "kh,./",
            "⇤\\=⇥",
        ]
    }
}

export const colemakThumbyDMapping: FlexMapping = {
    name: "Colemak Thumby",
    localMaximum: true,
    description: "Colemak with E on the thumb key and D taking E's home position. " +
        "I like this variant the most, because it combines low typing effort with the lowest diff to Qwerty. " +
        "(And it doesn't need all the shuffling of Colemak-DH on the left hand, while optionally allowing for " +
        "the HM swap on the right hand, depending on preference.) ",
    sourceUrl: "https://colemak.com/",
    mappings: {
        [KeymapTypeId.Thumb30]: [
            "qwfpg" + "jluy;",
            "arst-" + "hndio",
            "zxcvb" + "km,.",
            "e"
        ]
    },
    fallback: colemakMapping,
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
    mappings: {
        [KeymapTypeId.Thumb30]: [
            "qwfpb" + "jluy;",
            "arstg" + "-nhio",
            "xcdvz" + "km,.",
            "e"
        ]
    },
    fallback: colemakMapping,
}

export const colemakThumbyNMapping: FlexMapping = {
    name: "Colemak Thumby N",
    description: `Slightly modified version of Colemak-DH that places E on the thumb key and H on an actual home key. 
    Since N is more frequent than H, we move N to the middle finger where it causes less bigram conflicts.  
    TODO: make a custom version of this for the Harmonic 13 MidShift, because that's the only board to properly represent the angle mod. 
    And a custom version for ortho, same reason.`,
    // comparisonBase: colemakDhMapping,
    mappings: {
        [KeymapTypeId.Thumb30]: [
            "qwfpb" + "jlyu;",
            "arstg" + "-hnio",
            "xcdvz" + "km,.",
            "e"
        ]
    },
    fallback: colemakMapping,
}

export const colemakThumbyLMapping: FlexMapping = {
    name: "Colemak Thumby L",
    description: `Just a test to compare metrics. Turns out that moving L to the home row does not cause less bigram conflicts. `,
    // It's worse than Thumby-H, so we don't show it in the app :D
    // comparisonBase: colemakDhMapping,
    mappings: {
        [KeymapTypeId.Thumb30]: [
            "qwfpb" + "j-uy;",
            "arstg" + "mnlio",
            "xcdvz" + "kh,.",
            "e"
        ]
    },
    fallback: colemakMapping,
}

export const normanMapping: FlexMapping = {
    name: "Norman",
    sourceUrl: "https://normanlayout.info/index.html",
    description: "Norman has the heaviest focus on minimizing finger movement among all the mappings in this comparison. " +
        "Because Norman does this while also minimizing the learning difference to the Qwerty mapping," +
        "it ends up with the very worst SFB scores as well. " +
        "Especially the RI bigram and several of the right-index finger bigrams would certainly drive me crazy. " +
        "So Norman serves as a good example that not-measured metrics will usually suffer when optimizing very hard for some other metric. " +
        "This is why I stick so much with minimal modifications: it avoids unintended side-effects. ",

    // I think this would be prettier (and one less letter change to learn) with `p` in its ancient position and `;`
    // where `p` is here. But Norman's creator considers the new `p` position to be 25% easier to reach and thus the move.
    mappings: {
        [KeymapTypeId.Ansi30]: [
            "qwdfk" + "jurl;",
            "asetg" + "ynioh",
            "zxcvb" + "pm,./",
        ]
    },
}

export const minimak4Mapping: FlexMapping = {
    name: "Minimak 4-key",
    techName: "Minimak-4",
    sourceUrl: "https://github.com/binaryphile/www.minimak.org/blob/master/media/minimak_4_key.png",
    sourceLinkTitle: "GitHub: binaryphile/www.minimak.org",
    description: "Minimak partitions its key remapping in three steps, so that you can learn the mapping incrementally. " +
        "Thanks to the many same-finger changes this trick actually works with all of the mappings in this app, " +
        "but Minimak get credit for making it explicit.",
    mappings: {
        [KeymapTypeId.Ansi30]: [
            "qwdrk" + "yuiop",
            "astfg" + "hjel;",
            "zxcvb" + "nm,./",
        ]
    }
}

export const minimak8Mapping: FlexMapping = {
    ...minimak4Mapping,
    name: "Minimak 8-key",
    techName: "Minimak-8",
    sourceUrl: "https://github.com/binaryphile/www.minimak.org/blob/master/media/minimak_8_key.png",
    mappings: {
        [KeymapTypeId.Ansi30]: [
            "qwdrk" + "yuilp",
            "astfg" + "hneo;",
            "zxcvb" + "jm,./",
        ]
    }
}

export const minimakFullMapping: FlexMapping = {
    ...minimak4Mapping,
    name: "Minimak Full (12-key)",
    techName: "Minimak-12",
    sourceUrl: "https://github.com/binaryphile/www.minimak.org/blob/master/media/minimak.png",
    mappings: {
        [KeymapTypeId.Ansi30]: [
            "qwdfk" + "yuil;",
            "astrg" + "hneop",
            "zxcvb" + "jm,./",
        ]
    }
}
