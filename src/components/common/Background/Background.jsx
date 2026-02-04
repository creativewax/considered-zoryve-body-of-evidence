/**
 * Background.jsx
 * Full-screen background component that transitions between different background images
 * based on the current data source (Clinical Trial vs Practice Based)
 * Uses smooth fade animations for seamless transitions
 */

import { useRef } from 'react'
import { DATA_SOURCE, ASSETS } from '../../../constants/index.js'
import appStateManager from '../../../managers/AppStateManager.js'
import useBackgroundTransition from '../../../hooks/filters/useBackgroundTransition.js'
import './Background.css'

/**
 * Background - Full-screen background that crossfades when data source (category) changes.
 * Listens to CATEGORY_CHANGED events.
 */
const Background = () => {
  const backgroundRef = useRef(null)
  const currentSource = appStateManager.getSource()

  /**
   * Returns background image URL for the given source (CLINICAL_TRIAL or PRACTICE_BASED).
   */
  const getBackgroundImage = (source) => {
    return source === DATA_SOURCE.CLINICAL_TRIAL
      ? ASSETS.BACKGROUNDS.CLINICAL_TRIAL
      : ASSETS.BACKGROUNDS.PRACTICE_BASED
  }

  useBackgroundTransition(backgroundRef, getBackgroundImage, currentSource, 'background-image')

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  return (
    <div className="background" ref={backgroundRef} />
  )
}

export default Background
