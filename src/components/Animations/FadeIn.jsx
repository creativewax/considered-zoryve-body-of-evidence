import { motion } from 'framer-motion'
import { ANIMATIONS, TRANSITIONS } from '../../constants/animations.js'

/**
 * Fade in animation wrapper
 */
const FadeIn = ({ 
  children, 
  delay = 0,
  duration = 0.3,
  className = '',
  ...props 
}) => {
  return (
    <motion.div
      className={className}
      initial={ANIMATIONS.FADE_IN.initial}
      animate={ANIMATIONS.FADE_IN.animate}
      transition={{ duration, delay }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export default FadeIn
