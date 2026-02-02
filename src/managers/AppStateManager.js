import { APP_STATE, DATA_SOURCE } from '../constants/index.js'
import eventSystem from '../utils/EventSystem.js'

class AppStateManager {
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

  setState(newState) {
    if (this.currentState !== newState) {
      this.currentState = newState
      eventSystem.emit(eventSystem.constructor.EVENTS.APP_STATE_CHANGED, newState)
    }
  }

  getState() {
    return this.currentState
  }

  setSource(source) {
    if (this.currentSource !== source) {
      this.currentSource = source
      this.filters.source = source
      eventSystem.emit(eventSystem.constructor.EVENTS.CATEGORY_CHANGED, source)
      this.updateFilters()
    }
  }

  getSource() {
    return this.currentSource
  }

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

  resetFilters() {
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

  getFilters() {
    return { ...this.filters }
  }

  hasActiveFilters() {
    return Object.keys(this.filters).some(key => {
      if (key === 'source') return false
      return this.filters[key] !== null
    })
  }

  updateFilters() {
    // Trigger images update
    eventSystem.emit(eventSystem.constructor.EVENTS.IMAGES_UPDATED, { ...this.filters })
  }

  setSelectedImage(imageData) {
    this.selectedImage = imageData
    eventSystem.emit(eventSystem.constructor.EVENTS.IMAGE_CLICKED, imageData)
  }

  getSelectedImage() {
    return this.selectedImage
  }
}

// Create singleton instance
const appStateManager = new AppStateManager()

export default appStateManager
