/**
 * ScoreDisplay.jsx
 *
 * Displays patient scale scores (IGA, v-IGA-AD, etc.) and optional WI-NRS/SI-NRS scores.
 * Features: Main score with 50% midnight blue background, optional secondary scores with 25% midnight blue background.
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
const ScoreItem = ({ label, value, isLastTimepoint }) => (
  <div className={`score-item ${isLastTimepoint ? 'score-item-last-timepoint' : ''}`}>
    <span className={`score-item-label ${isLastTimepoint ? 'score-item-label-last-timepoint' : ''}`}>{label}</span>
    <span className={`score-item-value ${isLastTimepoint ? 'score-item-value-last-timepoint' : ''}`}>{value ?? '-'}</span>
  </div>
)

/**
 * ScoreItemArray - Displays an array of score items
 *
 * @param {Array} scale - Array of scale objects with name and score
 */
const ScoreItemArray = ({ scale, isLastTimepoint }) => {
  return scale.map((scale, index) => {
    // if name is valid, display the score item
    if (scale.name) return <ScoreItem key={index} label={scale.name} value={scale.score} isLastTimepoint={isLastTimepoint} />
    return null
  })
}

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
 * @param {boolean} isLastTimepoint - Whether this is the last timepoint (for special styling)
 */
const ScoreDisplay = ({ scale, wiNrs, siNrs, showWiNrs, showSiNrs, isLastTimepoint = false }) => {
  // Show secondary scores section if either WI-NRS or SI-NRS should be displayed
  const hasSecondaryScores = showWiNrs || showSiNrs

  return (
    <div className={`score-display ${isLastTimepoint ? 'score-display-last-timepoint' : ''}`}>
      {/* <div className="score-display-header">
        <span className="score-display-title">Scales</span>
      </div> */}
      <div className="score-display-main">
        <div className="score-display-scores">
          <div className="score-display-primary">
            <ScoreItemArray scale={scale} isLastTimepoint={isLastTimepoint} />
          </div>

          {hasSecondaryScores && (
            <div className="score-display-secondary">
              {showWiNrs && <ScoreItem label="WI-NRS" value={wiNrs} isLastTimepoint={isLastTimepoint} />}
              {showSiNrs && <ScoreItem label="SI-NRS" value={siNrs} isLastTimepoint={isLastTimepoint} />}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ScoreDisplay
