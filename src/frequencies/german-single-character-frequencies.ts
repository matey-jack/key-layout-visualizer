// data from https://de.wikipedia.org/wiki/Buchstabenh%C3%A4ufigkeit
// converted to occurrences per thousand for better readability

// data on punctuation copied from English, omitting the apostrophe which is much rarer in German.

export const singleCharacterFrequencies: Record<string, number> = {
    E: 174,
    N: 97.8,
    I: 75.5,
    S: 72.7,
    R: 70.0,
    A: 65.1,
    T: 61.5,
    D: 50.8,
    H: 47.6,
    U: 43.5,
    L: 34.4,
    C: 30.6,
    G: 30.1,
    M: 25.3,
    O: 25.1,
    B: 18.9,
    W: 18.9,
    F: 16.6,
    K: 12.1,
    Z: 11.3,
    ".": 10.0,
    ",": 10.0,
    P: 7.9,
    V: 6.7,
    "-": 5.0,
    "ẞ": 3.1,
    J: 2.7,
    Y: 0.4,
    X: 0.3,
    Q: 0.2,
}