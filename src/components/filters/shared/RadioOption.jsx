/**
 * RadioOption.jsx
 *
 * Reusable radio option component for single-select filters (Condition)
 * Provides animated checkmark icon and text with selected/unselected states
 * Composed of sub-components for radio button and text elements
 */

// #region Imports
import { motion } from 'framer-motion'
import { ANIMATION_PROPS } from '../../../constants/animations.js'
import ScaleIn from '../../animations/ScaleIn.jsx'
import './RadioFilter.css'
// #endregion

// #region Main Component
/**
 * RadioOption
 *
 * Main radio option button component with animated checkmark and label
 *
 * @component
 * @param {string} value - Option value/identifier
 * @param {string} label - Display text for the option
 * @param {boolean} isSelected - Whether the option is currently selected
 * @param {function} onClick - Callback function triggered when option is clicked
 * @returns {ReactElement} Animated radio button with checkmark and text
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
      {/* Radio button with animated checkmark */}
      <RadioButton isSelected={isSelected} />
      {/* Option label text */}
      <RadioOptionText label={label} isSelected={isSelected} />
    </motion.button>
  )
}
// #endregion

// #region Sub-Components
/**
 * RadioButton
 *
 * Radio button indicator with animated checkmark icon
 * Shows checkmark animation when selected, empty circle when unselected
 *
 * @component
 * @param {boolean} isSelected - Whether the radio button is selected
 * @returns {ReactElement} Radio button circle with optional animated checkmark
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
 * RadioOptionText
 *
 * Text label for radio option with selected state styling
 *
 * @component
 * @param {string} label - Display text
 * @param {boolean} isSelected - Whether the option is selected
 * @returns {ReactElement} Styled text span with conditional selected class
 */
const RadioOptionText = ({ label, isSelected }) => {
  return (
    <span className={`radio-option-text ${isSelected ? 'radio-option-text-selected' : ''}`}>
      {label}
    </span>
  )
}
// #endregion

export default RadioOption
export { RadioButton, RadioOptionText }
