import { fireEvent, render, screen } from '@testing-library/preact';
import { describe, expect, it, vi } from 'vitest';
import { NumberPicker } from './NumberPicker.tsx';

describe('NumberPicker', () => {
    describe('step=1', () => {
        it('renders all options as numeric labels when ≤9 options', () => {
            render(<NumberPicker min={14} max={16} current={15} step={1} onChange={() => {}} />);
            expect(screen.getByRole('button', {name: '14'})).toBeInTheDocument();
            expect(screen.getByRole('button', {name: '15'})).toBeInTheDocument();
            expect(screen.getByRole('button', {name: '16'})).toBeInTheDocument();
            expect(screen.queryByText('·')).not.toBeInTheDocument();
        });

        it('calls onChange with the clicked value', () => {
            const onChange = vi.fn();
            render(<NumberPicker min={14} max={16} current={15} step={1} onChange={onChange} />);
            fireEvent.click(screen.getByRole('button', {name: '14'}));
            expect(onChange).toHaveBeenCalledWith(14);
        });

        it('marks the current value as selected', () => {
            render(<NumberPicker min={14} max={16} current={15} step={1} onChange={() => {}} />);
            expect(screen.getByRole('button', {name: '15'})).toHaveClass('selected');
            expect(screen.getByRole('button', {name: '14'})).not.toHaveClass('selected');
        });

        it('renders every other option as a dot when >9 options', () => {
            // min=1, max=11 step=1 → 11 options; idx 0,2,4,… are labels, 1,3,5,… are dots
            render(<NumberPicker min={1} max={11} current={6} step={1} onChange={() => {}} />);
            expect(screen.getByRole('button', {name: '1'})).toHaveTextContent('1');
            expect(screen.getByRole('button', {name: '2'})).toHaveTextContent('·');
            expect(screen.getByRole('button', {name: '3'})).toHaveTextContent('3');
        });
    });

    describe('step=0.5', () => {
        it('shows whole numbers as labels and fractions as dots when >5 options', () => {
            // [13.5, 14, 14.5, 15, 15.5, 16] = 6 options
            render(<NumberPicker min={13.5} max={16} current={14} step={0.5} onChange={() => {}} />);
            expect(screen.getByRole('button', {name: '14'})).toHaveTextContent('14');
            expect(screen.getByRole('button', {name: '15'})).toHaveTextContent('15');
            expect(screen.getByRole('button', {name: '16'})).toHaveTextContent('16');
            expect(screen.getByRole('button', {name: '13.5'})).toHaveTextContent('·');
            expect(screen.getByRole('button', {name: '14.5'})).toHaveTextContent('·');
            expect(screen.getByRole('button', {name: '15.5'})).toHaveTextContent('·');
        });

        it('clicking a dot option calls onChange with the correct value', () => {
            const onChange = vi.fn();
            render(<NumberPicker min={13.5} max={16} current={14} step={0.5} onChange={onChange} />);
            fireEvent.click(screen.getByRole('button', {name: '13.5'}));
            expect(onChange).toHaveBeenCalledWith(13.5);
        });

        it('shows all options as numeric labels when ≤5 options', () => {
            // [0.5, 1, 1.5, 2, 2.5] = 5 options → no dots
            render(<NumberPicker min={0.5} max={2.5} current={1} step={0.5} onChange={() => {}} />);
            expect(screen.getByRole('button', {name: '0.5'})).toHaveTextContent('0.5');
            expect(screen.getByRole('button', {name: '1.5'})).toHaveTextContent('1.5');
            expect(screen.queryByText('·')).not.toBeInTheDocument();
        });

        it('marks the current value as selected', () => {
            render(<NumberPicker min={13.5} max={16} current={15} step={0.5} onChange={() => {}} />);
            expect(screen.getByRole('button', {name: '15'})).toHaveClass('selected');
            expect(screen.getByRole('button', {name: '14'})).not.toHaveClass('selected');
        });
    });

    describe('dotPattern', () => {
        it('shows dots and labels according to the pattern', () => {
            // [0, 0.25, 0.5, 0.75], pattern "x." → label, dot, label, dot
            render(<NumberPicker min={0} max={0.75} current={0} step={0.25} onChange={() => {}} dotPattern="x." />);
            expect(screen.getByRole('button', {name: '0'})).toHaveTextContent('0');
            expect(screen.getByRole('button', {name: '0.25'})).toHaveTextContent('·');
            expect(screen.getByRole('button', {name: '0.5'})).toHaveTextContent('0.5');
            expect(screen.getByRole('button', {name: '0.75'})).toHaveTextContent('·');
        });

        it('repeats the pattern when shorter than option count', () => {
            // [0, 1, 2, 3, 4, 5], pattern "x." (len 2) → label, dot, label, dot, label, dot
            render(<NumberPicker min={0} max={5} current={0} step={1} onChange={() => {}} dotPattern="x." />);
            expect(screen.getByRole('button', {name: '0'})).toHaveTextContent('0');
            expect(screen.getByRole('button', {name: '1'})).toHaveTextContent('·');
            expect(screen.getByRole('button', {name: '4'})).toHaveTextContent('4');
            expect(screen.getByRole('button', {name: '5'})).toHaveTextContent('·');
        });

        it('overrides the automatic step-based dot logic', () => {
            // step=0.5, 6 options — auto would dot fractions; pattern forces all labels
            render(<NumberPicker min={13.5} max={16} current={14} step={0.5} onChange={() => {}} dotPattern="x" />);
            expect(screen.getByRole('button', {name: '13.5'})).toHaveTextContent('13.5');
            expect(screen.queryByText('·')).not.toBeInTheDocument();
        });
    });

    describe('semicircular mode', () => {
        it('renders the same options and selection as linear mode', () => {
            render(<NumberPicker min={14} max={16} current={15} step={1} onChange={() => {}} semicircular />);
            expect(screen.getByRole('button', {name: '15'})).toHaveClass('selected');
            expect(screen.getByRole('button', {name: '14'})).not.toHaveClass('selected');
        });
    });
});
