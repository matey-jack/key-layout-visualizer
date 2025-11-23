import {describe, expect, it} from "vitest";

import {KeyboardRows} from "../base-model.ts";
import {ahkbAddAngleMod, ahkbLayoutModel} from "./ahkbLayoutModel.ts";

describe("ahkbLayoutModel angle mod", () => {
    const angleModLayout = ahkbAddAngleMod(ahkbLayoutModel);

    it("shifts lower row letters and places delete between backslash and slash", () => {
        expect(angleModLayout.thirtyKeyMapping![KeyboardRows.Lower]).toEqual(
            ["⇧", 1, 2, 3, 4, "\\", "⌦", 9, 5, 6, 7, 8, "⇧"],
        );
    });

    it("applies the same rotation to the thumb mapping", () => {
        expect(angleModLayout.thumb30KeyMapping![KeyboardRows.Lower]).toEqual(
            ["⇧", 1, 2, 3, 4, "\\", "⌦", "/", 5, 6, 7, 8, "⇧"],
        );
    });
});
