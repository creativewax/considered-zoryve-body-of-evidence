/**
 * FilterBody.jsx
 *
 * Renders all filter sub-components in a grid.
 * filters - Current filter selections for all filter types
 */

import { motion } from 'framer-motion'
import { ANIMATIONS, TRANSITIONS } from '../../../constants/animations.js'
import { FILTER_KEYS } from '../../../constants/index.js'
import ConditionFilter from '../ConditionFilter/ConditionFilter.jsx'
import FormulationFilter from '../FormulationFilter/FormulationFilter.jsx'
import BodyAreaFilter from '../BodyAreaFilter/BodyAreaFilter.jsx'
import BaselineSeverityFilter from '../BaselineSeverityFilter/BaselineSeverityFilter.jsx'
import AgeFilter from '../AgeFilter/AgeFilter.jsx'
import GenderFilter from '../GenderFilter/GenderFilter.jsx'
import './FilterBody.css'

// ---------------------------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------------------------

const FilterBody = ({ filters }) => {
  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  return (
    <motion.div
      className="filter-body"
      initial={ANIMATIONS.FADE_IN.initial}
      animate={ANIMATIONS.FADE_IN.animate}
      transition={TRANSITIONS.NORMAL}
    >
      <div className="filter-body-content">
        <ConditionFilter selected={filters[FILTER_KEYS.INDICATION]} />
        <FormulationFilter selected={filters[FILTER_KEYS.FORMULATION]} />
        <BodyAreaFilter selected={filters[FILTER_KEYS.BODY_AREA]} />
        <BaselineSeverityFilter selected={filters[FILTER_KEYS.BASELINE_SEVERITY]} />
        <AgeFilter selected={filters[FILTER_KEYS.AGE]} />
        <GenderFilter selected={filters[FILTER_KEYS.GENDER]} />
      </div>
    </motion.div>
  )
}

export default FilterBody
