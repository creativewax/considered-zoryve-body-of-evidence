import { motion } from 'framer-motion'
import { ANIMATION_PROPS } from '../../constants/animations.js'
import './AgeFilter.css'

/**
 * Reusable Filter Button Component (for Age, Gender filters)
 * Handles both selected and unselected states
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
      <span className={`age-button-text ${isSelected ? 'age-button-text-selected' : ''}`}>
        {label}
      </span>
    </motion.button>
  )
}

export default FilterButton
