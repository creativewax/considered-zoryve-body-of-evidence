// AppStateManager - singleton for global application state

import { APP_STATE } from '../constants/index.js'
import eventSystem from '../utils/EventSystem.js'
import debugManager from './DebugManager.js'

// ---------------------------------------------------------------------------
// CLASS DEFINITION
// ---------------------------------------------------------------------------

class AppStateManager {
  // ---------------------------------------------------------------------------
  // INITIALISATION
  // ---------------------------------------------------------------------------

  constructor() {
    this.currentState = APP_STATE.LOADING
    this.selectedImage = null
    this.listeners = new Set()

    // Listen to UI interaction events (event-driven architecture)
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

  handleImageSelected(imageData) {
    this.setSelectedImage(imageData)
  }

  handleImageDeselected() {
    this.setSelectedImage(null)
  }

  /**
   * Handle filter changed — clear selected image (overlay closes on filter change)
   * In debug mode, the selected image is preserved so the overlay stays open.
   */
  handleFilterChanged() {
    if (debugManager.getIsDebugMode()) return
    this.setSelectedImage(null)
  }

  /**
   * Handle images updated — clear selected image (overlay closes when image pool changes)
   * In debug mode, the selected image is preserved so the overlay stays open.
   */
  handleImagesUpdated() {
    if (debugManager.getIsDebugMode()) return
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

const appStateManager = new AppStateManager()

export default appStateManager
