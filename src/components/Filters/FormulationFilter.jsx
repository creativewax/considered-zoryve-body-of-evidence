import { motion } from 'framer-motion'
import { FILTER_OPTIONS } from '../../constants/index.js'
import { ANIMATION_PROPS, ANIMATIONS, TRANSITIONS } from '../../constants/animations.js'
import appStateManager from '../../managers/AppStateManager.js'
import FilterComponent from './FilterComponent.jsx'
import ScaleIn from '../Animations/ScaleIn.jsx'
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
            {...ANIMATION_PROPS.INTERACTIVE}
          >
            <div className={`radio-button ${selected === formulation ? 'radio-button--selected' : ''}`}>
              {selected === formulation && (
                <ScaleIn>
                  <svg
                    width="9"
                    height="9"
                    viewBox="0 0 9 9"
                  >
                    <path
                      d="M1.5 4.5 L3.5 6.5 L7.5 2"
                      stroke="var(--color-zoryve-black)"
                      strokeWidth="1.5"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </ScaleIn>
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
