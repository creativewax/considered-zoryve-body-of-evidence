/**
 * BaselineSeverityFilter.jsx
 *
 * Filter component for baseline disease severity (Mild, Moderate, Severe). Single select with toggle.
 * currentSource - Current data source (CLINICAL_TRIAL or PRACTICE_BASED)
 * selected - Currently selected severity or null if none selected
 */

import { FILTER_OPTIONS, FILTER_KEYS } from '../../../constants/index.js'
import eventSystem from '../../../utils/EventSystem.js'
import FilterComponent from '../shared/FilterComponent.jsx'
import RadioOption from '../shared/RadioOption.jsx'
import '../shared/RadioFilter.css'

// ---------------------------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------------------------

const BaselineSeverityFilter = ({ currentSource, selected }) => {
  const severities = [
    FILTER_OPTIONS.BASELINE_SEVERITY.MILD,
    FILTER_OPTIONS.BASELINE_SEVERITY.MODERATE,
    FILTER_OPTIONS.BASELINE_SEVERITY.SEVERE,
  ]

  // Handle severity selection; emits FILTER_SELECTED for FilterManager
  const handleSelect = (severity) => {
    eventSystem.emit(eventSystem.constructor.EVENTS.FILTER_SELECTED, {
      filterType: FILTER_KEYS.BASELINE_SEVERITY,
      value: severity === selected ? null : severity
    })
  }

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

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

export default BaselineSeverityFilter
