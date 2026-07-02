/**
 * DeepLinkManager.js
 *
 * Singleton manager for the permanent, always-on deep-linking feature.
 * Parses /patient URLs and orchestrates the detail overlay and image
 * viewer without going through the normal carousel interaction flow.
 *
 * URL patterns:
 *   /patient/:patientId/:bodyArea        — Opens detail overlay for patient
 *   /patient/:patientId/:bodyArea/:index  — Opens detail overlay + image viewer at index
 *
 * When active, sets a global flag that prevents normal events
 * (FILTER_CHANGED, IMAGES_UPDATED) from clearing the selected image.
 */

import { DATA_SOURCE_KEY, IMAGE_FIELDS, ASSETS, FILTER_KEYS, FILTER_DEFINITIONS, PATIENT_SCHEMA, ROUTES } from '../constants/index.js'
import eventSystem, { EventSystem } from '../utils/EventSystem.js'
import { splitPatientData } from '../utils/patientDataSplitter.js'
import filterManager from './FilterManager.js'

// ---------------------------------------------------------------------------
// CLASS DEFINITION
// ---------------------------------------------------------------------------

class DeepLinkManager {
  constructor() {
    this.isDeepLinkActive = false
    this.patientId = null
    this.bodyArea = null
    this.imageIndex = null // null = overlay only, number = also open image viewer
    this.patientData = null // cached on DATA_LOADED so hashchange links can activate

    // A hash-only URL change is a same-document navigation (no reload), so the
    // startup parse in App.jsx never re-runs. Listen for it so deep links work
    // when pasted into a running tab or set on the iframe by the RAMP host.
    eventSystem.on(EventSystem.EVENTS.DATA_LOADED, ({ data }) => {
      this.patientData = data
    })
    window.addEventListener('hashchange', () => this.handleHashChange())

    // While a deep link is active, keep the URL bar honest as the user moves
    // around or out of the deep-linked view. history.replaceState fires no
    // hashchange, so these cosmetic rewrites never re-trigger activation.
    eventSystem.on(EventSystem.EVENTS.IMAGE_VIEWER_OPENED, payload => {
      if (this.isDeepLinkActive) this.updateHashIndex(payload?.index ?? null)
    })
    eventSystem.on(EventSystem.EVENTS.IMAGE_VIEWER_NAVIGATED, payload => {
      if (this.isDeepLinkActive) this.updateHashIndex(payload?.index ?? null)
    })
    eventSystem.on(EventSystem.EVENTS.IMAGE_VIEWER_CLOSED, () => {
      if (this.isDeepLinkActive) this.updateHashIndex(null)
    })
    eventSystem.on(EventSystem.EVENTS.IMAGE_SELECTED, payload => {
      if (this.isDeepLinkActive && payload?.patient) this.retarget(payload.patient)
    })
    eventSystem.on(EventSystem.EVENTS.IMAGE_DESELECTED, payload => {
      if (this.isDeepLinkActive) this.exit(payload?.source === 'user')
    })
  }

  // ---------------------------------------------------------------------------
  // URL SYNC (active deep-link session only)
  // ---------------------------------------------------------------------------

  // Rewrite the hash without navigating (no hashchange event, no router remount)
  replaceHash(path) {
    history.replaceState(null, '', `${window.location.pathname}${window.location.search}#${path}`)
  }

  patientPath() {
    const idSlug = encodeURIComponent(this.patientId)
    const bodySlug = this.bodyArea.toLowerCase().replace(/ /g, '-')
    return `${ROUTES.PATIENT}/${idSlug}/${bodySlug}`
  }

  // Reflect the viewer's state in the URL's index segment (null = overlay only)
  updateHashIndex(index) {
    this.imageIndex = index
    this.replaceHash(index !== null ? `${this.patientPath()}/${index}` : this.patientPath())
  }

  // The overlay switched patient or body area (e.g. BodyAreaSelector tab)
  retarget(patient) {
    const samePatient = (patient.patientId || '').toLowerCase() === this.patientId.toLowerCase()
    const sameBody = (patient.bodyArea || '').toLowerCase() === this.bodyArea.toLowerCase()
    if (samePatient && sameBody) return

    this.patientId = patient.patientId
    this.bodyArea = patient.bodyArea
    this.imageIndex = null
    this.replaceHash(this.patientPath())
  }

  /**
   * End the deep-link session: the deep link was the jump-in point, so moving
   * out of it returns the URL to /main. An explicit user close also resets the
   * filters that were quietly set for the deep-linked patient. A filter-driven
   * deselect keeps them: the user's own filter click defines the new state.
   */
  exit(userClosed) {
    this.isDeepLinkActive = false
    this.patientId = null
    this.bodyArea = null
    this.imageIndex = null
    this.replaceHash(ROUTES.MAIN)

    // Full pipeline (availability, carousel refresh), but a direct call rather
    // than FILTERS_RESET_REQUESTED: a system reset is not a user intent and
    // must not reach RAMP analytics.
    if (userClosed) filterManager.handleResetRequested()
  }

