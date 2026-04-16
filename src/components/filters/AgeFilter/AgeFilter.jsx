/**
 * AgeFilter.jsx
 *
 * Filter component for age ranges. Single select with toggle.
 * selected - Currently selected age range indices
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

const AgeFilter = ({ selected }) => {
  const { isAvailable } = useFilterAvailability(FILTER_KEYS.AGE)

  const ageOptions = FILTER_DEFINITIONS[FILTER_KEYS.AGE].options

  // Handle age range selection; emits FILTER_SELECTED for FilterManager
  const handleSelect = (index) => {
    eventSystem.emit(eventSystem.constructor.EVENTS.FILTER_SELECTED, {
      filterType: FILTER_KEYS.AGE,
      value: index
    })
  }

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  return (
    <FilterComponent title={FILTER_DEFINITIONS[FILTER_KEYS.AGE].label}>
      <div className="age-filter">
        {/* Render age range buttons */}
        {ageOptions.map((option, index) => (
          <FilterButton
            key={index}
            value={option.display}
            label={option.display}
            isSelected={selected.includes(index)}
            isDisabled={!isAvailable(index)}
            onClick={() => handleSelect(index)}
          />
        ))}
      </div>
    </FilterComponent>
  )
}

export default AgeFilter
