import { useState, useEffect } from 'react'
import { DATA_SOURCE } from '../../constants/index.js'
import dataManager from '../../managers/DataManager.js'
import appStateManager from '../../managers/AppStateManager.js'
import eventSystem from '../../utils/EventSystem.js'
import './MainView.css'

const MainView = () => {
  const [images, setImages] = useState([])

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

  const getThumbnailPath = (imagePath) => {
    // Insert _thumb before the file extension
    // e.g., /patients/image.jpg -> /patients/image_thumb.jpg
    const lastDotIndex = imagePath.lastIndexOf('.')
    if (lastDotIndex === -1) return imagePath
    
    const pathWithoutExt = imagePath.substring(0, lastDotIndex)
    const extension = imagePath.substring(lastDotIndex)
    return `${pathWithoutExt}_thumb${extension}`
  }

  const handleImageClick = (imageData) => {
    appStateManager.setSelectedImage(imageData)
  }

  return (
    <div className="main-view">
      <div className="main-view-content">
        {images.length > 0 ? (
          <div className="main-view-grid">
            {images.map((imageData, index) => {
              const thumbnailPath = getThumbnailPath(imageData.imagePath)
              return (
                <div 
                  key={`${imageData.imagePath}-${index}`}
                  className="main-view-grid-item"
                  onClick={() => handleImageClick(imageData)}
                >
                  <img 
                    src={thumbnailPath} 
                    alt={`Patient image ${index + 1}`}
                    className="main-view-thumbnail"
                    onError={(e) => {
                      // Fallback to original image if thumbnail doesn't exist
                      e.target.src = imageData.imagePath
                    }}
                  />
                </div>
              )
            })}
          </div>
        ) : (
          <div className="main-view-placeholder">
            <h2>3D View Placeholder</h2>
            <p>This will be replaced with the React Three Fiber 3D component</p>
            <p>No images found with current filters</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default MainView
