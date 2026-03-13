/**
 * DebugManager.js
 *
 * Singleton manager for debug mode. Parses /debug URLs and orchestrates
 * the detail overlay and image viewer without going through the normal
 * carousel interaction flow.
 *
 * URL patterns:
 *   /debug/:patientId/:bodyArea        — Opens detail overlay for patient
 *   /debug/:patientId/:bodyArea/:index  — Opens detail overlay + image viewer at index
 *
 * When active, sets a global debug flag that prevents normal events
 * (FILTER_CHANGED, IMAGES_UPDATED) from clearing the selected image.
 */

import { DATA_SOURCE, DATA_SOURCE_KEYS, ASSETS, FILTER_KEYS, FILTER_DEFINITIONS, PATIENT_SCHEMA } from '../constants/index.js'
import eventSystem, { EventSystem } from '../utils/EventSystem.js'
import { splitPatientData } from '../utils/patientDataSplitter.js'
import filterManager from './FilterManager.js'

// ---------------------------------------------------------------------------
// CLASS DEFINITION
// ---------------------------------------------------------------------------

class DebugManager {
  constructor() {
    this.isDebugMode = false
    this.patientId = null
    this.bodyArea = null
    this.imageIndex = null // null = overlay only, number = also open image viewer
  }

  // ---------------------------------------------------------------------------
  // URL PARSING
  // ---------------------------------------------------------------------------

  /**
   * Parse the current URL to check for debug mode.
   * Expected format: /debug/:patientId/:bodyArea[/:imageIndex]
   * Body area in URL uses hyphens (e.g., "antecubital-fossa") which we
   * normalise to match the JSON data (e.g., "Antecubital Fossa").
   *
   * @returns {boolean} True if debug URL was detected
   */
  parseUrl() {
    const path = window.location.pathname
    const match = path.match(/^\/debug\/([^/]+)\/([^/]+)(?:\/(\d+))?$/)

    if (!match) return false

    this.isDebugMode = true
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

    console.log('[DebugManager] Debug mode active:', {
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
    const patients = patientData[DATA_SOURCE_KEYS.CLINICAL_TRIAL] || []
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
   * Activate debug mode after data has loaded.
   * Finds the patient, sets the source to Clinical Trial, emits IMAGE_SELECTED,
   * and optionally opens the image viewer.
   *
   * @param {Object} patientData - The full patient_data.json object
   */
  activate(patientData) {
    if (!this.isDebugMode) return

    const patient = this.findPatient(patientData)

    if (!patient) {
      console.error('[DebugManager] Patient not found:', this.patientId, this.bodyArea)
      console.log('[DebugManager] Available patients:')
      const patients = patientData[DATA_SOURCE_KEYS.CLINICAL_TRIAL] || []
      patients.forEach(p => console.log(`  ${p.patientId} / ${p.bodyArea}`))
      return
    }

    console.log('[DebugManager] Found patient:', patient.patientId, patient.bodyArea)

    // Build the imageData object that IMAGE_SELECTED expects
    // (same shape as DataManager.getFirstValidImage)
    const imageFields = ['baselineImage', 'week1Image', 'week2Image', 'week3Image', 'week4Image', 'week6Image', 'week8Image', 'week52Image']
    let firstImageField = null
    for (const field of imageFields) {
      if (patient[field] && patient[field].trim() !== '') {
        firstImageField = field
        break
      }
    }

    if (!firstImageField) {
      console.error('[DebugManager] Patient has no images')
      return
    }

    const imageData = {
      imagePath: `${ASSETS.PATIENTS_PATH}${patient[firstImageField]}`,
      field: firstImageField,
      patient: patient
    }

    // Ensure source is Clinical Trial
    eventSystem.emit(EventSystem.EVENTS.SOURCE_CHANGED, { source: DATA_SOURCE.CLINICAL_TRIAL })

    // Small delay to let source change propagate, then select the image
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
    const { timepoints } = splitPatientData(patient, DATA_SOURCE.CLINICAL_TRIAL)

    if (index >= timepoints.length) {
      console.warn(`[DebugManager] Image index ${index} out of range (max ${timepoints.length - 1})`)
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
   * Set filter selections to match the debug patient's data.
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

    // Body Area — match patient.bodyAreaSimple against options[].value
    filterValues[FILTER_KEYS.BODY_AREA] = wrap(this.findOptionIndex(
      FILTER_KEYS.BODY_AREA, patient[PATIENT_SCHEMA.BODY_AREA_SIMPLE]
    ))

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

    console.log('[DebugManager] Setting filters:', filterValues)
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

  getIsDebugMode() {
    return this.isDebugMode
  }
}

// ---------------------------------------------------------------------------
// SINGLETON EXPORT
// ---------------------------------------------------------------------------

const debugManager = new DebugManager()

export default debugManager
