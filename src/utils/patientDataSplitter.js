/**
 * patientDataSplitter.js
 *
 * Utility functions for processing patient data and determining which timepoints to display.
 * Handles both Clinical Trial and Practice-Based patient data formats.
 */

import { DATA_SOURCE } from '../constants/index.js'
import imageManager from '../managers/ImageManager.js'

// ---------------------------------------------------------------------------
// CONSTANTS
// ---------------------------------------------------------------------------

const NOT_REPORTED_REGEX = /^not reported\.?$/i

// Preferred timepoints in order of preference
const PREFERRED_TIMEPOINTS = ['baseline', 'week2', 'week8']

// All possible week timepoints
const ALL_WEEKS = ['baseline', 'week1', 'week2', 'week3', 'week4', 'week6', 'week8', 'week52', 'week56']

// ---------------------------------------------------------------------------
// HELPER FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Checks if a value is valid (not null, empty, or "Not Reported")
 */
function isValidValue(value) {
  if (value == null || value === '') return false
  const s = String(value).trim()
  if (s === '' || NOT_REPORTED_REGEX.test(s)) return false
  return true
}

/**
 * Gets score for a specific timepoint
 * Clinical Trial: numeric scores in 'baseline', 'week2', etc.
 * Practice-Based: text scores in 'baselineSeverity', 'week2Severity', etc.
 */
function getScoreForTimepoint(patient, timepoint, source) {
  const isClinicalTrial = source === DATA_SOURCE.CLINICAL_TRIAL

  if (isClinicalTrial) {
    // Clinical Trial: direct numeric scores
    return patient[timepoint]
  } else {
    // Practice-Based: severity text values
    const severityKey = timepoint === 'baseline' ? 'baselineSeverity' : `${timepoint}Severity`
    return patient[severityKey]
  }
}

/**
 * Gets WI-NRS score for a specific timepoint
 */
function getWiNrsForTimepoint(patient, timepoint) {
  if (timepoint === 'baseline') {
    return patient['wi-nrsBaseline']
  }
  // Extract week number (e.g., 'week2' -> '2')
  const weekNum = timepoint.replace('week', '')
  const key = `wi-nrsWeek${weekNum}`
  return patient[key]
}

/**
 * Gets SI-NRS score for a specific timepoint
 */
function getSiNrsForTimepoint(patient, timepoint) {
  if (timepoint === 'baseline') {
    return patient['si-nrsBaseline']
  }
  // Extract week number (e.g., 'week2' -> '2')
  const weekNum = timepoint.replace('week', '')
  const key = `si-nrsWeek${weekNum}`
  return patient[key]
}

/**
 * Gets image path for a specific timepoint
 */
function getImageForTimepoint(patient, timepoint) {
  const imageKey = `${timepoint}Image`
  return patient[imageKey]
}

/**
 * Formats timepoint name for display
 */
function formatTimepointLabel(timepoint) {
  if (timepoint === 'baseline') return 'Baseline'
  // Convert 'week2' to 'Week 2', 'week52' to 'Week 52', etc.
  const weekNum = timepoint.replace('week', '')
  return `Week ${weekNum}`
}

/**
 * Finds available timepoints that have both an image and a score
 */
function getAvailableTimepoints(patient, source) {
  const available = []

  for (const timepoint of ALL_WEEKS) {
    const image = getImageForTimepoint(patient, timepoint)
    const score = getScoreForTimepoint(patient, timepoint, source)

    // Only include if both image and score exist and are valid
    if (isValidValue(image) && isValidValue(score)) {
      available.push(timepoint)
    }
  }

  return available
}

/**
 * Selects 3 timepoints to display, preferring baseline, week2, week8
 * Always includes baseline if available
 */
function selectTimepoints(availableTimepoints) {
  // Always try to include baseline first
  const selected = []

  if (availableTimepoints.includes('baseline')) {
    selected.push('baseline')
  }

  // Try to add preferred timepoints
  for (const preferred of PREFERRED_TIMEPOINTS) {
    if (preferred === 'baseline') continue // Already added
    if (availableTimepoints.includes(preferred) && !selected.includes(preferred)) {
      selected.push(preferred)
    }
    if (selected.length >= 3) break
  }

  // If we don't have 3 yet, add any remaining available timepoints
  if (selected.length < 3) {
    for (const timepoint of availableTimepoints) {
      if (!selected.includes(timepoint)) {
        selected.push(timepoint)
      }
      if (selected.length >= 3) break
    }
  }

  return selected
}

// ---------------------------------------------------------------------------
// MAIN FUNCTION
// ---------------------------------------------------------------------------

/**
 * Splits patient data into displayable timepoint cards
 * Returns object with timepoint array and flags for showing WI-NRS/SI-NRS sections
 *
 * @param {Object} patient - Patient data object
 * @param {string} source - Data source (DATA_SOURCE.CLINICAL_TRIAL or DATA_SOURCE.PRACTICE_BASED)
 * @returns {Object} Object with structure:
 *   {
 *     timepoints: Array of timepoint objects,
 *     showWiNrs: boolean,  // true if any timepoint has WI-NRS data
 *     showSiNrs: boolean   // true if any timepoint has SI-NRS data
 *   }
 */
export function splitPatientData(patient, source) {
  if (!patient) return { timepoints: [], showWiNrs: false, showSiNrs: false }

  // Get all available timepoints with images and scores
  const available = getAvailableTimepoints(patient, source)

  // Select which 3 timepoints to show
  const selectedTimepoints = selectTimepoints(available)

  // Get scale name from patient data
  const scaleName = patient.scale

  // Build the result array
  const result = selectedTimepoints.map(timepoint => {
    const wiNrs = getWiNrsForTimepoint(patient, timepoint)
    const siNrs = getSiNrsForTimepoint(patient, timepoint)
    const imagePath = getImageForTimepoint(patient, timepoint)
    const thumbPath = imageManager.getThumbnailPath(imagePath)

    // For NRS scores, treat 0 as missing data (0 is often used to represent "not measured" in datasets)
    const validWiNrs = isValidValue(wiNrs) && wiNrs !== 0 && wiNrs !== '0' ? wiNrs : null
    const validSiNrs = isValidValue(siNrs) && siNrs !== 0 && siNrs !== '0' ? siNrs : null

    return {
      timepoint,
      label: formatTimepointLabel(timepoint),
      image: imagePath,
      thumb: thumbPath,
      scale: {
        name: scaleName,
        score: getScoreForTimepoint(patient, timepoint, source)
      },
      // Keep raw values (null if not valid) - display component will show "-" for null
      wiNrs: validWiNrs,
      siNrs: validSiNrs
    }
  })

  // Check if ANY timepoint has WI-NRS or SI-NRS data
  const showWiNrs = result.some(tp => tp.wiNrs !== null)
  const showSiNrs = result.some(tp => tp.siNrs !== null)

  return {
    timepoints: result,
    showWiNrs,
    showSiNrs
  }
}
