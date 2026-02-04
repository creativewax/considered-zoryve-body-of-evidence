/**
 * FadeIn.jsx
 * Animation wrapper component that applies a fade-in effect to child elements
 * Uses Framer Motion for smooth opacity transitions
 */

import { motion } from 'framer-motion'
import { ANIMATIONS, TRANSITIONS } from '../../constants/animations.js'

/**
 * FadeIn - Wraps children with a fade-in opacity animation
 *
 * children - Content to animate
 * delay, duration - Animation timing (seconds)
 * className, rest - Optional wrapper class and motion.div props
 */
const FadeIn = ({
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
