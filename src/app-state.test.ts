import {beforeEach, describe, expect, it} from "vitest";
import {AnsiVariant, ErgoboardVariant, HarmonicVariant, PlankVariant} from "./app-model";
import {createAppState} from "./app-state";
import {type FlexMapping, KeymapTypeId, type LayoutModel, LayoutType} from "./base-model";
import {allLayoutModels} from "./all-layout-models.ts";
import {alignForHex} from "./layout/harmonic-layout-functions.ts";
import {fillMapping, hasMatchingMapping} from "./layout/layout-functions";
import {hasNumberRow} from "./mapping/key-level-functions.ts";
import {hasColloquialLevel, ShiftPairing, shiftPairingFor} from "./mapping/key-levels.ts";
import {danishMapping, qwertyMapping, qwertyWideMapping, qwertzMapping} from './mapping/baseMappings.ts';
import {colemakMapping, colemakThumbyDMapping} from './mapping/colemakMappings.ts';
import {cozyEnglish} from './mapping/cozyMappings.ts';
import {allMappings, maltronMapping} from "./mapping/mappings";

beforeEach(() => {
    window.location.hash = "";
});

describe("setMapping", () => {
    it("switches to ANSI wide for thumb-using keymap", () => {
        // given
        const appState = createAppState();
        appState.setLayout({type: LayoutType.ANSI, ansiWide: false});
        // when
        appState.setMapping(cozyEnglish);
        // then
        expect(appState.layout.value.ansiWide).toBe(true);
    })

    it("replaces HHKB for thumb-using keymap", () => {
        // given
        const appState = createAppState();
        appState.setLayout({type: LayoutType.ANSI, ansiVariant: AnsiVariant.HHKB});
        // when
        appState.setMapping(cozyEnglish);
        // then
        expect(appState.layout.value.ansiVariant).not.toBe(AnsiVariant.HHKB);
        expect(appState.layout.value.ansiWide).toBe(true);
    })

    it("switches layout type for specific keymap: Ergosplit", () => {
        // given
        const appState = createAppState();
        appState.setLayout({type: LayoutType.Ergoplank});
        // when
        appState.setMapping(maltronMapping);
        // then
        expect(appState.layout.value.type).toBe(LayoutType.Ergosplit);
    })

    it("switches layout type for specific keymap: ANSI wide", () => {
        // given
        const appState = createAppState();
        appState.setLayout({type: LayoutType.Ergosplit})
        // when
        appState.setMapping(qwertyWideMapping);
        // then
        expect(appState.layout.value.type).toBe(LayoutType.ANSI);
    })

    it("switches layout to Harmonic when setting a mapping that only supports Harmonic layout", () => {
        // given
        const appState = createAppState();
        appState.setLayout({type: LayoutType.ANSI, ansiWide: false});

        const harmonicOnlyMapping: FlexMapping = {
            name: "Harmonic Only",
            mappings: {
                [KeymapTypeId.Harmonic13Wide]: [
                    "qwbf" + "öü" + "kuop",
                    "zasdrg" + "'" + "hniltä",
                    "yxcv" + "/-" + "jm,.",
                    "+e"
                ]
            }
        };

        // when
        appState.setMapping(harmonicOnlyMapping);

        // then
        expect(appState.layout.value.type).toBe(LayoutType.Harmonic);
        expect(appState.layout.value.harmonicVariant).toBe(HarmonicVariant.H13_Wide);
        expect(appState.mapping.value).toBe(harmonicOnlyMapping);
    });

    it("switches layout recursively to try all plank sub-variants when setting a mapping", () => {
        // given
        const appState = createAppState();
        appState.setLayout({
            type: LayoutType.Ergoplank,
            plankVariant: PlankVariant.KATANA_60, // only supports Ansi30
        });

        // when
        appState.setMapping(qwertzMapping);

        // then
        expect(appState.layout.value.type).toBe(LayoutType.Ergoplank);
        expect(appState.layout.value.plankVariant).toBe(PlankVariant.ERGOSLAT);
        expect(appState.mapping.value).toBe(qwertzMapping);
    });

    it("switches to Ergoboard MidShift Comfy Wide when active layout is a MidShift narrow variant and qwertzMapping is selected", () => {
        // given
        const appState = createAppState();
        appState.setLayout({
            type: LayoutType.Ergoplank,
            plankVariant: PlankVariant.ERGOBOARD_LEGACY,
            ergoboardVariant: ErgoboardVariant.RIGHT_ENTER, // narrow variant
        });

        // when
        appState.setMapping(qwertzMapping);

        // then
        expect(appState.layout.value.type).toBe(LayoutType.Ergoplank);
        expect(appState.layout.value.plankVariant).toBe(PlankVariant.ERGOBOARD_LEGACY);
        expect(appState.layout.value.ergoboardVariant).toBe(ErgoboardVariant.COMFY_WIDE);
        expect(appState.mapping.value).toBe(qwertzMapping);
    });
});

