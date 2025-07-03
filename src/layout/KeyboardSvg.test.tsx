import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/preact';
import {RowBasedKeyboard} from './KeyboardSvg.tsx';
import {qwertyMapping} from "../mapping/mappings.ts";
import {harmonicLayoutModel} from "./harmonicLayoutModel.ts";
import {VisualizationType} from "../model.ts";

// Test key rendering
describe('Key rendering', () => {
    it('renders correct number of keys for Harmonic 13', () => {
        const { container } = render(<RowBasedKeyboard
            layoutModel={harmonicLayoutModel}
            flexMapping={qwertyMapping}
            vizType={VisualizationType.LayoutEffort}
            mappingDiff={{}}
            split={true}
        />);
        const keys = container.querySelectorAll('.key-outline');
        expect(keys.length).toBe(13+12+13+12+10);
    });
});
