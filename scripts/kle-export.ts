/*
    Writes `kle.json` for one layout and one mapping, so that a board can be loaded at
    keyboard-layout-editor.com without going through the app. Which board that is, is the
    pair of constants below - edit them and run it again.

    Run it with:
        npx tsx scripts/kle-export.ts
 */
import {writeFileSync} from "node:fs";
import {kleJson} from "../src/kle-export.ts";
import {ergoboardCentralLayoutModel} from "../src/layout/ergoboardCentralLayoutModel.ts";
import {colemakMapping} from "../src/mapping/colemakMappings.ts";

const layout = ergoboardCentralLayoutModel;
const mapping = colemakMapping;

const json = kleJson(layout, mapping, {});
if (json === null) {
    console.error(`${mapping.name} does not fit ${layout.name}.`);
    process.exit(1);
}

writeFileSync("kle.json", json, "utf-8");
console.log(`Wrote kle.json: ${layout.name} — ${mapping.name}`);
