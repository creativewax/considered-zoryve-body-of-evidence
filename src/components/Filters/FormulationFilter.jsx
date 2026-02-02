import { motion } from 'framer-motion'
import { FILTER_OPTIONS } from '../../constants/index.js'
import appStateManager from '../../managers/AppStateManager.js'
import FilterComponent from './FilterComponent.jsx'
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
          <motion.button
            key={formulation}
            className="radio-option"
            onClick={() => handleSelect(formulation)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className={`radio-button ${selected === formulation ? 'radio-button--selected' : ''}`}>
              {selected === formulation && (
                <motion.svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  <path
                    d="M4 8 L7 11 L12 4"
                    stroke="var(--color-zoryve-black)"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </motion.svg>
              )}
            </div>
            <span className={`radio-option__text ${selected === formulation ? 'radio-option__text--selected' : ''}`}>
              {formulation}
            </span>
          </motion.button>
        ))}
      </div>
    </FilterComponent>
  )
}

export default FormulationFilter
