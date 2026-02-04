/**
 * BaselineSeverityFilter.jsx
 *
 * Filter component for selecting baseline disease severity
 * Displays three severity levels using radio-style selection
 * Allows toggling selection on/off for the baseline severity filter
 */

// #region Imports
import { FILTER_OPTIONS } from '../../../constants/index.js'
import appStateManager from '../../../managers/AppStateManager.js'
import FilterComponent from '../shared/FilterComponent.jsx'
import RadioOption from '../shared/RadioOption.jsx'
import '../shared/RadioFilter.css'
// #endregion

// #region Component
/**
 * BaselineSeverityFilter
 *
 * Renders baseline severity filter options as radio-style buttons within a FilterComponent container
 * Supports single selection with toggle behavior (click again to deselect)
 * Displays severity levels: Mild, Moderate, and Severe
 *
 * @component
 * @param {string} currentSource - Current data source (CLINICAL_TRIAL or PRACTICE_BASED)
 * @param {string|null} selected - Currently selected severity level or null if none selected
 * @returns {ReactElement} Filter component with severity radio options
 */
const BaselineSeverityFilter = ({ currentSource, selected }) => {
  // Available severity level options for filtering
  const severities = [
    FILTER_OPTIONS.BASELINE_SEVERITY.MILD,
    FILTER_OPTIONS.BASELINE_SEVERITY.MODERATE,
    FILTER_OPTIONS.BASELINE_SEVERITY.SEVERE,
  ]

  /**
   * Handle severity selection
   * Toggle behavior: if clicking the same severity, deselect it; otherwise select the new severity
   * @param {string} severity - Severity level to select/deselect
   */
  const handleSelect = (severity) => {
    appStateManager.setFilter('baselineSeverity', severity === selected ? null : severity)
  }

  return (
    <FilterComponent title="Baseline Severity" currentSource={currentSource}>
      <div className="radio-filter">
        {/* Render severity level radio option buttons */}
        {severities.map((severity) => (
          <RadioOption
            key={severity}
            value={severity}
            label={severity}
            isSelected={selected === severity}
            onClick={() => handleSelect(severity)}
          />
        ))}
      </div>
    </FilterComponent>
  )
}
// #endregion

export default BaselineSeverityFilter
