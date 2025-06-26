import {describe, it, expect} from 'vitest';

import {harmonicLayoutModel} from "./harmonicLayoutModel.ts";
import {fillMapping, getLabel} from "./layout-model.ts";
import {KeyboardRows} from "../model.ts";
import {QwertyMapping} from "../mapping/mappings-30-keys.ts"

describe('fillMapping', () => {
    it('Harmonic layout 30-key qwerty', () => {
        const actual = fillMapping(harmonicLayoutModel, QwertyMapping.mapping);
        expect(actual[0]).toStrictEqual(["Esc", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "="]);
        expect(actual[1]).toStrictEqual(["↹", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "⌫",]);
        expect(actual[2]).toStrictEqual(["`~", "a", "s", "d", "f", "g", "\\", "h", "j", "k", "l", ";", "'"]);
        expect(actual[3]).toStrictEqual(["⇧", "z", "x", "c", "v", "b", "/", "n", "m", ",", ".", "⇧",]);
        expect(actual[4]).toStrictEqual(["Ctrl", "Cmd", "Alt", "[", "⍽", "⏎", "]", "AltGr", "Fn", "Ctrl",]);
    })

    it('Harmonic layout full qwerty / baseline', () => {

    });
});
