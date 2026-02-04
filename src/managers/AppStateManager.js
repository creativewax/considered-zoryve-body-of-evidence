// AppStateManager - singleton for global application state and filter management

import { APP_STATE, DATA_SOURCE } from '../constants/index.js'
import eventSystem from '../utils/EventSystem.js'

// -----------------------------------------------------------------------------
// CLASS DEFINITION
// -----------------------------------------------------------------------------

class AppStateManager {
  // ---------------------------------------------------------------------------
  // INITIALIZATION
  // ---------------------------------------------------------------------------

  constructor() {
    this.currentState = APP_STATE.LOADING
    this.currentSource = DATA_SOURCE.CLINICAL_TRIAL
    this.filters = {
      source: DATA_SOURCE.CLINICAL_TRIAL,
      condition: null,
      formulation: null,
      bodyArea: null,
      baselineSeverity: null,
      age: null,
      gender: null,
    }
    this.selectedImage = null
  }

  // ---------------------------------------------------------------------------
  // APP STATE MANAGEMENT
  // ---------------------------------------------------------------------------

  // Set application state (LOADING, INTRO, MAIN, DETAIL)
  setState(newState) {
    if (this.currentState !== newState) {
      this.currentState = newState
      eventSystem.emit(eventSystem.constructor.EVENTS.APP_STATE_CHANGED, newState)
    }
  }

  // Get current application state
  getState() {
    return this.currentState
  }

  // ---------------------------------------------------------------------------
  // DATA SOURCE MANAGEMENT
  // ---------------------------------------------------------------------------

  // Set data source (Clinical Trial or Practice-Based)
  setSource(source) {
    if (this.currentSource !== source) {
      this.currentSource = source
      this.filters.source = source
      eventSystem.emit(eventSystem.constructor.EVENTS.CATEGORY_CHANGED, source)
      this.updateFilters()
    }
  }

  // Get current data source
  getSource() {
    return this.currentSource
  }

  // ---------------------------------------------------------------------------
  // FILTER MANAGEMENT
  // ---------------------------------------------------------------------------

  // Set individual filter value
  setFilter(filterType, value) {
    if (this.filters[filterType] !== value) {
      this.filters[filterType] = value
      eventSystem.emit(eventSystem.constructor.EVENTS.FILTER_CHANGED, {
        filterType,
        value,
        filters: { ...this.filters }
      })
      this.updateFilters()
    }
  }

  // Reset all filters to default state
  resetFilters() {
    // Check if there are any active filters before resetting
    const hasActiveFilters = Object.keys(this.filters).some(key => {
      if (key === 'source') return false
      return this.filters[key] !== null
    })

    if (!hasActiveFilters) return

    this.filters = {
      source: this.currentSource,
      condition: null,
      formulation: null,
      bodyArea: null,
      baselineSeverity: null,
      age: null,
      gender: null,
    }

    eventSystem.emit(eventSystem.constructor.EVENTS.FILTERS_RESET, { ...this.filters })
    this.updateFilters()
  }

  // Get copy of current filters
  getFilters() {
    return { ...this.filters }
  }

  // Check if any filters (excluding source) are active
  hasActiveFilters() {
    return Object.keys(this.filters).some(key => {
      if (key === 'source') return false
      return this.filters[key] !== null
    })
  }

  // Trigger images update event
  updateFilters() {
    eventSystem.emit(eventSystem.constructor.EVENTS.IMAGES_UPDATED, { ...this.filters })
  }

  // ---------------------------------------------------------------------------
  // IMAGE SELECTION
  // ---------------------------------------------------------------------------

  // Set selected image and emit event
  setSelectedImage(imageData) {
    this.selectedImage = imageData
    eventSystem.emit(eventSystem.constructor.EVENTS.IMAGE_CLICKED, imageData)
  }

  // Get currently selected image
  getSelectedImage() {
    return this.selectedImage
  }
}

// -----------------------------------------------------------------------------
// SINGLETON EXPORT
// -----------------------------------------------------------------------------

// Create singleton instance
const appStateManager = new AppStateManager()

export default appStateManager
