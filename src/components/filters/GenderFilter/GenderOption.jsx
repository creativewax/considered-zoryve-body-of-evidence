/**
 * GenderOption.jsx
 *
 * Reusable gender option component with icon and label
 * Provides animated transitions between selected/unselected states
 * Displays gender-specific icon and text within the button
 */

// #region Imports
import { motion } from 'framer-motion'
import { ANIMATION_PROPS } from '../../../constants/animations.js'
import './GenderFilter.css'
// #endregion

// #region Main Component
/**
 * GenderOption
 *
 * Gender option button with icon and label
 * Supports visual transitions for selected and unselected states
 *
 * @component
 * @param {string} value - Option value/identifier (e.g., "male", "female")
 * @param {string} label - Display text for the gender option
 * @param {string} icon - Image URL for the gender icon
 * @param {boolean} isSelected - Whether the option is currently selected
 * @param {function} onClick - Callback function triggered when option is clicked
 * @returns {ReactElement} Animated button with gender icon and label
 */
const GenderOption = ({
  value,
  label,
  icon,
  isSelected,
  onClick
}) => {
  return (
    <motion.button
      className={`gender-button ${isSelected ? 'gender-button-selected' : ''}`}
      onClick={onClick}
      {...ANIMATION_PROPS.INTERACTIVE}
    >
      {/* Gender icon with selected state styling */}
      <GenderIcon icon={icon} isSelected={isSelected} />
      {/* Gender label text */}
      <GenderText label={label} isSelected={isSelected} />
    </motion.button>
  )
}
// #endregion

// #region Sub-Components
/**
 * GenderIcon
 *
 * Gender icon image with selected/unselected state styling
 * Image styling changes based on selection state
 *
 * @component
 * @param {string} icon - Image URL for the gender icon
 * @param {boolean} isSelected - Whether the option is selected
 * @returns {ReactElement} Image element with conditional styling
 */
const GenderIcon = ({ icon, isSelected }) => {
  return (
    <img
      src={icon}
      alt=""
      className={`gender-button-icon ${isSelected ? 'gender-button-icon-selected' : 'gender-button-icon-unselected'}`}
    />
  )
}

/**
 * GenderText
 *
 * Gender label text with selected state styling
 *
 * @component
 * @param {string} label - Display text
 * @param {boolean} isSelected - Whether the option is selected
 * @returns {ReactElement} Styled text span with conditional selected class
 */
const GenderText = ({ label, isSelected }) => {
  return (
    <span className={`gender-button-text ${isSelected ? 'gender-button-text-selected' : ''}`}>
      {label}
    </span>
  )
}
// #endregion

export default GenderOption
export { GenderIcon, GenderText }
