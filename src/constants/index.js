/**
 * index.js
 *
 * Central constants file for the application
 * Contains patient data schema, filter options, data sources, asset paths, and app states
 * Serves as a single source of truth for configuration values used throughout the app
 */

// ---------------------------------------------------------------------------
// PATIENT DATA SCHEMA
// ---------------------------------------------------------------------------

/**
 * Patient data field names used in JSON data
 * Maps logical field names to the actual keys in patient data objects
 * Supports both Clinical Trial and Practice-Based data sources
 */
export const PATIENT_SCHEMA = {
  // Common fields
  REFERENCE_ID: 'referenceId',
  PAGE_NUMBER: 'pageNumber',
  PATIENT_ID: 'patientId',
  INDICATION: 'condition',
  FORMULATION: 'formulation',
  FITZPATRICK_SKIN_TYPE: 'fitzpatrickSkinType',
  GENDER: 'gender',
  AGE: 'age',
  RACE: 'race',
  ETHNICITY: 'ethnicity',
  BODY_AREA: 'bodyArea',
  /** One of four filter categories (Head and neck, Torso, Arms and hands, Legs and feet). Populate from bodyArea e.g. via AI so filtering works without guessing spellings. */
  BODY_AREA_SIMPLE: 'bodyAreaSimple',
  TREATMENTS_TRIED_AND_FAILED: 'treatmentsTriedAndFailed',
  BASELINE_SEVERITY: 'baselineSeverity',
  BASELINE_BSA: 'baselineBsa',
  DURATION_OF_DISEASE: 'durationOfDisease',
  
  // Practice-Based specific
  PRACTICE_BASED_OR_CLINICAL_TRIAL: 'practice-basedOrClinicalTrial',
  SCALE_DONT_DISPLAY: 'scale--don\'tDisplay',
  WEEK1_SEVERITY: 'week1Severity',
  WEEK2_SEVERITY: 'week2Severity',
  WEEK4_SEVERITY: 'week4Severity',
  WEEK8_SEVERITY: 'week8Severity',
  ITCH_SCORE_BASELINE: 'itchScoreBaseline',
  ITCH_SCORE_WEEK1: 'itchScoreWeek1',
  ITCH_SCORE_WEEK4: 'itchScoreWeek4',
  ITCH_SCORE_WEEK8: 'itchScoreWeek8',
  BASELINE_IMAGE: 'baselineImage',
  WEEK1_IMAGE: 'week1Image',
  WEEK4_IMAGE: 'week4Image',
  WEEK8_IMAGE: 'week8Image',
  QUOTE: 'quote',
  
  // Clinical Trial (iCVA 2.1) specific
  REAL_WORLD_OR_CLINICAL_TRIAL: 'realWorldOrClinicalTrial',
  SCALE: 'scale',
  BASELINE: 'baseline',
  WEEK1: 'week1',
  WEEK2: 'week2',
  WEEK3: 'week3',
  WEEK4: 'week4',
  WEEK6: 'week6',
  WEEK8: 'week8',
  WEEK52: 'week52',
  WEEK56: 'week56',
  WEEK2_IMAGE: 'week2Image',
  WEEK3_IMAGE: 'week3Image',
  WEEK6_IMAGE: 'week6Image',
  WEEK52_IMAGE: 'week52Image',
}

// ---------------------------------------------------------------------------
// DATA TYPES
// ---------------------------------------------------------------------------

/**
 * Data type constants for schema validation and parsing
 */
export const DATA_TYPES = {
  STRING: 'string',
  INTEGER: 'integer',
}

// ---------------------------------------------------------------------------
// FILTER OPTIONS
// ---------------------------------------------------------------------------

/**
 * Available filter values for each filter category
 * These options are displayed in the filter panel and used for patient data filtering
 */
export const FILTER_OPTIONS = {
  CONDITION: {
    PLAQUE_PSORIASIS: 'Plaque Psoriasis',
    ATOPIC_DERMATITIS: 'Atopic Dermatitis',
    SEBORRHEIC_DERMATITIS: 'Seborrheic Dermatitis',
  },
  FORMULATION: {
    CREAM_005: '0.05% Cream',
    CREAM_015: '0.15% Cream',
    CREAM_03: '0.3% Cream',
    FOAM_03: '0.3% Foam',
  },
  BODY_AREA: {
    HEAD_NECK: 'Head and neck',
    TORSO: 'Torso',
    ARMS_HANDS: 'Arms and hands',
    LEGS_FEET: 'Legs and feet',
  },
  BASELINE_SEVERITY: {
    MILD: 'Mild',
    MODERATE: 'Moderate',
    SEVERE: 'Severe',
  },
  AGE_RANGES: {
    RANGE_2_5: '2-5',
    RANGE_6_18: '6-18',
    RANGE_19_30: '19-30',
    RANGE_31_50: '31-50',
    RANGE_50_PLUS: '50+',
  },
  GENDER: {
    MALE: 'Male',
    FEMALE: 'Female',
  },
}

