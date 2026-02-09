/**
 * ConditionFilter.jsx
 *
 * Filter component for dermatological conditions with colour-coded styling. Single select with toggle.
 * currentSource - Current data source (CLINICAL_TRIAL or PRACTICE_BASED)
 * selected - Currently selected condition or null if none selected
 */

import { FILTER_OPTIONS, FILTER_KEYS } from '../../../constants/index.js'
import eventSystem from '../../../utils/EventSystem.js'
import { useFilterAvailability } from '../../../hooks/filters/useFilterAvailability'
import FilterComponent from '../shared/FilterComponent.jsx'
import ConditionOption from './ConditionOption.jsx'
import './ConditionFilter.css'

// ---------------------------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------------------------

const ConditionFilter = ({ currentSource, selected }) => {
  const { isAvailable } = useFilterAvailability(FILTER_KEYS.CONDITION)

  const conditions = [
    { value: FILTER_OPTIONS.CONDITION.PLAQUE_PSORIASIS, colourClass: 'condition-button-plaque-psoriasis' },
    { value: FILTER_OPTIONS.CONDITION.ATOPIC_DERMATITIS, colourClass: 'condition-button-atopic-dermatitis' },
    { value: FILTER_OPTIONS.CONDITION.SEBORRHEIC_DERMATITIS, colourClass: 'condition-button-seborrheic-dermatitis' },
  ]

  // Handle condition selection; emits FILTER_SELECTED for FilterManager
  const handleSelect = (condition) => {
    eventSystem.emit(eventSystem.constructor.EVENTS.FILTER_SELECTED, {
      filterType: FILTER_KEYS.CONDITION,
      value: condition === selected ? null : condition
    })
  }

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  return (
    <FilterComponent title="Condition" currentSource={currentSource} condensed>
      <div className="condition-filter">
        {/* Render colour-coded condition option buttons */}
        {conditions.map((condition) => (
          <ConditionOption
            key={condition.value}
            value={condition.value}
            label={condition.value}
            colourClass={condition.colourClass}
            isSelected={selected === condition.value}
            isDisabled={!isAvailable(condition.value)}
            onClick={() => handleSelect(condition.value)}
          />
        ))}
      </div>
    </FilterComponent>
  )
}

export default ConditionFilter
