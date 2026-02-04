/**
 * FadeIn.jsx
 * Animation wrapper component that applies a fade-in effect to child elements
 * Uses Framer Motion for smooth opacity transitions
 */

// #region Imports
import { motion } from 'framer-motion'
import { ANIMATIONS, TRANSITIONS } from '../../constants/animations.js'
// #endregion

/**
 * FadeIn Component
 *
 * Wraps child elements with a fade-in animation that gradually increases opacity
 * from 0 to 1 over the specified duration.
 *
 * @component
 * @example
 * // Basic usage
 * <FadeIn>
 *   <p>This content will fade in</p>
 * </FadeIn>
 *
 * @example
 * // With custom delay and duration
 * <FadeIn delay={0.2} duration={0.5}>
 *   <p>Staggered fade-in effect</p>
 * </FadeIn>
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Content to animate
 * @param {number} [props.delay=0] - Animation delay in seconds
 * @param {number} [props.duration=0.3] - Animation duration in seconds
 * @param {string} [props.className=''] - CSS classes to apply to wrapper
 * @param {Object} props.rest - Additional motion.div props
 * @returns {React.ReactElement} Animated wrapper div
 */
// #region Component
const FadeIn = ({
  children,
  // Animation timing props
  delay = 0,
  duration = 0.3,
  // Style and layout props
  className = '',
  // Pass through any additional motion.div props
  ...props
}) => {
  return (
    <motion.div
      className={className}
      // Apply fade-in animation states from animation constants
      initial={ANIMATIONS.FADE_IN.initial}
      animate={ANIMATIONS.FADE_IN.animate}
      // Configure transition timing
      transition={{ duration, delay }}
      // Allow overrides via spread props
      {...props}
    >
      {children}
    </motion.div>
  )
}
// #endregion

export default FadeIn
