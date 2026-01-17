import { act, fireEvent, render, screen } from '@testing-library/preact';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TruncatedText } from './TruncatedText.tsx';

describe('TruncatedText', () => {
  const longText = 'This is a long text that has more than twenty words so it should be truncated when displayed initially and then show the full text when the show more button is clicked by the user.';
  const shortText = 'This is a short text.';

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the full text when text is shorter than the word limit', () => {
    render(<TruncatedText text={shortText} />);
    expect(screen.getByText(shortText)).toBeInTheDocument();
    expect(screen.queryByText('Show more')).not.toBeInTheDocument();
  });

  it('truncates text when it exceeds the word limit', () => {
    render(<TruncatedText text={longText} />);

    // Check that only the first 20 words are shown initially
    const firstTwentyWords = longText.split(' ').slice(0, 20).join(' ');
    expect(screen.getByText(`${firstTwentyWords}...`)).toBeInTheDocument();

    // Check that the "Show more" button is present
    expect(screen.getByText('Show more')).toBeInTheDocument();
  });

  it('shows full text when "Show more" is clicked', () => {
    render(<TruncatedText text={longText} />);

    // Click the "Show more" button
    fireEvent.click(screen.getByText('Show more'));

    // Check that the full text is now shown
    expect(screen.getByText(longText)).toBeInTheDocument();

    // Check that the "Show less" button is now present
    expect(screen.getByText('Show less')).toBeInTheDocument();
  });

  it('truncates text again when "Show less" is clicked', () => {
    render(<TruncatedText text={longText} />);

    // Click "Show more" first
    fireEvent.click(screen.getByText('Show more'));

    // Then click "Show less"
    fireEvent.click(screen.getByText('Show less'));

    // Check that the text is truncated again
    const firstTwentyWords = longText.split(' ').slice(0, 20).join(' ');
    expect(screen.getByText(`${firstTwentyWords}...`)).toBeInTheDocument();

    // Check that the "Show more" button is present again
    expect(screen.getByText('Show more')).toBeInTheDocument();
  });

  it('respects custom word limit', () => {
    const customWordLimit = 5;
    render(<TruncatedText text={longText} wordLimit={customWordLimit} />);

    // Check that only the first 5 words are shown
    const firstFiveWords = longText.split(' ').slice(0, customWordLimit).join(' ');
    expect(screen.getByText(`${firstFiveWords}...`)).toBeInTheDocument();
  });

  it('uses custom button text when provided', () => {
    const customShowMoreText = 'Read more';
    const customShowLessText = 'Read less';

    render(
      <TruncatedText 
        text={longText} 
        showMoreText={customShowMoreText} 
        showLessText={customShowLessText} 
      />
    );

    // Check that the custom "Show more" text is used
    expect(screen.getByText(customShowMoreText)).toBeInTheDocument();

    // Click the button and check that the custom "Show less" text is used
    fireEvent.click(screen.getByText(customShowMoreText));
    expect(screen.getByText(customShowLessText)).toBeInTheDocument();
  });

  it('does not expand text on mouse enter', () => {
    render(<TruncatedText text={longText} />);

    // Initially text should be truncated
    const firstTwentyWords = longText.split(' ').slice(0, 20).join(' ');
    expect(screen.getByText(`${firstTwentyWords}...`)).toBeInTheDocument();

    // Simulate mouse enter
    const truncatedTextElement =
        screen.getByText(`${firstTwentyWords}...`).closest('.truncated-text')!;
    fireEvent.mouseEnter(truncatedTextElement);

    // Text should still be truncated (not expanded)
    expect(screen.getByText(`${firstTwentyWords}...`)).toBeInTheDocument();
    expect(screen.queryByText(longText)).not.toBeInTheDocument();
  });

  it('truncates text after delay when mouse leaves', () => {
    render(<TruncatedText text={longText} truncationDelay={500} />);

    const firstTwentyWords = longText.split(' ').slice(0, 20).join(' ');

    // Click "Show more" to expand text
    fireEvent.click(screen.getByText('Show more'));

    // Text should now be expanded
    expect(screen.getByText(longText)).toBeInTheDocument();

    // Get the expanded text element
    const expandedTextElement = screen.getByText(longText).closest('.truncated-text')!;

    // Simulate mouse leave
    fireEvent.mouseLeave(expandedTextElement);

    // Text should still be expanded before the delay
    expect(screen.getByText(longText)).toBeInTheDocument();

    // Advance timer by delay time
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // Text should now be truncated again
    expect(screen.getByText(`${firstTwentyWords}...`)).toBeInTheDocument();
  });

  it('cancels truncation if mouse re-enters before delay expires', () => {
    render(<TruncatedText text={longText} truncationDelay={500} />);

    // Click "Show more" to expand text
    fireEvent.click(screen.getByText('Show more'));

    // Text should now be expanded
    expect(screen.getByText(longText)).toBeInTheDocument();

    // Get the expanded text element
    const expandedTextElement = screen.getByText(longText).closest('.truncated-text')!;

    // Simulate mouse leave
    fireEvent.mouseLeave(expandedTextElement);

    // Advance timer by half the delay time
    act(() => {
      vi.advanceTimersByTime(250);
    });

    // Simulate mouse re-enter before delay expires
    fireEvent.mouseEnter(screen.getByText(longText).closest('.truncated-text')!);

    // Advance timer by the rest of the delay time
    act(() => {
      vi.advanceTimersByTime(250);
    });

    // Text should still be expanded because truncation was canceled
    expect(screen.getByText(longText)).toBeInTheDocument();
  });
});
