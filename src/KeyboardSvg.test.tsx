import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/preact';
import {HarmonicKeyboard} from './KeyboardSvg';
import {QwertyMapping} from "./KeyMapping.tsx";

// Test key rendering
describe('Key rendering', () => {
    it('renders correct number of keys', () => {
        const { container } = render(<HarmonicKeyboard mapping={QwertyMapping.mapping} />);
        const keys = container.querySelectorAll('.key-outline');
        expect(keys.length).toBe(13+12+13+12+10);
    });
});
