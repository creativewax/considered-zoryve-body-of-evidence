// DataManager - singleton for patient data loading and filtering

import {
  PATIENT_SCHEMA,
  DATA_SOURCE,
  DATA_SOURCE_KEYS,
  IMAGE_FIELDS,
  GENDER_MAP,
  ASSETS
} from '../constants/index.js'
import eventSystem from '../utils/EventSystem.js'

// -----------------------------------------------------------------------------
// CLASS DEFINITION
// -----------------------------------------------------------------------------

class DataManager {
  // ---------------------------------------------------------------------------
  // INITIALIZATION
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
    if (filters.condition) {
      patients = patients.filter(p => {
        const indication = p[PATIENT_SCHEMA.INDICATION]
        if (!indication) return false
        return indication.trim().toLowerCase() === filters.condition.toLowerCase().trim()
      })
    }

    // Filter by formulation (exact match)
    if (filters.formulation) {
      patients = patients.filter(p => {
        const formulation = p[PATIENT_SCHEMA.FORMULATION]
        return formulation && formulation.trim() === filters.formulation
      })
    }

    // Filter by body area (fuzzy match - contains or is contained)
    if (filters.bodyArea) {
      patients = patients.filter(p => {
        const bodyArea = p[PATIENT_SCHEMA.BODY_AREA]
        if (!bodyArea) return false

        const normalizedFilter = filters.bodyArea.toLowerCase().trim()
        const normalizedBodyArea = bodyArea.toLowerCase().trim()

        return normalizedBodyArea === normalizedFilter ||
               normalizedBodyArea.includes(normalizedFilter) ||
               normalizedFilter.includes(normalizedBodyArea)
      })
    }

    // Filter by baseline severity (exact match)
    if (filters.baselineSeverity) {
      patients = patients.filter(p => {
        const severity = p[PATIENT_SCHEMA.BASELINE_SEVERITY]
        return severity && severity.trim() === filters.baselineSeverity
      })
    }

    // Filter by age range (supports formats: "2-5" or "19+")
    if (filters.age) {
      patients = patients.filter(p => {
        const age = typeof p[PATIENT_SCHEMA.AGE] === 'number'
          ? p[PATIENT_SCHEMA.AGE]
          : parseInt(p[PATIENT_SCHEMA.AGE])

        if (isNaN(age)) return false

        if (filters.age.includes('+')) {
          const min = parseInt(filters.age.replace('+', ''))
          return age >= min
        } else {
          const [min, max] = filters.age.split('-').map(n => parseInt(n))
          return age >= min && age <= max
        }
      })
    }

    // Filter by gender (using gender map for normalization)
    if (filters.gender) {
      patients = patients.filter(p => {
        const gender = p[PATIENT_SCHEMA.GENDER]
        return gender && gender.trim().toUpperCase() === GENDER_MAP[filters.gender]
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
}

// -----------------------------------------------------------------------------
// SINGLETON EXPORT
// -----------------------------------------------------------------------------

// Create singleton instance
const dataManager = new DataManager()

export default dataManager
