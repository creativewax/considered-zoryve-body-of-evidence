/**
 * index.js
 *
 * Central constants file for the application
 * Contains patient data schema, filter options, data sources, asset paths, and app states
 * Serves as a single source of truth for configuration values used throughout the app
 */

// ─────────────────────────────────────────────────────────────────────────────
// PATIENT DATA SCHEMA
// ─────────────────────────────────────────────────────────────────────────────

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
  INDICATION: 'indication',
  FORMULATION: 'formulation',
  FITZPATRICK_SKIN_TYPE: 'fitzpatrickSkinType',
  GENDER: 'gender',
  AGE: 'age',
  RACE: 'race',
  ETHNICITY: 'ethnicity',
  BODY_AREA: 'bodyArea',
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

// ─────────────────────────────────────────────────────────────────────────────
// DATA TYPES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Data type constants for schema validation and parsing
 */
export const DATA_TYPES = {
  STRING: 'string',
  INTEGER: 'integer',
}

// ─────────────────────────────────────────────────────────────────────────────
// FILTER OPTIONS
// ─────────────────────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────────────────────
// DATA SOURCE CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────────────────────
// DATA MAPPING
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Gender mapping for data matching
 * Maps full gender names to abbreviated codes used in patient data
 */
export const GENDER_MAP = {
  Male: 'M',
  Female: 'F',
}

// ─────────────────────────────────────────────────────────────────────────────
// ASSET PATHS
// ─────────────────────────────────────────────────────────────────────────────

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
    PLUS_BUTTON: '/UI/plus_button.svg',
    FOOTER_INFO: '/UI/footer-info.svg',
    FOOTER_REFS: '/UI/footer-refs.svg',
    LOGO_ZORYVE: '/UI/logo-zoryve.svg',
    LOGO_APP: '/UI/logo-app.svg',
    SHADOW: '/UI/shadow.png',
  },
  DATA: {
    PATIENT_DATA: '/data/patient_data.json',
    PATIENT_SCHEMA: '/data/patient_schema.json',
  },
  PATIENTS_PATH: '/patients/',
}

// ─────────────────────────────────────────────────────────────────────────────
// APP STATES
// ─────────────────────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────────────────────
// ROUTES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Application route paths
 * Used by React Router for page navigation
 */
export const ROUTES = {
  INTRO: '/',
  MAIN: '/main',
  DETAIL: '/detail',
}
