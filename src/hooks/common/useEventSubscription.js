/**
 * useEventSubscription.js
 *
 * Custom hook to eliminate event subscription boilerplate
 * Automatically handles subscription and cleanup for EventSystem events
 * Used across 5+ components to standardize event handling pattern
 */

// #region Imports
import { useEffect } from 'react'
import eventSystem from '../../utils/EventSystem.js'
// #endregion

// ─────────────────────────────────────────────────────────────────────────────

/**
 * useEventSubscription
 *
 * Subscribe to an EventSystem event with automatic cleanup on unmount.
 * Eliminates the need to manually call eventSystem.on/off in every component.
 *
 * @param {string} eventName - Event name from eventSystem.constructor.EVENTS
 * @param {Function} callback - Function to call when event is emitted
 * @param {Array} [dependencies=[]] - Optional array of dependencies for the effect
 *
 * @example
 * // Subscribe to filter changes
 * useEventSubscription(
 *   eventSystem.constructor.EVENTS.FILTER_CHANGED,
 *   handleFilterChange
 * )
 *
 * @example
 * // Subscribe with dependencies
 * useEventSubscription(
 *   eventSystem.constructor.EVENTS.IMAGES_UPDATED,
 *   () => console.log('Images updated'),
 *   []
 * )
 */
export const useEventSubscription = (eventName, callback, dependencies = []) => {
  useEffect(() => {
    // Subscribe to event
    eventSystem.on(eventName, callback)

    // Cleanup: unsubscribe on unmount or when dependencies change
    return () => {
      eventSystem.off(eventName, callback)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventName, callback, ...dependencies])
}

export default useEventSubscription
