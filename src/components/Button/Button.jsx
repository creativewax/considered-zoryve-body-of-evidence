import { motion } from 'framer-motion'
import './Button.css'

const Button = ({ 
  children, 
  onClick, 
  disabled = false, 
  selected = false,
  className = '',
  style = {}
}) => {
  return (
    <motion.button
      className={`basic-button ${selected ? 'basic-button--selected' : ''} ${disabled ? 'basic-button--disabled' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled}
      style={style}
      whileHover={!disabled && !selected ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
    >
      {children}
    </motion.button>
  )
}

export default Button
