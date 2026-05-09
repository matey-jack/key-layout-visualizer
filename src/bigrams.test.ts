import {describe, expect, it} from "vitest";
import {BigramType, Finger} from "./base-model.ts";
import {differentFinger, getBigramMovements, getBigramType, sumBigramScores} from "./bigrams.ts";
import {ansiIBMLayoutModel} from "./layout/ansiLayoutModel.ts";
import {fillMapping, getKeyPositions} from "./layout/layout-functions.ts";
import {splitOrthoLayoutModel} from "./layout/splitOrthoLayoutModel.ts";
import {qwertyMapping} from "./mapping/baseMappings.ts";
import {colemakMapping} from "./mapping/colemakMappings.ts";

describe("index finger keys qwerty/ANSI", () => {
    const charMap = fillMapping(ansiIBMLayoutModel, qwertyMapping)!;
    const positions = getKeyPositions(ansiIBMLayoutModel, false, charMap);
    const lIndex = positions.filter(k => k.finger === Finger.LIndex && /[a-z]/.test(k.label));
    const rIndex = positions.filter(k => k.finger === Finger.RIndex && /[a-z]/.test(k.label));

    it("labels", () => {
        console.log("LIndex:", lIndex.map(k => k.label).join(" "));
        console.log("RIndex:", rIndex.map(k => k.label).join(" "));
    });

    it("bigram types for all pairs", () => {
        const bigramTypeName = (t: BigramType) => BigramType[t];
        const results: Record<string, string> = {};
        for (const keysOnFinger of [lIndex, rIndex]) {
            for (let i = 0; i < keysOnFinger.length; i++) {
                for (let j = i + 1; j < keysOnFinger.length; j++) {
                    const a = keysOnFinger[i];
                    const b = keysOnFinger[j];
                    results[`${a.label}${b.label}`] = bigramTypeName(getBigramType(a, b));
                }
            }
        }
        expect(results).toEqual({
            // left index: r t f g v b
            rt: "PianoAltFinger",
            rf: "PianoAltFinger",
            rg: "PianoAltFinger",
            rv: "PianoAltFinger",
            rb: "PianoAltFinger",
            tf: "PianoScissor",
            tg: "PianoAltFinger",
            tv: "SameFinger",
            tb: "PianoAltFinger",
            fg: "PianoAltFinger",
            fv: "PianoAltFinger",
            fb: "PianoAltFinger",
            gv: "PianoScissor",
            gb: "PianoAltFinger",
            vb: "PianoAltFinger",
            // right index: y u h j n m
            yu: "PianoAltFinger",
            yh: "SameFinger",
            yj: "PianoScissor",
            yn: "PianoScissor",
            ym: "AltFinger",
            uh: "PianoAltFinger",
            uj: "SameFinger",
            un: "PianoAltFinger",
            um: "AltFinger",
            hj: "PianoAltFinger",
            hn: "PianoScissor",
            hm: "AltFinger",
            jn: "PianoAltFinger",
            jm: "AltFinger",
            nm: "AltFinger",
        });
    });
});

describe("getMovements", () => {
    it("works", () => {
        const charMap = fillMapping(ansiIBMLayoutModel, qwertyMapping);
        const actual = sumBigramScores(ansiIBMLayoutModel, charMap!, qwertyMapping.name);
        expect(actual).toBe(362);
    })
})

describe("top 100 bigrams Colemak", () => {
    function printTop100(layout: typeof ansiIBMLayoutModel, layoutName: string) {
        const charMap = fillMapping(layout, colemakMapping)!;
        const movements = getBigramMovements(getKeyPositions(layout, false, charMap), `Colemak on ${layoutName}`);
        movements
            .filter((m) => m.a !== m.b && !differentFinger(m.a, m.b))
            .slice(0, 100)
            .forEach((m) => {
            console.log(`${m.a.label}${m.b.label}  freq=${m.frequency}  ${BigramType[m.type]}`);
        });
    }

    it("on ANSI", () => {
        printTop100(ansiIBMLayoutModel, "ANSI");
    });

    it("on SplitOrtho", () => {
        printTop100(splitOrthoLayoutModel(false), "SplitOrtho");
    });
})