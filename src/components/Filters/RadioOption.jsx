import { motion } from 'framer-motion'
import { ANIMATION_PROPS } from '../../constants/animations.js'
import ScaleIn from '../Animations/ScaleIn.jsx'
import './RadioFilter.css'

/**
 * Reusable Radio Option Component
 * Handles both selected and unselected states
 */
const RadioOption = ({ 
  value, 
  label, 
  isSelected, 
  onClick 
}) => {
  return (
    <motion.button
      className="radio-option"
      onClick={onClick}
      {...ANIMATION_PROPS.INTERACTIVE}
    >
      <RadioButton isSelected={isSelected} />
      <RadioOptionText label={label} isSelected={isSelected} />
    </motion.button>
  )
}

/**
 * Radio Button Sub-component (selected/unselected state)
 */
const RadioButton = ({ isSelected }) => {
  return (
    <div className={`radio-button ${isSelected ? 'radio-button-selected' : ''}`}>
      {isSelected && (
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
  )
}

/**
 * Radio Option Text Sub-component
 */
const RadioOptionText = ({ label, isSelected }) => {
  return (
    <span className={`radio-option-text ${isSelected ? 'radio-option-text-selected' : ''}`}>
      {label}
    </span>
  )
}

export default RadioOption
export { RadioButton, RadioOptionText }
