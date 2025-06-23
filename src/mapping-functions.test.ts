import { describe, it, expect } from 'vitest';

import {harmonicMapping} from "./HarmonicLayoutConfig.ts";
import {getLabel} from "./mapping-functions.ts";
import {KeyboardRows} from "./model.ts";
import {QwertyMapping} from "./KeyMapping.tsx"

describe('getLabel', () => {
    const quertyMapping = QwertyMapping.mapping;
    it('merges all the labels for the Harmonic layout, number row', () => {
        const labels = harmonicMapping[KeyboardRows.Number].map(
            (label) => getLabel(label, quertyMapping)
        );
        expect(labels).toStrictEqual(["Esc", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "="]);
    })

    it('merges all the labels for the Harmonic layout, upper letter row', () => {
        const labels = harmonicMapping[KeyboardRows.Upper].map(
            (label) => getLabel(label, quertyMapping)
        );
        expect(labels).toStrictEqual(["↹", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "⌫",]);
    })

    it('merges all the labels for the Harmonic layout, home row', () => {
        const labels = harmonicMapping[KeyboardRows.Home].map(
            (label) => getLabel(label, quertyMapping)
        );
        expect(labels).toStrictEqual(["`~", "a", "s", "d", "f", "g", "", "h", "j", "k", "l", ";", "'"]);
    })

    it('merges all the labels for the Harmonic layout, lower letter row', () => {
        const labels = harmonicMapping[KeyboardRows.Lower].map(
            (label) => getLabel(label, quertyMapping)
        );
        expect(labels).toStrictEqual(["⇧", "z", "x", "c", "v", "b", "/", "n", "m", ",", ".", "⇧",]);
    })

    it('merges all the labels for the Harmonic layout, bottom row', () => {
        const labels = harmonicMapping[KeyboardRows.Bottom].map(
            (label) => getLabel(label, quertyMapping)
        );
        expect(labels).toStrictEqual(["Ctrl", "Cmd", "Alt", "", "⍽", "⏎", "", "AltGr", "Fn", "Ctrl",]);
    })

});
