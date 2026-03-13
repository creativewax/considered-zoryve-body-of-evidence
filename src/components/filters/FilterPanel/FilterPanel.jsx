/**
 * FilterPanel.jsx
 *
 * Main container for the filter panel. Manages filter state and background image.
 */

import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ASSETS } from '../../../constants/index.js'
import { ANIMATIONS, TRANSITIONS } from '../../../constants/animations.js'
import filterManager from '../../../managers/FilterManager.js'
import FilterBody from './FilterBody.jsx'
import FilterBottom from './FilterBottom.jsx'
import useManagerSubscription from '../../../hooks/common/useManagerSubscription.js'
import './FilterPanel.css'

// ---------------------------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------------------------

const FilterPanel = () => {
  // ---------------------------------------------------------------------------
  // STATE — single source of truth from managers
  // ---------------------------------------------------------------------------

  const filters = useManagerSubscription(filterManager, mgr => mgr.getFilters())
  const backgroundRef = useRef(null)

  // ---------------------------------------------------------------------------
  // EFFECTS - BACKGROUND
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (!backgroundRef.current) return
    const bg = document.createElement('div')
    bg.className = 'filter-panel-background'
    bg.style.backgroundImage = `url(${ASSETS.FILTER_BACKGROUND})`
    bg.style.opacity = '1'
    backgroundRef.current.appendChild(bg)
  }, [])

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
      {/* Background container */}
      <div className="filter-panel-background-container" ref={backgroundRef} />

      {/* Main content area with filter components */}
      <div className="filter-panel-content">
        {/* Filter options grid (condition, formulation, body area, etc.) */}
        <FilterBody filters={filters} />

        {/* Reset button - enabled only when filters are active */}
        <FilterBottom />
      </div>
    </motion.div>
  )
}

export default FilterPanel
