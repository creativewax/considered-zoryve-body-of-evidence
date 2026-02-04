/**
 * AgeFilter.jsx
 *
 * Filter component for age ranges. Single select with toggle.
 * currentSource - Current data source (CLINICAL_TRIAL or PRACTICE_BASED)
 * selected - Currently selected age range or null if none selected
 */

import { FILTER_OPTIONS, FILTER_KEYS } from '../../../constants/index.js'
import eventSystem from '../../../utils/EventSystem.js'
import FilterComponent from '../shared/FilterComponent.jsx'
import FilterButton from '../shared/FilterButton.jsx'
import './AgeFilter.css'

// ---------------------------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------------------------

const AgeFilter = ({ currentSource, selected }) => {
  const ageRanges = [
    FILTER_OPTIONS.AGE_RANGES.RANGE_2_5,
    FILTER_OPTIONS.AGE_RANGES.RANGE_6_18,
    FILTER_OPTIONS.AGE_RANGES.RANGE_19_30,
    FILTER_OPTIONS.AGE_RANGES.RANGE_31_50,
    FILTER_OPTIONS.AGE_RANGES.RANGE_50_PLUS,
  ]

  // Handle age range selection; emits FILTER_SELECTED for FilterManager
  const handleSelect = (age) => {
    eventSystem.emit(eventSystem.constructor.EVENTS.FILTER_SELECTED, {
      filterType: FILTER_KEYS.AGE,
      value: age === selected ? null : age
    })
  }

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  return (
    <FilterComponent title="Age" currentSource={currentSource}>
      <div className="age-filter">
        {/* Render age range buttons */}
        {ageRanges.map((age) => (
          <FilterButton
            key={age}
            value={age}
            label={age}
            isSelected={selected === age}
            onClick={() => handleSelect(age)}
          />
        ))}
      </div>
    </FilterComponent>
  )
}

export default AgeFilter
