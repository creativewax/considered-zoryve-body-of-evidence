/*
================================================================================
  FilterBody.jsx

  Container component that renders all individual filter sub-components in a
  grid layout. Manages animations when the data source changes (triggering a
  re-render via the key prop). Distributes current source and filter selections
  to each filter component.

  Key Responsibilities:
  - Render all available filter types
  - Pass current source to filters for source-specific data
  - Pass selected filter values to filters for UI state
  - Animate filter layout changes when source changes

================================================================================
*/

// #region Imports
import { motion } from 'framer-motion'
import { ANIMATIONS, TRANSITIONS } from '../../../constants/animations.js'
import ConditionFilter from '../ConditionFilter/ConditionFilter.jsx'
import FormulationFilter from '../FormulationFilter/FormulationFilter.jsx'
import BodyAreaFilter from '../BodyAreaFilter/BodyAreaFilter.jsx'
import BaselineSeverityFilter from '../BaselineSeverityFilter/BaselineSeverityFilter.jsx'
import AgeFilter from '../AgeFilter/AgeFilter.jsx'
import GenderFilter from '../GenderFilter/GenderFilter.jsx'
import './FilterBody.css'
// #endregion

// #region Component
/**
 * FilterBody - Displays all filter options in a responsive grid
 *
 * @param {string} currentSource - The active data source (CLINICAL_TRIAL or PRACTICE_BASED)
 * @param {Object} filters - Current filter selections for all filter types
 * @param {string} filters.condition - Selected medical condition
 * @param {string} filters.formulation - Selected formulation type
 * @param {string} filters.bodyArea - Selected body area
 * @param {string} filters.baselineSeverity - Selected baseline severity
 * @param {string} filters.age - Selected age range
 * @param {string} filters.gender - Selected gender
 */
const FilterBody = ({ currentSource, filters }) => {
  return (
    <motion.div
      className="filter-body"
      // Using currentSource as key triggers re-animation when source changes
      key={currentSource}
      initial={ANIMATIONS.FADE_IN.initial}
      animate={ANIMATIONS.FADE_IN.animate}
      transition={TRANSITIONS.NORMAL}
    >
      {/* Grid container for all filter components */}
      <div className="filter-body-content">
        {/* Medical condition filter - allows selection of specific conditions */}
        <ConditionFilter
          currentSource={currentSource}
          selected={filters.condition}
        />

        {/* Formulation type filter - filters by treatment formulation */}
        <FormulationFilter
          currentSource={currentSource}
          selected={filters.formulation}
        />

        {/* Body area filter - filters by anatomical location */}
        <BodyAreaFilter
          currentSource={currentSource}
          selected={filters.bodyArea}
        />

        {/* Baseline severity filter - filters by initial symptom severity */}
        <BaselineSeverityFilter
          currentSource={currentSource}
          selected={filters.baselineSeverity}
        />

        {/* Age filter - filters by patient age range */}
        <AgeFilter
          currentSource={currentSource}
          selected={filters.age}
        />

        {/* Gender filter - filters by patient gender */}
        <GenderFilter
          currentSource={currentSource}
          selected={filters.gender}
        />
      </div>
    </motion.div>
  )
}
// #endregion

export default FilterBody
