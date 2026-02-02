import { motion } from 'framer-motion'
import { DATA_SOURCE } from '../../constants/index.js'
import './FilterComponent.css'

const FilterComponent = ({ 
  title, 
  children, 
  currentSource,
  condensed = false 
}) => {
  const headerBg = currentSource === DATA_SOURCE.CLINICAL_TRIAL
    ? 'var(--color-zoryve-midnight-blue)'
    : 'var(--color-pb-header)'
  
  const titleColor = currentSource === DATA_SOURCE.CLINICAL_TRIAL
    ? 'var(--color-white)'
    : 'var(--color-zoryve-midnight-blue)'

  return (
    <motion.div 
      className="filter-component"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div 
        className="filter-component__header"
        style={{ 
          background: headerBg,
          color: titleColor
        }}
      >
        <h3 className="filter-component__title">{title}</h3>
      </div>
      <div 
        className={`filter-component__body ${condensed ? 'filter-component__body--condensed' : ''}`}
      >
        {children}
      </div>
    </motion.div>
  )
}

export default FilterComponent
