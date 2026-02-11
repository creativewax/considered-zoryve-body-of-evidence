/**
 * ImageCardPracticeBased.jsx
 *
 * Displays patient image for Practice-Based data with severity header and itch score footer
 * Features: Severity header, patient image, itch score footer
 */

import { PlusIcon } from '../../../common/Svg'
import './ImageCardPracticeBased.css'

// ---------------------------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------------------------

/**
 * ImageCardPracticeBased Component
 *
 * @param {string} thumb - Thumbnail image filename
 * @param {string} label - Timepoint label (e.g., "Baseline", "Week 1")
 * @param {string} severity - Severity rating (e.g., "Moderate", "Mild", "Clear")
 * @param {string|number|null} itchScore - Patient-reported itch score
 */
const ImageCardPracticeBased = ({ thumb, label, severity, itchScore, onExpand, isLastTimepoint = false }) => {
  const thumbPath = `/patients/${thumb}`

  return (
    <div className={`image-card-pb ${isLastTimepoint ? 'image-card-pb-last-timepoint' : ''}`}>
      <div className="image-card-pb-image-wrapper" onClick={onExpand} style={{ cursor: 'pointer' }}>
        {/* Header with severity */}
        <div className="image-card-pb-header">
          <span className="image-card-pb-timepoint">{label} Severity:&nbsp;</span>
          <span className="image-card-pb-severity">{severity}</span>
        </div>

        {/* Patient image */}
        <img
          src={thumbPath}
          alt={`${label} - ${severity}`}
          className="image-card-pb-image"
        />

        {/* Footer with itch score */}
        <div className="image-card-pb-footer">
          <div className="image-card-pb-itch-label">Patient-Reported Itch Score</div>
          <div className="image-card-pb-itch-value">{itchScore ?? '-'}</div>
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
            bgClassName="image-card-plus-bg ${isLastTimepoint ? 'image-card-plus-bg-last-timepoint' : ''}"
            fgClassName="image-card-plus-fg"
          />
        </button>
      </div>
    </div>
  )
}

export default ImageCardPracticeBased
