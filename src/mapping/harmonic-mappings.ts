import {FlexMapping} from "../base-model.ts";

// probably stuff in this file is obsolete, because we diff layouts after applying the flexMapping to the layoutMapping.

export const harmonicComparisonBaseline: FlexMapping = {
    name: "Harmonic Qwerty",
    description: "Mechanical mapping of Qwerty to the Harmonic Layout. " +
        "This is not for actual use, but serves to calculate differences to estimate learnability.",
    // For calculations, we replace the five keys \/`[] with placeholders to account for them always changing.
    // Thus, the smallest change count is 5, but changing any of those keys won't increase the count.
    sourceUrl: "/",
    mappingHarmonic: [
        "-=",
        "qwer" + "ty" + "uiop",
        "`asdfg" + "\\" + "hjkl;'",
        "zxcv" + "b/" + "nm,.",
        "[]"
    ]
}

/*
    A "perfect home row" is when eight of the eleven most frequent characters are placed on the home row.
    (It's sensible to count the top eleven because D and L are already on the home row and replacing them with a top 8
    letter has less added value. Furthermore, in English the top 6,7,8,9 letters are very close in frequency,
    so they are usually considered together in keymap designs.)
    All casual layouts have a perfect home row, and we can get two steps closer to that place when mitigating for
    Harmonic's weak center keys.

    Qwerty has already 4 out of 8 home row keys "perfect".

    Rationale: swap NJY on same-finger seems to be a no-brainer and also one step to a perfect home row.
    But it doesn't take into account that the lower row is usually a bit harder to access, so it is not all set.
    Swapping T; is a bold hand-switch, but also another step closer to a perfect home row.
    Finally, the BQ swap is debatable in many ways: if off-homerow too precious a position for Q? Would top-center be good enough for B?
    (That would mean less reassignments of letters, since we could move `;` somewhere else...)
    I think I need to print a life-sized version of the keyboard layout to figure that out...

    Anyway, this layout is not something to recommend to anyone anyway. Maybe Qwerty on the Harmonic is not that much worse than Qwerty anywhere,
    so any user will use a better layout instead.
 */
const harmonicBaseline: FlexMapping = {
    name: "Harmonic Baseline",
    description: "Makes minimal changes to QWERTY to mitigate Harmonic's harder to reach center keys. Letters T Y B N are moving to better postions.",
    sourceUrl: "/",
    mappingHarmonic: [
        "-=",
        "bwer" + ";j" + "uiop",
        "qasdfg" + "`" + "hnklt'",
        "zxcv" + "\\/" + "ym,.",
        "[]"
    ]
}
