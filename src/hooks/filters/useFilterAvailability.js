/**
 * useFilterAvailability.js
 *
 * Subscribe to filter availability updates for a specific filter type
 * Returns availability Set and isAvailable helper function
 * Uses useManagerSubscription to read directly from FilterManager (single source of truth)
 */

import useManagerSubscription from '../common/useManagerSubscription.js'
import filterManager from '../../managers/FilterManager.js'

// ---------------------------------------------------------------------------
// HOOK DEFINITION
// ---------------------------------------------------------------------------

/**
 * Hook to track which filter options are currently available
 *
 * @param {string} filterType - Filter type to track (e.g., 'indication', 'age')
 * @returns {{availability: Set<number>, isAvailable: function(number): boolean}}
 */
export function useFilterAvailability(filterType) {
  const availability = useManagerSubscription(
    filterManager,
    mgr => mgr.availability[filterType] || new Set(),
    [filterType]
  )

  const isAvailable = index => {
    // Empty Set = initial state, all available
    if (availability.size === 0) return true
    return availability.has(index)
  }

  return { availability, isAvailable }
}
