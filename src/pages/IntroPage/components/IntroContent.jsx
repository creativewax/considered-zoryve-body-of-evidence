/**
 * IntroContent.jsx
 *
 * Main content section with header, body text, and stats
 * Note: Uses dangerouslySetInnerHTML for body - content is from trusted JSON source
 */

import IntroContentHeader from './IntroContentHeader.jsx'
import IntroContentStatContainer from './IntroContentStatContainer.jsx'
import './IntroContent.css'

const IntroContent = ({ icon, title, headerColor, body, stats }) => {
  return (
    <div className="intro-content">
      <IntroContentHeader 
        icon={icon}
        title={title}
        headerColor={headerColor}
      />
      
      <div className="intro-content-body-wrapper">
        {/* Body text from trusted intro_data.json */}
        <div 
          className="intro-content-body"
          dangerouslySetInnerHTML={{ __html: body }}
        />
        
        {stats && stats.length > 0 && (
          <IntroContentStatContainer stats={stats} />
        )}
      </div>
    </div>
  )
}

export default IntroContent
