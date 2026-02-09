/**
 * BaselineSeverityFilter.jsx
 *
 * Filter component for baseline disease severity (Mild, Moderate, Severe). Single select with toggle.
 * currentSource - Current data source (CLINICAL_TRIAL or PRACTICE_BASED)
 * selected - Currently selected severity or null if none selected
 */

import { FILTER_DEFINITIONS, FILTER_KEYS } from '../../../constants/index.js'
import eventSystem from '../../../utils/EventSystem.js'
import { useFilterAvailability } from '../../../hooks/filters/useFilterAvailability'
import FilterComponent from '../shared/FilterComponent.jsx'
import RadioOption from '../shared/RadioOption.jsx'
import '../shared/RadioFilter.css'

// ---------------------------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------------------------

const BaselineSeverityFilter = ({ currentSource, selected }) => {
  const { isAvailable } = useFilterAvailability(FILTER_KEYS.BASELINE_SEVERITY)

  const severityOptions = FILTER_DEFINITIONS[FILTER_KEYS.BASELINE_SEVERITY].options

  // Handle severity selection; emits FILTER_SELECTED for FilterManager
  const handleSelect = (index) => {
    eventSystem.emit(eventSystem.constructor.EVENTS.FILTER_SELECTED, {
      filterType: FILTER_KEYS.BASELINE_SEVERITY,
      value: index === selected ? null : index
    })
  }

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  return (
    <FilterComponent title="Baseline Severity" currentSource={currentSource}>
      <div className="radio-filter">
        {/* Render severity level radio option buttons */}
        {severityOptions.map((option, index) => (
          <RadioOption
            key={index}
            value={option.display}
            label={option.display}
            isSelected={selected === index}
            isDisabled={!isAvailable(index)}
            onClick={() => handleSelect(index)}
          />
        ))}
      </div>
    </FilterComponent>
  )
}

export default BaselineSeverityFilter
