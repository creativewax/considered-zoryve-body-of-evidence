import { FILTER_OPTIONS } from '../../constants/index.js'
import appStateManager from '../../managers/AppStateManager.js'
import FilterComponent from './FilterComponent.jsx'
import ConditionOption from './ConditionOption.jsx'
import './ConditionFilter.css'

const ConditionFilter = ({ currentSource, selected }) => {
  const conditions = [
    { value: FILTER_OPTIONS.CONDITION.PLAQUE_PSORIASIS, colorClass: 'condition-button--plaque-psoriasis' },
    { value: FILTER_OPTIONS.CONDITION.ATOPIC_DERMATITIS, colorClass: 'condition-button--atopic-dermatitis' },
    { value: FILTER_OPTIONS.CONDITION.SEBORRHEIC_DERMATITIS, colorClass: 'condition-button--seborrheic-dermatitis' },
  ]

  const handleSelect = (condition) => {
    appStateManager.setFilter('condition', condition === selected ? null : condition)
  }

  return (
    <FilterComponent title="Condition" currentSource={currentSource} condensed>
      <div className="condition-filter">
        {conditions.map((condition) => (
          <ConditionOption
            key={condition.value}
            value={condition.value}
            label={condition.value}
            colorClass={condition.colorClass}
            isSelected={selected === condition.value}
            onClick={() => handleSelect(condition.value)}
          />
        ))}
      </div>
    </FilterComponent>
  )
}

export default ConditionFilter
