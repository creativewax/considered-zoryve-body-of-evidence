/**
 * useBackgroundTransition.js
 *
 * Custom hook to handle animated background transitions with DOM manipulation
 * Extracted from FilterPanel to isolate background animation logic
 * Creates, animates, and cleans up background elements on source changes
 */

import { useEffect } from 'react'
import { gsap } from 'gsap'
import { TRANSITIONS } from '../../constants/animations.js'
import useEventSubscription from '../common/useEventSubscription.js'
import eventSystem from '../../utils/EventSystem.js'


/**
 * useBackgroundTransition
 *
 * Animated background transitions when data source changes. Fade-in new image, cleanup old.
 * backgroundRef - Container ref, getBackgroundUrl - (source) => url, initialSource, className - optional
 */
export const useBackgroundTransition = (backgroundRef, getBackgroundUrl, initialSource, className = 'filter-panel-background') => {
  // Create initial background on mount
  useEffect(() => {
    if (!backgroundRef.current) return

    const initialBg = document.createElement('div')
    initialBg.className = className
    initialBg.style.backgroundImage = `url(${getBackgroundUrl(initialSource)})`
    initialBg.style.opacity = '1'
    backgroundRef.current.appendChild(initialBg)
  }, [backgroundRef, getBackgroundUrl, initialSource, className])


  /**
   * Handles category change events by animating the background transition
   * Preloads the image first to prevent flashing, then fades in smoothly
   */
  const handleCategoryChange = (source) => {
    if (!backgroundRef.current) return

    const imageUrl = getBackgroundUrl(source)

    // Preload the image before creating the background element
    const img = new Image()
    img.onload = () => {
      // Create new background element with initial zero opacity
      const newBg = document.createElement('div')
      newBg.className = className
      newBg.style.backgroundImage = `url(${imageUrl})`
      newBg.style.opacity = '0'
      backgroundRef.current.appendChild(newBg)

      // Animate new background in with fade effect
      gsap.to(newBg, {
        opacity: 1,
        duration: TRANSITIONS.FADE_NORMAL.duration,
        ease: TRANSITIONS.FADE_NORMAL.ease,
        onComplete: () => {
          // Clean up old background elements after animation completes
          const oldBgs = backgroundRef.current?.querySelectorAll(`.${className}:not(:last-child)`)
          oldBgs?.forEach(bg => bg.remove())
        }
      })
    }
    img.src = imageUrl
  }

  // Subscribe to source change events
  useEventSubscription(
    eventSystem.constructor.EVENTS.SOURCE_CHANGED,
    ({ source }) => handleCategoryChange(source),
    [backgroundRef, getBackgroundUrl, className]
  )
}

export default useBackgroundTransition
