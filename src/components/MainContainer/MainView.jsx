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
import { getLayoutConfig } from './Carousel3D/carouselHelpers'
import { CAROUSEL_SETTINGS } from '../../constants/carousel'
import './MainView.css'

const MainView = () => {
  const [layoutConfig, setLayoutConfig] = useState(null)
  const [imageCount, setImageCount] = useState(0)
  const containerRef = useRef(null)
  const pendingRef = useRef(null)
  const currentRowsRef = useRef(null)

  // Get thumbnail path from full image path
  const getThumbnailPath = (path) => {
    const dot = path.lastIndexOf('.')
    return dot === -1 ? path : `${path.substring(0, dot)}_thumb${path.substring(dot)}`
  }

  useEffect(() => {
    const initCarousel = () => {
      const filters = appStateManager.getFilters()
      const images = dataManager.getFilteredImages(filters)
      const imagesWithThumbs = images.map(img => ({ ...img, thumbnailPath: getThumbnailPath(img.imagePath) }))
      const count = imagesWithThumbs.length

      if (count === 0) {
        setLayoutConfig(null)
        setImageCount(0)
        rotationStateManager.reset()
        poolManager.reset()
        currentRowsRef.current = null
        return
      }

      const config = getLayoutConfig(count)
      const rowsChanged = currentRowsRef.current !== null && currentRowsRef.current !== config.rows

      if (rowsChanged && containerRef.current) {
        // Fade out, then update and spin in
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
            
            // Initialize pool first (it calculates virtualColumns at rotation 0)
            const introStartRotation = -CAROUSEL_SETTINGS.introSpinAngle
            rotationStateManager.setRotation(introStartRotation)
            poolManager.initializePool(pending.config, pending.images, introStartRotation)
            
            // Then prepare intro state from pool (so we know which virtualColumns to hide)
            rotationStateManager.prepareIntroFromPool(poolManager)

            // Fade back in
            gsap.to(containerRef.current, {
              opacity: 1,
              duration: CAROUSEL_SETTINGS.transitionFadeDuration,
              ease: 'power2.inOut',
              onComplete: () => rotationStateManager.playIntro(pending.config.visibleColumns, poolManager)
            })
          }
        })
      } else {
        // Same row count - always do intro spin when filters change
        setLayoutConfig(config)
        setImageCount(count)
        currentRowsRef.current = config.rows
        rotationStateManager.setColumnAngle(config.columnAngle)
        
        // Initialize pool first (it calculates virtualColumns at rotation 0)
        const introStartRotation = -CAROUSEL_SETTINGS.introSpinAngle
        rotationStateManager.setRotation(introStartRotation)
        poolManager.initializePool(config, imagesWithThumbs, introStartRotation)
        
        // Then prepare intro state from pool (so we know which virtualColumns to hide)
        rotationStateManager.prepareIntroFromPool(poolManager)
        rotationStateManager.playIntro(config.visibleColumns, poolManager)
      }
    }

    initCarousel()
    eventSystem.on(eventSystem.constructor.EVENTS.IMAGES_UPDATED, initCarousel)
    eventSystem.on(eventSystem.constructor.EVENTS.CATEGORY_CHANGED, initCarousel)

    return () => {
      eventSystem.off(eventSystem.constructor.EVENTS.IMAGES_UPDATED, initCarousel)
      eventSystem.off(eventSystem.constructor.EVENTS.CATEGORY_CHANGED, initCarousel)
    }
  }, [])

  return (
    <div className="main-view">
      <div className="main-view-content" ref={containerRef}>
        {layoutConfig && imageCount > 0 ? (
          <>
            <Canvas
              camera={{ position: [0, 0, layoutConfig.cameraZ], fov: 50 }}
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
