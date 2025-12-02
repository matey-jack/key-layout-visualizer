import {describe, expect, it} from "vitest";

import {KeyboardRows} from "../base-model.ts";
import {ahkbAddAngleMod, ahkbLayoutModel} from "./ahkbLayoutModel.ts";
import {getAnsi30mapping, getThumb30mapping} from "./layout-functions.ts";

describe("ahkbLayoutModel angle mod", () => {
    const angleModLayout = ahkbAddAngleMod(ahkbLayoutModel);

    it("shifts lower row letters and places delete between backslash and slash", () => {
        expect(getAnsi30mapping(angleModLayout)![KeyboardRows.Lower]).toEqual(
            ["⇧", 1, 2, 3, 4, "\\", "⌦", 9, 5, 6, 7, 8, "⇧"],
        );
    });

    it("applies the same rotation to the thumb mapping", () => {
        expect(getThumb30mapping(angleModLayout)![KeyboardRows.Lower]).toEqual(
            ["⇧", 1, 2, 3, 4, "\\", "⌦", "/", 5, 6, 7, 8, "⇧"],
        );
    });
});
