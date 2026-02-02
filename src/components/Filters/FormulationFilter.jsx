import { FILTER_OPTIONS } from '../../constants/index.js'
import appStateManager from '../../managers/AppStateManager.js'
import FilterComponent from './FilterComponent.jsx'
import RadioOption from './RadioOption.jsx'
import './RadioFilter.css'

const FormulationFilter = ({ currentSource, selected }) => {
  const formulations = [
    FILTER_OPTIONS.FORMULATION.CREAM_005,
    FILTER_OPTIONS.FORMULATION.CREAM_015,
    FILTER_OPTIONS.FORMULATION.CREAM_03,
    FILTER_OPTIONS.FORMULATION.FOAM_03,
  ]

  const handleSelect = (formulation) => {
    appStateManager.setFilter('formulation', formulation === selected ? null : formulation)
  }

  return (
    <FilterComponent title="Formulation" currentSource={currentSource}>
      <div className="radio-filter">
        {formulations.map((formulation) => (
          <RadioOption
            key={formulation}
            value={formulation}
            label={formulation}
            isSelected={selected === formulation}
            onClick={() => handleSelect(formulation)}
          />
        ))}
      </div>
    </FilterComponent>
  )
}

export default FormulationFilter
