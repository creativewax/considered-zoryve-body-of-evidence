/**
 * ScaleIn.jsx
 * Animation wrapper component that applies a scale-in effect to child elements
 * Ideal for icons, badges, checkmarks, and other small UI elements
 * Uses spring-based animation for natural, bouncy motion
 */

// #region Imports
import { motion } from 'framer-motion'
import { ANIMATIONS, TRANSITIONS } from '../../constants/animations.js'
// #endregion

/**
 * ScaleIn Component
 *
 * Wraps child elements with a scale animation that grows from a small initial
 * scale to full size using a spring-based transition for natural motion.
 * Perfect for drawing attention to newly visible elements like checkmarks or icons.
 *
 * @component
 * @example
 * // Basic usage with icon
 * <ScaleIn>
 *   <CheckmarkIcon />
 * </ScaleIn>
 *
 * @example
 * // With custom className
 * <ScaleIn className="badge">
 *   <span>New</span>
 * </ScaleIn>
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Content to animate
 * @param {string} [props.className=''] - CSS classes to apply to wrapper
 * @param {Object} props.rest - Additional motion.div props
 * @returns {React.ReactElement} Animated wrapper div with spring transition
 */
// #region Component
const ScaleIn = ({
  children,
  // Style and layout props
  className = '',
  // Pass through any additional motion.div props
  ...props
}) => {
  return (
    <motion.div
      className={className}
      // Apply scale animation states from animation constants
      initial={ANIMATIONS.SCALE_IN.initial}
      animate={ANIMATIONS.SCALE_IN.animate}
      // Use spring transition for bouncy, natural motion
      transition={TRANSITIONS.SPRING}
      // Allow overrides via spread props
      {...props}
    >
      {children}
    </motion.div>
  )
}
// #endregion

export default ScaleIn
