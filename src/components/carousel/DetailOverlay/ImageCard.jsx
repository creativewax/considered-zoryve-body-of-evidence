/**
 * ImageCard.jsx
 *
 * Displays a patient image with a label and expand button.
 * Features: 2px white border, rounded corners, shadow, top-left label, bottom-right plus button.
 */

import { ASSETS } from '../../../constants/index.js'
import './ImageCard.css'

// ---------------------------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------------------------

/**
 * ImageCard Component
 *
 * @param {string} image - Full-size image filename
 * @param {string} thumb - Thumbnail image filename
 * @param {string} label - Label text to display in top-right corner
 * @param {string} title - Title text displayed below label
 * @param {function} onExpand - Callback when plus button is clicked
 */
const ImageCard = ({ image, thumb, label, title, onExpand }) => {
  const thumbPath = `/patients/${thumb}`

  return (
    <div className="image-card">
      <div className="image-card-image-wrapper" onClick={onExpand} style={{ cursor: 'pointer' }}>
        {/* Thumbnail with border, radius, and shadow - clickable */}
        <img
          src={thumbPath}
          alt={`${label} - ${title}`}
          className="image-card-image"
        />

        {/* Label in top-right corner */}
        <div className="image-card-label">
          <span className="image-card-label-text">{label}</span>
        </div>

        {/* Plus button in bottom-right corner */}
        <button
          className="image-card-expand-button"
          onClick={(e) => {
            e.stopPropagation() // Prevent double trigger from wrapper click
            onExpand()
          }}
          aria-label={`Expand ${label}`}
        >
          <img src={ASSETS.ICONS.PLUS_BUTTON_BLUE} alt="Expand" />
        </button>
      </div>
    </div>
  )
}

export default ImageCard
