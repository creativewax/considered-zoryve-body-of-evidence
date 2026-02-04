/**
 * FilterComponent.jsx
 *
 * Reusable container component for all filter sections (Age, Gender, Condition)
 * Provides consistent styling, animations, and header layout
 * Adapts header styling based on current data source (Clinical Trial vs Practice-Based)
 */

// #region Imports
import { motion } from 'framer-motion'
import { DATA_SOURCE } from '../../../constants/index.js'
import { ANIMATIONS, TRANSITIONS } from '../../../constants/animations.js'
import './FilterComponent.css'
// #endregion

// #region Component
/**
 * FilterComponent
 *
 * Container for filter sections with animated entrance and data source-based styling
 *
 * @component
 * @param {string} title - Filter section title (e.g., "Age", "Gender", "Condition")
 * @param {ReactNode} children - Filter options to be rendered within the body
 * @param {string} currentSource - Current data source (CLINICAL_TRIAL or PRACTICE_BASED)
 * @param {boolean} [condensed=false] - Optional flag to apply condensed body styling
 * @returns {ReactElement} Animated container with header and body sections
 */
const FilterComponent = ({
  title,
  children,
  currentSource,
  condensed = false
}) => {
  // Determine header styling based on data source
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
// #endregion

export default FilterComponent
