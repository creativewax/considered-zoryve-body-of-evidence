import { motion } from 'framer-motion'
import { FILTER_OPTIONS } from '../../constants/index.js'
import appStateManager from '../../managers/AppStateManager.js'
import FilterComponent from './FilterComponent.jsx'
import './ConditionFilter.css'

const ConditionFilter = ({ currentSource, selected }) => {
  const conditions = [
    { value: FILTER_OPTIONS.CONDITION.PLAQUE_PSORIASIS, color: 'var(--color-plaque-psoriasis)' },
    { value: FILTER_OPTIONS.CONDITION.ATOPIC_DERMATITIS, color: 'var(--color-atopic-dermatitis)' },
    { value: FILTER_OPTIONS.CONDITION.SEBORRHEIC_DERMATITIS, color: 'var(--color-seborrheic-dermatitis)' },
  ]

  const handleSelect = (condition) => {
    appStateManager.setFilter('condition', condition === selected ? null : condition)
  }

  return (
    <FilterComponent title="Condition" currentSource={currentSource} condensed>
      <div className="condition-filter">
        {conditions.map((condition) => (
          <motion.button
            key={condition.value}
            className={`condition-button ${selected === condition.value ? 'condition-button--selected' : ''}`}
            onClick={() => handleSelect(condition.value)}
            style={{
              backgroundColor: selected === condition.value ? condition.color : 'transparent'
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div 
              className="condition-button__dot"
              style={{
                backgroundColor: selected === condition.value 
                  ? 'var(--color-white)' 
                  : 'var(--color-zoryve-midnight-blue)',
                opacity: selected === condition.value ? 1 : 0.4
              }}
            />
            <span className="condition-button__text">{condition.value}</span>
          </motion.button>
        ))}
      </div>
    </FilterComponent>
  )
}

export default ConditionFilter
