/**
 * FilterComponent.jsx
 *
 * Container for filter sections with data source-based header styling.
 * title - Section title; children - Filter options; currentSource - Data source; condensed - Optional.
 */

import { motion } from 'framer-motion'
import { DATA_SOURCE } from '../../../constants/index.js'
import { ANIMATIONS, TRANSITIONS } from '../../../constants/animations.js'
import './FilterComponent.css'

// ---------------------------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------------------------

const FilterComponent = ({
  title,
  children,
  currentSource,
  condensed = false
}) => {
  const headerClass = currentSource === DATA_SOURCE.CLINICAL_TRIAL
    ? 'filter-component-header-clinical-trial'
    : 'filter-component-header-practice-based'

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  return (
    <motion.div
      className="filter-component"
      initial={ANIMATIONS.FADE_SLIDE_UP.initial}
      animate={ANIMATIONS.FADE_SLIDE_UP.animate}
      transition={TRANSITIONS.NORMAL}
    >
      {/* Filter section header with data source-specific styling */}
      <div className={`filter-component-header ${headerClass}`}>
        <h3 className="filter-component-title">{title}</h3>
      </div>

      {/* Filter options body with optional condensed layout */}
      <div
        className={`filter-component-body ${condensed ? 'filter-component-body-condensed' : ''}`}
      >
        {children}
      </div>
    </motion.div>
  )
}

export default FilterComponent
