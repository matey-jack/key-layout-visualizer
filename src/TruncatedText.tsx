import { useState } from 'react';

interface TruncatedTextProps {
  text: string;
  wordLimit?: number;
  showMoreText?: string;
  showLessText?: string;
}

export const TruncatedText = ({
  text,
  wordLimit = 20,
  showMoreText = "Show more",
  showLessText = "Show less"
}: TruncatedTextProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Split the text into words and check if truncation is needed
  const words = text.split(' ');
  const needsTruncation = words.length > wordLimit;
  
  // Get the truncated text (first 20 words)
  const truncatedText = words.slice(0, wordLimit).join(' ');
  
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };
  
  return (
    <div className="truncated-text">
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