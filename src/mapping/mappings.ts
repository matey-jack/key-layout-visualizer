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

import {type FlexMapping, KeymapTypeId} from "../base-model.ts";
import {
    colemakDhMapping,
    colemakMapping,
    colemakThumbyDMapping,
    colemakThumbyHMapping,
    colemakThumbyLMapping, colemakThumbyNMapping, minimakFullMapping, normanMapping,
} from './colemakMappings.ts';
import {
    enTryMapping,
    ergoFix,
    qweertyMapping,
    qwertyFlipTwistMapping,
    qwertyFlipTwistSpinMapping, qwertyFlipTwistThumbFlingR, qwertyFlipTwistThumbFlingT,
    qwertyFlipTwistThumbMapping,
} from './flipMappings.ts';
import {cozyEnglish, cozyFlingH, cozyGerman, cozyPlusC, cozyPlusCH} from './cozyMappings.ts';
import {top9kul, top9rst, top9t, top9u, topNine, topNineLeftThumb} from './top9mappings.ts';
import {qwertyMapping, qwertyWideMapping, qwertzMapping} from './baseMappings.ts';

export const quipperMapping: FlexMapping = {
    name: "Quipper aka Qwpr",
    techName: "Qwpr",
    localMaximum: true,
    klcId: "qwpr",
    sourceUrl: "https://sourceforge.net/p/qwpr/wiki/Home/",
    description: "By placing 'e' on the right pinky, this mapping avoids a lot of bigram conflicts, " +
        "since no other letter is on that finger. ",
    mappings: {
        [KeymapTypeId.Ansi30]: [
            "qwprf" + "yukl;",
            "asdtg" + "hnioe",
            "zxcvb" + "jm,./",
        ]
    }
}

export const quipperThumbRMapping: FlexMapping = {
    name: "Quipper with Thumb-R",
    techName: "Qwp-Thumb-R",
    description: `We super-charge Quipper by placing R on the thumb and B in R's old spot. 
    This means that the Quipper Home-Row stays unchanged, 
    making it a super-easy upgrade with a lot of benefits both in single-key effort and avoided bigram conflicts. 
    Interestingly, we end up with very similar metrics to The Cozy Keyboard, despite rotating the very frequent letters E, T, and R. `,
    mappings: {
        [KeymapTypeId.Thumb30]: [
            "qwpbf" + "yukl;",
            "asdtg" + "hnioe",
            "zxcv" + "-" + "jm,.",
            "r"
        ]
    },
    fallback: quipperMapping,
}

export const quipperThumbTMapping: FlexMapping = {
    name: "Quipper with Thumb-T",
    techName: "Qwp-Thumb-T",
    description: `We super-charge Quipper by placing T on the thumb, R on T's home spot, and B in R's old spot. 
    This means that the Quipper Home-Row stays unchanged, 
    making it a super-easy upgrade with a lot of benefits both in single-key effort and avoided bigram conflicts. 
    Interestingly, we end up with very similar metrics to The Cozy Keyboard, despite rotating the very frequent letters E, T, and R. `,
    mappings: {
        [KeymapTypeId.Thumb30]: [
            "qwpbf" + "yukl;",
            "asdrg" + "hnioe",
            "zxcv" + "-" + "jm,.",
            "t"
        ]
    },
    fallback: quipperMapping,
}

export const quipperThumbyMapping: FlexMapping = {
    name: "Quipper Thumby",
    localMaximum: true,
    description: `With the Thumb T and the KU swap, Quipper Thumby is an excellent well-rounded mapping. 
    Great typing metrics for little learning effort! (Disclaimer: I haven't actually typed with this letter map.)`,
    mappings: {
        [KeymapTypeId.Thumb30]: [
            "qwpbf" + "ykul;",
            "asdrg" + "hnioe",
            "zxcv" + "-" + "jm,.",
            "t"
        ]
    },
    fallback: quipperMapping,
}

// There are too many contemporary mappings and I have no good way to select representative ones,
// but I do want to include two historically importatn ones that are actually using a letter on thumb key.
export const maltronMapping: FlexMapping = {
    name: "Maltron",
    sourceUrl: "https://www.maltron.com/the-maltron-letter-layout-advantage.html",
    sourceLinkTitle: "Maltron Company Website",
    localMaximum: true,
    description: `Before the keyboard mapping community existed, the Maltron company produced and marketed keyboards that 
    had their own letter mapping... and remarkably with a letter on a thumb key! 
    This is designed exclusively for a split ortho board and I'll leave it at that.`,
    mappings: {
        [KeymapTypeId.SplitOrtho]: [
            "qpycb" + "vmuzl=",
            "anisf" + "dthor'",
            ".,jg;" + "/wk-x",
            "⇤\\e⇥",
        ]
    },
}

