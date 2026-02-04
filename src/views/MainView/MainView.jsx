// MainView - main carousel container with R3F canvas and carousel initialization

// ─────────────────────────────────────────────────────────────────────────────
// IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import { useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import Carousel3DScene from '../Carousel3DScene/Carousel3DScene'
import NavigationArrows from '../../components/carousel/NavigationArrows/NavigationArrows'
import Shadow from '../../components/carousel/Shadow/Shadow'
import DetailOverlay from '../../components/carousel/DetailOverlay/DetailOverlay'
import { calculateBestFitFOV } from '../../utils/carouselHelpers'
import useCarouselManager from '../../hooks/carousel/useCarouselManager.js'
import './MainView.css'

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

const MainView = () => {
  // ───────────────────────────────────────────────────────────────────────────
  // HOOKS / STATE MANAGEMENT
  // ───────────────────────────────────────────────────────────────────────────

  const containerRef = useRef(null)

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

  // Use carousel manager hook to handle all carousel initialization and transitions
  // Replaces the previous 73-line useEffect with a clean, focused custom hook
  const { layoutConfig, imageCount } = useCarouselManager(containerRef, getThumbnailPath)

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