/**
 * Filter state object keys (used in FilterManager, filter components, DataManager)
 * Use these instead of hardcoded strings when emitting FILTER_SELECTED or reading filters
 */
export const FILTER_KEYS = {
  INDICATION: 'indication',
  FORMULATION: 'formulation',
  BODY_AREA: 'bodyArea',
  BASELINE_SEVERITY: 'baselineSeverity',
  AGE: 'age',
  GENDER: 'gender',
}

// ---------------------------------------------------------------------------
// DATA SOURCE CONFIGURATION
// ---------------------------------------------------------------------------

/**
 * Data source display names (shown in UI tabs)
 */
export const DATA_SOURCE = {
  CLINICAL_TRIAL: 'Clinical Trial',
  PRACTICE_BASED: 'Practice-Based',
}

/**
 * Data source keys as they appear in the patient data JSON
 * Maps to the top-level keys in patient_data.json
 */
export const DATA_SOURCE_KEYS = {
  CLINICAL_TRIAL: 'iCVA 2.1',
  PRACTICE_BASED: 'Practice-Based Patients',
}

/**
 * Image field names for each data source
 * Clinical Trial data has more time points (up to week 52) than Practice-Based data
 */
export const IMAGE_FIELDS = {
  CLINICAL_TRIAL: [
    'baselineImage',
    'week1Image',
    'week2Image',
    'week3Image',
    'week4Image',
    'week6Image',
    'week8Image',
    'week52Image',
  ],
  PRACTICE_BASED: [
    'baselineImage',
    'week1Image',
    'week4Image',
    'week8Image',
  ],
}

// ---------------------------------------------------------------------------
// DATA MAPPING
// ---------------------------------------------------------------------------

/**
 * Gender mapping for data matching
 * Maps full gender names to abbreviated codes used in patient data
 */
export const GENDER_MAP = {
  Male: 'M',
  Female: 'F',
}

/**
 * Gender codes used in patient data (M/F)
 * Use with FILTER_OPTIONS.GENDER for display labels in UI
 */
export const GENDER_CODE = {
  MALE: 'M',
  FEMALE: 'F',
}

// ---------------------------------------------------------------------------
// COLOURS (for icon components and components that pass colour props)
// ---------------------------------------------------------------------------

export const COLOURS = {
  WHITE: '#FFFFFF',
  ZORYVE_YELLOW: '#FDE939',
  ZORYVE_MIDNIGHT_BLUE: '#14365B',
}

// ---------------------------------------------------------------------------
// ASSET PATHS
// ---------------------------------------------------------------------------

/**
 * Static asset file paths for images, icons, backgrounds, and data files
 * All paths are relative to the public directory
 */
export const ASSETS = {
  BACKGROUNDS: {
    CLINICAL_TRIAL: '/UI/bkgd-ct.jpg',
    PRACTICE_BASED: '/UI/bkgd-pb.jpg',
  },
  FILTER_BACKGROUNDS: {
    CLINICAL_TRIAL: '/UI/filter-bkgd-ct.jpg',
    PRACTICE_BASED: '/UI/filter-bkgd-pb.jpg',
  },
  ICONS: {
    MALE: '/UI/icon-male.svg',
    FEMALE: '/UI/icon-female.svg',
    BODY_AREA_PERSON: '/UI/body-area-person.svg',
    CLOSE_BUTTON: '/UI/close-button.svg',
    PLUS_BUTTON: '/UI/plus-button.svg',
    PLUS_BUTTON_BLUE: '/UI/plus-button-blue.svg',
    FOOTER_INFO: '/UI/footer-info.svg',
    FOOTER_REFS: '/UI/footer-refs.svg',
    LOGO_ZORYVE: '/UI/logo-zoryve.svg',
    LOGO_APP: '/UI/logo-app.svg',
    SHADOW: '/UI/shadow.png',
    ISI_TITLE_SHAPE: '/UI/isi-title-shape.svg',
  },
  DATA: {
    PATIENT_DATA: '/data/patient_data.json',
    PATIENT_SCHEMA: '/data/patient_schema.json',
    INTRO_DATA: '/data/intro_data.json',
  },
  PATIENTS_PATH: '/patients/',
}

// ---------------------------------------------------------------------------
// FILTER DEFINITIONS (Index-Based System)
// ---------------------------------------------------------------------------

