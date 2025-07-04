// data from https://en.wikipedia.org/wiki/Letter_frequency
// converted to occurrences per thousand for better readability

// data on punctuation from https://www.researchgate.net/publication/328512136_Frequency_Distributions_of_Punctuation_Marks_in_English_Evidence_from_Large-scale_Corpora
// those are punctuation character counts per million words which I divided by 4.7 (average English word length) to get to per million characters.
// (This is low accuracy, but it's fine, because just having the right order of magnitude helps to put things in perspective.

export const singleCharacterFrequencies: Record<string, number> = {
    E: 127,
    T: 91,
    A: 82,
    O: 75,
    I: 70,
    N: 67,
    S: 63,
    H: 61,
    R: 60,
    D: 43,
    L: 40,
    C: 28,
    U: 28,
    M: 24,
    W: 24,
    F: 22,
    G: 20,
    Y: 20,
    P: 19,
    B: 15,
    ",": 10,
    ".": 10,
    V: 9.8,
    K: 7.7,
    "-": 5,
    "'": 2,
    J: 1.5,
    X: 1.5,
    Q: 1.0,
    Z: 0.7,
}