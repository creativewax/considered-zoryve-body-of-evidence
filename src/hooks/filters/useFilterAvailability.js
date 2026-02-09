/**
 * useFilterAvailability.js
 *
 * Subscribe to filter availability updates for a specific filter type
 * Returns availability Set and isAvailable helper function
 */

import { useState, useEffect } from 'react'
import eventSystem, { EventSystem } from '../../utils/EventSystem'

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
  const [availability, setAvailability] = useState(new Set())

  useEffect(() => {
    const handleAvailabilityChange = availabilityMap => {
      setAvailability(availabilityMap[filterType] || new Set())
    }

    eventSystem.on(EventSystem.EVENTS.FILTER_AVAILABILITY_CHANGED, handleAvailabilityChange)

    return () => {
      eventSystem.off(EventSystem.EVENTS.FILTER_AVAILABILITY_CHANGED, handleAvailabilityChange)
    }
  }, [filterType])

  const isAvailable = index => {
    // Empty Set = initial state, all available
    if (availability.size === 0) return true
    return availability.has(index)
  }

  return { availability, isAvailable }
}
