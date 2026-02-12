/**
 * FilterManager.js
 *
 * Manages filter state and coordinates filter-related events
 * Extracted from AppStateManager to provide single responsibility for filter logic
 * Uses event-driven architecture for decoupled component communication
 */

import { FILTER_KEYS } from '../constants/index.js'
import eventSystem, { EventSystem } from '../utils/EventSystem.js'
import dataManager from './DataManager.js'
import appStateManager from './AppStateManager.js'

// ---------------------------------------------------------------------------
// CLASS DEFINITION
// ---------------------------------------------------------------------------

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
  // ---------------------------------------------------------------------------
  // INITIALISATION
  // ---------------------------------------------------------------------------

  constructor() {
    // Initialise filter state - all filters start as null (unselected)
    this.filters = {
      [FILTER_KEYS.INDICATION]: null,
      [FILTER_KEYS.FORMULATION]: null,
      [FILTER_KEYS.BODY_AREA]: null,
      [FILTER_KEYS.BASELINE_SEVERITY]: null,
      [FILTER_KEYS.AGE]: null,
      [FILTER_KEYS.GENDER]: null,
    }

    // Initialise availability with empty sets
    this.availability = {
      [FILTER_KEYS.INDICATION]: new Set(),
      [FILTER_KEYS.FORMULATION]: new Set(),
      [FILTER_KEYS.BODY_AREA]: new Set(),
      [FILTER_KEYS.BASELINE_SEVERITY]: new Set(),
      [FILTER_KEYS.AGE]: new Set(),
      [FILTER_KEYS.GENDER]: new Set(),
    }

    this.listeners = new Set()

    // Listen to UI interaction events
    eventSystem.on(
      EventSystem.EVENTS.FILTER_SELECTED,
      this.handleFilterSelected.bind(this)
    )
    eventSystem.on(
      EventSystem.EVENTS.FILTERS_RESET_REQUESTED,
      this.handleResetRequested.bind(this)
    )
    eventSystem.on(
      EventSystem.EVENTS.SOURCE_CHANGED,
      this.handleSourceChanged.bind(this)
    )
    // Listen to data loading event to calculate initial availability
    eventSystem.on(
      EventSystem.EVENTS.DATA_LOADED,
      this.handleDataLoaded.bind(this)
    )
  }

  // ---------------------------------------------------------------------------
  // EVENT HANDLERS
  // ---------------------------------------------------------------------------

  /**
   * Handle data loaded event
   * Calculate initial filter availability when patient data loads
   */
  handleDataLoaded() {
    this.updateAvailability()
  }

  /**
   * Handle data source change (Clinical Trial <-> Practice-Based)
   * Recalculates filter availability for new dataset
   * @param {Object} payload - Event payload containing source
   * @param {string} payload.source - New data source
   */
  handleSourceChanged({ source }) {
    // Small delay to let React finish rendering before updating availability
    setTimeout(() => {
      this.updateAvailability(source)
    }, 50)
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
      eventSystem.emit(EventSystem.EVENTS.FILTER_CHANGED, {
        filterType,
        value,
        filters: { ...this.filters }
      })

      // Update filter availability and trigger carousel refresh
      this.updateAvailability()
      this.triggerUpdate()
      this.notifyListeners()
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
      [FILTER_KEYS.INDICATION]: null,
      [FILTER_KEYS.FORMULATION]: null,
      [FILTER_KEYS.BODY_AREA]: null,
      [FILTER_KEYS.BASELINE_SEVERITY]: null,
      [FILTER_KEYS.AGE]: null,
      [FILTER_KEYS.GENDER]: null,
    }

    // Emit reset event for UI updates
    eventSystem.emit(EventSystem.EVENTS.FILTERS_RESET, {
      ...this.filters
    })

    // Update filter availability and trigger carousel refresh
    this.updateAvailability()
    this.triggerUpdate()
    this.notifyListeners()
  }

  // ---------------------------------------------------------------------------
  // UPDATE METHODS
  // ---------------------------------------------------------------------------

  /**
   * Trigger carousel update with current filter state
   *
   * Emits IMAGES_UPDATED event to signal that filtered images should be refreshed.
   * This event is consumed by useCarouselManager hook.
   */
  triggerUpdate() {
    eventSystem.emit(EventSystem.EVENTS.IMAGES_UPDATED, {
      ...this.filters
    })
  }

  /**
   * Update filter availability based on current filter state
   * Calculates which filter options would yield results and emits availability map
   * @param {string} [sourceOverride] - Optional source to use instead of getting from AppStateManager
   */
  updateAvailability(sourceOverride) {
    const source = sourceOverride || appStateManager.getSource()
    const filtersWithSource = { ...this.filters, source }

    // Calculate available options for each filter type
    this.availability = {
      [FILTER_KEYS.INDICATION]: dataManager.getAvailableFilterOptions(filtersWithSource, FILTER_KEYS.INDICATION),
      [FILTER_KEYS.FORMULATION]: dataManager.getAvailableFilterOptions(filtersWithSource, FILTER_KEYS.FORMULATION),
      [FILTER_KEYS.BODY_AREA]: dataManager.getAvailableFilterOptions(filtersWithSource, FILTER_KEYS.BODY_AREA),
      [FILTER_KEYS.BASELINE_SEVERITY]: dataManager.getAvailableFilterOptions(filtersWithSource, FILTER_KEYS.BASELINE_SEVERITY),
      [FILTER_KEYS.AGE]: dataManager.getAvailableFilterOptions(filtersWithSource, FILTER_KEYS.AGE),
      [FILTER_KEYS.GENDER]: dataManager.getAvailableFilterOptions(filtersWithSource, FILTER_KEYS.GENDER),
    }

    // Emit to components and notify subscribers
    eventSystem.emit(EventSystem.EVENTS.FILTER_AVAILABILITY_CHANGED, this.availability)
    this.notifyListeners()
  }

  // ---------------------------------------------------------------------------
  // PUBLIC API
  // ---------------------------------------------------------------------------

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

  // ---------------------------------------------------------------------------
  // SUBSCRIPTION (same pattern as PoolManager / RotationStateManager)
  // ---------------------------------------------------------------------------

  subscribe(callback) {
    this.listeners.add(callback)
    return () => this.listeners.delete(callback)
  }

  notifyListeners() {
    this.listeners.forEach(cb => {
      try { cb() } catch (e) { console.error('FilterManager:', e) }
    })
  }
}

// ---------------------------------------------------------------------------
// SINGLETON EXPORT
// ---------------------------------------------------------------------------

// Create singleton instance
const filterManager = new FilterManager()

export default filterManager
