// AppStateManager - singleton for global application state and filter management

import { APP_STATE, DATA_SOURCE } from '../constants/index.js'
import eventSystem from '../utils/EventSystem.js'

// ---------------------------------------------------------------------------
// CLASS DEFINITION
// ---------------------------------------------------------------------------

class AppStateManager {
  // ---------------------------------------------------------------------------
  // INITIALISATION
  // ---------------------------------------------------------------------------

  constructor() {
    this.currentState = APP_STATE.LOADING
    this.currentSource = DATA_SOURCE.CLINICAL_TRIAL
    this.selectedImage = null

    // Listen to UI interaction events (event-driven architecture)
    eventSystem.on(
      eventSystem.constructor.EVENTS.SOURCE_CHANGED,
      this.handleSourceChanged.bind(this)
    )
    eventSystem.on(
      eventSystem.constructor.EVENTS.IMAGE_SELECTED,
      this.handleImageSelected.bind(this)
    )
    eventSystem.on(
      eventSystem.constructor.EVENTS.IMAGE_DESELECTED,
      this.handleImageDeselected.bind(this)
    )
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
      eventSystem.emit(eventSystem.constructor.EVENTS.CATEGORY_CHANGED, source)
    }
  }

  // Get current data source
  getSource() {
    return this.currentSource
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

  // ---------------------------------------------------------------------------
  // EVENT HANDLERS (Event-Driven Architecture)
  // ---------------------------------------------------------------------------

  /**
   * Handle source change event from UI
   * Responds to SOURCE_CHANGED event emitted by FilterPanel component
   */
  handleSourceChanged({ source }) {
    // Delegate to existing setSource method
    this.setSource(source)
  }

  /**
   * Handle image selection event from UI
   * Responds to IMAGE_SELECTED event emitted by ImageFrame component
   */
  handleImageSelected(imageData) {
    // Delegate to existing setSelectedImage method
    this.setSelectedImage(imageData)
  }

  /**
   * Handle image deselection event from UI
   * Responds to IMAGE_DESELECTED event emitted by DetailOverlay component
   */
  handleImageDeselected() {
    // Clear selected image
    this.setSelectedImage(null)
  }
}

// ---------------------------------------------------------------------------
// SINGLETON EXPORT
// ---------------------------------------------------------------------------

// Create singleton instance
const appStateManager = new AppStateManager()

export default appStateManager
