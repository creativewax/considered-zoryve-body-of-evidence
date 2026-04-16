/**
 * FilterComponent.jsx
 *
 * Container for filter sections with header styling.
 * title - Section title; children - Filter options; condensed - Optional.
 */

import { motion } from 'framer-motion'
import { ANIMATIONS, TRANSITIONS } from '../../../constants/animations.js'
import './FilterComponent.css'

// ---------------------------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------------------------

const FilterComponent = ({
  title,
  subTitle,
  children,
  condensed = false
}) => {
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
      <div className="filter-component-header">
        <div className="filter-component-title">{title}</div>
        {subTitle && <div className="filter-component-sub-title">{subTitle}</div>}
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
