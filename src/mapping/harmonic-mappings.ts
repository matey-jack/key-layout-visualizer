
const harmonicComparisonBaseline: KeyMapping = {
    name: "Harmonic Qwerty",
    description: "Mechanical mapping of Qwerty to the Harmonic Layout. " +
        "This is not for actual use, but serves to calculate differences to estimate learnability.",
    // For calculations, we replace the five keys \/`[] with placeholders to account for them always changing.
    // Thus, the smallest change count is 5, but changing any of those keys won't increase the count.
    sourceUrl: "/",
    mapping: [
        "-=",
        "qwer" + "ty" + "uiop",
        "`asdfg" + "\\" + "hnkl;'",
        "zxcv" + "b/" + "ym,.",
        "[]"
    ]
}

const harmonicBaseline: KeyMapping = {
    name: "Harmonic Baseline",
    description: "Makes minimal changes to QWERTY to mitigate Harmonic's weaker center. Letters T Y B are moving to better postions.",
    sourceUrl: "/",
    mapping: [
        "-=",
        "bwer" + ";j" + "uiop",
        "qasdfg" + "`" + "hnklt'",
        "zxcv" + "\\/" + "ym,.",
        "[]"
    ]
}
