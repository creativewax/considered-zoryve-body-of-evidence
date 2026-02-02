import { motion } from 'framer-motion'
import { ANIMATION_PROPS } from '../../constants/animations.js'
import './ConditionFilter.css'

/**
 * Reusable Condition Option Component
 * Handles both selected and unselected states with color-coded backgrounds
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
      <ConditionDot isSelected={isSelected} />
      <ConditionText label={label} />
    </motion.button>
  )
}

/**
 * Condition Dot Sub-component (selected/unselected state)
 */
const ConditionDot = ({ isSelected }) => {
  return (
    <div 
      className={`condition-button-dot ${isSelected ? 'condition-button-dot-selected' : 'condition-button-dot-unselected'}`}
    />
  )
}

/**
 * Condition Text Sub-component
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
