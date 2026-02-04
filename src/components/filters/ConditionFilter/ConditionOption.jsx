/**
 * ConditionOption.jsx
 *
 * Reusable condition option component with color-coded indicator dot
 * Provides animated transitions between selected/unselected states
 * Supports multiple condition types with color differentiation
 */

// #region Imports
import { motion } from 'framer-motion'
import { ANIMATION_PROPS } from '../../../constants/animations.js'
import './ConditionFilter.css'
// #endregion

// #region Main Component
/**
 * ConditionOption
 *
 * Condition option button with color-coded indicator dot and label
 * Supports multiple condition types differentiated by color classes
 *
 * @component
 * @param {string} value - Option value/identifier (e.g., "hypertension", "diabetes")
 * @param {string} label - Display text for the condition
 * @param {string} colorClass - CSS class for color-coding (applied when selected)
 * @param {boolean} isSelected - Whether the option is currently selected
 * @param {function} onClick - Callback function triggered when option is clicked
 * @returns {ReactElement} Animated button with color-coded dot and label
 */
const ConditionOption = ({
  value,
  label,
  colorClass,
  isSelected,
  onClick
}) => {
  return (
    <motion.button
      className={`condition-button ${isSelected ? `condition-button-selected ${colorClass}` : ''}`}
      onClick={onClick}
      {...ANIMATION_PROPS.INTERACTIVE}
    >
      {/* Color-coded indicator dot */}
      <ConditionDot isSelected={isSelected} />
      {/* Condition label text */}
      <ConditionText label={label} />
    </motion.button>
  )
}
// #endregion

// #region Sub-Components
/**
 * ConditionDot
 *
 * Color-coded indicator dot for condition option
 * Provides visual differentiation for selected vs unselected states
 *
 * @component
 * @param {boolean} isSelected - Whether the condition is selected
 * @returns {ReactElement} Styled div element representing the indicator dot
 */
const ConditionDot = ({ isSelected }) => {
  return (
    <div
      className={`condition-button-dot ${isSelected ? 'condition-button-dot-selected' : 'condition-button-dot-unselected'}`}
    />
  )
}

/**
 * ConditionText
 *
 * Condition label text
 *
 * @component
 * @param {string} label - Display text for the condition
 * @returns {ReactElement} Styled text span with condition name
 */
const ConditionText = ({ label }) => {
  return (
    <span className="condition-button-text">
      {label}
    </span>
  )
}
// #endregion

export default ConditionOption
export { ConditionDot, ConditionText }
