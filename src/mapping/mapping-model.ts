
interface KeyMapping {
    name: string;
    // description: string;
    sourceUrl: string;

    // this is 3 rows of 10 characters for ortho/typewriter (classical) mappings
    // and 5 rows of [2, 10, 13, 10, 2] characters for a "full" Harmonic mapping, see harmonic-mapping.ts
    mapping: string[];
}

// interface MappingDiff {
//     // number of changes compared to qwerty
//     sameFinger: number;
//     sameHand: number;
//     swapHands: number;
// }
