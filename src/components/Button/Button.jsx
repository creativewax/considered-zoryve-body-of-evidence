import { motion } from 'framer-motion'
import { ANIMATION_PROPS } from '../../constants/animations.js'
import './Button.css'

const Button = ({ 
  children, 
  onClick, 
  disabled = false, 
  selected = false,
  className = '',
  style = {}
}) => {
  const animationProps = (!disabled && !selected) ? ANIMATION_PROPS.INTERACTIVE : {}
  
  return (
    <motion.button
      className={`basic-button ${selected ? 'basic-button--selected' : ''} ${disabled ? 'basic-button--disabled' : ''} ${className}`}
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
