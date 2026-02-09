/**
 * FormulationFilter.jsx
 *
 * Filter component for formulation types (cream/foam). Radio-style, single select with toggle.
 * currentSource - Current data source (CLINICAL_TRIAL or PRACTICE_BASED)
 * selected - Currently selected formulation or null if none selected
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

const FormulationFilter = ({ currentSource, selected }) => {
  const { isAvailable } = useFilterAvailability(FILTER_KEYS.FORMULATION)

  const formulationOptions = FILTER_DEFINITIONS[FILTER_KEYS.FORMULATION].options

  // Handle formulation selection; emits FILTER_SELECTED for FilterManager
  const handleSelect = (index) => {
    eventSystem.emit(eventSystem.constructor.EVENTS.FILTER_SELECTED, {
      filterType: FILTER_KEYS.FORMULATION,
      value: index === selected ? null : index
    })
  }

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  return (
    <FilterComponent title="Formulation" currentSource={currentSource}>
      <div className="radio-filter">
        {/* Render formulation radio option buttons */}
        {formulationOptions.map((option, index) => (
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

export default FormulationFilter
