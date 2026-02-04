/**
 * useBackgroundTransition.js
 *
 * Custom hook to handle animated background transitions with DOM manipulation
 * Extracted from FilterPanel to isolate background animation logic
 * Creates, animates, and cleans up background elements on source changes
 */

// #region Imports
import { useEffect } from 'react'
import { gsap } from 'gsap'
import { TRANSITIONS } from '../../constants/animations.js'
import useEventSubscription from '../common/useEventSubscription.js'
import eventSystem from '../../utils/EventSystem.js'
// #endregion

// ─────────────────────────────────────────────────────────────────────────────

/**
 * useBackgroundTransition
 *
 * Manages animated background image transitions when data source changes.
 * Creates new background elements with fade-in animation and removes old ones.
 * Prevents memory buildup by cleaning up old backgrounds after animation.
 *
 * @param {React.RefObject} backgroundRef - Ref to background container element
 * @param {Function} getBackgroundUrl - Function that returns background URL for a source
 * @param {string} initialSource - Initial data source for first background
 * @param {string} [className='filter-panel-background'] - CSS class name for background elements
 *
 * @example
 * const backgroundRef = useRef(null)
 * useBackgroundTransition(
 *   backgroundRef,
 *   (source) => source === 'Clinical Trial' ? '/ct-bg.jpg' : '/pb-bg.jpg',
 *   currentSource,
 *   'background-image' // custom className
 * )
 */
export const useBackgroundTransition = (backgroundRef, getBackgroundUrl, initialSource, className = 'filter-panel-background') => {
  // #region Initial Background Setup
  // Create initial background on mount
  useEffect(() => {
    if (!backgroundRef.current) return

    const initialBg = document.createElement('div')
    initialBg.className = className
    initialBg.style.backgroundImage = `url(${getBackgroundUrl(initialSource)})`
    initialBg.style.opacity = '1'
    backgroundRef.current.appendChild(initialBg)
  }, [backgroundRef, getBackgroundUrl, initialSource, className])
  // #endregion

  // ───────────────────────────────────────────────────────────────────────────

  // #region Background Transition Handler
  /**
   * Handles category change events by animating the background transition
   * Fades in the new background and removes old ones to prevent memory buildup
   */
  const handleCategoryChange = (source) => {
    if (!backgroundRef.current) return

    // Create new background element with initial zero opacity
    const newBg = document.createElement('div')
    newBg.className = className
    newBg.style.backgroundImage = `url(${getBackgroundUrl(source)})`
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

  // Subscribe to category change events
  useEventSubscription(
    eventSystem.constructor.EVENTS.CATEGORY_CHANGED,
    handleCategoryChange,
    [backgroundRef, getBackgroundUrl, className]
  )
  // #endregion
}

export default useBackgroundTransition
