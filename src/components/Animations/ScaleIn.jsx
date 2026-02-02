import { motion } from 'framer-motion'
import { ANIMATIONS, TRANSITIONS } from '../../constants/animations.js'

/**
 * Scale in animation (for checkmarks, icons, etc)
 */
const ScaleIn = ({ 
  children, 
  className = '',
  ...props 
}) => {
  return (
    <motion.div
      className={className}
      initial={ANIMATIONS.SCALE_IN.initial}
      animate={ANIMATIONS.SCALE_IN.animate}
      transition={TRANSITIONS.SPRING}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export default ScaleIn
