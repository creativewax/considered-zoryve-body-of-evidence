import { motion } from 'framer-motion'
import { DATA_SOURCE } from '../../constants/index.js'
import './FilterTabs.css'

const FilterTabs = ({ currentSource, onSourceChange }) => {
  return (
    <div className="filter-tabs">
      <motion.button
        className={`filter-tab ${currentSource === DATA_SOURCE.CLINICAL_TRIAL ? 'filter-tab--active' : ''}`}
        onClick={() => onSourceChange(DATA_SOURCE.CLINICAL_TRIAL)}
        style={{
          background: currentSource === DATA_SOURCE.CLINICAL_TRIAL
            ? 'linear-gradient(to bottom, var(--color-ct-gradient-start), var(--color-ct-gradient-end))'
            : 'transparent'
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span className="filter-tab__text">Clinical Trial</span>
      </motion.button>
      <motion.button
        className={`filter-tab ${currentSource === DATA_SOURCE.PRACTICE_BASED ? 'filter-tab--active' : ''}`}
        onClick={() => onSourceChange(DATA_SOURCE.PRACTICE_BASED)}
        style={{
          background: currentSource === DATA_SOURCE.PRACTICE_BASED
            ? 'linear-gradient(to bottom, var(--color-pb-gradient-start), var(--color-pb-gradient-end))'
            : 'transparent'
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span className="filter-tab__text">Practice Based</span>
      </motion.button>
    </div>
  )
}

export default FilterTabs
