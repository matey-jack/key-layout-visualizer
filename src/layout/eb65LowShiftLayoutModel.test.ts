import {describe, expect, it} from 'vitest';

import {eb65LowShiftLayoutModel as model} from "./eb65LowShiftLayoutModel.ts";
import {sum} from "../library/math.ts";

describe('ErgoBoard 65 Low Shift layout model', () => {
    it('key width', () => {
        for (let r = 0; r < 5; r++) {
            const widths = model.thirtyKeyMapping![r].map((_, c) => {
                return model.keyWidth(r, c);
            });
            console.log(sum(widths), widths);
        }
    });
});
