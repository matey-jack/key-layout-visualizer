import {describe, expect, it} from "vitest";
import {AnsiVariant,} from "./app-model";
import {createAppState} from "./app-state";
import {LayoutType} from "./base-model";
import {maltronMapping} from "./mapping/mappings";
import {cozyEnglish} from './mapping/cozyMappings.ts';
import {colemakMapping, colemakThumbyDMapping} from './mapping/colemakMappings.ts';
import {qwertyWideMapping} from './mapping/baseMappings.ts';

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

