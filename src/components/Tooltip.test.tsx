import { render, screen } from '@testing-library/preact';
import { describe, expect, it } from 'vitest';
import { Tooltip } from './Tooltip.tsx';

describe('Tooltip', () => {
  it('renders the children and the tooltip text', () => {
    render(
      <Tooltip text="Test Tooltip Content">
        <button type="button">Trigger Button</button>
      </Tooltip>
    );

    // Verify children element is rendered
    expect(screen.getByText('Trigger Button')).toBeInTheDocument();

    // Verify tooltip text is rendered
    expect(screen.getByText('Test Tooltip Content')).toBeInTheDocument();
  });
});
