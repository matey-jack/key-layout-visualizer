import {describe, expect, it} from 'vitest';
import {render} from '@testing-library/preact';
import {RowBasedKeyboard} from './KeyboardSvg.tsx';
import {qwertyMapping} from "../mapping/mappings.ts";
import {VisualizationType} from "../base-model.ts";
import {ansiIBMLayoutModel} from "./ansiLayoutModel.ts";
import {fillMapping, getKeyMovements, getKeyPositions} from "./layout-functions.ts";

// Test key rendering
describe('Key rendering', () => {
    it('renders correct number of keys for ANSI', () => {
        const charMap = fillMapping(ansiIBMLayoutModel, qwertyMapping);
        const keyPositions = getKeyPositions(ansiIBMLayoutModel, true, charMap!)
        const keyMovements = getKeyMovements(keyPositions, keyPositions);
        const {container} = render(<RowBasedKeyboard
            layoutModel={ansiIBMLayoutModel}
            keyMovements={keyMovements}
            vizType={VisualizationType.LayoutKeyEffort}
            mappingDiff={{}}
        />);
        const keys = container.querySelectorAll('.key-outline');
        expect(keys.length).toBe(14 + 14 + 13 + 12 + 8);
    });
});
