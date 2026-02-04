/**
 * FilterButton.jsx
 *
 * Reusable button component for filter options (Age, Gender)
 * Provides animated state transitions and standard button styling
 * Supports selected/unselected visual states
 */

// #region Imports
import { motion } from 'framer-motion'
import { ANIMATION_PROPS } from '../../../constants/animations.js'
import '../AgeFilter/AgeFilter.css'
// #endregion

// #region Component
/**
 * FilterButton
 *
 * Reusable animated button for Age and Gender filter options
 * Toggles between selected and unselected visual states
 *
 * @component
 * @param {string} value - Button value/identifier
 * @param {string} label - Display text for the button
 * @param {boolean} isSelected - Whether the button is currently selected
 * @param {function} onClick - Callback function triggered when button is clicked
 * @param {string} [className=''] - Additional CSS classes to apply
 * @returns {ReactElement} Animated button element with conditional styling
 */
const FilterButton = ({
  value,
  label,
  isSelected,
  onClick,
  className = ''
}) => {
  return (
    <motion.button
      className={`age-button ${isSelected ? 'age-button-selected' : ''} ${className}`}
      onClick={onClick}
      {...ANIMATION_PROPS.INTERACTIVE}
    >
      {/* Button text with selected state styling */}
      <span className={`age-button-text ${isSelected ? 'age-button-text-selected' : ''}`}>
        {label}
      </span>
    </motion.button>
  )
}
// #endregion

export default FilterButton
