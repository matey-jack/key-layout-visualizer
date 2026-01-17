import {describe, expect, it} from "vitest";
import {KeymapTypeId} from '../base-model.ts';
import {ansiIBMLayoutModel} from '../layout/ansiLayoutModel.ts';
import {mergeMapping} from '../layout/layout-functions.ts';
import {qwertyMapping} from './mappings.ts';
import {getKlc} from "./msKlcTemplate.ts";

describe("getKlc", () => {
    it("should generate KLC format output from merged mapping", () => {
        const ansiFrameMapping = (ansiIBMLayoutModel.frameMappings[KeymapTypeId.Ansi30])!;
        const qwertyKeymap = ["", ...qwertyMapping.mappings[KeymapTypeId.Ansi30]!];
        const mergedMapping = mergeMapping(ansiFrameMapping, qwertyKeymap);
        const result = getKlc(mergedMapping, qwertyMapping);

        // Save result to file for manual inspection
        // const outputPath = resolve("test-results", "generated-qwerty.klc");
        // writeFileSync(outputPath, result);
        // console.log(`Generated KLC file saved to: ${outputPath}`);

        // Verify header is present
        expect(result).toContain("KBD\tqwerty\t\"US-ANSI - Qwerty – ");
        
        // Verify footer is present
        expect(result).toContain("KEYNAME\r\n");
        expect(result).toContain("DESCRIPTIONS\r\n");
        
        // Verify some scancode lines are present (format: HEX\tKLC_LINE)
        expect(result).toMatch(/29\tOEM_3\t\t0\t0060\t007e\t-1/); // scancode 0x29 for "`"
        expect(result).toMatch(/02\t1\t\t0\t1\t0021\t-1/); // scancode 0x02 for "1"
        expect(result).toMatch(/10\tQ\t\t1\tq\tQ\t-1/); // scancode 0x10 for "q"
        expect(result).toMatch(/24\tJ\t\t1\tj\tJ\t-1/); // scancode 0x24 for "j"
        expect(result).toMatch(/34\tOEM_PERIOD\t0\t002e\t003e\t-1/); // scancode 0x34 for "."
        expect(result).toMatch(/2b\tOEM_5\t\t0\t005c\t007c\t001c/); // scancode 0x2B for "\"
    });
});
