/*
================================================================================
  FilterTabs.jsx

  Tab navigation component for selecting between data sources. Renders two
  tabs (Clinical Trial and Practice Based) with active state styling and
  click handlers to switch sources.

  Key Responsibilities:
  - Display data source selection tabs
  - Apply active styling based on current source
  - Notify parent component when source changes
  - Animate tab interactions with Framer Motion

================================================================================
*/

// #region Imports
import { motion } from 'framer-motion'
import { DATA_SOURCE } from '../../../constants/index.js'
import { ANIMATION_PROPS } from '../../../constants/animations.js'
import './FilterTabs.css'
// #endregion

// #region Component
/**
 * FilterTabs - Tabbed navigation for switching between data sources
 *
 * @param {string} currentSource - The currently active data source
 * @param {Function} onSourceChange - Callback fired when user clicks a tab
 */
const FilterTabs = ({ currentSource, onSourceChange }) => {
  return (
    <div className="filter-tabs">
      {/* Clinical Trial tab */}
      <motion.button
        className={`filter-tab ${
          currentSource === DATA_SOURCE.CLINICAL_TRIAL
            ? 'filter-tab-active filter-tab-clinical-trial'
            : ''
        }`}
        onClick={() => onSourceChange(DATA_SOURCE.CLINICAL_TRIAL)}
        {...ANIMATION_PROPS.INTERACTIVE}
      >
        <span className="filter-tab-text">Clinical Trial</span>
      </motion.button>

      {/* Practice Based tab */}
      <motion.button
        className={`filter-tab ${
          currentSource === DATA_SOURCE.PRACTICE_BASED
            ? 'filter-tab-active filter-tab-practice-based'
            : ''
        }`}
        onClick={() => onSourceChange(DATA_SOURCE.PRACTICE_BASED)}
        {...ANIMATION_PROPS.INTERACTIVE}
      >
        <span className="filter-tab-text">Practice Based</span>
      </motion.button>
    </div>
  )
}
// #endregion

export default FilterTabs
