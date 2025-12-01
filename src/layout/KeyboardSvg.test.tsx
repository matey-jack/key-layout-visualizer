import {describe, expect, it} from 'vitest';
import {render} from '@testing-library/preact';
import {RowBasedKeyboard} from './KeyboardSvg.tsx';
import {qwertyMapping} from "../mapping/mappings.ts";
import {VisualizationType} from "../base-model.ts";
import {ansiIBMLayoutModel} from "./ansiLayoutModel.ts";
import {fillMappingNew, getKeyPositions} from "./layout-functions.ts";

// Test key rendering
describe('Key rendering', () => {
    it('renders correct number of keys for ANSI', () => {
        const charMap = fillMappingNew(ansiIBMLayoutModel, qwertyMapping);
        const keyPositions = getKeyPositions(ansiIBMLayoutModel, true, charMap!)
        const {container} = render(<RowBasedKeyboard
            layoutModel={ansiIBMLayoutModel}
            keyPositions={keyPositions}
            vizType={VisualizationType.LayoutKeyEffort}
            mappingDiff={{}}
        />);
        const keys = container.querySelectorAll('.key-outline');
        expect(keys.length).toBe(14 + 14 + 13 + 12 + 8);
    });
});
