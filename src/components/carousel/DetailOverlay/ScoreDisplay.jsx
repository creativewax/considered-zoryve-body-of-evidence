/**
 * ScoreDisplay.jsx
 *
 * Displays patient scale scores (IGA, v-IGA-AD, etc.) and optional WI-NRS/SI-NRS scores.
 * Features: Main score with 40% black background, optional secondary scores with 20% black background.
 */

import './ScoreDisplay.css'

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
    <div className="score-item-value">{value ?? '-'}</div>
  </div>
)

// ---------------------------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------------------------

/**
 * ScoreDisplay Component
 *
 * @param {Object} scale - Main scale object with name and score
 * @param {string|number|null} wiNrs - WI-NRS score (shows "-" if null)
 * @param {string|number|null} siNrs - SI-NRS score (shows "-" if null)
 * @param {boolean} showWiNrs - Whether to show WI-NRS section (if any timepoint has WI-NRS data)
 * @param {boolean} showSiNrs - Whether to show SI-NRS section (if any timepoint has SI-NRS data)
 */
const ScoreDisplay = ({ scale, wiNrs, siNrs, showWiNrs, showSiNrs }) => {
  // Show secondary scores section if either WI-NRS or SI-NRS should be displayed
  const hasSecondaryScores = showWiNrs || showSiNrs

  return (
    <div className="score-display">
      {/* Main scale score - 50% midnight blue background */}
      <div className="score-display-main">
        <ScoreItem label={scale.name} value={scale.score} />
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

export default ScoreDisplay
