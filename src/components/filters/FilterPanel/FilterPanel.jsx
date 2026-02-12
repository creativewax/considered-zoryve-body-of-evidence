/**
 * FilterPanel.jsx
 *
 * Main container for the filter panel. Manages data source and filter state,
 * background transitions on source change, and event subscriptions.
 */

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { DATA_SOURCE, ASSETS } from '../../../constants/index.js'
import { ANIMATIONS, TRANSITIONS } from '../../../constants/animations.js'
import appStateManager from '../../../managers/AppStateManager.js'
import filterManager from '../../../managers/FilterManager.js'
import eventSystem from '../../../utils/EventSystem.js'
import FilterTabs from './FilterTabs.jsx'
import FilterBody from './FilterBody.jsx'
import FilterBottom from './FilterBottom.jsx'
import useBackgroundTransition from '../../../hooks/filters/useBackgroundTransition.js'
import useManagerSubscription from '../../../hooks/common/useManagerSubscription.js'
import './FilterPanel.css'

// ---------------------------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------------------------

const FilterPanel = () => {
  // ---------------------------------------------------------------------------
  // STATE — single source of truth from managers
  // ---------------------------------------------------------------------------

  const currentSource = useManagerSubscription(appStateManager, mgr => mgr.getSource())
  const filters = useManagerSubscription(filterManager, mgr => mgr.getFilters())
  const backgroundRef = useRef(null)

  // ---------------------------------------------------------------------------
  // HELPERS
  // ---------------------------------------------------------------------------

  const getFilterBackground = (source) => {
    return source === DATA_SOURCE.CLINICAL_TRIAL
      ? ASSETS.FILTER_BACKGROUNDS.CLINICAL_TRIAL
      : ASSETS.FILTER_BACKGROUNDS.PRACTICE_BASED
  }

  // ---------------------------------------------------------------------------
  // EFFECTS - BACKGROUND
  // ---------------------------------------------------------------------------

  useBackgroundTransition(backgroundRef, getFilterBackground, currentSource)

  // ---------------------------------------------------------------------------
  // HANDLERS
  // ---------------------------------------------------------------------------

  const handleSourceChange = (source) => {
    // Close any visible detail overlay
    eventSystem.emit(eventSystem.constructor.EVENTS.IMAGE_DESELECTED)

    // Reset filters when switching between sources
    eventSystem.emit(eventSystem.constructor.EVENTS.FILTERS_RESET_REQUESTED)

    // Change the data source
    eventSystem.emit(eventSystem.constructor.EVENTS.SOURCE_CHANGED, { source })
  }

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  return (
    <motion.div
      className="filter-panel"
      initial={ANIMATIONS.SLIDE_LEFT.initial}
      animate={ANIMATIONS.SLIDE_LEFT.animate}
      transition={TRANSITIONS.SLOW_EASE}
    >
      {/* Background container - holds layered background images for smooth transitions */}
      <div className="filter-panel-background-container" ref={backgroundRef} />

      {/* Main content area with filter components */}
      <div className="filter-panel-content">
        {/* Source selection tabs (Clinical Trial vs Practice Based) */}
        <FilterTabs
          currentSource={currentSource}
          onSourceChange={handleSourceChange}
        />

        {/* Filter options grid (condition, formulation, body area, etc.) */}
        <FilterBody currentSource={currentSource} filters={filters} />

        {/* Reset button - enabled only when filters are active */}
        <FilterBottom />
      </div>
    </motion.div>
  )
}

export default FilterPanel
