/**
 * SlideUp.jsx
 * Animation wrapper component that applies a slide-up effect to child elements
 * Translates content from below the viewport upward with optional delay for staggered effects
 */

// #region Imports
import { motion } from 'framer-motion'
import { ANIMATIONS, TRANSITIONS } from '../../constants/animations.js'
// #endregion

/**
 * SlideUp Component
 *
 * Wraps child elements with a slide-up animation that translates content
 * upward from its initial position. Commonly used for staggered list items
 * or content that appears in sequence.
 *
 * @component
 * @example
 * // Basic usage
 * <SlideUp>
 *   <Card>Content slides up on load</Card>
 * </SlideUp>
 *
 * @example
 * // Staggered animation with delay
 * {items.map((item, index) => (
 *   <SlideUp key={item.id} delay={index * 0.1} duration={0.4}>
 *     <Item>{item.name}</Item>
 *   </SlideUp>
 * ))}
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
const SlideUp = ({
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
      // Apply slide-up animation states from animation constants
      initial={ANIMATIONS.SLIDE_UP.initial}
      animate={ANIMATIONS.SLIDE_UP.animate}
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

export default SlideUp
