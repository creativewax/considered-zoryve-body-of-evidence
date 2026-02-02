import { motion } from 'framer-motion'
import { ANIMATION_PROPS } from '../../constants/animations.js'
import './GenderFilter.css'

/**
 * Reusable Gender Option Component
 * Handles both selected and unselected states with icon
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
      <GenderIcon icon={icon} isSelected={isSelected} />
      <GenderText label={label} isSelected={isSelected} />
    </motion.button>
  )
}

/**
 * Gender Icon Sub-component (selected/unselected state)
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
 * Gender Text Sub-component
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
