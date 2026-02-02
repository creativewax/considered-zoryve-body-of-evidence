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

  const handleImageClick = (imageData) => {
    appStateManager.setSelectedImage(imageData)
  }

  return (
    <div className="main-view">
      <div className="main-view-content">
        <div className="main-view-placeholder">
          <h2>3D View Placeholder</h2>
          <p>This will be replaced with the React Three Fiber 3D component</p>
          <p>Filtered Images: {images.length}</p>
        </div>
      </div>
    </div>
  )
}

export default MainView