/**
 * Comprehensive filter definitions with index-based lookups
 *
 * This structure defines ALL filter metadata in one place:
 * - Array index IS the filter ID (0, 1, 2...)
 * - schemaField maps to patient data field name
 * - matchFunction indicates special matching logic (age ranges, gender codes)
 * - options array defines what's available for each filter
 *
 * Benefits of index-based approach:
 * - No string parsing overhead (age ranges use pre-computed min/max)
 * - No case-insensitive comparisons (direct value matching)
 * - Type-safe with numeric indices
 * - Faster Set operations (integer hashing vs string hashing)
 */
export const FILTER_DEFINITIONS = {
  [FILTER_KEYS.INDICATION]: {
    schemaField: PATIENT_SCHEMA.INDICATION,
    options: [
      { value: 'Plaque Psoriasis', display: 'Plaque Psoriasis' },
      { value: 'Atopic Dermatitis', display: 'Atopic Dermatitis' },
      { value: 'Seborrheic Dermatitis', display: 'Seborrheic Dermatitis' },
    ]
  },

  [FILTER_KEYS.FORMULATION]: {
    schemaField: PATIENT_SCHEMA.FORMULATION,
    options: [
      { value: '0.05% Cream', display: '0.05% Cream' },
      { value: '0.15% Cream', display: '0.15% Cream' },
      { value: '0.3% Cream', display: '0.3% Cream' },
      { value: '0.3% Foam', display: '0.3% Foam' },
    ]
  },

  [FILTER_KEYS.BODY_AREA]: {
    schemaField: PATIENT_SCHEMA.BODY_AREA_SIMPLE,
    options: [
      { value: 'Head and neck', display: 'Head and neck' },
      { value: 'Torso', display: 'Torso' },
      { value: 'Arms and hands', display: 'Arms and hands' },
      { value: 'Legs and feet', display: 'Legs and feet' },
    ]
  },

  [FILTER_KEYS.BASELINE_SEVERITY]: {
    schemaField: PATIENT_SCHEMA.BASELINE_SEVERITY,
    options: [
      { value: 'Mild', display: 'Mild' },
      { value: 'Moderate', display: 'Moderate' },
      { value: 'Severe', display: 'Severe' },
    ]
  },

  [FILTER_KEYS.AGE]: {
    schemaField: PATIENT_SCHEMA.AGE,
    matchFunction: 'ageRange',
    options: [
      { min: 2, max: 5, display: '2-5' },
      { min: 6, max: 18, display: '6-18' },
      { min: 19, max: 30, display: '19-30' },
      { min: 31, max: 50, display: '31-50' },
      { min: 50, max: Infinity, display: '50+' },
    ]
  },

  [FILTER_KEYS.GENDER]: {
    schemaField: PATIENT_SCHEMA.GENDER,
    matchFunction: 'gender',
    options: [
      { value: 'M', display: 'Male', icon: ASSETS.ICONS.MALE },
      { value: 'F', display: 'Female', icon: ASSETS.ICONS.FEMALE },
    ]
  },
}

/**
 * Get a filter option by index
 * @param {string} filterKey - Filter type (e.g., FILTER_KEYS.INDICATION)
 * @param {number} index - Option index (0, 1, 2...)
 * @returns {Object|null} Filter option object or null if not found
 */
export const getFilterOption = (filterKey, index) =>
  FILTER_DEFINITIONS[filterKey]?.options[index] || null

/**
 * Get display value for a filter option
 * @param {string} filterKey - Filter type
 * @param {number} index - Option index
 * @returns {string} Display string (empty if not found)
 */
export const getFilterDisplay = (filterKey, index) =>
  getFilterOption(filterKey, index)?.display || ''

/**
 * Get match value for a filter option (for data filtering)
 * @param {string} filterKey - Filter type
 * @param {number} index - Option index
 * @returns {any} Value for matching against patient data
 */
export const getFilterValue = (filterKey, index) => {
  const option = getFilterOption(filterKey, index)
  // Return the value property if it exists, otherwise return the whole option
  return option?.value ?? option
}

// ---------------------------------------------------------------------------
// APP STATES
// ---------------------------------------------------------------------------

/**
 * Application state constants
 * Used to track the current phase of the app lifecycle
 */
export const APP_STATE = {
  LOADING: 'loading',
  INTRO: 'intro',
  MAIN: 'main',
  DETAIL: 'detail',
}

// ---------------------------------------------------------------------------
// ROUTES
// ---------------------------------------------------------------------------

/**
 * Application route paths
 * Used by React Router for page navigation
 */
export const ROUTES = {
  INTRO: '/',
  MAIN: '/main',
  DETAIL: '/detail',
}

// ---------------------------------------------------------------------------
// CAROUSEL NAVIGATION
// ---------------------------------------------------------------------------

/**
 * Carousel navigation direction values
 * Used when emitting NAVIGATION_REQUESTED and in RotationStateManager
 */
