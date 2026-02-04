/**
 * useManagerSubscription.js
 *
 * Custom hook to abstract manager subscription pattern with automatic state updates
 * Subscribes to manager changes and keeps component state in sync
 * Used for RotationStateManager, PoolManager, and AppStateManager subscriptions
 */

import { useState, useEffect } from 'react'


/**
 * useManagerSubscription
 *
 * Subscribe to a manager's state changes with automatic state synchronisation.
 * manager - Instance with subscribe(), selector - (mgr) => value, dependencies - optional
 * Returns current value from manager, updates when manager notifies.
 */
export const useManagerSubscription = (manager, selector, dependencies = []) => {
  // Initialise state with current manager value
  const [value, setValue] = useState(() => selector(manager))

  useEffect(() => {
    // Create update handler that calls selector
    const update = () => {
      const newValue = selector(manager)
      setValue(newValue)
    }

    // Initialise with current value
    update()

    // Subscribe to manager updates
    const unsubscribe = manager.subscribe(update)

    // Cleanup: unsubscribe on unmount
    return unsubscribe
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manager, ...dependencies])

  return value
}

export default useManagerSubscription
