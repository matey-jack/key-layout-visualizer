import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/preact';
import {LayoutElements} from './KeyboardSvg.tsx';
import {QwertyMapping} from "../mapping/mappings-30-keys.ts";
import {LayoutType} from "../model.ts";

// Test key rendering
describe('Key rendering', () => {
    const HarmonicKeyboard = LayoutElements[LayoutType.Harmonic]!!
    it('renders correct number of keys', () => {
        const { container } = render(<HarmonicKeyboard mapping={QwertyMapping.mapping} />);
        const keys = container.querySelectorAll('.key-outline');
        expect(keys.length).toBe(13+12+13+12+10);
    });
});
