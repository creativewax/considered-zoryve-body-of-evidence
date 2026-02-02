import { motion } from 'framer-motion'
import { FILTER_OPTIONS } from '../../constants/index.js'
import { ANIMATION_PROPS } from '../../constants/animations.js'
import appStateManager from '../../managers/AppStateManager.js'
import FilterComponent from './FilterComponent.jsx'
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
        {conditions.map((condition) => {
          const isSelected = selected === condition.value
          return (
            <motion.button
              key={condition.value}
              className={`condition-button ${isSelected ? `condition-button--selected ${condition.colorClass}` : ''}`}
              onClick={() => handleSelect(condition.value)}
              {...ANIMATION_PROPS.INTERACTIVE}
            >
              <div 
                className={`condition-button__dot ${isSelected ? 'condition-button__dot--selected' : 'condition-button__dot--unselected'}`}
              />
              <span className="condition-button__text">{condition.value}</span>
            </motion.button>
          )
        })}
      </div>
    </FilterComponent>
  )
}

export default ConditionFilter
