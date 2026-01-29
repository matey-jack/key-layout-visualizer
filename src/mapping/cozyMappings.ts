import {type FlexMapping, KeymapTypeId} from '../base-model.ts';
import {qwertzMapping} from './baseMappings.ts';
import {qwertyFlipTwistMapping} from './flipMappings.ts';

export const cozyEnglish: FlexMapping = {
    name: "The Cozy Keyboard for English",
    techName: "cozy-english",
    localMaximum: true,
    description: `A simple continuation of Qwerty Flip/Twist/Thumb (with a Fling instead of the Spin 😅), 
    although I didn't know of Qwerty Flip when first designing this letter map. 
    We swap T to the right hand and suddenly get very good metrics given very little changes from the original Qwerty.
    There's also an additional KU swap which makes U easier to type and more importantly removes NU and HU SFBs 
    which could be alt-fingered in Qwerty, but become annoyingly noticeable once the N is so easy to type. `,
    mappings: {
        [KeymapTypeId.SplitOrtho]: [
            "qwbf'" + "ykulp-",
            "asdrg" + "hniot;",
            "zxcv=" + "jm,./",
            "⇤\\e⇥",
        ],
        [KeymapTypeId.Thumb30]: [
            "qwbf;" + "y" + "kulp",
            "asdrg" + "hniot",
            "zxcv" + "-" + "jm,.",
            "e",
        ],
    },
    fallback: qwertyFlipTwistMapping,
}

export const cozyGerman: FlexMapping = {
    name: "The Cozy Keyboard, German variant",
    techName: "cozy-german",
    sourceUrl: "https://github.com/matey-jack/gemuetliche-tastatur",
    description: "German and English have very similar letter frequencies. " +
        "I am writing a lot in both languages, and so I optimized for both. " +
        "The result is a Cozy variant with just two changes: O and L stay as in Qwerty" +
        "and Y and Z stay as in the standard German Qwertz. " +
        "This reflects German letter frequencies and also makes it a bit easier to switch " +
        "from the legacy Qwerty/Qwertz mapping. ",
    comparisonBase: qwertzMapping,
    mappings: {
        [KeymapTypeId.Thumb30]: [
            "qwbf-" + "z" + "kuop",
            "asdrg" + "hnilt",
            "yxcv" + ";" + "jm,.",
            "e",
        ]
    },
    fallback: qwertzMapping,
}

export const cozyPlusP: FlexMapping = {
    name: "Cozy plus P",
    description: `Trying out Qwpr's P-Fling which also keeps B on the traditional finger. 
    Qwpr needs this swap because of the PE bigram, but for Thumby it has no benefits.`,
    mappings: {
        [KeymapTypeId.Thumb30]: [
            "qwpfb" + "y" + "kul;",
            "asdrg" + "hniot",
            "zxcv" + "-" + "jm,.",
            "e",
        ]
    },
    fallback: cozyEnglish,
}

export const cozyPlusC: FlexMapping = {
    name: "Cozy plus C",
    description: `Swapping C to a better position on its traditions finger improves the single-key metrics 
    and also keeps B on the traditional finger. `,
    mappings: {
        [KeymapTypeId.Thumb30]: [
            "qwcfb" + "y" + "kulp",
            "asdrg" + "hniot",
            "zx;v" + "-" + "jm,.",
            "e",
        ]
    },
    fallback: cozyEnglish,
}

export const cozyPlusCH: FlexMapping = {
    name: "Cozy plus C and H",
    description: `Swapping C and H on same finger to better positions improves the single-key metrics, 
    but doesn't have significant impact in practical experience. 
    Especially on my ortho keyboard, the old and new H positions are similarly easy to reach. `,
    mappings: {
        [KeymapTypeId.Thumb30]: [
            "qwcfb" + "y" + "kulp",
            "asdrg" + "mniot",
            "zx;v" + "-" + "jh,.",
            "e",
        ]
    },
    fallback: cozyEnglish,
}

export const cozyFlingH: FlexMapping = {
    name: "Cozy, fling H",
    description: `(Just an experiment, NOT a recommended variant.) 
    The Cozy Keyboard has great bigram conflict avoidance due to flipping T to the right hand. 
    This variant tries improving H's position without having to move D or S as Top Nine does. 
    It's a nice try, but neither single nor bigram score approaches the values of Top Nine RST.`,
    mappings: {
        [KeymapTypeId.Thumb30]: [
            "qwfhb" + "y" + "kulp",
            "asdrg" + ";niot",
            "zxcv" + "-" + "jm,.",
            "e",
        ]
    },
    fallback: cozyEnglish,
}


/*  Port of my personal German letter map.
    Note that this supposes a mixed German/ANSI shift-pairing with notably `;:` mapped on `,.` and `=` on `0`.
    Other Shift-mappings can vary, as well as the AltGr mappings, although it seems wise to swap Cmd/AltGr keys because
    most of the German AltGr mappings are on the right hand. This way, we can actually move all of them to the right hand
    (maybe with some compatibility alternatives like @ and € staying on the left as a second/alternative mapping), and thus
    we'd only need one exclusive AltGr key. (A secondary AltGr could be tap/hold on `+` which is rare enough not to lead to
    confusion. Similarly, a secondary tap/hold Fn on the Esc key. This would be so much better than my overloadings of `öy-`
    on the Iris at the moment.)
 */
export const gemuetlichesMapping: FlexMapping = {
    name: "Die Gemütliche Tastatur",
    description: "Full mapping of The Cozy Keyboard, German variant. " +
        "Shows how I map Umlauts and punctuation on ANSI keyboards and the Ergodox. " +
        "(On Iris I use combinding diaeresis key, because I could't fit all three Umlaut letters. ",
    sourceUrl: "https://github.com/matey-jack/gemuetliche-tastatur",
    sourceLinkTitle: "GitHub: matey-jack/gemuetliche-tastatur",
    comparisonBase: qwertzMapping,

    // I actually used this mapping on an ISO keyboard, so the right pinky keys are a bit different!
    mappings: {
        [KeymapTypeId.AnsiWide]: [
            "´ß",
            "qwbfö" + "+zkuopüä",
            "asdrg" + "'hnilt",
            "yxcv/" + "-jm,.",
            "e⌥"
        ],
        [KeymapTypeId.SplitOrtho]: [
            "qwbf'" + "zkuopü",
            "asdrg" + "hniltä",
            "yxcv/" + "jm,.-",
            "ö⌦" + "e+"
        ],
        /*
             The Harmonic port of this mapping changes less than Qwerty, because it is already made for a wide home position.
             Changed chars are üzj+
             ü sends away + because there is one less physical key on the upper row.
             J and - simply swap places, both keep their finger and direction assignment.
             (Alternatively swap also Q and J to improve the positioning for frequency.)
             Finally, with `Z` I am not completely sure: it's still a bit awkward to think about this "new" left off-home position
             although the symmetric position on the right has always been a character key in ANSI, even a letter in German.
             TODO: align those mappings with modifications made on other variants. In particular the Q overspill to the home row.
          */
        [KeymapTypeId.Harmonic13Wide]: [
            "´ß",
            "qwbf" + "öü" + "kuop",
            "zasdrg" + "'" + "hniltä",
            "yxcv" + "/-" + "jm,.",
            "+e"
        ],
        [KeymapTypeId.Harmonic14T]: [
            "ß",
            "qwbfö" + "´ä" + "zkuopü",
            "asdrg" + "'" + "hnilt",
            "yxcv" + "/-" + "jm,.",
            "\\e+"
        ],
    },
    fallback: qwertzMapping,
}