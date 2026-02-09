/**
 * TreatedBy.jsx
 *
 * Displays treating healthcare provider information
 * Features: Doctor image and provider details
 */

import './TreatedBy.css'

// ---------------------------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------------------------

/**
 * TreatedBy Component
 *
 * @param {string} name - Provider name (default: static for now)
 * @param {string} location - Practice location (default: static for now)
 */
const TreatedBy = ({ name = 'Andrew Mastro, PA', location = 'Chicago, Illinois' }) => {
  return (
    <div className="treated-by">
      <div className="treated-by-image">
        {/* Placeholder for doctor icon/image */}
        <div className="treated-by-icon">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="12" r="6" fill="white" opacity="0.8"/>
            <path d="M8 32c0-6.627 5.373-12 12-12s12 5.373 12 12" fill="white" opacity="0.8"/>
          </svg>
        </div>
      </div>
      <div className="treated-by-text">
        <div className="treated-by-label">Treated by:</div>
        <div className="treated-by-name">{name}</div>
        <div className="treated-by-location">{location}</div>
      </div>
    </div>
  )
}

export default TreatedBy
