/**
 * ConditionFilter.jsx
 *
 * Filter component for dermatological conditions with colour-coded styling. Single select with toggle.
 * currentSource - Current data source (CLINICAL_TRIAL or PRACTICE_BASED)
 * selected - Currently selected condition or null if none selected
 */

import { FILTER_DEFINITIONS, FILTER_KEYS } from '../../../constants/index.js'
import eventSystem from '../../../utils/EventSystem.js'
import { useFilterAvailability } from '../../../hooks/filters/useFilterAvailability'
import FilterComponent from '../shared/FilterComponent.jsx'
import ConditionOption from './ConditionOption.jsx'
import './ConditionFilter.css'

// ---------------------------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------------------------

const ConditionFilter = ({ currentSource, selected }) => {
  const { isAvailable } = useFilterAvailability(FILTER_KEYS.INDICATION)

  const conditions = [
    { colourClass: 'condition-button-plaque-psoriasis' },
    { colourClass: 'condition-button-atopic-dermatitis' },
    { colourClass: 'condition-button-seborrheic-dermatitis' },
  ]

  // Handle condition selection; emits FILTER_SELECTED for FilterManager
  const handleSelect = (index) => {
    eventSystem.emit(eventSystem.constructor.EVENTS.FILTER_SELECTED, {
      filterType: FILTER_KEYS.INDICATION,
      value: index === selected ? null : index
    })
  }

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  return (
    <FilterComponent title="Indication" currentSource={currentSource} condensed>
      <div className="condition-filter">
        {/* Render colour-coded condition option buttons */}
        {conditions.map((condition, index) => {
          const option = FILTER_DEFINITIONS[FILTER_KEYS.INDICATION].options[index]
          return (
            <ConditionOption
              key={index}
              value={option.display}
              label={option.display}
              colourClass={condition.colourClass}
              isSelected={selected === index}
              isDisabled={!isAvailable(index)}
              onClick={() => handleSelect(index)}
            />
          )
        })}
      </div>
    </FilterComponent>
  )
}

export default ConditionFilter
