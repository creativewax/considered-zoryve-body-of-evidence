/**
 * useMultipleEventSubscriptions.js
 * Subscribe to multiple events with a single hook call.
 */

import { useEffect } from 'react'
import eventSystem from '../../utils/EventSystem'

/**
 * Subscribe to multiple events at once
 *
 * subscriptions - Array of [eventName, callback] tuples
 * deps - Dependency array (like useEffect)
 */
export default function useMultipleEventSubscriptions(subscriptions, deps = []) {
  useEffect(() => {
    subscriptions.forEach(([eventName, callback]) => {
      eventSystem.on(eventName, callback)
    })
    return () => {
      subscriptions.forEach(([eventName, callback]) => {
        eventSystem.off(eventName, callback)
      })
    }
  }, deps)
}