describe("setLayout", () => {
    it("changes layout type from default", () => {
        // given
        const appState = createAppState();
        expect(appState.layout.value.type).toBe(LayoutType.ANSI);
        // when
        appState.setLayout({type: LayoutType.Ergoplank});
        // then
        expect(appState.layout.value.type).toBe(LayoutType.Ergoplank);
    })

    it("sets ANSI wide flag when a thumb-using mapping is active", () => {
        // given
        const appState = createAppState();
        // switch to a thumb-enabled layout first, to avoid setMapping() already setting the wide flag.
        appState.setLayout({type: LayoutType.Ergoplank});
        appState.setMapping(cozyEnglish);
        // when
        appState.setLayout({type: LayoutType.ANSI, ansiVariant: AnsiVariant.IBM});
        // then
        expect(appState.layout.value.ansiWide).toBe(true);
    })

    it("preserves mapping and switches layout to a compatible sub-variant when setLayout is called with an incompatible sub-variant", () => {
        // given 1: set the Ergoplank subvariant (to stay selected in the background)
        const appState = createAppState();
        appState.setLayout({
            type: LayoutType.Ergoplank,
            plankVariant: PlankVariant.ERGOBOARD_LEGACY,
            ergoboardVariant: ErgoboardVariant.RIGHT_ENTER,
        });

        // given 2: select another variant and mapping
        appState.setLayout({type: LayoutType.ANSI});
        appState.setMapping(qwertzMapping);
        expect(appState.mapping.value).toBe(qwertzMapping);

        // when - switch to Ergoboard (previously selected subvariant)
        appState.setLayout({type: LayoutType.Ergoplank,});

        // then - it should automatically fall back to COMFY_WIDE to preserve the qwertzMapping
        expect(appState.layout.value.type).toBe(LayoutType.Ergoplank);
        expect(appState.layout.value.plankVariant).toBe(PlankVariant.ERGOBOARD_LEGACY);
        expect(appState.layout.value.ergoboardVariant).toBe(ErgoboardVariant.COMFY_WIDE);
        expect(appState.mapping.value).toBe(qwertzMapping);
    });

    it("does not fallback to another variant when setLayout is called explicitly with an incompatible variant, but instead falls back the mapping", () => {
        // given
        const appState = createAppState();
        appState.setLayout({
            type: LayoutType.Ergoplank,
            plankVariant: PlankVariant.ERGOSLAT,
        });
        appState.setMapping(qwertzMapping);
        expect(appState.layout.value.plankVariant).toBe(PlankVariant.ERGOSLAT);
        expect(appState.mapping.value).toBe(qwertzMapping);

        // when - switch variant explicitly to KATANA_60 which does not support qwertzMapping
        appState.setLayout({ plankVariant: PlankVariant.KATANA_60 });

        // then - layout variant should be KATANA_60, and mapping should fallback
        expect(appState.layout.value.plankVariant).toBe(PlankVariant.KATANA_60);
        expect(appState.mapping.value).not.toBe(qwertzMapping);
    });

    it("when setLayout is called explicitly with an incompatible subvariant, fall back the mapping", () => {
        // given
        const appState = createAppState();
        appState.setLayout({
            type: LayoutType.Ergoplank,
            plankVariant: PlankVariant.ERGOBOARD_LEGACY,
            ergoboardVariant: ErgoboardVariant.COMFY_WIDE
        });
        appState.setMapping(qwertzMapping);
        expect(appState.layout.value.type).toBe(LayoutType.Ergoplank);
        expect(appState.layout.value.plankVariant).toBe(PlankVariant.ERGOBOARD_LEGACY);
        expect(appState.layout.value.ergoboardVariant).toBe(ErgoboardVariant.COMFY_WIDE);
        expect(appState.mapping.value).toBe(qwertzMapping);

        // when - switch subvariant explicitly to KATANA_60 which does not support qwertzMapping
        appState.setLayout({ ergoboardVariant: ErgoboardVariant.RIGHT_ENTER });

        // then - layout variant should be KATANA_60, and mapping should fallback
        expect(appState.layout.value.plankVariant).toBe(PlankVariant.ERGOBOARD_LEGACY);
        expect(appState.layout.value.ergoboardVariant).toBe(ErgoboardVariant.RIGHT_ENTER);
        expect(appState.mapping.value).not.toBe(qwertzMapping);
    });

    it("restricts fallback layout candidates when a variant is explicitly changed without a subvariant", () => {
        // given: select an Ergoboard subvariant that doesn't support ansi32 mappings
        const appState = createAppState();
        appState.setLayout({
            type: LayoutType.Ergoplank,
            plankVariant: PlankVariant.ERGOBOARD_LEGACY,
            ergoboardVariant: ErgoboardVariant.RIGHT_ENTER,
        });
        // given: switch to qwertzMapping and Ergoplank (which matches)
        appState.setLayout({
            type: LayoutType.Ergoplank,
            plankVariant: PlankVariant.ERGOSLAT,
        });
        appState.setMapping(qwertzMapping);
        expect(appState.mapping.value).toBe(qwertzMapping);

        // when - switch variant explicitly to ERGOBOARD_MID_SHIFT (which has narrow variants that do not support qwertzMapping)
        // Since we explicitly request ERGOBOARD_MID_SHIFT, it must NOT fallback to ERGOSLAT or ERGOPLANK.
        // But since we did not specify the subvariant (ergoboardVariant), it can fallback *within* mid-shift variants to COMFY_WIDE (which supports qwertzMapping).
        appState.setLayout({ plankVariant: PlankVariant.ERGOBOARD_LEGACY });

        // then - layout variant should be ERGOBOARD_MID_SHIFT, subvariant should be COMFY_WIDE, and mapping should be preserved
        expect(appState.layout.value.plankVariant).toBe(PlankVariant.ERGOBOARD_LEGACY);
        expect(appState.layout.value.ergoboardVariant).toBe(ErgoboardVariant.COMFY_WIDE);
        expect(appState.mapping.value).toBe(qwertzMapping);
    });

    it("use fallback mapping when thumb keys are not available any more", () => {
        // given
        const appState = createAppState();
        appState.setMapping(colemakThumbyDMapping)
        // when
        appState.setLayout({type: LayoutType.ANSI, ansiVariant: AnsiVariant.HHKB});
        // then
        expect(appState.mapping.value).toBe(colemakMapping);
    })

    it("falls back to qwertyMapping when fallback chain has no match", () => {
        // given
        const appState = createAppState();
        const fallbackMapping: FlexMapping = {
            name: "Custom Ortho Fallback",
            mappings: {
                [KeymapTypeId.SplitOrtho]: [
                    "qpycb" + "vmuzl'",
                    "anisf" + "dthor",
                    ".,jg;" + "/wk-x",
                    "⇤=e\\⇥",
                ]
            }
        };
        const customMapping: FlexMapping = {
            name: "Custom Only Ortho",
            fallback: fallbackMapping,
            mappings: {
                [KeymapTypeId.SplitOrtho]: [
                    "qpycb" + "vmuzl'",
                    "anisf" + "dthor",
                    ".,jg;" + "/wk-x",
                    "⇤=e\\⇥",
                ]
            }
        };
        appState.setLayout({type: LayoutType.Ergosplit});
        appState.setMapping(customMapping);
        expect(appState.mapping.value).toBe(customMapping);

        // when - switch to ANSI layout (does not support SplitOrtho)
        appState.setLayout({type: LayoutType.ANSI, ansiVariant: AnsiVariant.IBM});

        // then
        expect(appState.mapping.value).toBe(qwertyMapping);
    });

    it("falls back to the first layout-compatible mapping in allMappings when qwertyMapping is also incompatible", () => {
        // given
        const appState = createAppState();
        const customMapping: FlexMapping = {
            name: "Custom Ortho Only",
            mappings: {
                [KeymapTypeId.SplitOrtho]: [
                    "qpycb" + "vmuzl'",
                    "anisf" + "dthor",
                    ".,jg;" + "/wk-x",
                    "⇤=e\\⇥",
                ]
            }
        };
        appState.setLayout({type: LayoutType.Ergosplit});
        appState.setMapping(customMapping);
        expect(appState.mapping.value).toBe(customMapping);

        // Temporarily clear qwertyMapping's mappings
        const originalQwertyMappings = qwertyMapping.mappings;
        qwertyMapping.mappings = {};

        try {
            // when - switch to ANSI layout (does not support SplitOrtho)
            appState.setLayout({type: LayoutType.ANSI, ansiVariant: AnsiVariant.IBM});

            // then
            expect(appState.mapping.value).not.toBe(customMapping);
            expect(appState.mapping.value).not.toBe(qwertyMapping);
            expect(hasMatchingMapping(appState.layoutModel.value, appState.mapping.value)).toBe(true);
        } finally {
            // Restore
            qwertyMapping.mappings = originalQwertyMappings;
        }
    });

    it("handles circular mapping fallback chains without hanging, falling back to qwertyMapping", () => {
        // given
        const appState = createAppState();
        const mappingA: FlexMapping = {
            name: "Mapping A",
            mappings: {
                [KeymapTypeId.SplitOrtho]: [
                    "qpycb" + "vmuzl'",
                    "anisf" + "dthor",
                    ".,jg;" + "/wk-x",
                    "⇤=e\\⇥",
                ]
            }
        };
        const mappingB: FlexMapping = {
            name: "Mapping B",
            mappings: {
                [KeymapTypeId.SplitOrtho]: [
                    "qpycb" + "vmuzl'",
                    "anisf" + "dthor",
                    ".,jg;" + "/wk-x",
                    "⇤=e\\⇥",
                ]
            }
        };
        mappingA.fallback = mappingB;
        mappingB.fallback = mappingA;

        appState.setLayout({type: LayoutType.Ergosplit});
        appState.setMapping(mappingA);
        expect(appState.mapping.value).toBe(mappingA);

        // when - switch to ANSI layout (does not support SplitOrtho)
        appState.setLayout({type: LayoutType.ANSI, ansiVariant: AnsiVariant.IBM});

        // then
        expect(appState.mapping.value).toBe(qwertyMapping);
    });
});

