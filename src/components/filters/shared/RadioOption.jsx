/**
 * RadioOption.jsx
 *
 * Reusable radio option component for single-select filters (Condition)
 * Provides animated checkmark icon and text with selected/unselected states
 * Composed of sub-components for radio button and text elements
 */

import { motion } from 'framer-motion'
import { ANIMATION_PROPS } from '../../../constants/animations.js'
import ScaleIn from '../../animations/ScaleIn.jsx'
import './RadioFilter.css'

/**
 * RadioOption - Main radio option button with animated checkmark and label
 *
 * value - Option value/identifier
 * label - Display text for the option
 * isSelected - Whether the option is currently selected
 * isDisabled - Whether the option is disabled (faded and not clickable)
 * onClick - Callback when option is clicked
 */
const RadioOption = ({
  value,
  label,
  isSelected,
  isDisabled = false,
  onClick
}) => {
  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  return (
    <motion.button
      className={`radio-option ${isDisabled ? 'button-disabled' : ''}`}
      disabled={isDisabled}
      onClick={onClick}
      {...ANIMATION_PROPS.INTERACTIVE}
    >
      {/* Radio button with animated checkmark */}
      <RadioButton isSelected={isSelected} />
      {/* Option label text */}
      <RadioOptionText label={label} isSelected={isSelected} />
    </motion.button>
  )
}

/**
 * RadioButton - Radio indicator with animated checkmark when selected.
 * isSelected - Whether the radio button is selected
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
              stroke="var(--colour-zoryve-black)"
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
 * RadioOptionText - Text label for radio option with selected state styling
 * label - Display text, isSelected - Whether the option is selected
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
