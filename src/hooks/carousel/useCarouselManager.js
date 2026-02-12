/**
 * useCarouselManager.js
 *
 * Manages the carousel lifecycle: fetching filtered images, calculating layout,
 * initialising carousel managers, and animating transitions between states.
 *
 * Thumbnails are preloaded by ImageManager during app init — this hook only
 * coordinates data and layout, it doesn't handle image loading.
 *
 * ---------------------------------------------------------------------------
 * DATA FLOW
 * ---------------------------------------------------------------------------
 *
 *   FilterManager.getFilters()   ──┐
 *   AppStateManager.getSource()  ──┼──► DataManager.getFilteredImages(filters)
 *                                  │
 *                                  ▼
 *                          filteredImages[]
 *                                  │
 *                                  ▼
 *                      getLayoutConfig(imageCount)
 *                                  │
 *                                  ▼
 *                             layoutConfig
 *                                  │
 *                     ┌────────────┼────────────┐
 *                     ▼            ▼            ▼
 *              PoolManager   RotationState   React state
 *             .initialise    .setColumnAngle  { layoutConfig,
 *                            .setRotation       imageCount }
 *
 * ---------------------------------------------------------------------------
 * DATA STRUCTURES
 * ---------------------------------------------------------------------------
 *
 * filteredImages[] — from DataManager.getFilteredImages(), one entry per patient:
 *   [{
 *     imagePath:  string   — full path to first valid image (e.g. '/patients/110-005_baseline.jpg')
 *     field:      string   — which image field matched (e.g. 'baselineImage', 'week2Image')
 *     patient:    object   — the full patient record with all PATIENT_SCHEMA fields:
 *       {
 *         referenceId, pageNumber, patientId,
 *         condition, formulation, fitzpatrickSkinType,
 *         gender, age, race, ethnicity,
 *         bodyArea, bodyAreaSimple,
 *         treatmentsTriedAndFailed, baselineSeverity, baselineBsa, durationOfDisease,
 *         scale (or scale--don'tDisplay for practice-based),
 *         baselineImage, week1Image, week2Image, ... week52Image,
 *         baseline, week1, week2, ... week52 (score values),
 *         itchScoreBaseline, itchScoreWeek1, itchScoreWeek4, itchScoreWeek8,
 *         quote (practice-based only)
 *       }
 *   }]
 *
 * layoutConfig — calculated from image count via getLayoutConfig():
 *   {
 *     rows:            number   — row count (1, 3, or 5)
 *     visibleColumns:  number   — how many columns the user sees at once
 *     totalColumns:    number   — total columns to hold all images
 *     imageSize:       number   — size of each image in 3D units
 *     cylinderRadius:  number   — radius of the 3D cylinder
 *     rowSpacing:      number   — vertical gap between rows
 *     columnAngle:     number   — radians between adjacent columns
 *     poolSize:        number   — number of active 3D frames (visible + buffer)
 *     cameraZ:         number   — camera distance from cylinder
 *   }
 *
 * ---------------------------------------------------------------------------
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


// ---------------------------------------------------------------------------
// PURE HELPERS (no side-effects, easy to reason about)
// ---------------------------------------------------------------------------

/**
 * Gather current filters + source from managers and fetch matching images.
 * Returns { images, count }.
 */
function fetchFilteredImages() {
  const filters = {
    ...filterManager.getFilters(),
    source: appStateManager.getSource()
  }
  const images = dataManager.getFilteredImages(filters)
  return { images, count: images.length }
}


// ---------------------------------------------------------------------------
// HOOK
// ---------------------------------------------------------------------------

