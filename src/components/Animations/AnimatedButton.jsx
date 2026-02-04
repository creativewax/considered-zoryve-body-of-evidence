/**
 * AnimatedButton.jsx
 * Interactive button component with built-in hover and tap animations
 * Provides consistent, polished user feedback for button interactions
 */

// #region Imports
import { motion } from 'framer-motion'
import { ANIMATION_PROPS } from '../../constants/animations.js'
// #endregion

/**
 * AnimatedButton Component
 *
 * A motion-enhanced button that automatically applies hover and tap animations
 * to provide visual feedback to user interactions. Animations are disabled when
 * the button is in a disabled state to prevent misleading visual cues.
 *
 * @component
 * @example
 * // Basic button
 * <AnimatedButton onClick={handleClick}>
 *   Click me
 * </AnimatedButton>
 *
 * @example
 * // With custom styling and disabled state
 * <AnimatedButton
 *   onClick={handleSubmit}
 *   disabled={isLoading}
 *   className="btn btn-primary"
 * >
 *   {isLoading ? 'Loading...' : 'Submit'}
 * </AnimatedButton>
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Button text or content
 * @param {Function} props.onClick - Click event handler
 * @param {boolean} [props.disabled=false] - Disables interactions and animations
 * @param {string} [props.className=''] - CSS classes to apply
 * @param {Object} props.rest - Additional motion.button props
 * @returns {React.ReactElement} Animated button element
 */
// #region Component
const AnimatedButton = ({
  children,
  // Event handler
  onClick,
  // Button state
  disabled = false,
  // Style and layout props
  className = '',
  // Pass through any additional motion.button props
  ...props
}) => {
  // Apply animations only when button is enabled
  // Disabled buttons have empty animation props to prevent misleading visual feedback
  const animationProps = disabled ? {} : ANIMATION_PROPS.INTERACTIVE

  return (
    <motion.button
      className={className}
      onClick={onClick}
      disabled={disabled}
      // Spread animation properties (hover, tap, transition)
      {...animationProps}
      // Allow overrides via spread props
      {...props}
    >
      {children}
    </motion.button>
  )
}
// #endregion

export default AnimatedButton
