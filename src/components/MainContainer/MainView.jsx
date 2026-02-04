// MainView - main carousel container with R3F canvas

import { useState, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { gsap } from 'gsap'
import dataManager from '../../managers/DataManager'
import appStateManager from '../../managers/AppStateManager'
import eventSystem from '../../utils/EventSystem'
import CarouselScene from './Carousel3D/CarouselScene'
import NavigationArrows from './Carousel3D/NavigationArrows'
import Shadow from './Carousel3D/Shadow'
import DetailOverlay from './Carousel3D/DetailOverlay'
import poolManager from './Carousel3D/PoolManager'
import rotationStateManager from './Carousel3D/RotationStateManager'
import { getLayoutConfig, calculateBestFitFOV } from './Carousel3D/carouselHelpers'
import { CAROUSEL_SETTINGS } from '../../constants/carousel'
import './MainView.css'

const MainView = () => {
  const [layoutConfig, setLayoutConfig] = useState(null)
  const [imageCount, setImageCount] = useState(0)
  const containerRef = useRef(null)
  const pendingRef = useRef(null)
  const currentRowsRef = useRef(null)

  // ---------------------------------------------------------------------------
  // THUMBNAIL PATH HELPER
  // ---------------------------------------------------------------------------

  const getThumbnailPath = (path) => {
    const dot = path.lastIndexOf('.')
    return dot === -1 ? path : `${path.substring(0, dot)}_thumb${path.substring(dot)}`
  }

  // ---------------------------------------------------------------------------
  // CAROUSEL INITIALIZATION
  // ---------------------------------------------------------------------------

  useEffect(() => {
    const initCarousel = () => {
      const filters = appStateManager.getFilters()
      const images = dataManager.getFilteredImages(filters)
      const imagesWithThumbs = images.map(img => ({ ...img, thumbnailPath: getThumbnailPath(img.imagePath) }))
      const count = imagesWithThumbs.length

      // Handle empty state
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

      // Fade transition for filter changes (not initial load)
      if (!isInitialLoad && containerRef.current) {
        pendingRef.current = { config, images: imagesWithThumbs, count }

        gsap.to(containerRef.current, {
          opacity: 0,
          duration: CAROUSEL_SETTINGS.transitionFadeDuration,
          ease: 'power2.inOut',
          onComplete: () => {
            const pending = pendingRef.current
            if (!pending) return
            pendingRef.current = null

            setLayoutConfig(pending.config)
            setImageCount(pending.count)
            currentRowsRef.current = pending.config.rows
            rotationStateManager.setColumnAngle(pending.config.columnAngle)
            rotationStateManager.setRotation(0)
            poolManager.initializePool(pending.config, pending.images, 0)

            gsap.to(containerRef.current, {
              opacity: 1,
              duration: CAROUSEL_SETTINGS.transitionFadeDuration,
              ease: 'power2.inOut'
            })
          }
        })
      } else {
        // Initial load - no transition
        setLayoutConfig(config)
        setImageCount(count)
        currentRowsRef.current = config.rows
        rotationStateManager.setColumnAngle(config.columnAngle)
        rotationStateManager.setRotation(0)
        poolManager.initializePool(config, imagesWithThumbs, 0)
      }
    }

    initCarousel()

    // Subscribe to data updates
    eventSystem.on(eventSystem.constructor.EVENTS.IMAGES_UPDATED, initCarousel)
    eventSystem.on(eventSystem.constructor.EVENTS.CATEGORY_CHANGED, initCarousel)

    return () => {
      eventSystem.off(eventSystem.constructor.EVENTS.IMAGES_UPDATED, initCarousel)
      eventSystem.off(eventSystem.constructor.EVENTS.CATEGORY_CHANGED, initCarousel)
    }
  }, [])

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  return (
    <div className="main-view">
      <div className="main-view-content" ref={containerRef}>
        {layoutConfig && imageCount > 0 ? (
          <>
            <Canvas
              camera={{
                position: [0, 0, layoutConfig.cameraZ],
                fov: calculateBestFitFOV(layoutConfig, window.innerWidth / window.innerHeight)
              }}
              style={{ background: 'transparent' }}
              gl={{ alpha: true, antialias: true }}
            >
              <CarouselScene layoutConfig={layoutConfig} />
            </Canvas>
            <NavigationArrows />
            <Shadow rowCount={layoutConfig.rows} />
          </>
        ) : (
          <div className="main-view-placeholder">
            <h2>No Images Found</h2>
            <p>Adjust filters to see patient images</p>
          </div>
        )}
      </div>
      <DetailOverlay />
    </div>
  )
}

export default MainView
