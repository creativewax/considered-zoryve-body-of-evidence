// DataManager - singleton for patient data loading and filtering

import {
  PATIENT_SCHEMA,
  DATA_SOURCE_KEY,
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
      const patients = this.getPatients()
      patients.forEach(patient => {
        if (patient[PATIENT_SCHEMA.AGE] !== undefined && patient[PATIENT_SCHEMA.AGE] !== null) {
          patient[PATIENT_SCHEMA.AGE] = typeof patient[PATIENT_SCHEMA.AGE] === 'number'
            ? patient[PATIENT_SCHEMA.AGE]
            : parseInt(patient[PATIENT_SCHEMA.AGE], 10)
        }
      })

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
  // DATA ACCESS
  // ---------------------------------------------------------------------------

  // Get all patients
  getPatients() {
    if (!this.isLoaded || !this.patientData) return []
    return this.patientData[DATA_SOURCE_KEY] || []
  }

  // ---------------------------------------------------------------------------
  // IMAGE EXTRACTION
  // ---------------------------------------------------------------------------

  // Get first valid image from patient record
  getFirstValidImage(patient) {
    for (const field of IMAGE_FIELDS) {
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
   * Check if a patient matches a single filter option.
   * Handles standard string match, age ranges, gender codes, and custom matchField.
   */
  matchesOption(patient, filterKey, option) {
    const definition = FILTER_DEFINITIONS[filterKey]

    // Custom matchField (e.g., multiBodyArea boolean check)
    if (option.matchField) {
      return patient[option.matchField] === option.value
    }

    // Age range — check min/max
    if (definition.matchFunction === 'ageRange') {
      const age = patient[definition.schemaField]
      return typeof age === 'number' && !isNaN(age) && age >= option.min && age <= option.max
    }

    // Gender — uppercase comparison
    if (definition.matchFunction === 'gender') {
      const gender = patient[definition.schemaField]
      return gender && gender.trim().toUpperCase() === option.value
    }

    // Standard string match — case-insensitive to guard against data entry variation
    const fieldValue = patient[definition.schemaField]
    return fieldValue && String(fieldValue).trim().toLowerCase() === option.value.toLowerCase()
  }

  /**
   * Check if a patient matches ANY of the selected options for a filter.
   * Filter values are arrays of option indices (OR logic within a category).
   */
  matchesAnySelectedOption(patient, filterKey, selectedIndices) {
    const definition = FILTER_DEFINITIONS[filterKey]
    return selectedIndices.some(index => {
      const option = definition.options[index]
      return this.matchesOption(patient, filterKey, option)
    })
  }

  // Filter patients based on active filter criteria (array-based, multi-select)
  filterPatients(filters) {
    if (!this.isLoaded || !this.patientData) return []

    let patients = this.getPatients()

    // Apply each active filter (OR within category, AND across categories)
    for (const filterKey of Object.values(FILTER_KEYS)) {
      const selected = filters[filterKey]
      if (selected?.length > 0) {
        patients = patients.filter(p => this.matchesAnySelectedOption(p, filterKey, selected))
      }
    }

    return patients
  }

  // Get filtered patient images based on filter criteria
  getFilteredImages(filters) {
    const filteredPatients = this.filterPatients(filters)
    const images = []

    filteredPatients.forEach(patient => {
      const imageData = this.getFirstValidImage(patient)
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
    const patients = this.getPatients()

    for (const patient of patients) {
      for (const field of IMAGE_FIELDS) {
        if (patient[field] === imageName) {
          return { patient, imageField: field }
        }
      }
    }

    return null
  }

  // ---------------------------------------------------------------------------
  // RELATED PATIENTS (multi-body-area)
  // ---------------------------------------------------------------------------

  /**
   * Get all patient entries sharing the same patientId.
   * Returns array sorted alphabetically by bodyArea.
   */
  getRelatedPatients(patientId) {
    if (!patientId) return []
    return this.getPatients()
      .filter(p => p[PATIENT_SCHEMA.PATIENT_ID] === patientId)
      .sort((a, b) => {
        const aArea = (a[PATIENT_SCHEMA.BODY_AREA] || '').toLowerCase()
        const bArea = (b[PATIENT_SCHEMA.BODY_AREA] || '').toLowerCase()
        return aArea.localeCompare(bArea)
      })
  }

  // ---------------------------------------------------------------------------
  // FILTER AVAILABILITY
  // ---------------------------------------------------------------------------

  /**
   * Get available filter options for a specific filter type
   * Returns Set of indices that would yield results if selected
   */
  getAvailableFilterOptions(filters, filterType) {
    if (!this.isLoaded || !this.patientData) return new Set()

    // Create temporary filter state excluding the target filter
    const tempFilters = { ...filters }
    delete tempFilters[filterType]

    // Get patients matching all OTHER filters
    const patients = this.filterPatients(tempFilters)

    // Check each option against each patient using generic matcher
    const indices = new Set()
    const definition = FILTER_DEFINITIONS[filterType]

    patients.forEach(patient => {
      definition.options.forEach((option, index) => {
        if (this.matchesOption(patient, filterType, option)) {
          indices.add(index)
        }
      })
    })

    return indices
  }

  // ---------------------------------------------------------------------------
  // INTRO DATA ACCESS
  // ---------------------------------------------------------------------------

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

const dataManager = new DataManager()

export default dataManager
