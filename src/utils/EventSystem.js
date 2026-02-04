/**
 * EventSystem.js
 *
 * Simple pub/sub event system for decoupled component communication
 * Provides a centralized event bus for app-wide state change notifications
 * Used throughout the app to coordinate between managers, filters, and UI components
 */

// ─────────────────────────────────────────────────────────────────────────────
// EVENT SYSTEM CLASS
// ─────────────────────────────────────────────────────────────────────────────

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
  // #region Initialization
  constructor() {
    // Storage for event listeners: { eventName: [callback1, callback2, ...] }
    this.events = {}
  }
  // #endregion

  // ───────────────────────────────────────────────────────────────────────────

  // #region Event Constants
  /**
   * Centralized event name constants to prevent typos and provide autocomplete
   * Used across the application for consistent event naming
   */
  static EVENTS = {
    // Filter events
    CATEGORY_CHANGED: 'categoryChanged',      // Data source tab changed (Clinical Trial / Practice-Based)
    FILTER_CHANGED: 'filterChanged',          // Individual filter value changed
    FILTERS_RESET: 'filtersReset',            // All filters reset to defaults

    // Image/carousel events
    IMAGE_CLICKED: 'imageClicked',            // User clicked on carousel image
    IMAGES_UPDATED: 'imagesUpdated',          // Filtered images list changed

    // App lifecycle events
    DATA_LOADED: 'dataLoaded',                // Patient data finished loading
    APP_STATE_CHANGED: 'appStateChanged',     // App state changed (loading/intro/main)
  }
  // #endregion

  // ───────────────────────────────────────────────────────────────────────────

  // #region Public API - Subscription
  /**
   * Subscribe to an event
   *
   * Registers a callback function to be called when the specified event is emitted.
   * Multiple callbacks can be registered for the same event.
   *
   * @param {string} eventName - Name of the event to subscribe to
   * @param {Function} callback - Function to call when event is emitted
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
   * Removes a callback from the event listener list. If no callback is provided,
   * removes all listeners for that event.
   *
   * @param {string} eventName - Name of the event to unsubscribe from
   * @param {Function} [callback] - Specific callback to remove (optional)
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
  // #endregion

  // ───────────────────────────────────────────────────────────────────────────

  // #region Public API - Emission
  /**
   * Emit an event
   *
   * Calls all registered callbacks for the specified event with the provided data.
   * Each callback is wrapped in a try/catch to prevent errors in one handler from
   * affecting others.
   *
   * @param {string} eventName - Name of the event to emit
   * @param {*} data - Data to pass to event handlers
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
  // #endregion

  // ───────────────────────────────────────────────────────────────────────────

  // #region Public API - Cleanup
  /**
   * Remove all listeners for an event (or all events)
   *
   * Useful for cleanup during app reset or unmounting.
   *
   * @param {string} [eventName] - Event to clear (if omitted, clears all events)
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
  // #endregion
}

// ─────────────────────────────────────────────────────────────────────────────
// SINGLETON INSTANCE
// ─────────────────────────────────────────────────────────────────────────────

// Create a singleton instance for app-wide use
const eventSystem = new EventSystem()

export default eventSystem
export { EventSystem }
