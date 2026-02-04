/*
================================================================================
  FilterBottom.jsx

  Footer component that displays the reset filters button. Tracks whether any
  filters are currently active and enables/disables the button accordingly.
  Subscribes to filter change events to update the active filter state.

  Key Responsibilities:
  - Monitor active filter state
  - Display reset button with proper enabled/disabled state
  - Handle filter reset action
  - Animate button appearance with FadeIn

================================================================================
*/

// #region Imports
import { useState, useEffect } from 'react'
import FadeIn from '../../animations/FadeIn.jsx'
import appStateManager from '../../../managers/AppStateManager.js'
import eventSystem from '../../../utils/EventSystem.js'
import Button from '../../common/Button/Button.jsx'
import useEventSubscription from '../../../hooks/common/useEventSubscription.js'
import './FilterBottom.css'
// #endregion

// #region Component
const FilterBottom = () => {
  // #region State Management
  // Track whether any filters are currently selected
  const [hasActiveFilters, setHasActiveFilters] = useState(false)

  // Helper to check filter state
  const checkFilters = () => {
    setHasActiveFilters(appStateManager.hasActiveFilters())
  }
  // #endregion

  // #region Effects - Initial Check and Event Subscriptions
  // Check initial filter state on component mount
  useEffect(() => {
    checkFilters()
  }, [])

  // Subscribe to filter change events
  useEventSubscription(
    eventSystem.constructor.EVENTS.FILTER_CHANGED,
    checkFilters,
    []
  )

  // Subscribe to filter reset events
  useEventSubscription(
    eventSystem.constructor.EVENTS.FILTERS_RESET,
    checkFilters,
    []
  )
  // #endregion

  // #region Event Handlers
  /**
   * Resets all active filters by calling the app state manager
   * This triggers a FILTERS_RESET event which updates all filter components
   */
  const handleReset = () => {
    appStateManager.resetFilters()
  }
  // #endregion

  // #region Render
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
  // #endregion
}

export default FilterBottom
