/**
 * GenderFilter.jsx
 *
 * Filter component for gender with icons. Single select with toggle.
 * currentSource - Current data source (CLINICAL_TRIAL or PRACTICE_BASED)
 * selected - Currently selected gender or null if none selected
 */

import { FILTER_DEFINITIONS, FILTER_KEYS } from '../../../constants/index.js'
import eventSystem from '../../../utils/EventSystem.js'
import { useFilterAvailability } from '../../../hooks/filters/useFilterAvailability'
import FilterComponent from '../shared/FilterComponent.jsx'
import GenderOption from './GenderOption.jsx'
import './GenderFilter.css'

// ---------------------------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------------------------

const GenderFilter = ({ currentSource, selected }) => {
  const { isAvailable } = useFilterAvailability(FILTER_KEYS.GENDER)

  const genderOptions = FILTER_DEFINITIONS[FILTER_KEYS.GENDER].options

  // Handle gender selection; emits FILTER_SELECTED for FilterManager
  const handleSelect = (index) => {
    eventSystem.emit(eventSystem.constructor.EVENTS.FILTER_SELECTED, {
      filterType: FILTER_KEYS.GENDER,
      value: index === selected ? null : index
    })
  }

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  return (
    <FilterComponent title="Gender" currentSource={currentSource}>
      <div className="gender-filter">
        {/* Render gender option buttons with icons */}
        {genderOptions.map((option, index) => (
          <GenderOption
            key={index}
            value={option.display}
            label={option.display}
            icon={option.icon}
            isSelected={selected === index}
            isDisabled={!isAvailable(index)}
            onClick={() => handleSelect(index)}
          />
        ))}
      </div>
    </FilterComponent>
  )
}

export default GenderFilter