  /**
   * Re-parse the URL on a runtime hash change and activate any patient link.
   * A non-patient hash deactivates deep-link mode.
   */
  handleHashChange() {
    if (!this.parseUrl()) return
    if (this.patientData) this.activate(this.patientData)
  }

  // ---------------------------------------------------------------------------
  // URL PARSING
  // ---------------------------------------------------------------------------

  /**
   * Parse the current URL to check for a patient deep link.
   * Expected format: /patient/:patientId/:bodyArea[/:imageIndex]
   * Body area in URL uses hyphens (e.g., "antecubital-fossa") which we
   * normalise to match the JSON data (e.g., "Antecubital Fossa").
   *
   * @returns {boolean} True if a patient deep link URL was detected
   */
  parseUrl() {
    // HashRouter puts the path in the hash fragment — strip the leading '#'
    const path = window.location.hash.replace(/^#/, '')
    const match = path.match(/^\/patient\/([^/]+)\/([^/]+)(?:\/(\d+))?$/)

    if (!match) {
      // Keep state true to the current URL — navigating away from a patient
      // link ends deep-link mode (and its overlay-close suppression)
      this.isDeepLinkActive = false
      this.patientId = null
      this.bodyArea = null
      this.imageIndex = null
      return false
    }

    this.isDeepLinkActive = true
    this.patientId = decodeURIComponent(match[1])
    // Convert URL-friendly body area back to title case with spaces
    // e.g., "antecubital-fossa" → "Antecubital Fossa"
    // e.g., "ear-&-scalp" → "Ear & Scalp"
    this.bodyArea = decodeURIComponent(match[2])
      .split('-')
      .map(word => {
        if (word === '&') return '&'
        return word.charAt(0).toUpperCase() + word.slice(1)
      })
      .join(' ')
    this.imageIndex = match[3] !== undefined ? parseInt(match[3], 10) : null

    console.log('[DeepLinkManager] Deep link active:', {
      patientId: this.patientId,
      bodyArea: this.bodyArea,
      imageIndex: this.imageIndex
    })

    return true
  }

  // ---------------------------------------------------------------------------
  // PATIENT LOOKUP
  // ---------------------------------------------------------------------------

  /**
   * Find the matching patient in iCVA 2.1 data.
   * Matches on patientId and bodyArea (case-insensitive).
   *
   * @param {Object} patientData - The full patient_data.json object
   * @returns {Object|null} The matching patient record
   */
  findPatient(patientData) {
    const patients = patientData[DATA_SOURCE_KEY] || []
    const targetId = this.patientId.toLowerCase()
    const targetBody = this.bodyArea.toLowerCase()

    // Handle "&" in body area (URL uses "and" separator via hyphen: "ear-&-scalp" or "scalp-and-ear")
    return patients.find(p => {
      const pId = (p.patientId || '').toLowerCase()
      const pBody = (p.bodyArea || '').toLowerCase()
      return pId === targetId && pBody === targetBody
    })
  }

  // ---------------------------------------------------------------------------
  // ACTIVATION
  // ---------------------------------------------------------------------------

  /**
   * Activate the deep link after data has loaded.
   * Finds the patient, sets the source to Clinical Trial, emits IMAGE_SELECTED,
   * and optionally opens the image viewer.
   *
   * @param {Object} patientData - The full patient_data.json object
   */
  activate(patientData) {
    if (!this.isDeepLinkActive) return

    const patient = this.findPatient(patientData)

    if (!patient) {
      console.error('[DeepLinkManager] Patient not found:', this.patientId, this.bodyArea)
      console.log('[DeepLinkManager] Available patients:')
      const patients = patientData[DATA_SOURCE_KEY] || []
      patients.forEach(p => console.log(`  ${p.patientId} / ${p.bodyArea}`))
      return
    }

    console.log('[DeepLinkManager] Found patient:', patient.patientId, patient.bodyArea)

    // Build the imageData object that IMAGE_SELECTED expects
    // (same shape as DataManager.getFirstValidImage)
    let firstImageField = null
    for (const field of IMAGE_FIELDS) {
      if (patient[field] && patient[field].trim() !== '') {
        firstImageField = field
        break
      }
    }

    if (!firstImageField) {
      console.error('[DeepLinkManager] Patient has no images')
      return
    }

    const imageData = {
      imagePath: `${ASSETS.PATIENTS_PATH}${patient[firstImageField]}`,
      field: firstImageField,
      patient: patient
    }

    // Small delay to let app initialise, then select the image
    setTimeout(() => {
      // Highlight matching filters in the UI without triggering events
      this.setFiltersFromPatient(patient)

      eventSystem.emit(EventSystem.EVENTS.IMAGE_SELECTED, imageData)

      // If an image index was specified, open the image viewer after overlay renders
      if (this.imageIndex !== null) {
        this.openImageViewer(patient, this.imageIndex)
      }
    }, 100)
  }

  /**
   * Open the image viewer at the specified index.
   * Uses the same splitPatientData logic as the overlay components.
   *
   * @param {Object} patient - Patient record
   * @param {number} index - Timepoint index to display
   */
  openImageViewer(patient, index) {
    const { timepoints } = splitPatientData(patient)

    if (index >= timepoints.length) {
      console.warn(`[DeepLinkManager] Image index ${index} out of range (max ${timepoints.length - 1})`)
      index = timepoints.length - 1
    }

    // Small delay to let the overlay render first
    setTimeout(() => {
      eventSystem.emit(EventSystem.EVENTS.IMAGE_VIEWER_OPENED, { timepoints, index })
    }, 200)
  }

  // ---------------------------------------------------------------------------
  // FILTER HIGHLIGHTING
  // ---------------------------------------------------------------------------

  /**
   * Set filter selections to match the deep-linked patient's data.
   * Uses FILTER_DEFINITIONS to find the correct option index for each field.
   * Calls filterManager.setFiltersQuietly() — no events fired, just UI highlighting.
   *
   * @param {Object} patient - Patient record from iCVA 2.1 data
   */
  setFiltersFromPatient(patient) {
    const wrap = (index) => index !== null ? [index] : []
    const filterValues = {}

    // Indication — match patient.condition against options[].value
    filterValues[FILTER_KEYS.INDICATION] = wrap(this.findOptionIndex(
      FILTER_KEYS.INDICATION, patient[PATIENT_SCHEMA.INDICATION]
    ))

    // Formulation — match patient.formulation against options[].value
    filterValues[FILTER_KEYS.FORMULATION] = wrap(this.findOptionIndex(
      FILTER_KEYS.FORMULATION, patient[PATIENT_SCHEMA.FORMULATION]
    ))

    // Body Area — match bodyAreaSimple, plus "Multiple body parts" if multiBodyArea is true
    const bodyAreaIndices = []
    const bodyAreaSimpleIndex = this.findOptionIndex(FILTER_KEYS.BODY_AREA, patient[PATIENT_SCHEMA.BODY_AREA_SIMPLE])
    if (bodyAreaSimpleIndex !== null) bodyAreaIndices.push(bodyAreaSimpleIndex)

    if (patient[PATIENT_SCHEMA.MULTI_BODY_AREA] === true) {
      const multiIndex = FILTER_DEFINITIONS[FILTER_KEYS.BODY_AREA].options
        .findIndex(opt => opt.matchField === PATIENT_SCHEMA.MULTI_BODY_AREA)
      if (multiIndex !== -1) bodyAreaIndices.push(multiIndex)
    }
    filterValues[FILTER_KEYS.BODY_AREA] = bodyAreaIndices

    // Baseline Severity — match patient.baselineSeverity against options[].value
    filterValues[FILTER_KEYS.BASELINE_SEVERITY] = wrap(this.findOptionIndex(
      FILTER_KEYS.BASELINE_SEVERITY, patient[PATIENT_SCHEMA.BASELINE_SEVERITY]
    ))

    // Age — find which age range the patient falls into
    const age = patient[PATIENT_SCHEMA.AGE]
    if (typeof age === 'number' && !isNaN(age)) {
      const ageOptions = FILTER_DEFINITIONS[FILTER_KEYS.AGE].options
      const ageIndex = ageOptions.findIndex(opt => age >= opt.min && age <= opt.max)
      filterValues[FILTER_KEYS.AGE] = ageIndex !== -1 ? [ageIndex] : []
    } else {
      filterValues[FILTER_KEYS.AGE] = []
    }

    // Gender — match patient.gender against options[].value (M/F)
    filterValues[FILTER_KEYS.GENDER] = wrap(this.findOptionIndex(
      FILTER_KEYS.GENDER, patient[PATIENT_SCHEMA.GENDER]
    ))

    console.log('[DeepLinkManager] Setting filters:', filterValues)
    filterManager.setFiltersQuietly(filterValues)
  }

  /**
   * Find the index of a filter option matching a patient field value.
   * Uses case-insensitive trimmed comparison for robustness.
   *
   * @param {string} filterKey - FILTER_KEYS constant
   * @param {string} value - Patient data value to match
   * @returns {number|null} Option index, or null if not found
   */
  findOptionIndex(filterKey, value) {
    if (!value) return null
    const trimmed = String(value).trim().toLowerCase()
    const options = FILTER_DEFINITIONS[filterKey].options
    const index = options.findIndex(opt => {
      const optVal = (opt.value || '').toLowerCase()
      return optVal === trimmed
    })
    return index !== -1 ? index : null
  }

  // ---------------------------------------------------------------------------
  // PUBLIC API
  // ---------------------------------------------------------------------------

  getIsDeepLinkActive() {
    return this.isDeepLinkActive
  }
}

// ---------------------------------------------------------------------------
// SINGLETON EXPORT
// ---------------------------------------------------------------------------

const deepLinkManager = new DeepLinkManager()

export default deepLinkManager
