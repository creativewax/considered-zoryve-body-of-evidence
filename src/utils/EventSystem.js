// Simple event system
class EventSystem {
  constructor() {
    this.events = {}
  }

  // Event constants
  static EVENTS = {
    CATEGORY_CHANGED: 'categoryChanged',
    FILTER_CHANGED: 'filterChanged',
    FILTERS_RESET: 'filtersReset',
    IMAGE_CLICKED: 'imageClicked',
    IMAGES_UPDATED: 'imagesUpdated',
    DATA_LOADED: 'dataLoaded',
    APP_STATE_CHANGED: 'appStateChanged',
  }

  // Subscribe to an event
  on(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = []
    }
    this.events[eventName].push(callback)
  }

  // Unsubscribe from an event
  off(eventName, callback) {
    if (!this.events[eventName]) return
    if (!callback) {
      delete this.events[eventName]
      return
    }
    this.events[eventName] = this.events[eventName].filter(cb => cb !== callback)
  }

  // Emit an event
  emit(eventName, data) {
    if (!this.events[eventName]) return
    this.events[eventName].forEach(callback => {
      try {
        callback(data)
      } catch (error) {
        console.error(`Error in event handler for ${eventName}:`, error)
      }
    })
  }

  // Remove all listeners for an event
  clear(eventName) {
    if (eventName) {
      delete this.events[eventName]
    } else {
      this.events = {}
    }
  }
}

// Create a singleton instance
const eventSystem = new EventSystem()

export default eventSystem
export { EventSystem }
