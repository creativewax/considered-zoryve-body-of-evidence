/**
 * Background.jsx
 * Full-screen background component that transitions between different background images
 * based on the current data source (Clinical Trial vs Practice Based)
 * Uses smooth fade animations for seamless transitions
 */

// #region Imports
import { useState, useEffect, useRef } from 'react'
import { DATA_SOURCE, ASSETS } from '../../../constants/index.js'
import { TRANSITIONS } from '../../../constants/animations.js'
import appStateManager from '../../../managers/AppStateManager.js'
import eventSystem from '../../../utils/EventSystem.js'
import { gsap } from 'gsap'
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
  // #region State
  const [currentSource, setCurrentSource] = useState(appStateManager.getSource())
  // #endregion

  // #region Refs
  const backgroundRef = useRef(null)
  const oldBackgroundRef = useRef(null)
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

  // #region Effects
  useEffect(() => {
    // Handle category change event and animate background transition
    const handleCategoryChange = (source) => {
      if (backgroundRef.current) {
        // Create new background element (initially invisible)
        const newBg = document.createElement('div')
        newBg.className = 'background-image'
        newBg.style.backgroundImage = `url(${getBackgroundImage(source)})`
        newBg.style.opacity = '0'
        backgroundRef.current.appendChild(newBg)

        // Animate new background in with fade transition
        gsap.to(newBg, {
          opacity: 1,
          duration: TRANSITIONS.FADE_SLOW.duration,
          ease: TRANSITIONS.FADE_SLOW.ease,
          onComplete: () => {
            // Clean up: remove old background elements after fade completes
            if (oldBackgroundRef.current) {
              oldBackgroundRef.current.remove()
            }
            // Get all old background images and remove them
            oldBackgroundRef.current = backgroundRef.current.querySelector('.background-image:not(:last-child)')
            if (oldBackgroundRef.current) {
              oldBackgroundRef.current.remove()
            }
          }
        })
      }
      setCurrentSource(source)
    }

    // Initialize background on mount with current source
    if (backgroundRef.current) {
      const initialBg = document.createElement('div')
      initialBg.className = 'background-image'
      initialBg.style.backgroundImage = `url(${getBackgroundImage(currentSource)})`
      initialBg.style.opacity = '1'
      backgroundRef.current.appendChild(initialBg)
    }

    // Listen for category change events
    eventSystem.on(eventSystem.constructor.EVENTS.CATEGORY_CHANGED, handleCategoryChange)

    // Cleanup: unsubscribe from events
    return () => {
      eventSystem.off(eventSystem.constructor.EVENTS.CATEGORY_CHANGED, handleCategoryChange)
    }
  }, [])
  // #endregion

  // #region Render
  return (
    <div className="background" ref={backgroundRef} />
  )
  // #endregion
}
// #endregion

export default Background
