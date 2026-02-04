/**
 * SlideUp.jsx
 * Animation wrapper component that applies a slide-up effect to child elements
 * Translates content from below the viewport upward with optional delay for staggered effects
 */

import { motion } from 'framer-motion'
import { ANIMATIONS, TRANSITIONS } from '../../constants/animations.js'

/**
 * SlideUp - Wraps children with a slide-up entrance animation
 *
 * children - Content to animate
 * delay, duration - Animation timing (seconds)
 * className, rest - Optional wrapper class and motion.div props
 */
const SlideUp = ({
  children,
  delay = 0,
  duration = 0.3,
  className = '',
  ...props
}) => {
  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

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
