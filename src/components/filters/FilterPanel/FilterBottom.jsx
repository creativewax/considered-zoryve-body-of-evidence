/**
 * FilterBottom.jsx
 *
 * Reset filters button. Enabled only when filters are active; subscribes to filter events.
 */

import FadeIn from '../../animations/FadeIn.jsx'
import eventSystem from '../../../utils/EventSystem.js'
import Button from '../../common/Button/Button.jsx'
import useManagerSubscription from '../../../hooks/common/useManagerSubscription.js'
import filterManager from '../../../managers/FilterManager.js'
import './FilterBottom.css'

// ---------------------------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------------------------

const FilterBottom = () => {
  // ---------------------------------------------------------------------------
  // STATE — single source of truth from FilterManager
  // ---------------------------------------------------------------------------

  const hasActiveFilters = useManagerSubscription(filterManager, mgr => mgr.hasActiveFilters())

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
