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
    this.listeners = new Set()

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
    eventSystem.on(
      eventSystem.constructor.EVENTS.FILTER_CHANGED,
      this.handleFilterChanged.bind(this)
    )
    eventSystem.on(
      eventSystem.constructor.EVENTS.IMAGES_UPDATED,
      this.handleImagesUpdated.bind(this)
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
      this.notifyListeners()
    }
  }

  // Get current application state
  getState() {
    return this.currentState
  }

  // ---------------------------------------------------------------------------
  // DATA SOURCE MANAGEMENT
  // ---------------------------------------------------------------------------

  // Store data source and notify subscribers
  setSource(source) {
    if (this.currentSource !== source) {
      this.currentSource = source
      this.notifyListeners()
    }
  }

  // Get current data source
  getSource() {
    return this.currentSource
  }

  // ---------------------------------------------------------------------------
  // IMAGE SELECTION
  // ---------------------------------------------------------------------------

  // Store selected image and notify subscribers
  setSelectedImage(imageData) {
    this.selectedImage = imageData
    this.notifyListeners()
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
    this.setSelectedImage(null)
  }

  /**
   * Handle filter changed — clear selected image (overlay closes on filter change)
   */
  handleFilterChanged() {
    this.setSelectedImage(null)
  }

  /**
   * Handle images updated — clear selected image (overlay closes when image pool changes)
   */
  handleImagesUpdated() {
    this.setSelectedImage(null)
  }

  // ---------------------------------------------------------------------------
  // SUBSCRIPTION (same pattern as PoolManager / RotationStateManager)
  // ---------------------------------------------------------------------------

  subscribe(callback) {
    this.listeners.add(callback)
    return () => this.listeners.delete(callback)
  }

  notifyListeners() {
    this.listeners.forEach(cb => {
      try { cb() } catch (e) { console.error('AppStateManager:', e) }
    })
  }
}

// ---------------------------------------------------------------------------
// SINGLETON EXPORT
// ---------------------------------------------------------------------------

// Create singleton instance
const appStateManager = new AppStateManager()

export default appStateManager