describe("URL hash parameters", () => {
    it("parses epRightRet from window.location.hash and serializes it back", () => {
        // given
        window.location.hash = "#layout=2&plank=2&epRightRet=1";
        const appState = createAppState();

        // then
        expect(appState.layout.value.epRightReturn).toBe(true);

        // when
        appState.setLayout({ epRightReturn: false });

        // then
        const params = new URLSearchParams(window.location.hash.slice(1));
        expect(params.get("epRightRet")).toBe("0");
    });
});


/*
    The one value the keyboard, the level switches and the details text all read. Its rules are in
    mapping/key-levels.ts and tested there; what matters here is that the app state applies them to
    the right board and hands out an answer the three consumers can share.
 */
describe("resolvedKeyLevels", () => {
    it("selects a colloquial level only where the key map has one, and only in that viz", () => {
        window.location.hash = "#layout=0&mapping=QWERTY&viz=8&colloquial=1";
        const appState = createAppState();
        expect(appState.resolvedKeyLevels.value.hasColloquialLevel).toBe(true);
        expect(appState.resolvedKeyLevels.value.colloquial).toBe(true);
        expect(appState.resolvedKeyLevels.value.pairing).toBe(ShiftPairing.Colloquial);

        // The switch stays on, but a German map has nothing for it to select.
        appState.setMapping(qwertzMapping);
        expect(appState.shiftColloquial.value).toBe(true);
        expect(appState.resolvedKeyLevels.value.hasColloquialLevel).toBe(false);
        expect(appState.resolvedKeyLevels.value.colloquial).toBe(false);
        expect(appState.resolvedKeyLevels.value.pairing).toBe(ShiftPairing.German);
    });

    it("leaves the board un-colloquialised outside the key levels visualization", () => {
        window.location.hash = "#layout=0&mapping=QWERTY&viz=0&colloquial=1";
        const appState = createAppState();
        expect(appState.resolvedKeyLevels.value.hasColloquialLevel).toBe(true);
        expect(appState.resolvedKeyLevels.value.colloquial).toBe(false);
        expect(appState.resolvedKeyLevels.value.pairing).toBe(ShiftPairing.Ansi);
    });

    it("forces the colloquial level where the board cannot serve the standard one", () => {
        window.location.hash = "#viz=8&colloquial=0";
        const appState = createAppState();
        appState.setLayout({type: LayoutType.Ergoplank, plankVariant: PlankVariant.ERGOSLAT});
        appState.setMapping(danishMapping);
        // The 13/3 has no `/` key, so the ANSI number row would leave `/` and `?` untypeable.
        expect(appState.resolvedKeyLevels.value.hasStandardLevel).toBe(false);
        expect(appState.shiftColloquial.value).toBe(false);
        expect(appState.resolvedKeyLevels.value.colloquial).toBe(true);
        expect(appState.resolvedKeyLevels.value.pairing).toBe(ShiftPairing.ColloquialInternational);

        // A board with the key to spare leaves the choice to the switch.
        appState.setLayout({type: LayoutType.Ergoplank, plankVariant: PlankVariant.ERGOPLANK});
        expect(appState.resolvedKeyLevels.value.hasStandardLevel).toBe(true);
        expect(appState.resolvedKeyLevels.value.colloquial).toBe(false);
        expect(appState.resolvedKeyLevels.value.pairing).toBe(ShiftPairing.International);
    });
    it("follows the selected board and key map", () => {
        window.location.hash = "#layout=0&mapping=QWERTY&viz=8";
        const appState = createAppState();
        expect(appState.resolvedKeyLevels.value.keymapType).toBe(KeymapTypeId.Ansi30);
        expect(appState.resolvedKeyLevels.value.hasNumberRow).toBe(true);

        appState.setMapping(danishMapping);
        expect(appState.resolvedKeyLevels.value.keymapType).toBe(KeymapTypeId.Ansi32);
        expect(appState.resolvedKeyLevels.value.pairing).toBe(ShiftPairing.International);
    });
});

