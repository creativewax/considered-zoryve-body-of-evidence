/**
 * FormulationFilter.jsx
 *
 * Filter component for formulation types (cream/foam). Radio-style, single select with toggle.
 * currentSource - Current data source (CLINICAL_TRIAL or PRACTICE_BASED)
 * selected - Currently selected formulation or null if none selected
 */

import { FILTER_OPTIONS, FILTER_KEYS } from '../../../constants/index.js'
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

  const formulations = [
    FILTER_OPTIONS.FORMULATION.CREAM_005,
    FILTER_OPTIONS.FORMULATION.CREAM_015,
    FILTER_OPTIONS.FORMULATION.CREAM_03,
    FILTER_OPTIONS.FORMULATION.FOAM_03,
  ]

  // Handle formulation selection; emits FILTER_SELECTED for FilterManager
  const handleSelect = (formulation) => {
    eventSystem.emit(eventSystem.constructor.EVENTS.FILTER_SELECTED, {
      filterType: FILTER_KEYS.FORMULATION,
      value: formulation === selected ? null : formulation
    })
  }

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  return (
    <FilterComponent title="Formulation" currentSource={currentSource}>
      <div className="radio-filter">
        {/* Render formulation radio option buttons */}
        {formulations.map((formulation) => (
          <RadioOption
            key={formulation}
            value={formulation}
            label={formulation}
            isSelected={selected === formulation}
            isDisabled={!isAvailable(formulation)}
            onClick={() => handleSelect(formulation)}
          />
        ))}
      </div>
    </FilterComponent>
  )
}

export default FormulationFilter
