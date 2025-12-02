import {describe, expect, it} from "vitest";
import {createAppState} from "./app-state";
import {LayoutType} from "./base-model";
import {AnsiVariant,} from "./app-model";
import {cozyEnglish,} from "./mapping/mappings";

describe("setMapping", () => {
    // TODO: this test won't work until setMapping uses the new data model
    it.skip("switches to ANSI wide for thumb-using keymap", () => {
        // given
        const appState = createAppState();
        expect(appState.layout.value.type).toBe(LayoutType.ANSI);
        // when
        appState.setMapping(cozyEnglish);
        // then
        expect(appState.layout.value.ansiWide).toBe(true);
    })
});

describe("setLayout", () => {
    it("changes layout type from default", () => {
        // given
        const appState = createAppState();
        expect(appState.layout.value.type).toBe(LayoutType.ANSI);
        // when
        appState.setLayout({...appState.layout.value, type: LayoutType.Ergoplank});
        // then
        expect(appState.layout.value.type).toBe(LayoutType.Ergoplank);
    })

    it("sets ANSI wide flag when a thumb-using mapping is active", () => {
        // given
        const appState = createAppState();
        // switch to a thumb-enabled layout first, to avoid setMapping() already setting the wide flag.
        appState.setLayout({...appState.layout.value, type: LayoutType.Ergoplank});
        appState.setMapping(cozyEnglish);
        // when
        appState.setLayout({...appState.layout.value, type: LayoutType.ANSI, ansiVariant: AnsiVariant.IBM});
        // then
        expect(appState.layout.value.ansiWide).toBe(true);
    })
});
