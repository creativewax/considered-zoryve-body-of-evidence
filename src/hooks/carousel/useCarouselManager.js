/**
 * useCarouselManager.js
 *
 * Comprehensive carousel management hook extracted from MainView.jsx
 * Handles image fetching, layout calculation, manager initialisation, and fade transitions
 * Encapsulates the complex 73-line useEffect into a focused, reusable hook
 */

import { useState, useRef, useCallback, useEffect } from 'react'
import { gsap } from 'gsap'
import dataManager from '../../managers/DataManager.js'
import appStateManager from '../../managers/AppStateManager.js'
import filterManager from '../../managers/FilterManager.js'
import poolManager from '../../managers/PoolManager.js'
import rotationStateManager from '../../managers/RotationStateManager.js'
import { getLayoutConfig } from '../../utils/carouselHelpers.js'
import { CAROUSEL_SETTINGS } from '../../constants/carousel.js'
import useMultipleEventSubscriptions from '../common/useMultipleEventSubscriptions.js'
import eventSystem from '../../utils/EventSystem.js'

/**
 * useCarouselManager - Carousel data, layout, fade transitions.
 * containerRef - Ref for fade animations.
 * Returns { layoutConfig, imageCount }.
 *
 * Note: Thumbnails are preloaded by ImageManager during app init
 */
export const useCarouselManager = (containerRef) => {
  // ---------------------------------------------------------------------------
  // STATE
  // ---------------------------------------------------------------------------

  const [layoutConfig, setLayoutConfig] = useState(null)
  const [imageCount, setImageCount] = useState(0)
  const pendingRef = useRef(null)
  const currentRowsRef = useRef(null)
  const isInitialisedRef = useRef(false)

  // ---------------------------------------------------------------------------
  // CAROUSEL INIT
  // ---------------------------------------------------------------------------

  const initCarousel = useCallback(() => {
    // Fetch filtered images
    // Combine filters from FilterManager with source from AppStateManager
    // Note: Thumbnails already preloaded by ImageManager, no need to add paths
    const filters = {
      ...filterManager.getFilters(),
      source: appStateManager.getSource()
    }
    const images = dataManager.getFilteredImages(filters)
    const count = images.length

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
      pendingRef.current = { config, images, count }

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
          poolManager.initialisePool(pending.config, pending.images, 0)

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
      poolManager.initialisePool(config, images, 0)
    }
  }, [containerRef])

  // ---------------------------------------------------------------------------
  // SUBSCRIPTIONS & MOUNT
  // ---------------------------------------------------------------------------

  useMultipleEventSubscriptions([
    [eventSystem.constructor.EVENTS.IMAGES_UPDATED, initCarousel],
    [eventSystem.constructor.EVENTS.CATEGORY_CHANGED, initCarousel],
  ], [initCarousel])

  useEffect(() => {
    if (!isInitialisedRef.current) {
      isInitialisedRef.current = true
      initCarousel()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { layoutConfig, imageCount }
}

export default useCarouselManager
