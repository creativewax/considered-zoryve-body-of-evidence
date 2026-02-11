/**
 * ImageCardClinicalTrial.jsx
 *
 * Displays a patient image with a label and expand button for Clinical Trial patients.
 * Features: 2px white border, rounded corners, shadow, top-left label, bottom-right plus button.
 */

import { PlusIcon } from '../../../common/Svg/index.js'
import './ImageCardClinicalTrial.css'

// ---------------------------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------------------------

/**
 * ImageCardClinicalTrial Component
 *
 * @param {string} image - Full-size image filename
 * @param {string} thumb - Thumbnail image filename
 * @param {string} label - Label text to display in top-right corner
 * @param {string} title - Title text displayed below label
 * @param {function} onExpand - Callback when plus button is clicked
 * @param {boolean} isLastTimepoint - Whether this is the last timepoint (for special styling)
 */
const ImageCardClinicalTrial = ({ image, thumb, label, title, onExpand, isLastTimepoint = false }) => {
  const thumbPath = `/patients/${thumb}`

  return (
    <div className={`image-card ${isLastTimepoint ? 'image-card-last-timepoint' : ''}`}>
      <div className="image-card-image-wrapper" onClick={onExpand} style={{ cursor: 'pointer' }}>
        {/* Thumbnail with border, radius, and shadow - clickable */}
        <img
          src={thumbPath}
          alt={`${label} - ${title}`}
          className="image-card-image"
        />

        {/* Label in top-right corner */}
        <div className={`image-card-label ${isLastTimepoint ? 'image-card-label-last-timepoint' : ''}`}>
          <span className="image-card-label-text">{label}</span>
        </div>

        {/* Plus button in bottom-right corner */}
        <button
          className="image-card-expand-button"
          onClick={(e) => {
            e.stopPropagation()
            onExpand()
          }}
          aria-label={`Expand ${label}`}
        >
          <PlusIcon
            width={24}
            height={24}
            bgClassName="image-card-plus-bg"
            fgClassName="image-card-plus-fg"
          />
        </button>
      </div>
    </div>
  )
}

export default ImageCardClinicalTrial
