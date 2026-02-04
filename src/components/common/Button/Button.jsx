/**
 * Button.jsx
 *
 * Styled button with interactive animations (disabled when disabled or selected).
 * children, onClick - Content and click handler; disabled, selected - State flags.
 */

import { motion } from 'framer-motion'
import { ANIMATION_PROPS } from '../../../constants/animations.js'
import './Button.css'

// ---------------------------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------------------------

const Button = ({
  children,
  onClick,
  disabled = false,
  selected = false,
  className = '',
  style = {}
}) => {
  const animationProps = (!disabled && !selected) ? ANIMATION_PROPS.INTERACTIVE : {}

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  return (
    <motion.button
      className={`basic-button ${selected ? 'basic-button-selected' : ''} ${disabled ? 'basic-button-disabled' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled}
      style={style}
      {...animationProps}
    >
      {children}
    </motion.button>
  )
}

export default Button
