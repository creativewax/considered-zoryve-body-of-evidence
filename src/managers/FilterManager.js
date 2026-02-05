/**
 * FilterManager.js
 *
 * Manages filter state and coordinates filter-related events
 * Extracted from AppStateManager to provide single responsibility for filter logic
 * Uses event-driven architecture for decoupled component communication
 */

import { FILTER_KEYS } from '../constants/index.js'
import eventSystem from '../utils/EventSystem.js'

// FILTER MANAGER CLASS

/**
 * FilterManager
 *
 * Centralised filter state management with event-driven updates.
 * Listens to user filter selection events from UI components and emits
 * state change events for the carousel and other listeners.
 *
 * Responsibilities:
 * - Store current filter values (condition, formulation, bodyArea, etc.)
 * - Validate and update filter state
 * - Handle filter reset logic
 * - Emit events when filters change
 *
 * @class
 */
class FilterManager {
  constructor() {
    // Initialise filter state - all filters start as null (unselected)
    this.filters = {
      [FILTER_KEYS.CONDITION]: null,
      [FILTER_KEYS.FORMULATION]: null,
      [FILTER_KEYS.BODY_AREA]: null,
      [FILTER_KEYS.BASELINE_SEVERITY]: null,
      [FILTER_KEYS.AGE]: null,
      [FILTER_KEYS.GENDER]: null,
    }

    // Listen to UI interaction events
    eventSystem.on(
      eventSystem.constructor.EVENTS.FILTER_SELECTED,
      this.handleFilterSelected.bind(this)
    )
    eventSystem.on(
      eventSystem.constructor.EVENTS.FILTERS_RESET_REQUESTED,
      this.handleResetRequested.bind(this)
    )
  }


  /**
   * Handle filter selection from UI. Responds to FILTER_SELECTED event.
   * Updates internal state and emits FILTER_CHANGED if value changed.
   * payload.filterType - Type of filter (condition, age, etc.)
   * payload.value - New filter value (null to deselect)
   */
  handleFilterSelected({ filterType, value }) {
    // Only update if value actually changed
    if (this.filters[filterType] !== value) {
      // Close any visible detail overlay BEFORE updating filters
      // This ensures the overlay closes with old data before carousel refreshes
      eventSystem.emit(eventSystem.constructor.EVENTS.IMAGE_DESELECTED)

      this.filters[filterType] = value

      // Emit filter changed event for UI updates
      eventSystem.emit(eventSystem.constructor.EVENTS.FILTER_CHANGED, {
        filterType,
        value,
        filters: { ...this.filters }
      })

      // Trigger carousel refresh with new filter state
      this.triggerUpdate()
    }
  }

  /**
   * Handle filter reset request from UI
   *
   * Responds to FILTERS_RESET_REQUESTED event emitted by reset button.
   * Resets all filters to null and emits FILTERS_RESET event.
   */
  handleResetRequested() {
    // Check if there are any active filters before resetting
    const hasActiveFilters = Object.values(this.filters).some(v => v !== null)

    // No filters active, nothing to reset
    if (!hasActiveFilters) return

    // Close any visible detail overlay BEFORE resetting filters
    // This ensures the overlay closes with old data before carousel refreshes
    eventSystem.emit(eventSystem.constructor.EVENTS.IMAGE_DESELECTED)

    // Reset all filters to null
    this.filters = {
      [FILTER_KEYS.CONDITION]: null,
      [FILTER_KEYS.FORMULATION]: null,
      [FILTER_KEYS.BODY_AREA]: null,
      [FILTER_KEYS.BASELINE_SEVERITY]: null,
      [FILTER_KEYS.AGE]: null,
      [FILTER_KEYS.GENDER]: null,
    }

    // Emit reset event for UI updates
    eventSystem.emit(eventSystem.constructor.EVENTS.FILTERS_RESET, {
      ...this.filters
    })

    // Trigger carousel refresh with cleared filters
    this.triggerUpdate()
  }

  /**
   * Trigger carousel update with current filter state
   *
   * Emits IMAGES_UPDATED event to signal that filtered images should be refreshed.
   * This event is consumed by useCarouselManager hook.
   */
  triggerUpdate() {
    eventSystem.emit(eventSystem.constructor.EVENTS.IMAGES_UPDATED, {
      ...this.filters
    })
  }


  /**
   * Get all current filter values (copy to prevent external mutation).
   */
  getFilters() {
    return { ...this.filters }
  }

  /**
   * Get a specific filter value. filterType - Type of filter to get. Returns null if not set.
   */
  getFilter(filterType) {
    return this.filters[filterType]
  }

  /**
   * Check if any filters are currently active.
   */
  hasActiveFilters() {
    return Object.values(this.filters).some(v => v !== null)
  }

  /**
   * Reset all filters programmatically
   *
   * This method can be called directly by other managers or hooks.
   * Also available via FILTERS_RESET_REQUESTED event from UI.
   */
  reset() {
    this.handleResetRequested()
  }
}

// SINGLETON EXPORT

// Create singleton instance
const filterManager = new FilterManager()

export default filterManager
