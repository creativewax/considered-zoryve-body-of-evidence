/**
 * useEventSubscription.js
 *
 * Custom hook to eliminate event subscription boilerplate
 * Automatically handles subscription and cleanup for EventSystem events
 * Used across 5+ components to standardize event handling pattern
 */

import { useEffect } from 'react'
import eventSystem from '../../utils/EventSystem.js'


/**
 * useEventSubscription
 *
 * Subscribe to an EventSystem event with automatic cleanup on unmount.
 * eventName - From eventSystem.constructor.EVENTS, callback - Handler, dependencies - optional
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
