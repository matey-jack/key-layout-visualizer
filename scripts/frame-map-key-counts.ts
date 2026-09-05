/*
    How much room each frame mapping leaves the characters, and where. A board's alphabet has to fit
    the flexspots, and the frame fills the rest of the character keys with punctuation, so the two
    numbers per cell say how one keymap type divides the board: how many character keys sit in the
    number row and the three writing rows, and how many the thumbs have to reach in the bottom row.

    Only the layout models defining both a 30-key and a 32-key frame mapping are listed, because the
    point is the comparison between the two alphabet sizes on one board.

    Run it with:
        npx tsx scripts/frame-map-key-counts.ts
 */
import {allLayoutModels} from "../src/all-layout-models.ts";
import {type FrameMapping, KeyboardRows, KeymapTypeId, type LayoutModel} from "../src/base-model.ts";
import {isFrameCharacterKey} from "../src/mapping/mapping-functions.ts";

const small = [KeymapTypeId.Ansi30, KeymapTypeId.Thumb30];
const large = [KeymapTypeId.Ansi32, KeymapTypeId.Thumb32];
const columns = [...small, ...large];

const defines = (model: LayoutModel, types: KeymapTypeId[]) => types.some((type) => model.frameMappings[type]);

const count = (rows: FrameMapping) => rows.flat().filter(isFrameCharacterKey).length;

const cell = (frame: FrameMapping | undefined): string =>
    frame === undefined ? ""
        : count(frame.filter((_, row) => row !== KeyboardRows.Bottom))
            + "+" + count([frame[KeyboardRows.Bottom] ?? []]);

const models = allLayoutModels.filter((model) => defines(model, small) && defines(model, large));
const rows = models.map((model) => [model.name, ...columns.map((type) => cell(model.frameMappings[type]))]);

const head = ["layout model", ...columns];
const widths = head.map((title, i) => Math.max(title.length, ...rows.map((cells) => cells[i].length)));
const line = (cells: string[]) => "| " + cells.map((c, i) => c.padEnd(widths[i])).join(" | ") + " |";

console.log();
console.log("Character keys per frame mapping: above the bottom row + in the bottom row");
console.log();
console.log(line(head));
console.log("|" + widths.map((w) => "-".repeat(w + 2)).join("|") + "|");
for (const cells of rows) console.log(line(cells));
console.log();
console.log(`  ${models.length} of ${allLayoutModels.length} layout models define both a 30- and a 32-key frame mapping.`);
console.log("  An empty cell is a keymap type the model does not define.");
console.log();
