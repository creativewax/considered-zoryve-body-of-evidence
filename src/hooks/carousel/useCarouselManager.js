/**
 * useCarouselManager.js
 *
 * Comprehensive carousel management hook extracted from MainView.jsx
 * Handles image fetching, layout calculation, manager initialization, and fade transitions
 * Encapsulates the complex 73-line useEffect into a focused, reusable hook
 */

// #region Imports
import { useState, useRef, useCallback, useEffect } from 'react'
import { gsap } from 'gsap'
import dataManager from '../../managers/DataManager.js'
import appStateManager from '../../managers/AppStateManager.js'
import poolManager from '../../managers/PoolManager.js'
import rotationStateManager from '../../managers/RotationStateManager.js'
import { getLayoutConfig } from '../../utils/carouselHelpers.js'
import { CAROUSEL_SETTINGS } from '../../constants/carousel.js'
import useEventSubscription from '../common/useEventSubscription.js'
import eventSystem from '../../utils/EventSystem.js'
// #endregion

// ─────────────────────────────────────────────────────────────────────────────

/**
 * useCarouselManager
 *
 * Manages carousel data, layout, and transitions with fade animations.
 * Handles both initial load (no animation) and filter changes (with fade transition).
 * Automatically subscribes to data update events and manages carousel state.
 *
 * @param {React.RefObject} containerRef - Ref to container element for fade animations
 * @param {Function} getThumbnailPath - Function to convert image paths to thumbnail paths
 * @returns {Object} { layoutConfig, imageCount } - Current carousel configuration
 *
 * @example
 * const containerRef = useRef(null)
 * const { layoutConfig, imageCount } = useCarouselManager(containerRef, getThumbnailPath)
 */
export const useCarouselManager = (containerRef, getThumbnailPath) => {
  // #region State Management
  const [layoutConfig, setLayoutConfig] = useState(null)
  const [imageCount, setImageCount] = useState(0)
  const pendingRef = useRef(null)
  const currentRowsRef = useRef(null)
  // #endregion

  // ───────────────────────────────────────────────────────────────────────────

  // #region Carousel Initialization
  /**
   * Initialize or update carousel with current filter state
   * Handles data fetching, layout calculation, manager updates, and transitions
   */
  const initCarousel = useCallback(() => {
    // Fetch filtered images and add thumbnail paths
    const filters = appStateManager.getFilters()
    const images = dataManager.getFilteredImages(filters)
    const imagesWithThumbs = images.map(img => ({
      ...img,
      thumbnailPath: getThumbnailPath(img.imagePath)
    }))
    const count = imagesWithThumbs.length

    // Handle empty state - reset all carousel state
    if (count === 0) {
      setLayoutConfig(null)
      setImageCount(0)
      rotationStateManager.reset()
      poolManager.reset()
      currentRowsRef.current = null
      return
    }

    const config = getLayoutConfig(count)
    const isInitialLoad = currentRowsRef.current === null

    // Apply fade transition for filter changes (skip on initial load)
    if (!isInitialLoad && containerRef.current) {
      // Store pending update and fade out current carousel
      pendingRef.current = { config, images: imagesWithThumbs, count }

      gsap.to(containerRef.current, {
        opacity: 0,
        duration: CAROUSEL_SETTINGS.transitionFadeDuration,
        ease: 'power2.inOut',
        onComplete: () => {
          const pending = pendingRef.current
          if (!pending) return
          pendingRef.current = null

          // Update state with new carousel configuration
          setLayoutConfig(pending.config)
          setImageCount(pending.count)
          currentRowsRef.current = pending.config.rows
          rotationStateManager.setColumnAngle(pending.config.columnAngle)
          rotationStateManager.setRotation(0)
          poolManager.initializePool(pending.config, pending.images, 0)

          // Fade back in with new content
          gsap.to(containerRef.current, {
            opacity: 1,
            duration: CAROUSEL_SETTINGS.transitionFadeDuration,
            ease: 'power2.inOut'
          })
        }
      })
    } else {
      // Initial load - apply state without animation
      setLayoutConfig(config)
      setImageCount(count)
      currentRowsRef.current = config.rows
      rotationStateManager.setColumnAngle(config.columnAngle)
      rotationStateManager.setRotation(0)
      poolManager.initializePool(config, imagesWithThumbs, 0)
    }
  }, [containerRef, getThumbnailPath])
  // #endregion

  // ───────────────────────────────────────────────────────────────────────────

  // #region Event Subscriptions & Initial Load
  // Subscribe to data update events
  useEventSubscription(
    eventSystem.constructor.EVENTS.IMAGES_UPDATED,
    initCarousel,
    [initCarousel]
  )

  useEventSubscription(
    eventSystem.constructor.EVENTS.CATEGORY_CHANGED,
    initCarousel,
    [initCarousel]
  )

  // Initialize carousel on component mount
  // Call initCarousel once on mount to load initial data
  useEffect(() => {
    initCarousel()
  }, [initCarousel])
  // #endregion

  return { layoutConfig, imageCount }
}

export default useCarouselManager
