import {beforeEach, describe, expect, it } from "vitest";
import {AnsiVariant, HarmonicVariant, PlankVariant} from "./app-model";
import {createAppState} from "./app-state";
import {type FlexMapping, KeymapTypeId, LayoutType } from "./base-model";
import {hasMatchingMapping} from "./layout/layout-functions";
import {qwertyMapping, qwertyWideMapping, qwertzMapping} from './mapping/baseMappings.ts';
import {colemakMapping, colemakThumbyDMapping} from './mapping/colemakMappings.ts';
import {cozyEnglish} from './mapping/cozyMappings.ts';
import {maltronMapping} from "./mapping/mappings";

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

