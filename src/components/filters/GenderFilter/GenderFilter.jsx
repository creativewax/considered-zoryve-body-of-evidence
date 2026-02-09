/**
 * GenderFilter.jsx
 *
 * Filter component for gender with icons. Single select with toggle.
 * currentSource - Current data source (CLINICAL_TRIAL or PRACTICE_BASED)
 * selected - Currently selected gender or null if none selected
 */

import { FILTER_OPTIONS, FILTER_KEYS, ASSETS } from '../../../constants/index.js'
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

  const genders = [
    { value: FILTER_OPTIONS.GENDER.MALE, icon: ASSETS.ICONS.MALE },
    { value: FILTER_OPTIONS.GENDER.FEMALE, icon: ASSETS.ICONS.FEMALE },
  ]

  // Handle gender selection; emits FILTER_SELECTED for FilterManager
  const handleSelect = (gender) => {
    eventSystem.emit(eventSystem.constructor.EVENTS.FILTER_SELECTED, {
      filterType: FILTER_KEYS.GENDER,
      value: gender === selected ? null : gender
    })
  }

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  return (
    <FilterComponent title="Gender" currentSource={currentSource}>
      <div className="gender-filter">
        {/* Render gender option buttons with icons */}
        {genders.map((gender) => (
          <GenderOption
            key={gender.value}
            value={gender.value}
            label={gender.value}
            icon={gender.icon}
            isSelected={selected === gender.value}
            isDisabled={!isAvailable(gender.value)}
            onClick={() => handleSelect(gender.value)}
          />
        ))}
      </div>
    </FilterComponent>
  )
}

export default GenderFilter
