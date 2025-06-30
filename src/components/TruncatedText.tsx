import { useState, useRef, useEffect } from 'react';

interface TruncatedTextProps {
  text: string;
  wordLimit?: number;
  showMoreText?: string;
  showLessText?: string;
  truncationDelay?: number;
}

export const TruncatedText = ({
  text,
  wordLimit = 20,
  showMoreText = "Show more",
  showLessText = "Show less",
  truncationDelay = 300 // Default delay in milliseconds
}: TruncatedTextProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isMouseOverRef = useRef(false);
  const timeoutRef = useRef<number | null>(null);

  // Split the text into words and check if truncation is needed
  const words = text.split(' ');
  const needsTruncation = words.length > wordLimit;

  // Get the truncated text (first 20 words)
  const truncatedText = words.slice(0, wordLimit).join(' ');

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleMouseEnter = () => {
    isMouseOverRef.current = true;

    // Clear any pending truncation timeout
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // No longer auto-expand on mouse enter
    // Only track mouse position to prevent unwanted truncation
  };

  const handleMouseLeave = () => {
    isMouseOverRef.current = false;

    // Set a timeout to truncate the text after delay
    if (needsTruncation && isExpanded) {
      timeoutRef.current = window.setTimeout(() => {
        // Only truncate if mouse is still outside the element
        if (!isMouseOverRef.current) {
          setIsExpanded(false);
        }
        timeoutRef.current = null;
      }, truncationDelay);
    }
  };

  return (
    <div 
      className="truncated-text"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {isExpanded || !needsTruncation ? (
        <>
          <span>{text}</span>
          {needsTruncation && (
            <button 
              className="toggle-text-button" 
              onClick={toggleExpanded}
            >
              {showLessText}
            </button>
          )}
        </>
      ) : (
        <>
          <span>{truncatedText}...</span>
          <button 
            className="toggle-text-button" 
            onClick={toggleExpanded}
          >
            {showMoreText}
          </button>
        </>
      )}
    </div>
  );
};