export const useCarouselManager = (containerRef) => {
  // ---------------------------------------------------------------------------
  // STATE
  // ---------------------------------------------------------------------------

  const [layoutConfig, setLayoutConfig] = useState(null)
  const [imageCount, setImageCount] = useState(0)

  // Refs for managing transition state between renders
  const pendingRef = useRef(null)        // holds queued update during fade-out
  const currentRowsRef = useRef(null)    // tracks current row count (null = first load)
  const isInitialisedRef = useRef(false) // prevents double-init in StrictMode

  // ---------------------------------------------------------------------------
  // APPLY — push a new config into all managers and React state
  // ---------------------------------------------------------------------------

  /**
   * Write the new carousel state everywhere it needs to go:
   *  - React state (triggers re-render of Carousel3DScene)
   *  - RotationStateManager (resets rotation to 0 with new column angle)
   *  - PoolManager (builds the visible frame pool from images + config)
   */
  const applyCarouselState = useCallback((config, images, count) => {
    setLayoutConfig(config)
    setImageCount(count)
    currentRowsRef.current = config.rows

    rotationStateManager.setColumnAngle(config.columnAngle)
    rotationStateManager.setRotation(0)
    poolManager.initialisePool(config, images, 0)
  }, [])

  // ---------------------------------------------------------------------------
  // RESET — clear everything when there are no images
  // ---------------------------------------------------------------------------

  const resetCarousel = useCallback(() => {
    setLayoutConfig(null)
    setImageCount(0)
    currentRowsRef.current = null

    rotationStateManager.reset()
    poolManager.reset()
  }, [])

  // ---------------------------------------------------------------------------
  // TRANSITION — fade out old carousel, apply new state, fade back in
  // ---------------------------------------------------------------------------

  /**
   * Crossfade to a new carousel state using GSAP.
   * Stores the pending update in a ref so only the latest one is applied
   * (if multiple filter changes fire in quick succession, earlier ones are dropped).
   */
  const transitionToNewState = useCallback((config, images, count) => {
    pendingRef.current = { config, images, count }

    gsap.to(containerRef.current, {
      opacity: 0,
      duration: CAROUSEL_SETTINGS.transitionFadeDuration,
      ease: 'power2.inOut',
      onComplete: () => {
        // Grab the latest pending update (may differ from what started the fade)
        const pending = pendingRef.current
        if (!pending) return
        pendingRef.current = null

        // Apply new state while carousel is invisible
        applyCarouselState(pending.config, pending.images, pending.count)

        // Fade back in
        gsap.to(containerRef.current, {
          opacity: 1,
          duration: CAROUSEL_SETTINGS.transitionFadeDuration,
          ease: 'power2.inOut'
        })
      }
    })
  }, [containerRef, applyCarouselState])

  // ---------------------------------------------------------------------------
  // INIT — main entry point, called on mount and when filters/source change
  // ---------------------------------------------------------------------------

  const initCarousel = useCallback(() => {
    // 1. Get the current filtered images from managers
    const { images, count } = fetchFilteredImages()

    // 2. No results — clear the carousel
    if (count === 0) {
      resetCarousel()
      return
    }

    // 3. Calculate layout from image count (rows, columns, cylinder size, etc.)
    const config = getLayoutConfig(count)

    // 4. First load — apply immediately without animation
    const isFirstLoad = currentRowsRef.current === null
    if (isFirstLoad || !containerRef.current) {
      applyCarouselState(config, images, count)
      return
    }

    // 5. Subsequent updates — crossfade to new state
    transitionToNewState(config, images, count)
  }, [containerRef, resetCarousel, applyCarouselState, transitionToNewState])

  // ---------------------------------------------------------------------------
  // SUBSCRIPTIONS — re-init when filters change or source switches
  // ---------------------------------------------------------------------------

  useMultipleEventSubscriptions([
    [eventSystem.constructor.EVENTS.IMAGES_UPDATED, initCarousel],
    [eventSystem.constructor.EVENTS.SOURCE_CHANGED, initCarousel],
  ], [initCarousel])

  // Run once on mount (guarded against StrictMode double-fire)
  useEffect(() => {
    if (!isInitialisedRef.current) {
      isInitialisedRef.current = true
      initCarousel()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ---------------------------------------------------------------------------
  // PUBLIC API
  // ---------------------------------------------------------------------------

  return { layoutConfig, imageCount }
}

export default useCarouselManager
