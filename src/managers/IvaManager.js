/**
 * IvaManager.js
 *
 * Singleton manager that reports user interactions to the RAMP IVA host.
 * Subscribes to every user-intent event on eventSystem and forwards each
 * one to iva.analytics.trackEvent() via the vendored postMessage SDK, using
 * the RAMP-facing ANALYTICS_EVENTS taxonomy rather than internal event names.
 * Also exposes goBack() for the app's global close button.
 */

import { iva } from '../vendor/ramp-iva-sdk.mjs'
import eventSystem, { EventSystem } from '../utils/EventSystem.js'
import { ANALYTICS_EVENTS } from '../constants/analytics.js'
import { getFilterDisplay } from '../constants/index.js'

class IvaManager {
  constructor() {
    // Cached patientId of the currently open detail overlay, if any. Powers
    // the deselect bug fix and the description for viewer sub-events, since
    // reading AppStateManager at handler time would be racy.
    this.selectedPatientId = null

    eventSystem.on(EventSystem.EVENTS.GET_STARTED_SELECTED, () =>
      this.report(ANALYTICS_EVENTS.GET_STARTED))

    // FILTER_CHANGED (not FILTER_SELECTED) so the resulting state is known:
    // a click is a toggle, and RAMP distinguishes select from deselect.
    // Quiet filter-setting (deep links) never emits it, so no phantom events.
    eventSystem.on(EventSystem.EVENTS.FILTER_CHANGED, payload =>
      this.report(
        payload.selected ? ANALYTICS_EVENTS.FILTER_SELECTED : ANALYTICS_EVENTS.FILTER_DESELECTED,
        `${payload.filterType}: ${getFilterDisplay(payload.filterType, payload.clickedValue)}`))

    eventSystem.on(EventSystem.EVENTS.FILTERS_RESET_REQUESTED, () =>
      this.report(ANALYTICS_EVENTS.FILTERS_RESET))

    eventSystem.on(EventSystem.EVENTS.NAVIGATION_REQUESTED, payload =>
      this.report(ANALYTICS_EVENTS.CAROUSEL_NAVIGATION, payload?.direction))

    eventSystem.on(EventSystem.EVENTS.IMAGE_SELECTED, payload => this.handleImageSelected(payload))
    eventSystem.on(EventSystem.EVENTS.IMAGE_DESELECTED, () => this.handleImageDeselected())

    eventSystem.on(EventSystem.EVENTS.IMAGE_VIEWER_OPENED, payload =>
      this.report(ANALYTICS_EVENTS.PATIENT_IMAGE_SELECTED, this.selectedPatientId, payload?.index))

    eventSystem.on(EventSystem.EVENTS.IMAGE_VIEWER_NAVIGATED, payload =>
      this.report(ANALYTICS_EVENTS.PATIENT_IMAGE_NAVIGATION, this.selectedPatientId, payload?.index))

    eventSystem.on(EventSystem.EVENTS.IMAGE_VIEWER_CLOSED, () =>
      this.report(ANALYTICS_EVENTS.PATIENT_IMAGE_CLOSED, this.selectedPatientId))

    eventSystem.on(EventSystem.EVENTS.REFERENCES_OPENED, () =>
      this.report(ANALYTICS_EVENTS.REFERENCES_OPENED))

    eventSystem.on(EventSystem.EVENTS.REFERENCES_CLOSED, () =>
      this.report(ANALYTICS_EVENTS.REFERENCES_CLOSED))

    eventSystem.on(EventSystem.EVENTS.ISI_TOGGLED, payload =>
      this.report(payload?.isOpen ? ANALYTICS_EVENTS.ISI_OPENED : ANALYTICS_EVENTS.ISI_CLOSED))

    eventSystem.on(EventSystem.EVENTS.APP_CLOSE_REQUESTED, () =>
      this.report(ANALYTICS_EVENTS.APP_CLOSED))
  }

  // ---------------------------------------------------------------------------
  // EVENT HANDLERS WITH SELECTED-PATIENT STATE
  // ---------------------------------------------------------------------------

  handleImageSelected(payload) {
    this.selectedPatientId = payload?.patient?.patientId ?? null
    this.report(ANALYTICS_EVENTS.PATIENT_SELECTED, this.selectedPatientId)
  }

  // FilterManager emits IMAGE_DESELECTED on every filter change, even when no
  // overlay is open. Only report a genuine deselect when a patient was cached.
  handleImageDeselected() {
    if (!this.selectedPatientId) return

    this.report(ANALYTICS_EVENTS.PATIENT_DESELECTED, this.selectedPatientId)
    this.selectedPatientId = null
  }

  // ---------------------------------------------------------------------------
  // REPORTING
  // ---------------------------------------------------------------------------

  // Forward a single event to the RAMP host as a trackEvent postMessage
  report(type, description, id) {
    iva.analytics.trackEvent(type, description, id === undefined ? undefined : String(id))
  }

  // Exit back to the RAMP host (called by the global close button)
  goBack() {
    iva.navigate.goBack()
  }
}

// ---------------------------------------------------------------------------
// SINGLETON EXPORT
// ---------------------------------------------------------------------------

const ivaManager = new IvaManager()

export default ivaManager
