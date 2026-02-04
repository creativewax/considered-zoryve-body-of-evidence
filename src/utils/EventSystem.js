/**
 * EventSystem.js
 *
 * Simple pub/sub event system for decoupled component communication
 * Provides a centralised event bus for app-wide state change notifications
 * Used throughout the app to coordinate between managers, filters, and UI components
 */

// ---------------------------------------------------------------------------
// EVENT SYSTEM CLASS
// ---------------------------------------------------------------------------

/**
 * EventSystem
 *
 * Lightweight publish/subscribe event system for managing cross-component communication.
 * Allows components to subscribe to events, emit events, and unsubscribe when needed.
 * All callbacks are wrapped in try/catch to prevent one handler from breaking others.
 *
 * @class
 * @example
 * // Subscribe to an event
 * eventSystem.on(eventSystem.constructor.EVENTS.FILTER_CHANGED, handleFilterChange)
 *
 * // Emit an event with data
 * eventSystem.emit(eventSystem.constructor.EVENTS.FILTER_CHANGED, { filterType: 'age', value: '19-30' })
 *
 * // Unsubscribe from an event
 * eventSystem.off(eventSystem.constructor.EVENTS.FILTER_CHANGED, handleFilterChange)
 */
class EventSystem {
  constructor() {
    // Storage for event listeners: { eventName: [callback1, callback2, ...] }
    this.events = {}
  }


  /**
   * Centralised event name constants to prevent typos and provide autocomplete
   * Used across the application for consistent event naming
   *
   * Naming convention:
   * - Past tense (e.g., filterChanged) - State HAS changed (emitted by managers)
   * - Present/request (e.g., filterSelected) - User IS requesting action (emitted by components)
   */
  static EVENTS = {
    // User interaction events (requests from UI components)
    FILTER_SELECTED: 'filterSelected',               // User clicked filter button
    FILTERS_RESET_REQUESTED: 'filtersResetRequested', // User clicked reset button
    SOURCE_CHANGED: 'sourceChanged',                 // User changed data source tab
    IMAGE_SELECTED: 'imageSelected',                 // User clicked carousel image
    IMAGE_DESELECTED: 'imageDeselected',             // User closed detail overlay
    NAVIGATION_REQUESTED: 'navigationRequested',     // User clicked nav arrow

    // Manager state change events (notifications from managers)
    CATEGORY_CHANGED: 'categoryChanged',      // Data source tab changed (Clinical Trial / Practice-Based)
    FILTER_CHANGED: 'filterChanged',          // Individual filter value changed
    FILTERS_RESET: 'filtersReset',            // All filters reset to defaults
    IMAGE_CLICKED: 'imageClicked',            // Selected image changed
    IMAGES_UPDATED: 'imagesUpdated',          // Filtered images list changed

    // App lifecycle events
    DATA_LOADED: 'dataLoaded',                // Patient data finished loading
    IMAGES_READY: 'imagesReady',              // All thumbnail images preloaded
    APP_STATE_CHANGED: 'appStateChanged',     // App state changed (loading/intro/main)
  }


  /**
   * Subscribe to an event
   *
   * Registers a callback for when the event is emitted. Multiple callbacks allowed per event.
   * eventName - Event to subscribe to, callback - Function to call
   */
  on(eventName, callback) {
    // Create array for this event if it doesn't exist
    if (!this.events[eventName]) {
      this.events[eventName] = []
    }

    // Add callback to list of listeners
    this.events[eventName].push(callback)
  }

  /**
   * Unsubscribe from an event
   *
   * Removes a callback, or all listeners for the event if callback omitted.
   * eventName - Event to unsubscribe from, callback - Optional specific callback
   */
  off(eventName, callback) {
    // Event doesn't exist, nothing to remove
    if (!this.events[eventName]) return

    // No callback specified: remove all listeners for this event
    if (!callback) {
      delete this.events[eventName]
      return
    }

    // Remove specific callback from listener list
    this.events[eventName] = this.events[eventName].filter(cb => cb !== callback)
  }


  /**
   * Emit an event
   *
   * Calls all registered callbacks for the event with the provided data (try/catch per handler).
   * eventName - Event to emit, data - Payload for handlers
   */
  emit(eventName, data) {
    // No listeners registered for this event
    if (!this.events[eventName]) return

    // Call each registered callback with the event data
    this.events[eventName].forEach(callback => {
      try {
        callback(data)
      } catch (error) {
        // Log error but continue calling other handlers
        console.error(`Error in event handler for ${eventName}:`, error)
      }
    })
  }


  /**
   * Remove all listeners for an event (or all events)
   *
   * eventName - Event to clear, or omit to clear all events.
   */
  clear(eventName) {
    if (eventName) {
      // Clear specific event
      delete this.events[eventName]
    } else {
      // Clear all events
      this.events = {}
    }
  }
}

// SINGLETON INSTANCE

// Create a singleton instance for app-wide use
const eventSystem = new EventSystem()

export default eventSystem
export { EventSystem }
