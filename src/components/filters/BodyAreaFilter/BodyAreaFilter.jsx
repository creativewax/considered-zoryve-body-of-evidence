/**
 * BodyAreaFilter.jsx
 *
 * Filter component for selecting body area locations. Radio-style selection, single select with toggle.
 * currentSource - Current data source (CLINICAL_TRIAL or PRACTICE_BASED)
 * selected - Currently selected body area or null if none selected
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

const BodyAreaFilter = ({ currentSource, selected }) => {
  const { isAvailable } = useFilterAvailability(FILTER_KEYS.BODY_AREA)

  const bodyAreaOptions = FILTER_DEFINITIONS[FILTER_KEYS.BODY_AREA].options

  // Handle body area selection; emits FILTER_SELECTED for FilterManager
  const handleSelect = (index) => {
    eventSystem.emit(eventSystem.constructor.EVENTS.FILTER_SELECTED, {
      filterType: FILTER_KEYS.BODY_AREA,
      value: index === selected ? null : index
    })
  }

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  return (
    <FilterComponent title="Body Area" currentSource={currentSource}>
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
              isSelected={selected === index}
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
