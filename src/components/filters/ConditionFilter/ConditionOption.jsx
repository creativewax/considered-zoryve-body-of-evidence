/**
 * ConditionOption.jsx
 *
 * Reusable condition option component with colour-coded indicator dot
 * Provides animated transitions between selected/unselected states
 * Supports multiple condition types with colour differentiation
 */

import { motion } from 'framer-motion'
import { ANIMATION_PROPS } from '../../../constants/animations.js'
import './ConditionFilter.css'

/**
 * ConditionOption - Condition option button with colour-coded indicator dot and label
 *
 * value, label - Option value and display text
 * colourClass - CSS class for colour-coding (applied when selected)
 * isSelected - Whether the option is currently selected
 * onClick - Callback when option is clicked
 */
const ConditionOption = ({
  value,
  label,
  colourClass,
  isSelected,
  onClick
}) => {
  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  return (
    <motion.button
      className={`condition-button ${isSelected ? `condition-button-selected ${colourClass}` : ''}`}
      onClick={onClick}
      {...ANIMATION_PROPS.INTERACTIVE}
    >
      {/* Colour-coded indicator dot */}
      <ConditionDot isSelected={isSelected} />
      {/* Condition label text */}
      <ConditionText label={label} />
    </motion.button>
  )
}

/**
 * ConditionDot - Colour-coded indicator dot for condition option
 * isSelected - Whether the condition is selected
 */
const ConditionDot = ({ isSelected }) => {
  return (
    <div
      className={`condition-button-dot ${isSelected ? 'condition-button-dot-selected' : 'condition-button-dot-unselected'}`}
    />
  )
}

/**
 * ConditionText - Condition label text. label - Display text for the condition
 */
const ConditionText = ({ label }) => {
  return (
    <span className="condition-button-text">
      {label}
    </span>
  )
}

export default ConditionOption
export { ConditionDot, ConditionText }
