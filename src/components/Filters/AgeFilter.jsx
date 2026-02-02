import { motion } from 'framer-motion'
import { FILTER_OPTIONS } from '../../constants/index.js'
import { ANIMATION_PROPS } from '../../constants/animations.js'
import appStateManager from '../../managers/AppStateManager.js'
import FilterComponent from './FilterComponent.jsx'
import './AgeFilter.css'

const AgeFilter = ({ currentSource, selected }) => {
  const ageRanges = [
    FILTER_OPTIONS.AGE_RANGES.RANGE_2_5,
    FILTER_OPTIONS.AGE_RANGES.RANGE_6_18,
    FILTER_OPTIONS.AGE_RANGES.RANGE_19_30,
    FILTER_OPTIONS.AGE_RANGES.RANGE_31_50,
    FILTER_OPTIONS.AGE_RANGES.RANGE_50_PLUS,
  ]

  const handleSelect = (age) => {
    appStateManager.setFilter('age', age === selected ? null : age)
  }

  return (
    <FilterComponent title="Age" currentSource={currentSource}>
      <div className="age-filter">
        {ageRanges.map((age) => (
          <motion.button
            key={age}
            className={`age-button ${selected === age ? 'age-button--selected' : ''}`}
            onClick={() => handleSelect(age)}
            {...ANIMATION_PROPS.INTERACTIVE}
          >
            <span className={`age-button__text ${selected === age ? 'age-button__text--selected' : ''}`}>
              {age}
            </span>
          </motion.button>
        ))}
      </div>
    </FilterComponent>
  )
}

export default AgeFilter
