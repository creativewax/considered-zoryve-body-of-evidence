/**
 * IntroContentHeader.jsx
 *
 * Header with icon and title for each content section
 * Note: Uses dangerouslySetInnerHTML for title to support HTML tags like <sup>
 *       Content is from trusted intro_data.json source file
 */

import './IntroContentHeader.css'

const IntroContentHeader = ({ icon, title, headerColor }) => {
  // Handle CSS variable or direct color value
  const backgroundColor = headerColor?.startsWith('--') 
    ? `var(${headerColor})` 
    : headerColor

  return (
    <div 
      className="intro-content-header"
      style={{ backgroundColor }}
    >
      <img 
        src={`/UI/${icon}`}
        alt=""
        className="intro-content-header-icon"
      />
      {/* Title with HTML support for superscripts (from trusted JSON source) */}
      <h3 
        className="intro-content-header-title"
        dangerouslySetInnerHTML={{ __html: title }}
      />
    </div>
  )
}

export default IntroContentHeader
