/**
 * MainView.jsx
 *
 * Main carousel container with R3F canvas and carousel initialisation.
 */

import { useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import Carousel3DScene from '../Carousel3DScene/Carousel3DScene'
import NavigationArrows from '../../components/carousel/NavigationArrows/NavigationArrows'
import Shadow from '../../components/carousel/Shadow/Shadow'
import DetailOverlay from '../../components/carousel/DetailOverlay/DetailOverlay'
import { calculateBestFitFOV } from '../../utils/carouselHelpers'
import useCarouselManager from '../../hooks/carousel/useCarouselManager.js'
import './MainView.css'

// ---------------------------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------------------------

const MainView = () => {
  const containerRef = useRef(null)

  // Use carousel manager hook to handle all carousel initialisation and transitions
  // Replaces the previous 73-line useEffect with a clean, focused custom hook
  // Note: Thumbnails are preloaded by ImageManager during app init
  const { layoutConfig, imageCount } = useCarouselManager(containerRef)

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

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
              style={{ background: 'transparent', touchAction: 'none' }}
              gl={{ alpha: true, antialias: true }}
            >
              <Carousel3DScene layoutConfig={layoutConfig} />
            </Canvas>
            {/* Navigation controls and shadow elements */}
            <NavigationArrows />
            <Shadow rowCount={layoutConfig.rows} />
          </>
        ) : (
          <div className="main-view-no-images">
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
