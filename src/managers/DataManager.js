// DataManager - singleton for patient data loading and filtering

import {
  PATIENT_SCHEMA,
  DATA_SOURCE,
  DATA_SOURCE_KEYS,
  IMAGE_FIELDS,
  FILTER_KEYS,
  FILTER_DEFINITIONS,
  ASSETS
} from '../constants/index.js'
import eventSystem from '../utils/EventSystem.js'

// ---------------------------------------------------------------------------
// CLASS DEFINITION
// ---------------------------------------------------------------------------

class DataManager {
  // ---------------------------------------------------------------------------
  // INITIALISATION
  // ---------------------------------------------------------------------------

  constructor() {
    this.introData = null
    this.patientData = null
    this.schema = null
    this.isLoaded = false
    this.listeners = new Set()
  }

  // ---------------------------------------------------------------------------
  // DATA LOADING
  // ---------------------------------------------------------------------------

  // Load patient data and schema from JSON files
  async loadData() {
    try {
      const [introResponse, dataResponse, schemaResponse] = await Promise.all([
        fetch(ASSETS.DATA.INTRO_DATA),
        fetch(ASSETS.DATA.PATIENT_DATA),
        fetch(ASSETS.DATA.PATIENT_SCHEMA)
      ])

      this.introData = await introResponse.json()
      this.patientData = await dataResponse.json()
      this.schema = await schemaResponse.json()

      // Normalise age field to ensure it's always a number
      for (const key of Object.keys(this.patientData)) {
        if (!Array.isArray(this.patientData[key])) continue
        this.patientData[key].forEach(patient => {
          if (patient[PATIENT_SCHEMA.AGE] !== undefined && patient[PATIENT_SCHEMA.AGE] !== null) {
            patient[PATIENT_SCHEMA.AGE] = typeof patient[PATIENT_SCHEMA.AGE] === 'number'
              ? patient[PATIENT_SCHEMA.AGE]
              : parseInt(patient[PATIENT_SCHEMA.AGE], 10)
          }
        })
      }

      this.isLoaded = true

      eventSystem.emit(eventSystem.constructor.EVENTS.DATA_LOADED, {
        introData: this.introData,
        data: this.patientData,
        schema: this.schema
      })

      this.notifyListeners()

      return { introData: this.introData, data: this.patientData, schema: this.schema }
    } catch (error) {
      console.error('Error loading data:', error)
      throw error
    }
  }

  // ---------------------------------------------------------------------------
  // SOURCE HELPERS
  // ---------------------------------------------------------------------------

  // Get data source key for accessing patient data
  getSourceKey(source) {
    return source === DATA_SOURCE.CLINICAL_TRIAL
      ? DATA_SOURCE_KEYS.CLINICAL_TRIAL
      : DATA_SOURCE_KEYS.PRACTICE_BASED
  }

  // Get image field names for given data source
  getImageFields(source) {
    return source === DATA_SOURCE.CLINICAL_TRIAL
      ? IMAGE_FIELDS.CLINICAL_TRIAL
      : IMAGE_FIELDS.PRACTICE_BASED
  }

  // Get all patients for given source
  getPatientsBySource(source) {
    if (!this.isLoaded || !this.patientData) return []
    const sourceKey = this.getSourceKey(source)
    return this.patientData[sourceKey] || []
  }

  // ---------------------------------------------------------------------------
  // IMAGE EXTRACTION
  // ---------------------------------------------------------------------------

  // Get first valid image from patient record
  getFirstValidImage(patient, source) {
    const imageFields = this.getImageFields(source)

    // Check each image field in order until we find a valid one
    for (const field of imageFields) {
      if (patient[field] && patient[field].trim() !== '') {
        return {
          imagePath: `${ASSETS.PATIENTS_PATH}${patient[field]}`,
          field: field,
          patient: patient
        }
      }
    }
    return null
  }

  // ---------------------------------------------------------------------------
  // PATIENT FILTERING
  // ---------------------------------------------------------------------------

  /**
   * Convert filter index to match value for data filtering
   * @param {string} filterKey - Filter type (e.g., FILTER_KEYS.INDICATION)
   * @param {number|null} filterIndex - Filter option index
   * @returns {any} Value to match against patient data
   */
  getFilterMatchValue(filterKey, filterIndex) {
    if (filterIndex === null) return null

    const definition = FILTER_DEFINITIONS[filterKey]
    const option = definition.options[filterIndex]

    // Age ranges need the whole object { min, max, display }
    if (definition.matchFunction === 'ageRange') {
      return option
    }

    // Others need the value field
    return option.value
  }

