/**
 * Button.jsx
 * Reusable button component with interactive animations and state variants
 * Supports disabled and selected states with conditional animations
 */

// #region Imports
import { motion } from 'framer-motion'
import { ANIMATION_PROPS } from '../../../constants/animations.js'
import './Button.css'
// #endregion

/**
 * Button Component
 *
 * A styled button wrapper with built-in animation support. The component
 * applies interactive animations only when the button is neither disabled
 * nor in a selected state, ensuring appropriate visual feedback.
 *
 * Available state variants:
 * - Default: Interactive animation enabled
 * - Disabled: No animation, cursor disabled
 * - Selected: No animation, highlighted appearance
 *
 * @component
 * @example
 * // Basic button
 * <Button onClick={handleClick}>Click me</Button>
 *
 * @example
 * // Selected button
 * <Button selected={true}>Selected</Button>
 *
 * @example
 * // Disabled button
 * <Button disabled={true}>Disabled</Button>
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Button content
 * @param {Function} [props.onClick] - Click handler
 * @param {boolean} [props.disabled=false] - Disable button interaction
 * @param {boolean} [props.selected=false] - Show selected state
 * @param {string} [props.className=''] - Additional CSS classes
 * @param {Object} [props.style={}] - Inline styles
 * @returns {React.ReactElement} Animated button element
 */
// #region Component
const Button = ({
  children,
  onClick,
  // State flags
  disabled = false,
  selected = false,
  // Styling
  className = '',
  style = {}
}) => {
  // Only apply interactive animation when button is active (not disabled and not selected)
  const animationProps = (!disabled && !selected) ? ANIMATION_PROPS.INTERACTIVE : {}

  return (
    <motion.button
      // Dynamic classnames based on state
      className={`basic-button ${selected ? 'basic-button-selected' : ''} ${disabled ? 'basic-button-disabled' : ''} ${className}`}
      // Event handlers
      onClick={onClick}
      disabled={disabled}
      // Styling
      style={style}
      // Conditionally apply animations
      {...animationProps}
    >
      {children}
    </motion.button>
  )
}
// #endregion

export default Button
