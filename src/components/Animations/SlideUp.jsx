import { motion } from 'framer-motion'
import { ANIMATIONS, TRANSITIONS } from '../../constants/animations.js'

/**
 * Slide up animation wrapper
 */
const SlideUp = ({ 
  children, 
  delay = 0,
  duration = 0.3,
  className = '',
  ...props 
}) => {
  return (
    <motion.div
      className={className}
      initial={ANIMATIONS.SLIDE_UP.initial}
      animate={ANIMATIONS.SLIDE_UP.animate}
      transition={{ duration, delay }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export default SlideUp