  // Filter patients based on active filter criteria
  filterPatients(filters) {
    if (!this.isLoaded || !this.patientData) return []

    const source = filters.source || DATA_SOURCE.CLINICAL_TRIAL
    let patients = this.getPatientsBySource(source)

    // Filter by indication (clean comparison, no toLowerCase)
    if (filters[FILTER_KEYS.INDICATION] !== null && filters[FILTER_KEYS.INDICATION] !== undefined) {
      const matchValue = this.getFilterMatchValue(FILTER_KEYS.INDICATION, filters[FILTER_KEYS.INDICATION])
      patients = patients.filter(p => {
        const indication = p[PATIENT_SCHEMA.INDICATION]
        return indication && indication.trim() === matchValue
      })
    }

    // Filter by formulation (clean comparison)
    if (filters[FILTER_KEYS.FORMULATION] !== null && filters[FILTER_KEYS.FORMULATION] !== undefined) {
      const matchValue = this.getFilterMatchValue(FILTER_KEYS.FORMULATION, filters[FILTER_KEYS.FORMULATION])
      patients = patients.filter(p => {
        const formulation = p[PATIENT_SCHEMA.FORMULATION]
        return formulation && formulation.trim() === matchValue
      })
    }

    // Filter by body area (clean comparison)
    if (filters[FILTER_KEYS.BODY_AREA] !== null && filters[FILTER_KEYS.BODY_AREA] !== undefined) {
      const matchValue = this.getFilterMatchValue(FILTER_KEYS.BODY_AREA, filters[FILTER_KEYS.BODY_AREA])
      patients = patients.filter(p => {
        const bodyArea = p[PATIENT_SCHEMA.BODY_AREA_SIMPLE]
        return bodyArea && bodyArea.trim() === matchValue
      })
    }

    // Filter by baseline severity (clean comparison)
    if (filters[FILTER_KEYS.BASELINE_SEVERITY] !== null && filters[FILTER_KEYS.BASELINE_SEVERITY] !== undefined) {
      const matchValue = this.getFilterMatchValue(FILTER_KEYS.BASELINE_SEVERITY, filters[FILTER_KEYS.BASELINE_SEVERITY])
      patients = patients.filter(p => {
        const severity = p[PATIENT_SCHEMA.BASELINE_SEVERITY]
        return severity && severity.trim() === matchValue
      })
    }

    // Filter by age range (use pre-computed min/max - no parsing!)
    if (filters[FILTER_KEYS.AGE] !== null && filters[FILTER_KEYS.AGE] !== undefined) {
      const ageRange = this.getFilterMatchValue(FILTER_KEYS.AGE, filters[FILTER_KEYS.AGE])
      patients = patients.filter(p => {
        const age = p[PATIENT_SCHEMA.AGE]
        if (typeof age !== 'number' || isNaN(age)) return false
        return age >= ageRange.min && age <= ageRange.max
      })
    }

    // Filter by gender (direct value match)
    if (filters[FILTER_KEYS.GENDER] !== null && filters[FILTER_KEYS.GENDER] !== undefined) {
      const matchValue = this.getFilterMatchValue(FILTER_KEYS.GENDER, filters[FILTER_KEYS.GENDER])
      patients = patients.filter(p => {
        const gender = p[PATIENT_SCHEMA.GENDER]
        return gender && gender.trim().toUpperCase() === matchValue
      })
    }

    return patients
  }

  // Get filtered patient images based on filter criteria
  getFilteredImages(filters) {
    const filteredPatients = this.filterPatients(filters)
    const images = []

    // Extract first valid image from each patient
    filteredPatients.forEach(patient => {
      const imageData = this.getFirstValidImage(patient, filters.source || DATA_SOURCE.CLINICAL_TRIAL)
      if (imageData) images.push(imageData)
    })

    return images
  }

  // ---------------------------------------------------------------------------
  // PATIENT LOOKUP
  // ---------------------------------------------------------------------------

  // Find patient record by image path (reverse lookup)
  getPatientByImage(imagePath) {
    if (!this.isLoaded || !this.patientData) return null

    const imageName = imagePath.split('/').pop()

    // Search in both data sources
    const sources = [
      { key: DATA_SOURCE_KEYS.CLINICAL_TRIAL, source: DATA_SOURCE.CLINICAL_TRIAL },
      { key: DATA_SOURCE_KEYS.PRACTICE_BASED, source: DATA_SOURCE.PRACTICE_BASED }
    ]

    for (const { key, source } of sources) {
      const patients = this.patientData[key] || []
      const imageFields = this.getImageFields(source)

      for (const patient of patients) {
        for (const field of imageFields) {
          if (patient[field] === imageName) {
            return {
              patient,
              source: source,
              imageField: field
            }
          }
        }
      }
    }

    return null
  }

  // ---------------------------------------------------------------------------
  // FILTER AVAILABILITY
  // ---------------------------------------------------------------------------

  /**
   * Get available filter options for a specific filter type
   * Returns Set of indices that would yield results if selected
   *
   * @param {Object} filters - Current filter state
   * @param {string} filterType - Which filter to get options for
   * @returns {Set<number>} Set of available option indices
   */
  getAvailableFilterOptions(filters, filterType) {
    if (!this.isLoaded || !this.patientData) return new Set()

    // Create temporary filter state excluding the target filter
    const tempFilters = { ...filters }
    delete tempFilters[filterType]

    // Get patients matching all OTHER filters
    const patients = this.filterPatients(tempFilters)

    // Extract unique indices for the target filter from matching patients
    const indices = new Set()
    const definition = FILTER_DEFINITIONS[filterType]

    patients.forEach(patient => {
      const fieldValue = patient[definition.schemaField]

      if (filterType === FILTER_KEYS.AGE) {
        // Age ranges - check which ranges the patient's age falls into
        const age = fieldValue
        if (typeof age === 'number' && !isNaN(age)) {
          definition.options.forEach((option, index) => {
            if (age >= option.min && age <= option.max) {
              indices.add(index)
            }
          })
        }
      } else if (filterType === FILTER_KEYS.GENDER) {
        // Gender - find index of matching gender code
        const index = definition.options.findIndex(opt => opt.value === fieldValue)
        if (index !== -1) indices.add(index)
      } else {
        // All other filters - find index of matching value
        const index = definition.options.findIndex(opt => opt.value === fieldValue?.trim())
        if (index !== -1) indices.add(index)
      }
    })

    return indices
  }

  // ---------------------------------------------------------------------------
  // INTRO DATA ACCESS
  // ---------------------------------------------------------------------------

  // Get intro data for landing page
  getIntroData() {
    return this.introData
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
      try { cb() } catch (e) { console.error('DataManager:', e) }
    })
  }
}

// ---------------------------------------------------------------------------
// SINGLETON EXPORT
// ---------------------------------------------------------------------------

// Create singleton instance
const dataManager = new DataManager()

export default dataManager
