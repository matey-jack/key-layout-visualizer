import {FlexMapping} from "../base-model.ts";

// probably stuff in this file is obsolete, because we diff layouts after applying the flexMapping to the layoutMapping.

export const harmonicComparisonBaseline: FlexMapping = {
    name: "Harmonic Qwerty",
    description: "Mechanical mapping of Qwerty to the Harmonic Layout. " +
        "This is not for actual use, but serves to calculate differences to estimate learnability.",
    // For calculations, we replace the five keys \/`[] with placeholders to account for them always changing.
    // Thus, the smallest change count is 5, but changing any of those keys won't increase the count.
    sourceUrl: "/",
    mappingHarmonic13c: [
        "-=",
        "wert" + "`" + "yuiop",
        "qasdfg" + "\\" + "hjkl;'",
        "zxcv" + "b/" + "nm,.",
        "[]"
    ]
}

/*
    With Qwerty on Harmonic (both versions, actually) B and Y are not on neighbor-of-home keys
    B isn't there on ANSI either, but Y is worse to type on Harmonic, so we can fix that with a ring-swap NJY.
    Best minimal way to fix B is a H;B ring swap. But then again, no layout is good until E is on a thumb key,
    and when doing that, another place will be free for B... after a lot of keys move triggered by E's free spot.
 */
const harmonicBaseline: FlexMapping = {
    name: "Harmonic Baseline",
    description: "Simple NJY ring-swap on Qwerty to mitigate for worse typing score of Y on Harmonic.",
    sourceUrl: "/",
    mapping30: [
        "qwert" + "juiop",
        "asdfg" + "hnkl;",
        "zxcv" + "ym,./",
    ]
}
