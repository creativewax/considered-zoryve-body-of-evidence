/**
 * ScoreDisplayClinicalTrial.jsx
 *
 * Displays patient scale scores (IGA, v-IGA-AD, etc.) and optional WI-NRS/SI-NRS scores for Clinical Trial patients.
 * Features: Main score with 40% black background, optional secondary scores with 20% black background.
 */

import './ScoreDisplayClinicalTrial.css'
import { DATA_SOURCE } from '../../../../constants/index.js'
import appStateManager from '../../../../managers/AppStateManager.js'

// ---------------------------------------------------------------------------
// SCORE ITEM COMPONENT
// ---------------------------------------------------------------------------

/**
 * ScoreItem - Displays a label and score value in a box
 *
 * @param {string} label - Score label (e.g., "IGA", "WI-NRS")
 * @param {string|number|null} value - Score value (shows "-" if null)
 */
const ScoreItem = ({ label, value }) => (
  <div className="score-item">
    <span className="score-item-label">{label}</span>
    <span className="score-item-value">{value ?? '-'}</span>
  </div>
)

/**
 * ScoreItemArray - Displays an array of score items
 *
 * @param {Array} scale - Array of scale objects with name and score
 */
const ScoreItemArray = ({ scale }) => {
  return scale.map((scale, index) => {
    // if name is valid, display the score item
    if (scale.name) return <ScoreItem key={index} label={scale.name} value={scale.score} />
    return null
  })
}

// ---------------------------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------------------------

/**
 * ScoreDisplayClinicalTrial Component
 *
 * @param {Object} scale - Main scale object with name and score
 * @param {string|number|null} wiNrs - WI-NRS score (shows "-" if null)
 * @param {string|number|null} siNrs - SI-NRS score (shows "-" if null)
 * @param {boolean} showWiNrs - Whether to show WI-NRS section (if any timepoint has WI-NRS data)
 * @param {boolean} showSiNrs - Whether to show SI-NRS section (if any timepoint has SI-NRS data)
 * @param {boolean} isLastTimepoint - Whether this is the last timepoint (for special styling)
 */
const ScoreDisplayClinicalTrial = ({ scale, wiNrs, siNrs, showWiNrs, showSiNrs, isLastTimepoint = false }) => {
  // Show secondary scores section if either WI-NRS or SI-NRS should be displayed
  const hasSecondaryScores = showWiNrs || showSiNrs

  return (
    <div className={`score-display ${isLastTimepoint ? 'score-display-last-timepoint' : ''}`}>
      <div className="score-display-main">
        {/* Main scale score - 50% midnight blue background */}
        <ScoreItemArray scale={scale} />
      </div>

      {/* Secondary scores (WI-NRS and SI-NRS) - 25% midnight blue background */}
      {hasSecondaryScores && (
        <div className="score-display-secondary">
          {showWiNrs && <ScoreItem label="WI-NRS" value={wiNrs} />}
          {showSiNrs && <ScoreItem label="SI-NRS" value={siNrs} />}
        </div>
      )}
    </div>
  )
}

export default ScoreDisplayClinicalTrial
