/**
 * IntroContentContainer.jsx
 *
 * Scrollable container for intro content with references footer
 * Note: Uses dangerouslySetInnerHTML for references - content is from trusted JSON source
 */

import './IntroContentContainer.css'

const IntroContentContainer = ({ children, references }) => {
  return (
    <div className="intro-content-container">
      <div className="intro-content-scrollable">
        {children}
        
        {/* References block - from trusted intro_data.json */}
        {references && (
          <div 
            className="intro-content-references"
            dangerouslySetInnerHTML={{ __html: references }}
          />
        )}
      </div>
    </div>
  )
}

export default IntroContentContainer
