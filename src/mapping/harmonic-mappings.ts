import {KeyMapping} from "./mapping-model.ts";

export const harmonicComparisonBaseline: KeyMapping = {
    name: "Harmonic Qwerty",
    description: "Mechanical mapping of Qwerty to the Harmonic Layout. " +
        "This is not for actual use, but serves to calculate differences to estimate learnability.",
    // For calculations, we replace the five keys \/`[] with placeholders to account for them always changing.
    // Thus, the smallest change count is 5, but changing any of those keys won't increase the count.
    sourceUrl: "/",
    mapping: [
        "-=",
        "qwer" + "ty" + "uiop",
        "`asdfg" + "\\" + "hjkl;'",
        "zxcv" + "b/" + "nm,.",
        "[]"
    ]
}

/*
    A "perfect home row" is when eight of the eleven most frequent characters are placed on the home row.
    (Including the top 11 is because D and L are already on the home row and replacing them with a top 8 letter has less added value.
    And Top 6,7,8,9 are very close in frequency, so they are usually considered together in keymap designs.)
    All casual layouts have a perfect home row, and we can get two steps closer to that pace when mitigating for Harmonic's weak center keys.

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
const harmonicBaseline: KeyMapping = {
    name: "Harmonic Baseline",
    description: "Makes minimal changes to QWERTY to mitigate Harmonic's harder to reach center keys. Letters T Y B N are moving to better postions.",
    sourceUrl: "/",
    mapping: [
        "-=",
        "bwer" + ";j" + "uiop",
        "qasdfg" + "`" + "hnklt'",
        "zxcv" + "\\/" + "ym,.",
        "[]"
    ]
}

// first draft of a port of my personal German layout, but without the German letters.
// Bottom left thumb key could alternatively be used for Delete, as on my Iris. And [] as Home/End keys.
// (But adding PgUp/PgDn would mean more refactoring and a more complicated AltGr layer.)
const harmonicCozy: KeyMapping = {
    name: "Harmonic Baseline",
    description: "A few letter swaps, off-home row hyphen, and a thumb E. I used a German derivate of this for more than ten years daily.",
    sourceUrl: "/",
    mapping: [
        "[]",
        "qwbf" + ";j" + "kuop",
        "-asdrg" + "`" + "hnilt'",
        "zxcv" + "=/" + "ym,.",
        "\\e"
    ]
}

/* Port of my personal German layout. It changes less than Qwerty, because it is already made for a wide home position.
     Changed chars are üzj+
     ü sends away + because there is one less physical key on the upper row.
     J and - simply swap places, both keep their finger and direction assignment.
     (Alternatively swap also Q and J to improve the positioning for frequency.)
     Finally, with `Z` I am not completely sure: it's still a bit awkward to think about this "new" left off-home position
     although the symmetric position on the right has always been a character key in ANSI, even a letter in German.

     Note that this supposes a mixed German/ANSI shift-pairing with notably `;:` mapped on `,.` and `=` on `0`.
     Other Shift-mappings can vary, as well as the AltGr mappings, although it seems wise to swap Cmd/AltGr keys because
     most of the German AltGr mappings are on the right hand. This way, we can actually move all of them to the right hand
     (maybe with some compatibility alternatives like @ and € staying on the left as a second/alternative mapping), and thus
     we'd only need one exclusive AltGr key. (A secondary AltGr could be tap/hold on `+` which is rare enough not to lead to
     confusion. Similarly, a secondary tap/hold Fn on the Esc key. This would be so much better than my overloadings of `öy-`
     on the Iris at the moment.)
 */
const harmonicGemuetlich: KeyMapping = {
    name: "Harmonic Baseline",
    description: "A few letter swaps, off-home row hyphen, and a thumb E. I used a German derivate of this for more than ten years daily.",
    sourceUrl: "/",
    mapping: [
        "´ß",
        "qwbf" + "öü" + "kuop",
        "zasdrg" + "'" + "hniltä",
        "yxcv" + "/j" + "-m,.",
        "+e"
    ]
}
