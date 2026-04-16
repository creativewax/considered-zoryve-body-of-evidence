/**
 * BodyAreaFilter.jsx
 *
 * Filter component for selecting body area locations. Radio-style selection, single select with toggle.
 * selected - Currently selected body area indices
 */

import { FILTER_DEFINITIONS, FILTER_KEYS } from '../../../constants/index.js'
import eventSystem from '../../../utils/EventSystem.js'
import { useFilterAvailability } from '../../../hooks/filters/useFilterAvailability'
import FilterComponent from '../shared/FilterComponent.jsx'
import RadioOption from '../shared/RadioOption.jsx'
import '../shared/RadioFilter.css'
import './BodyAreaFilter.css'

// ---------------------------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------------------------

const BodyAreaFilter = ({ selected }) => {
  const { isAvailable } = useFilterAvailability(FILTER_KEYS.BODY_AREA)

  const bodyAreaOptions = FILTER_DEFINITIONS[FILTER_KEYS.BODY_AREA].options

  // Handle body area selection; emits FILTER_SELECTED for FilterManager
  const handleSelect = (index) => {
    eventSystem.emit(eventSystem.constructor.EVENTS.FILTER_SELECTED, {
      filterType: FILTER_KEYS.BODY_AREA,
      value: index
    })
  }

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  return (
    <FilterComponent title={FILTER_DEFINITIONS[FILTER_KEYS.BODY_AREA].label}>
      <div className="body-area-filter">
        {/* Decorative background element */}
        <div className="body-area-filter-background" />
        {/* Body area radio option buttons */}
        <div className="radio-filter body-area-filter-options">
          {bodyAreaOptions.map((option, index) => (
            <RadioOption
              key={index}
              value={option.display}
              label={option.display}
              isSelected={selected.includes(index)}
              isDisabled={!isAvailable(index)}
              onClick={() => handleSelect(index)}
            />
          ))}
        </div>
      </div>
    </FilterComponent>
  )
}

export default BodyAreaFilter
