/**
 * useManagerSubscription.js
 *
 * Custom hook to abstract manager subscription pattern with automatic state updates
 * Subscribes to manager changes and keeps component state in sync
 * Used for RotationStateManager, PoolManager, and AppStateManager subscriptions
 */

// #region Imports
import { useState, useEffect } from 'react'
// #endregion

// ─────────────────────────────────────────────────────────────────────────────

/**
 * useManagerSubscription
 *
 * Subscribe to a manager's state changes with automatic state synchronization.
 * The hook calls the selector function to extract the desired value from the manager
 * and automatically updates component state when the manager notifies subscribers.
 *
 * @param {Object} manager - Manager instance with subscribe() method
 * @param {Function} selector - Function to extract value from manager (mgr) => mgr.getValue()
 * @param {Array} [dependencies=[]] - Optional dependencies for the effect
 * @returns {*} Current value from manager, auto-syncs on manager updates
 *
 * @example
 * // Subscribe to rotation state
 * const rotation = useManagerSubscription(
 *   rotationStateManager,
 *   (mgr) => mgr.getRotation()
 * )
 *
 * @example
 * // Subscribe to pool manager with array copy
 * const activeSlots = useManagerSubscription(
 *   poolManager,
 *   (mgr) => [...mgr.getActiveSlots()]
 * )
 */
export const useManagerSubscription = (manager, selector, dependencies = []) => {
  // Initialize state with current manager value
  const [value, setValue] = useState(() => selector(manager))

  useEffect(() => {
    // Create update handler that calls selector
    const update = () => setValue(selector(manager))

    // Initialize with current value
    update()

    // Subscribe to manager updates
    const unsubscribe = manager.subscribe(update)

    // Cleanup: unsubscribe on unmount
    return unsubscribe
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manager, selector, ...dependencies])

  return value
}

export default useManagerSubscription
