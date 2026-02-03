import { useState, useEffect } from 'react'
import dataManager from '../../managers/DataManager.js'
import appStateManager from '../../managers/AppStateManager.js'
import eventSystem from '../../utils/EventSystem.js'
import Carousel3D from './Carousel3D/Carousel3D.jsx'
import NavigationArrows from './Carousel3D/NavigationArrows.jsx'
import Shadow from './Carousel3D/Shadow.jsx'
import DetailOverlay from './Carousel3D/DetailOverlay.jsx'
import './MainView.css'

const MainView = () => {
  const [images, setImages] = useState([])
  const [selectedImage, setSelectedImage] = useState(null)

  useEffect(() => {
    const handleImagesUpdate = () => {
      const currentFilters = appStateManager.getFilters()
      const filteredImages = dataManager.getFilteredImages(currentFilters)
      setImages(filteredImages)
    }

    const handleCategoryChange = () => {
      const filters = appStateManager.getFilters()
      const filteredImages = dataManager.getFilteredImages(filters)
      setImages(filteredImages)
    }

    // Initial load
    const filters = appStateManager.getFilters()
    const filteredImages = dataManager.getFilteredImages(filters)
    setImages(filteredImages)

    eventSystem.on(eventSystem.constructor.EVENTS.IMAGES_UPDATED, handleImagesUpdate)
    eventSystem.on(eventSystem.constructor.EVENTS.CATEGORY_CHANGED, handleCategoryChange)

    return () => {
      eventSystem.off(eventSystem.constructor.EVENTS.IMAGES_UPDATED, handleImagesUpdate)
      eventSystem.off(eventSystem.constructor.EVENTS.CATEGORY_CHANGED, handleCategoryChange)
    }
  }, [])

  const handleImageClick = (imageData) => {
    setSelectedImage(imageData)
  }

  const handleCloseOverlay = () => {
    setSelectedImage(null)
  }

  const handleNavigateNext = () => {
    if (window.carouselNavigate) {
      window.carouselNavigate.next()
    }
  }

  const handleNavigatePrev = () => {
    if (window.carouselNavigate) {
      window.carouselNavigate.prev()
    }
  }

  return (
    <div className="main-view">
      <div className="main-view-content">
        {images.length > 0 ? (
          <>
            <Carousel3D 
              images={images} 
              onImageClick={handleImageClick}
            />
            <NavigationArrows
              onLeftClick={handleNavigatePrev}
              onRightClick={handleNavigateNext}
            />
            <Shadow imageCount={images.length} />
          </>
        ) : (
          <div className="main-view-placeholder">
            <h2>3D View Placeholder</h2>
            <p>This will be replaced with the React Three Fiber 3D component</p>
            <p>No images found with current filters</p>
          </div>
        )}
      </div>
      {selectedImage && (
        <DetailOverlay 
          imageData={selectedImage} 
          onClose={handleCloseOverlay}
        />
      )}
    </div>
  )
}

export default MainView
