// DataManager - singleton for patient data loading and filtering

import {
  PATIENT_SCHEMA,
  DATA_SOURCE,
  DATA_SOURCE_KEYS,
  IMAGE_FIELDS,
  FILTER_KEYS,
  GENDER_MAP,
  ASSETS
} from '../constants/index.js'
import eventSystem from '../utils/EventSystem.js'

// ---------------------------------------------------------------------------
// TESTING CONFIGURATION
// ---------------------------------------------------------------------------
// For testing purposes: duplicate patient data to simulate larger datasets
// Set to 1 for no duplication, 2 to double, 3 to triple, etc.
const DATA_DUPLICATION_FACTOR = 2

// ---------------------------------------------------------------------------
// CLASS DEFINITION
// ---------------------------------------------------------------------------

class DataManager {
  // ---------------------------------------------------------------------------
  // INITIALISATION
  // ---------------------------------------------------------------------------

  constructor() {
    this.patientData = null
    this.schema = null
    this.isLoaded = false
  }

  // ---------------------------------------------------------------------------
  // DATA LOADING
  // ---------------------------------------------------------------------------

  // Load patient data and schema from JSON files
  async loadData() {
    try {
      const [dataResponse, schemaResponse] = await Promise.all([
        fetch(ASSETS.DATA.PATIENT_DATA),
        fetch(ASSETS.DATA.PATIENT_SCHEMA)
      ])

      this.patientData = await dataResponse.json()
      this.schema = await schemaResponse.json()

      // For testing: duplicate patient data if factor > 1
      if (DATA_DUPLICATION_FACTOR > 1) {
        for (const key of Object.keys(this.patientData)) {
          if (!Array.isArray(this.patientData[key])) continue
          const originalPatients = this.patientData[key]
          const duplicated = []
          for (let i = 0; i < DATA_DUPLICATION_FACTOR; i++) {
            originalPatients.forEach((patient) => {
              const copy = { ...patient }
              if (i > 0) copy.patientId = `${patient.patientId}-dup${i}`
              duplicated.push(copy)
            })
          }
          this.patientData[key] = duplicated
        }
      }

      this.isLoaded = true

      eventSystem.emit(eventSystem.constructor.EVENTS.DATA_LOADED, {
        data: this.patientData,
        schema: this.schema
      })

      return { data: this.patientData, schema: this.schema }
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

  // Filter patients based on active filter criteria
  filterPatients(filters) {
    if (!this.isLoaded || !this.patientData) return []

    const source = filters.source || DATA_SOURCE.CLINICAL_TRIAL
    let patients = this.getPatientsBySource(source)

    // Filter by condition (exact match, case-insensitive)
    if (filters[FILTER_KEYS.INDICATION]) {
      patients = patients.filter(p => {
        const indication = p[PATIENT_SCHEMA.INDICATION]
        if (!indication) return false
        return indication.trim().toLowerCase() === filters[FILTER_KEYS.INDICATION].toLowerCase().trim()
      })
    }

    // Filter by formulation (exact match)
    if (filters[FILTER_KEYS.FORMULATION]) {
      patients = patients.filter(p => {
        const formulation = p[PATIENT_SCHEMA.FORMULATION]
        return formulation && formulation.trim() === filters[FILTER_KEYS.FORMULATION]
      })
    }

    // Filter by body area: use bodyAreaSimple when present (one of four categories); no mapping so typos/edge cases are avoided
    if (filters[FILTER_KEYS.BODY_AREA]) {
      const selectedCategory = filters[FILTER_KEYS.BODY_AREA]
      patients = patients.filter(p => {
        const simple = p[PATIENT_SCHEMA.BODY_AREA_SIMPLE]
        return simple && simple.trim() === selectedCategory
      })
    }

    // Filter by baseline severity (exact match)
    if (filters[FILTER_KEYS.BASELINE_SEVERITY]) {
      patients = patients.filter(p => {
        const severity = p[PATIENT_SCHEMA.BASELINE_SEVERITY]
        return severity && severity.trim() === filters[FILTER_KEYS.BASELINE_SEVERITY]
      })
    }

    // Filter by age range (supports formats: "2-5" or "19+")
    if (filters[FILTER_KEYS.AGE]) {
      patients = patients.filter(p => {
        const age = typeof p[PATIENT_SCHEMA.AGE] === 'number'
          ? p[PATIENT_SCHEMA.AGE]
          : parseInt(p[PATIENT_SCHEMA.AGE])

        if (isNaN(age)) return false

        if (filters[FILTER_KEYS.AGE].includes('+')) {
          const min = parseInt(filters[FILTER_KEYS.AGE].replace('+', ''))
          return age >= min
        } else {
          const [min, max] = filters[FILTER_KEYS.AGE].split('-').map(n => parseInt(n))
          return age >= min && age <= max
        }
      })
    }

    // Filter by gender (using gender map for normalisation)
    if (filters[FILTER_KEYS.GENDER]) {
      patients = patients.filter(p => {
        const gender = p[PATIENT_SCHEMA.GENDER]
        return gender && gender.trim().toUpperCase() === GENDER_MAP[filters[FILTER_KEYS.GENDER]]
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
      if (imageData) {
        images.push(imageData)
      }
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
   * Returns Set of values that would yield results if selected
   *
   * @param {Object} filters - Current filter state
   * @param {string} filterType - Which filter to get options for
   * @returns {Set<string>} Set of available option values
   */
  getAvailableFilterOptions(filters, filterType) {
    if (!this.isLoaded || !this.patientData) return new Set()

    // Create temporary filter state excluding the target filter
    const tempFilters = { ...filters }
    delete tempFilters[filterType]

    // Get patients matching all OTHER filters
    const patients = this.filterPatients(tempFilters)

    // Extract unique values for the target filter from matching patients
    const values = new Set()

    patients.forEach(patient => {
      let fieldValue

      // Map filter type to patient schema field
      switch (filterType) {
        case FILTER_KEYS.INDICATION:
          fieldValue = patient[PATIENT_SCHEMA.INDICATION]
          break
        case FILTER_KEYS.FORMULATION:
          fieldValue = patient[PATIENT_SCHEMA.FORMULATION]
          break
        case FILTER_KEYS.BODY_AREA:
          fieldValue = patient[PATIENT_SCHEMA.BODY_AREA_SIMPLE]
          break
        case FILTER_KEYS.BASELINE_SEVERITY:
          fieldValue = patient[PATIENT_SCHEMA.BASELINE_SEVERITY]
          break
        case FILTER_KEYS.AGE:
          // Special handling for age ranges
          const ageValue = patient[PATIENT_SCHEMA.AGE]
          const age = typeof ageValue === 'number' ? ageValue : typeof ageValue === 'string' ? parseInt(ageValue) : NaN

          if (!isNaN(age)) {
            // Determine which age range(s) this patient fits into
            if (age >= 2 && age <= 5) values.add('2-5')
            if (age >= 6 && age <= 18) values.add('6-18')
            if (age >= 19 && age <= 30) values.add('19-30')
            if (age >= 31 && age <= 50) values.add('31-50')
            if (age >= 50) values.add('50+')
          }
          return // Skip the normal field value handling
        case FILTER_KEYS.GENDER:
          // Map gender codes back to display names
          const genderCode = patient[PATIENT_SCHEMA.GENDER]
          if (genderCode === 'M') values.add('Male')
          else if (genderCode === 'F') values.add('Female')
          return // Skip the normal field value handling
      }

      // Add non-null, non-empty string values
      if (typeof fieldValue === 'string' && fieldValue.trim() !== '') {
        values.add(fieldValue.trim())
      }
    })

    return values
  }
}

// ---------------------------------------------------------------------------
// SINGLETON EXPORT
// ---------------------------------------------------------------------------

// Create singleton instance
const dataManager = new DataManager()

export default dataManager
