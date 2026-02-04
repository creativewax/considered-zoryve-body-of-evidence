/**
 * Background.jsx
 * Full-screen background component that transitions between different background images
 * based on the current data source (Clinical Trial vs Practice Based)
 * Uses smooth fade animations for seamless transitions
 */

// #region Imports
import { useRef } from 'react'
import { DATA_SOURCE, ASSETS } from '../../../constants/index.js'
import appStateManager from '../../../managers/AppStateManager.js'
import useBackgroundTransition from '../../../hooks/filters/useBackgroundTransition.js'
import './Background.css'
// #endregion

/**
 * Background Component
 *
 * Manages the full-screen background image that changes when the data source
 * category is changed. Implements a crossfade transition effect by:
 * 1. Creating a new background image element with opacity 0
 * 2. Fading in the new background
 * 3. Cleaning up old background elements after animation completes
 *
 * Listens to CATEGORY_CHANGED events from the global event system to trigger
 * background updates and respects the current app state source.
 *
 * @component
 * @example
 * // Basic usage - typically placed as a background layer
 * <Background />
 *
 * @returns {React.ReactElement} Fullscreen background container
 */
// #region Component
const Background = () => {
  // #region Refs
  const backgroundRef = useRef(null)
  const currentSource = appStateManager.getSource()
  // #endregion

  // #region Helpers
  /**
   * Get the appropriate background image URL for the given source
   * @param {string} source - Data source type (CLINICAL_TRIAL or PRACTICE_BASED)
   * @returns {string} URL path to the background image
   */
  const getBackgroundImage = (source) => {
    return source === DATA_SOURCE.CLINICAL_TRIAL
      ? ASSETS.BACKGROUNDS.CLINICAL_TRIAL
      : ASSETS.BACKGROUNDS.PRACTICE_BASED
  }
  // #endregion

  // #region Custom Hooks
  // Handle animated background transitions on source changes
  useBackgroundTransition(backgroundRef, getBackgroundImage, currentSource, 'background-image')
  // #endregion

  // #region Render
  return (
    <div className="background" ref={backgroundRef} />
  )
  // #endregion
}
// #endregion

export default Background