export const NAVIGATION_DIRECTION = {
  LEFT: 'left',
  RIGHT: 'right',
}

// ---------------------------------------------------------------------------
// TIMEPOINT DATA SCHEMA
// ---------------------------------------------------------------------------

/**
 * Timepoint data structure returned by splitPatientData() utility
 * Used in DetailOverlay, ImageCard, and ScoreDisplay components
 *
 * splitPatientData() returns an object with:
 * - timepoints: Array of TimepointData objects
 * - showWiNrs: boolean flag indicating if WI-NRS section should display (true if any timepoint has WI-NRS)
 * - showSiNrs: boolean flag indicating if SI-NRS section should display (true if any timepoint has SI-NRS)
 *
 * Each timepoint represents a single measurement (e.g., Baseline, Week 2, Week 8) with all
 * associated image and scoring data for display in the patient detail view.
 *
 * @typedef {Object} TimepointData
 * @property {string} timepoint - Internal timepoint identifier (e.g., 'baseline', 'week2', 'week8')
 * @property {string} label - Human-readable label for display (e.g., 'Baseline', 'Week 2', 'Week 8')
 * @property {string} image - Full-size image filename (e.g., 'dc_ear_baseline.jpg')
 * @property {string} thumb - Thumbnail image filename (e.g., 'dc_ear_baseline_thumb.jpg')
 * @property {Object} scale - Main severity scale score
 * @property {string} scale.name - Scale name (e.g., 'IGA', 'v-IGA-AD', 'S-IGA')
 * @property {string|number|null} scale.score - Score value (null shown as "-" in UI)
 *   - Clinical Trial: numeric (e.g., 0, 1, 2, 3)
 *   - Practice-Based: text severity (e.g., 'Clear', 'Mild', 'Moderate', 'Severe')
 * @property {string|number|null} wiNrs - WI-NRS (Worst Itch Numerical Rating Scale) score
 *   - null if not available or "Not Reported" (shown as "-" in UI when section is displayed)
 *   - numeric value 0-10 if available
 * @property {string|number|null} siNrs - SI-NRS (Skin Itch Numerical Rating Scale) score
 *   - null if not available or "Not Reported" (shown as "-" in UI when section is displayed)
 *   - numeric value 0-10 if available
 *
 * @example
 * // splitPatientData() return structure for Clinical Trial patient
 * {
 *   timepoints: [
 *     {
 *       timepoint: 'baseline',
 *       label: 'Baseline',
 *       image: '110-005_baseline.jpg',
 *       thumb: '110-005_baseline_thumb.jpg',
 *       scale: { name: 'IGA', score: 3 },
 *       wiNrs: 4,
 *       siNrs: null
 *     },
 *     {
 *       timepoint: 'week2',
 *       label: 'Week 2',
 *       image: '110-005_week2.jpg',
 *       thumb: '110-005_week2_thumb.jpg',
 *       scale: { name: 'IGA', score: 2 },
 *       wiNrs: null,  // Will display as "-" because showWiNrs is true
 *       siNrs: null
 *     },
 *     {
 *       timepoint: 'week8',
 *       label: 'Week 8',
 *       image: '110-005_week8.jpg',
 *       thumb: '110-005_week8_thumb.jpg',
 *       scale: { name: 'IGA', score: 1 },
 *       wiNrs: 2,
 *       siNrs: null
 *     }
 *   ],
 *   showWiNrs: true,   // At least one timepoint has WI-NRS data
 *   showSiNrs: false   // No timepoints have SI-NRS data
 * }
 *
 * @example
 * // splitPatientData() return structure for Practice-Based patient
 * {
 *   timepoints: [
 *     {
 *       timepoint: 'baseline',
 *       label: 'Baseline',
 *       image: 'dc_ear_baseline.jpg',
 *       thumb: 'dc_ear_baseline_thumb.jpg',
 *       scale: { name: 'IGA', score: 'Moderate' },
 *       wiNrs: null,
 *       siNrs: null
 *     },
 *     {
 *       timepoint: 'week2',
 *       label: 'Week 2',
 *       image: 'dc_ear_week2.jpg',
 *       thumb: 'dc_ear_week2_thumb.jpg',
 *       scale: { name: 'IGA', score: 'Mild' },
 *       wiNrs: null,
 *       siNrs: null
 *     },
 *     {
 *       timepoint: 'week8',
 *       label: 'Week 8',
 *       image: 'dc_ear_week8.jpg',
 *       thumb: 'dc_ear_week8_thumb.jpg',
 *       scale: { name: 'IGA', score: 'Clear' },
 *       wiNrs: null,
 *       siNrs: null
 *     }
 *   ],
 *   showWiNrs: false,  // No WI-NRS data for practice-based patients
 *   showSiNrs: false   // No SI-NRS data for practice-based patients
 * }
 */
