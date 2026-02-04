/**
 * ScaleIn.jsx
 * Animation wrapper component that applies a scale-in effect to child elements
 * Ideal for icons, badges, checkmarks, and other small UI elements
 * Uses spring-based animation for natural, bouncy motion
 */

import { motion } from 'framer-motion'
import { ANIMATIONS, TRANSITIONS } from '../../constants/animations.js'

/**
 * ScaleIn - Wraps children with a scale-in spring animation (e.g. for checkmarks, icons)
 *
 * children - Content to animate
 * className, rest - Optional wrapper class and motion.div props
 */
const ScaleIn = ({
  children,
  className = '',
  ...props
}) => {
  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

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
