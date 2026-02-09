/**
 * FilterBottom.jsx
 *
 * Reset filters button. Enabled only when filters are active; subscribes to filter events.
 */

import { useState, useEffect } from 'react'
import FadeIn from '../../animations/FadeIn.jsx'
import eventSystem from '../../../utils/EventSystem.js'
import Button from '../../common/Button/Button.jsx'
import useMultipleEventSubscriptions from '../../../hooks/common/useMultipleEventSubscriptions.js'
import filterManager from '../../../managers/FilterManager.js'
import './FilterBottom.css'

// ---------------------------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------------------------

const FilterBottom = () => {
  // ---------------------------------------------------------------------------
  // STATE
  // ---------------------------------------------------------------------------

  const [hasActiveFilters, setHasActiveFilters] = useState(false)

  const checkFilters = () => {
    setHasActiveFilters(filterManager.hasActiveFilters())
  }

  // ---------------------------------------------------------------------------
  // EFFECTS
  // ---------------------------------------------------------------------------

  useEffect(() => {
    checkFilters()
  }, [])

  useMultipleEventSubscriptions([
    [eventSystem.constructor.EVENTS.FILTER_CHANGED, checkFilters],
    [eventSystem.constructor.EVENTS.FILTERS_RESET, checkFilters],
  ], [])

  // ---------------------------------------------------------------------------
  // HANDLERS
  // ---------------------------------------------------------------------------

  const handleReset = () => {
    eventSystem.emit(eventSystem.constructor.EVENTS.FILTERS_RESET_REQUESTED)
  }

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  return (
    <FadeIn delay={0.3}>
      <div className="filter-bottom">
        {/* Reset button - only enabled when at least one filter is active */}
        <Button
          onClick={handleReset}
          disabled={!hasActiveFilters}
        >
          RESET FILTERS
        </Button>
      </div>
    </FadeIn>
  )
}

export default FilterBottom
