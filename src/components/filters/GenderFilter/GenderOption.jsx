/**
 * GenderOption.jsx
 *
 * Reusable gender option component with icon and label
 * Provides animated transitions between selected/unselected states
 * Displays gender-specific icon and text within the button
 */

import { motion } from 'framer-motion'
import { ANIMATION_PROPS } from '../../../constants/animations.js'
import './GenderFilter.css'

/**
 * GenderOption - Gender option button with icon and label
 *
 * value, label - Option value and display text
 * icon - Image URL for the gender icon
 * isSelected - Whether the option is currently selected
 * isDisabled - Whether the option is disabled (faded and not clickable)
 * onClick - Callback when option is clicked
 */
const GenderOption = ({
  value,
  label,
  icon,
  isSelected,
  isDisabled = false,
  onClick
}) => {
  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  return (
    <motion.button
      className={`gender-button ${isSelected ? 'gender-button-selected' : ''} ${isDisabled ? 'button-disabled' : ''}`}
      disabled={isDisabled}
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

/**
 * GenderIcon - Gender icon image with selected/unselected styling
 * icon - Image URL, isSelected - Whether the option is selected
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
 * GenderText - Gender label with selected state styling
 * label - Display text, isSelected - Whether the option is selected
 */
const GenderText = ({ label, isSelected }) => {
  return (
    <span className={`gender-button-text ${isSelected ? 'gender-button-text-selected' : ''}`}>
      {label}
    </span>
  )
}

export default GenderOption
export { GenderIcon, GenderText }
