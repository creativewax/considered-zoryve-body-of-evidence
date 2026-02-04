// MainView - main carousel container with R3F canvas and carousel initialization

// ─────────────────────────────────────────────────────────────────────────────
// IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { gsap } from 'gsap'
import dataManager from '../../managers/DataManager'
import appStateManager from '../../managers/AppStateManager'
import eventSystem from '../../utils/EventSystem'
import Carousel3DScene from '../Carousel3DScene/Carousel3DScene'
import NavigationArrows from '../../components/carousel/NavigationArrows/NavigationArrows'
import Shadow from '../../components/carousel/Shadow/Shadow'
import DetailOverlay from '../../components/carousel/DetailOverlay/DetailOverlay'
import poolManager from '../../managers/PoolManager'
import rotationStateManager from '../../managers/RotationStateManager'
import { getLayoutConfig, calculateBestFitFOV } from '../../utils/carouselHelpers'
import { CAROUSEL_SETTINGS } from '../../constants/carousel'
import './MainView.css'

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

const MainView = () => {
  // ───────────────────────────────────────────────────────────────────────────
  // HOOKS / STATE MANAGEMENT
  // ───────────────────────────────────────────────────────────────────────────

  const [layoutConfig, setLayoutConfig] = useState(null)
  const [imageCount, setImageCount] = useState(0)
  const containerRef = useRef(null)
  const pendingRef = useRef(null)
  const currentRowsRef = useRef(null)

  // ───────────────────────────────────────────────────────────────────────────
  // HELPER FUNCTIONS
  // ───────────────────────────────────────────────────────────────────────────

  /**
   * Converts an image path to its thumbnail version
   * @param {string} path - Original image path
   * @returns {string} Path with '_thumb' inserted before file extension
   */
  const getThumbnailPath = (path) => {
    const dot = path.lastIndexOf('.')
    return dot === -1 ? path : `${path.substring(0, dot)}_thumb${path.substring(dot)}`
  }

  // ───────────────────────────────────────────────────────────────────────────
  // EFFECTS
  // ───────────────────────────────────────────────────────────────────────────

  /**
   * Initializes carousel on component mount and when filters/images change
   * Handles both initial load and filter-based transitions with fade animations
   */
  useEffect(() => {
    const initCarousel = () => {
      // Fetch filtered images and add thumbnail paths
      const filters = appStateManager.getFilters()
      const images = dataManager.getFilteredImages(filters)
      const imagesWithThumbs = images.map(img => ({ ...img, thumbnailPath: getThumbnailPath(img.imagePath) }))
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
    }

    initCarousel()

    // Subscribe to data updates from event system
    eventSystem.on(eventSystem.constructor.EVENTS.IMAGES_UPDATED, initCarousel)
    eventSystem.on(eventSystem.constructor.EVENTS.CATEGORY_CHANGED, initCarousel)

    // Clean up event listeners on unmount
    return () => {
      eventSystem.off(eventSystem.constructor.EVENTS.IMAGES_UPDATED, initCarousel)
      eventSystem.off(eventSystem.constructor.EVENTS.CATEGORY_CHANGED, initCarousel)
    }
  }, [])

  // ───────────────────────────────────────────────────────────────────────────
  // RENDER
  // ───────────────────────────────────────────────────────────────────────────

  return (
    <div className="main-view">
      <div className="main-view-content" ref={containerRef}>
        {layoutConfig && imageCount > 0 ? (
          <>
            {/* R3F Canvas with carousel scene */}
            <Canvas
              camera={{
                position: [0, 0, layoutConfig.cameraZ],
                fov: calculateBestFitFOV(layoutConfig, window.innerWidth / window.innerHeight)
              }}
              style={{ background: 'transparent' }}
              gl={{ alpha: true, antialias: true }}
            >
              <Carousel3DScene layoutConfig={layoutConfig} />
            </Canvas>
            {/* Navigation controls and shadow elements */}
            <NavigationArrows />
            <Shadow rowCount={layoutConfig.rows} />
          </>
        ) : (
          /* Placeholder when no images match current filters */
          <div className="main-view-placeholder">
            <h2>No Images Found</h2>
            <p>Adjust filters to see patient images</p>
          </div>
        )}
      </div>
      {/* Overlay for detailed image information */}
      <DetailOverlay />
    </div>
  )
}

export default MainView
