import { motion } from 'framer-motion'
import { DATA_SOURCE } from '../../constants/index.js'
import { ANIMATIONS, TRANSITIONS } from '../../constants/animations.js'
import './FilterComponent.css'

const FilterComponent = ({ 
  title, 
  children, 
  currentSource,
  condensed = false 
}) => {
  const headerClass = currentSource === DATA_SOURCE.CLINICAL_TRIAL
    ? 'filter-component-header-clinical-trial'
    : 'filter-component-header-practice-based'

  return (
    <motion.div 
      className="filter-component"
      initial={ANIMATIONS.FADE_SLIDE_UP.initial}
      animate={ANIMATIONS.FADE_SLIDE_UP.animate}
      transition={TRANSITIONS.NORMAL}
    >
      <div className={`filter-component-header ${headerClass}`}>
        <h3 className="filter-component-title">{title}</h3>
      </div>
      <div 
        className={`filter-component-body ${condensed ? 'filter-component-body-condensed' : ''}`}
      >
        {children}
      </div>
    </motion.div>
  )
}

export default FilterComponent
