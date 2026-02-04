/**
 * useRotationSync.js
 *
 * Custom hook to synchronize component state with RotationStateManager
 * Provides automatic subscription to rotation updates
 * Used by multiple components that need to track carousel rotation
 */

// #region Imports
import useManagerSubscription from '../common/useManagerSubscription.js'
import rotationStateManager from '../../managers/RotationStateManager.js'
// #endregion

// ─────────────────────────────────────────────────────────────────────────────

/**
 * useRotationSync
 *
 * Subscribe to rotation state changes and return current rotation value.
 * Automatically updates when rotation changes via manager.
 *
 * @returns {number} Current carousel rotation value in radians
 *
 * @example
 * const rotation = useRotationSync()
 * // rotation automatically updates when carousel rotates
 */
export const useRotationSync = () => {
  return useManagerSubscription(
    rotationStateManager,
    (mgr) => mgr.getRotation()
  )
}

export default useRotationSync
