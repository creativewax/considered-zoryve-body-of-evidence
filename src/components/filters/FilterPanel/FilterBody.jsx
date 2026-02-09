/**
 * FilterBody.jsx
 *
 * Renders all filter sub-components in a grid. Re-animates when data source changes (key=currentSource).
 * currentSource - Active data source (CLINICAL_TRIAL or PRACTICE_BASED)
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

const FilterBody = ({ currentSource, filters }) => {
  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  return (
    <motion.div
      className="filter-body"
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
          selected={filters[FILTER_KEYS.INDICATION]}
        />

        {/* Formulation type filter - filters by treatment formulation */}
        <FormulationFilter
          currentSource={currentSource}
          selected={filters[FILTER_KEYS.FORMULATION]}
        />

        {/* Body area filter - filters by anatomical location */}
        <BodyAreaFilter
          currentSource={currentSource}
          selected={filters[FILTER_KEYS.BODY_AREA]}
        />

        {/* Baseline severity filter - filters by initial symptom severity */}
        <BaselineSeverityFilter
          currentSource={currentSource}
          selected={filters[FILTER_KEYS.BASELINE_SEVERITY]}
        />

        {/* Age filter - filters by patient age range */}
        <AgeFilter
          currentSource={currentSource}
          selected={filters[FILTER_KEYS.AGE]}
        />

        {/* Gender filter - filters by patient gender */}
        <GenderFilter
          currentSource={currentSource}
          selected={filters[FILTER_KEYS.GENDER]}
        />
      </div>
    </motion.div>
  )
}

export default FilterBody
