/**
 * AgeFilter.jsx
 *
 * Filter component for age ranges. Single select with toggle.
 * currentSource - Current data source (CLINICAL_TRIAL or PRACTICE_BASED)
 * selected - Currently selected age range or null if none selected
 */

import { FILTER_DEFINITIONS, FILTER_KEYS } from '../../../constants/index.js'
import eventSystem from '../../../utils/EventSystem.js'
import { useFilterAvailability } from '../../../hooks/filters/useFilterAvailability'
import FilterComponent from '../shared/FilterComponent.jsx'
import FilterButton from '../shared/FilterButton.jsx'
import './AgeFilter.css'

// ---------------------------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------------------------

const AgeFilter = ({ currentSource, selected }) => {
  const { isAvailable } = useFilterAvailability(FILTER_KEYS.AGE)

  const ageOptions = FILTER_DEFINITIONS[FILTER_KEYS.AGE].options

  // Handle age range selection; emits FILTER_SELECTED for FilterManager
  const handleSelect = (index) => {
    eventSystem.emit(eventSystem.constructor.EVENTS.FILTER_SELECTED, {
      filterType: FILTER_KEYS.AGE,
      value: index === selected ? null : index
    })
  }

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  return (
    <FilterComponent title="Age" currentSource={currentSource}>
      <div className="age-filter">
        {/* Render age range buttons */}
        {ageOptions.map((option, index) => (
          <FilterButton
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

export default AgeFilter
