import {type FlexMapping, KeymapTypeId} from '../base-model.ts';

export const qwertyMapping: FlexMapping = {
    name: "Qwerty – US and world-wide standard",
    techName: "QWERTY",
    klcId: "qwerty",
    description: `This ancient typewriter-born key mapping is so ubiquitous today that many people might never have seen 
    a different mapping in their whole life. At the same time it is also extra-ordinary bad for touch-typing, 
    because frequently used letters are not in the center. `,
    sourceUrl: "https://en.wikipedia.org/wiki/QWERTY",
    mappings: {
        [KeymapTypeId.Ansi30]: [
            "qwert" + "yuiop",
            "asdfg" + "hjkl;",
            "zxcvb" + "nm,./",
        ],
    },
}

export const qwertyWideMapping: FlexMapping = {
    name: "Qwerty Wide",
    description: `Small changes to Qwerty for a wide hand position. 
    This makes it easy to swap keycaps on your keyboard to fit the layout, by not changing the J and \\| key position. e
    This is, how, as a nice side-effect, N moves to the home-row.
    Thus the mapping becomes a gateway drug to more layout changes, because it makes it feel good to have N on a home key 
    and weird to not have more frequent letters there, too.
    We also pair [] and +- vertically and close, instead of horizontally and split (as would happen with the automatically generated wide-mod),
    which brings the frequently used hyphen into a better position.
    A lot of muscle memory is preserved because + and - stay on the same finger and in the same direction of movement.
    For a fun laptop version, [] could be replaced by Home/End and \\ by Delete. 
    Far better to have those keys in standard positions (instead of random model-dependent Laptop positions),
    because the characters can as well be accessible on the AltGr layer.`,
    mappings: {
        [KeymapTypeId.AnsiWide]: [
            "[=",
            "qwert" + "]" + "yuiop-\\",
            "asdfg" + ";" + "jnkl'",
            "zxcvb" + "/" + "hm,.",
            "⌥≡",
        ],
    },
    fallback: qwertyMapping,
    // don't define mapping30, so the app switches automatically into wide mode and only shows this on the ANSI keyboard.
}


export const qwertzMapping: FlexMapping = {
    name: "Qwertz – German Standard",
    techName: "QWERTZ",
    description: "Qwerty, but with z/y swapped and three more letters added instead of extended punctuation.",
    sourceUrl: "https://en.wikipedia.org/wiki/QWERTZ",
    // This is not correct but needed as a diffing base for the Cozy German mapping that is only defined as a mapping30.
    // Otherwise, the app will crash just by switching to Ortho layout on any mapping. :/
    mappings: {
        [KeymapTypeId.Ansi30]: [
            "qwert" + "zuiop",
            "asdfg" + "jnkl;",
            "yxcvb" + "hm,./",
        ],
        [KeymapTypeId.Ansi]: [
            "ß´",
            "qwert" + "zuiopü+#",
            "asdfg" + "hjklöä",  // there is # on the ISO key here
            "yxcvb" + "nm,.-",   // and <> on the ISO key here
        ],
        [KeymapTypeId.AnsiWide]: [
            "´ß",
            "qwert" + "+" + "zuiopüä",
            "asdfg" + "#hjklö",  // there is ä on the ISO key here
            "yxcvb" + "-nm,.",   // and <> on the ISO key here
            "⌥≡"
        ],
        // We have one less key above the bottom on the Harmonic 14T than on ANSI, and one taken up by Escape,
        // but we have two character keys in the bottom, so it checks out to 100% coverage!
        [KeymapTypeId.Harmonic14T]: [
            "ß",
            "qwert" + "+z" + "uiopüä",
            "asdfg" + "#" + "hjklö",
            "yxcvb" + "-" + "nm,.",
            "^⌥´≡"
        ]
    }
}
