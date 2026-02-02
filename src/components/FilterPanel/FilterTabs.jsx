import { motion } from 'framer-motion'
import { DATA_SOURCE } from '../../constants/index.js'
import { ANIMATION_PROPS } from '../../constants/animations.js'
import './FilterTabs.css'

const FilterTabs = ({ currentSource, onSourceChange }) => {
  return (
    <div className="filter-tabs">
      <motion.button
        className={`filter-tab ${currentSource === DATA_SOURCE.CLINICAL_TRIAL ? 'filter-tab-active filter-tab-clinical-trial' : ''}`}
        onClick={() => onSourceChange(DATA_SOURCE.CLINICAL_TRIAL)}
        {...ANIMATION_PROPS.INTERACTIVE}
      >
        <span className="filter-tab-text">Clinical Trial</span>
      </motion.button>
      <motion.button
        className={`filter-tab ${currentSource === DATA_SOURCE.PRACTICE_BASED ? 'filter-tab-active filter-tab-practice-based' : ''}`}
        onClick={() => onSourceChange(DATA_SOURCE.PRACTICE_BASED)}
        {...ANIMATION_PROPS.INTERACTIVE}
      >
        <span className="filter-tab-text">Practice Based</span>
      </motion.button>
    </div>
  )
}

export default FilterTabs
