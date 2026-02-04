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
import './FilterBottom.css'
// #endregion

// #region Component
const FilterBottom = () => {
  // #region State Management
  // Track whether any filters are currently selected
  const [hasActiveFilters, setHasActiveFilters] = useState(false)
  // #endregion

  // #region Effects - Event Subscriptions
  useEffect(() => {
    /**
     * Checks current filter state and updates component state
     * Called on mount and whenever filter state changes
     */
    const checkFilters = () => {
      setHasActiveFilters(appStateManager.hasActiveFilters())
    }

    /**
     * Handles filter change events by re-checking filter state
     */
    const handleFilterChange = () => {
      checkFilters()
    }

    /**
     * Handles filter reset events by re-checking filter state
     */
    const handleFiltersReset = () => {
      checkFilters()
    }

    // Check initial filter state on component mount
    checkFilters()

    // Subscribe to global events
    eventSystem.on(eventSystem.constructor.EVENTS.FILTER_CHANGED, handleFilterChange)
    eventSystem.on(eventSystem.constructor.EVENTS.FILTERS_RESET, handleFiltersReset)

    // Cleanup: unsubscribe from events on unmount
    return () => {
      eventSystem.off(eventSystem.constructor.EVENTS.FILTER_CHANGED, handleFilterChange)
      eventSystem.off(eventSystem.constructor.EVENTS.FILTERS_RESET, handleFiltersReset)
    }
  }, [])
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
