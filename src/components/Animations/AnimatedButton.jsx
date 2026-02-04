/**
 * AnimatedButton.jsx
 * Interactive button component with built-in hover and tap animations
 * Provides consistent, polished user feedback for button interactions
 */

import { motion } from 'framer-motion'
import { ANIMATION_PROPS } from '../../constants/animations.js'

/**
 * AnimatedButton - Button with hover and tap animations (disabled when disabled prop is true)
 *
 * children, onClick - Content and click handler
 * disabled - Disables interactions and animations
 * className, rest - Optional styling and motion.button props
 */
const AnimatedButton = ({
  children,
  onClick,
  disabled = false,
  className = '',
  ...props
}) => {
  const animationProps = disabled ? {} : ANIMATION_PROPS.INTERACTIVE

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  return (
    <motion.button
      className={className}
      onClick={onClick}
      disabled={disabled}
      {...animationProps}
      {...props}
    >
      {children}
    </motion.button>
  )
}

export default AnimatedButton
