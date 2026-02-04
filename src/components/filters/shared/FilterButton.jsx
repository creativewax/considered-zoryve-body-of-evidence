/**
 * FilterButton.jsx
 *
 * Reusable button component for filter options (Age, Gender)
 * Provides animated state transitions and standard button styling
 * Supports selected/unselected visual states
 */

import { motion } from 'framer-motion'
import { ANIMATION_PROPS } from '../../../constants/animations.js'
import '../AgeFilter/AgeFilter.css'

/**
 * FilterButton - Animated button for Age/Gender filter options (selected/unselected states)
 *
 * value, label - Button value and display text
 * isSelected - Whether the button is currently selected
 * onClick - Callback when button is clicked
 * className - Optional additional CSS classes
 */
const FilterButton = ({
  value,
  label,
  isSelected,
  onClick,
  className = ''
}) => {
  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

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

export default FilterButton
