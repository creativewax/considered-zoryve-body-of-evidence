/**
 * patientDataSplitter.js
 *
 * Utility functions for processing patient data and determining which timepoints to display.
 */

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
 * Gets score for a specific timepoint (numeric scores in 'baseline', 'week2', etc.)
 */
function getScoreForTimepoint(patient, timepoint, hasScaleData = false, index = 0) {
  if (hasScaleData) return patient.scaleData[index][timepoint]
  return patient[timepoint]
}

/**
 * Gets WI-NRS score for a specific timepoint
 * Uses 'wi-nrsBaseline', 'wi-nrsWeek1', etc.
 */
function getWiNrsForTimepoint(patient, timepoint) {
  if (timepoint === 'baseline') return patient['wi-nrsBaseline']
  const weekNum = timepoint.replace('week', '')
  return patient[`wi-nrsWeek${weekNum}`]
}

/**
 * Gets SI-NRS score for a specific timepoint
 */
function getSiNrsForTimepoint(patient, timepoint) {
  if (timepoint === 'baseline') return patient['si-nrsBaseline']
  const weekNum = timepoint.replace('week', '')
  return patient[`si-nrsWeek${weekNum}`]
}

/**
 * Gets image path for a specific timepoint
 */
function getImageForTimepoint(patient, timepoint) {
  return patient[`${timepoint}Image`]
}

/**
 * Formats timepoint name for display
 */
function formatTimepointLabel(timepoint) {
  if (timepoint === 'baseline') return 'Baseline'
  const weekNum = timepoint.replace('week', '')
  return `Week ${weekNum}`
}

/**
 * Sorts timepoints chronologically (baseline first, then by week number)
 */
function sortTimepointsChronologically(timepoints) {
  return [...timepoints].sort((a, b) => {
    if (a === 'baseline') return -1
    if (b === 'baseline') return 1
    const weekA = parseInt(a.replace('week', ''))
    const weekB = parseInt(b.replace('week', ''))
    return weekA - weekB
  })
}

/**
 * Finds available timepoints that have both an image and a score
 */
function getAvailableTimepoints(patient, hasScaleData = false) {
  const available = []

  for (const timepoint of ALL_WEEKS) {
    const image = getImageForTimepoint(patient, timepoint)
    const score = getScoreForTimepoint(patient, timepoint, hasScaleData)

    if (isValidValue(image) && isValidValue(score)) {
      available.push(timepoint)
    }
  }

  return available
}

/**
 * Selects 3 timepoints to display, preferring baseline, week2, week8
 * Always includes baseline if available
 * Returns timepoints sorted chronologically
 */
function selectTimepoints(availableTimepoints) {
  const selected = []

  if (availableTimepoints.includes('baseline')) {
    selected.push('baseline')
  }

  for (const preferred of PREFERRED_TIMEPOINTS) {
    if (preferred === 'baseline') continue
    if (availableTimepoints.includes(preferred) && !selected.includes(preferred)) {
      selected.push(preferred)
    }
    if (selected.length >= 3) break
  }

  if (selected.length < 3) {
    for (const timepoint of availableTimepoints) {
      if (!selected.includes(timepoint)) {
        selected.push(timepoint)
      }
      if (selected.length >= 3) break
    }
  }

  return sortTimepointsChronologically(selected)
}

// ---------------------------------------------------------------------------
// MAIN FUNCTION
// ---------------------------------------------------------------------------

/**
 * Splits patient data into displayable timepoint cards
 * Returns object with timepoint array and flags for showing WI-NRS/SI-NRS sections
 *
 * @param {Object} patient - Patient data object
 * @returns {Object} { timepoints, showWiNrs, showSiNrs }
 */
export function splitPatientData(patient) {
  if (!patient) return { timepoints: [], showWiNrs: false, showSiNrs: false }

  const hasScaleData = patient.scaleData !== undefined
  const available = getAvailableTimepoints(patient, hasScaleData)
  const selectedTimepoints = selectTimepoints(available)

  const result = selectedTimepoints.map(timepoint => {
    const wiNrs = getWiNrsForTimepoint(patient, timepoint)
    const siNrs = getSiNrsForTimepoint(patient, timepoint)
    const imagePath = getImageForTimepoint(patient, timepoint)
    const thumbPath = imageManager.getThumbnailPath(imagePath)

    const validWiNrs = isValidValue(wiNrs) ? wiNrs : null
    const validSiNrs = isValidValue(siNrs) ? siNrs : null

    let scale = null
    if (hasScaleData) {
      scale = []
      for (let i = 0; i < patient.scaleData.length; i++) {
        scale.push({
          name: patient.scaleData[i].scale,
          score: getScoreForTimepoint(patient, timepoint, true, i)
        })
      }
    } else {
      scale = {
        name: patient.scale,
        score: getScoreForTimepoint(patient, timepoint)
      }
    }

    return {
      timepoint,
      label: formatTimepointLabel(timepoint),
      image: imagePath,
      thumb: thumbPath,
      scale: scale,
      wiNrs: validWiNrs,
      siNrs: validSiNrs
    }
  })

  const showWiNrs = result.some(tp => tp.wiNrs !== null)
  const showSiNrs = result.some(tp => tp.siNrs !== null)

  return { timepoints: result, showWiNrs, showSiNrs }
}
