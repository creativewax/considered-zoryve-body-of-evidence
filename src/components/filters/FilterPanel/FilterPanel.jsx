/*
================================================================================
  FilterPanel.jsx

  Main container component for the filter panel. Manages the state of the
  current data source (Clinical Trial vs Practice Based) and filters. Handles
  background image transitions when the source changes and coordinates event
  updates across all filter subcomponents.

  Key Responsibilities:
  - Track current data source and filter selections
  - Manage dynamic background image transitions with GSAP animation
  - Subscribe to app state changes via EventSystem
  - Pass source and filter data to child components

================================================================================
*/

// #region Imports
import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { DATA_SOURCE, ASSETS } from '../../../constants/index.js'
import { ANIMATIONS, TRANSITIONS } from '../../../constants/animations.js'
import appStateManager from '../../../managers/AppStateManager.js'
import eventSystem from '../../../utils/EventSystem.js'
import FilterTabs from './FilterTabs.jsx'
import FilterBody from './FilterBody.jsx'
import FilterBottom from './FilterBottom.jsx'
import useBackgroundTransition from '../../../hooks/filters/useBackgroundTransition.js'
import useEventSubscription from '../../../hooks/common/useEventSubscription.js'
import './FilterPanel.css'
// #endregion

// #region Component
const FilterPanel = () => {
  // #region State Management
  // Track the currently selected data source (Clinical Trial or Practice Based)
  const [currentSource, setCurrentSource] = useState(appStateManager.getSource())

  // Track all active filter selections (condition, formulation, bodyArea, etc.)
  const [filters, setFilters] = useState(appStateManager.getFilters())

  // Reference to background container for DOM manipulation
  const backgroundRef = useRef(null)
  // #endregion

  // #region Helper Methods
  /**
   * Determines the correct background image URL based on the selected data source
   * @param {string} source - The data source (CLINICAL_TRIAL or PRACTICE_BASED)
   * @returns {string} URL to the background image asset
   */
  const getFilterBackground = (source) => {
    return source === DATA_SOURCE.CLINICAL_TRIAL
      ? ASSETS.FILTER_BACKGROUNDS.CLINICAL_TRIAL
      : ASSETS.FILTER_BACKGROUNDS.PRACTICE_BASED
  }
  // #endregion

  // #region Custom Hooks - Background and Event Management
  // Handle animated background transitions on source changes
  useBackgroundTransition(backgroundRef, getFilterBackground, currentSource)

  // Subscribe to category change events
  useEventSubscription(
    eventSystem.constructor.EVENTS.CATEGORY_CHANGED,
    (source) => {
      setCurrentSource(source)
      setFilters(appStateManager.getFilters())
    },
    []
  )

  // Subscribe to filter change events
  useEventSubscription(
    eventSystem.constructor.EVENTS.FILTER_CHANGED,
    ({ filters: newFilters }) => setFilters(newFilters),
    []
  )

  // Subscribe to filter reset events
  useEventSubscription(
    eventSystem.constructor.EVENTS.FILTERS_RESET,
    (newFilters) => setFilters(newFilters),
    []
  )
  // #endregion

  // #region Event Handlers
  /**
   * Handles source tab changes by persisting the selection to app state
   */
  const handleSourceChange = (source) => {
    appStateManager.setSource(source)
  }
  // #endregion

  // #region Render
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
  // #endregion
}

export default FilterPanel
