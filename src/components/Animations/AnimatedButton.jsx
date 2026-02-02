import { motion } from 'framer-motion'
import { ANIMATION_PROPS } from '../../constants/animations.js'

/**
 * Reusable animated button component
 * Handles hover and tap animations automatically
 */
const AnimatedButton = ({ 
  children, 
  onClick, 
  disabled = false,
  className = '',
  ...props 
}) => {
  const animationProps = disabled ? {} : ANIMATION_PROPS.INTERACTIVE
  
  return (
    <motion.button
      className={className}
      onClick={onClick}
      disabled={disabled}
      {...animationProps}
      {...props}
    >
      {children}
    </motion.button>
  )
}

export default AnimatedButton
