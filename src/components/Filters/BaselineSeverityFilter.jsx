import { motion } from 'framer-motion'
import { FILTER_OPTIONS } from '../../constants/index.js'
import appStateManager from '../../managers/AppStateManager.js'
import FilterComponent from './FilterComponent.jsx'
import './RadioFilter.css'

const BaselineSeverityFilter = ({ currentSource, selected }) => {
  const severities = [
    FILTER_OPTIONS.BASELINE_SEVERITY.MILD,
    FILTER_OPTIONS.BASELINE_SEVERITY.MODERATE,
    FILTER_OPTIONS.BASELINE_SEVERITY.SEVERE,
  ]

  const handleSelect = (severity) => {
    appStateManager.setFilter('baselineSeverity', severity === selected ? null : severity)
  }

  return (
    <FilterComponent title="Baseline Severity" currentSource={currentSource}>
      <div className="radio-filter">
        {severities.map((severity) => (
          <motion.button
            key={severity}
            className="radio-option"
            onClick={() => handleSelect(severity)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className={`radio-button ${selected === severity ? 'radio-button--selected' : ''}`}>
              {selected === severity && (
                <motion.svg
                  width="9"
                  height="9"
                  viewBox="0 0 9 9"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  <path
                    d="M1.5 4.5 L3.5 6.5 L7.5 2"
                    stroke="var(--color-zoryve-black)"
                    strokeWidth="1.5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </motion.svg>
              )}
            </div>
            <span className={`radio-option__text ${selected === severity ? 'radio-option__text--selected' : ''}`}>
              {severity}
            </span>
          </motion.button>
        ))}
      </div>
    </FilterComponent>
  )
}

export default BaselineSeverityFilter