export const rsthdMapping: FlexMapping = {
    name: "RSTHD",
    sourceUrl: "https://xsznix.wordpress.com/2016/05/16/introducing-the-rsthd-layout/",
    sourceLinkTitle: `Announcement Blog Post`,
    description: `The first (or at least an early example) of a mapping with thumb letter, now created with the modern metrics 
    of the keyboard community in mind: not just frequent home row use and SFBs, but rolls, scissors, and more.
    Note that RSTD with thumb-E is only defined for Ortho boards, so the wide ANSI version here is an adaption 
    created in a rush just to let the app calculate the metrics.
    It also has a variant without thumb-E which is shown here on the ANSI non-wide and Harmonic layouts. 
    Switch to wide ANSI or split Ortho to see the actually famous version. `,
    // our Thumb30 abstraction doesn't fit this mapping because of different '/' placement.
    // mappingThumb30: [
    //     "jcyfk" + "zl,uq",
    //     "rsthd" + "mnaio",
    //     "/vgpb" + "xw.;'",
    //     "e"
    // ],
    mappings: {
        [KeymapTypeId.Ansi30]: [
            "jcyfk" + "zlou;",
            "rsthd" + "mneia",
            "qvgpb" + "xw,./"
        ],
        [KeymapTypeId.AnsiWide]: [
            "=\\",
            "jcyfk" + "-" + "zl,uq'⌫",
            "rsthd" + "b" + "mnaio",
            "/vgp" + "[]" + "xw.;",
            "e⌥",
        ],
        [KeymapTypeId.SplitOrtho]: [
            "jcyfk" + "zl,uq-",
            "rsthd" + "mnaio=",
            "/vgpb" + "xw.;'",
            "⇤\\e⇥",
        ]
    }
}

// straw man mappings to represent the limit of what's possible in SFBs (bigram effort).
// (Similar to the Top Nine mapping showing a minimal single key effort on ANSI.)
// I spent minimal research effort and just went to https://cyanophage.github.io/
// sorted it by SFB and picked the first using a thumb letter and the first using no thumb letter.

export const snthMapping: FlexMapping = {
    name: "SNTH",
    sourceUrl: "https://www.reddit.com/r/KeyboardLayouts/comments/18jefux/snth/",
    sourceLinkTitle: "r/KeyboardLayouts",
    description: `There are so many mappings proposed nowadays, some of them probably have no actual users,
     because even their creator has moved on. 
     But SNTH stands out on https://cyanophage.github.io/ as the mapping with the lowest SFB.
     (My version here looks different because of constraints of my data model.)`,
    mappings: {
        [KeymapTypeId.Thumb30]: [
            "xpdmq" + "-you,",
            "snthv" + "gcaei",
            "fbklj" + "zw;.",
            "r"
        ]
    },
}

export const rtnaMapping: FlexMapping = {
    name: "RTNA",
    sourceUrl: "https://docs.google.com/document/d/1_a5Nzbkwyk1o0bvTctZrtgsee9jSP-6I0q3A0_9Mzm0/edit?tab=t.0",
    sourceLinkTitle: "The Keyboard Layouts doc, v2",
    description: `See the last page of the linked document. It was actually made as a straw man. `,
    mappings: {
        [KeymapTypeId.Ansi30]: [
            "xdh.q" + "bfouj",
            "rtna;" + "gweis",
            "lkm,/" + "pczyv",
        ]
    }
}

export const allMappings: FlexMapping[] = [
    qwertyMapping,
    qwertyWideMapping,
    ergoFix,
    qweertyMapping,
    enTryMapping,
    qwertzMapping,
    qwertyFlipTwistMapping,
    qwertyFlipTwistSpinMapping,
    qwertyFlipTwistThumbMapping,
    qwertyFlipTwistThumbFlingR,
    qwertyFlipTwistThumbFlingT,
    cozyEnglish,
    cozyGerman,
    // gemuetlichesMapping,
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
    // full 31 key rearrangements
    maltronMapping,
    rsthdMapping,
    // Those two actually don't have significantly better metrics than Colemak and Thumby Colemak.
    // Other than a bug in my code, the reason for the small difference could be the different weights that I use,
    // compared to whatever metrics and weights those mappings for optimized for.
    // snthMapping,
    // rtnaMapping,
]
