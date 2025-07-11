import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/preact';
import {RowBasedKeyboard} from './KeyboardSvg.tsx';
import {qwertyMapping} from "../mapping/mappings.ts";
import {VisualizationType} from "../base-model.ts";
import {ansiLayoutModel} from "./ansiLayoutModel.ts";
import {getKeyPositions} from "./layout-functions.ts";

// Test key rendering
describe('Key rendering', () => {
    it('renders correct number of keys for ANSI', () => {
        const keyPositions = getKeyPositions(ansiLayoutModel, true, qwertyMapping)
        const { container } = render(<RowBasedKeyboard
            layoutModel={ansiLayoutModel}
            keyPositions={keyPositions}
            vizType={VisualizationType.LayoutKeyEffort}
            mappingDiff={{}}
        />);
        const keys = container.querySelectorAll('.key-outline');
        expect(keys.length).toBe(14+14+13+12+8);
    });
});