/*
    Deriving the levels once is only sound because the rules read the character set, which neither
    the hexagon alignment nor the flipped Return/Rubout changes. The app state therefore resolves
    them from the plain board, while LayoutArea draws a rearranged one.

    The colloquial rearrangement is the one thing that does change the character set: it takes the
    `;` that marks an English key map away, so a colloquialised board lands on the international
    table instead. That the two colloquial tables agree is pinned in mapping/key-levels.test.ts.
 */
describe("the plain board can speak for the rendered one", () => {
    it("resolves alike on the plain and the hexagon-aligned board", () => {
        const divergent: string[] = [];
        let combos = 0;
        for (const model of allLayoutModels) {
            const hexed = alignForHex(model);
            for (const mapping of allMappings.filter((m) => hasMatchingMapping(model, m))) {
                combos++;
                const plain = fillMapping(model, mapping)!;
                const onHex = fillMapping(hexed, mapping)!;
                // `true` asks for the colloquial level wherever there is one, which is the case
                // where the two boards differ most.
                const pairing = (charMap: string[][], m: LayoutModel) =>
                    shiftPairingFor(charMap, hasNumberRow(m), true);
                const expected = pairing(plain, model);
                const got = pairing(onHex, hexed);
                if (got !== expected) {
                    divergent.push(`${model.name} / ${mapping.name}: hexagons say ${got}, plain says ${expected}`);
                }
                if (hasColloquialLevel(onHex, hasNumberRow(hexed))
                    !== hasColloquialLevel(plain, hasNumberRow(model))) {
                    divergent.push(`${model.name} / ${mapping.name}: hexagons disagree about having a colloquial level`);
                }
            }
        }
        expect(combos).toBeGreaterThan(1500);
        expect(divergent).toEqual([]);
    });
});
