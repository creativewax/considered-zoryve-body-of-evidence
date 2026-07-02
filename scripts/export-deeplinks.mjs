/**
 * scripts/export-deeplinks.mjs
 *
 * Generates the permanent patient deep-link list from public/data/patient_data.json:
 *   1. public/data/deeplinks.json — flat array of /patient/... routes, consumed by
 *      scripts/screenshots.mjs (replaces the old debug.json).
 *   2. docs/deep-links.xlsx — one row per patient+bodyArea with clickable links,
 *      for sharing with other teams.
 *
 * Timepoint selection re-derives the same up-to-3-timepoint logic as
 * src/utils/patientDataSplitter.js (getAvailableTimepoints/selectTimepoints).
 * It is reimplemented here rather than imported because that module pulls in
 * ImageManager.js, which has browser/Three.js dependencies that don't run
 * under plain Node.
 *
 * Every generated route is self-validated by reversing DeepLinkManager's
 * parseUrl()/findPatient() logic (title-case the slug back, case-insensitive
 * match) before anything is written to disk — a bad link is a build failure,
 * not a silent entry in the shared spreadsheet.
 *
 * Run from project root: node scripts/export-deeplinks.mjs
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import XLSX from 'xlsx'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_PATH = path.join(__dirname, '../public/data/patient_data.json')
const DEEPLINKS_JSON_PATH = path.join(__dirname, '../public/data/deeplinks.json')
const XLSX_PATH = path.join(__dirname, '../docs/deep-links.xlsx')
const DATA_SOURCE_KEY = 'iCVA 2.1'

// ---------------------------------------------------------------------------
// TIMEPOINT SELECTION (mirrors src/utils/patientDataSplitter.js)
// ---------------------------------------------------------------------------

const NOT_REPORTED_REGEX = /^not reported\.?$/i
const PREFERRED_TIMEPOINTS = ['baseline', 'week2', 'week8']
const ALL_WEEKS = ['baseline', 'week1', 'week2', 'week3', 'week4', 'week6', 'week8', 'week52', 'week56']

function isValidValue(value, checkNotReported = true) {
  if (value == null || value === '') return false
  const s = String(value).trim()
  if (s === '' || (checkNotReported && NOT_REPORTED_REGEX.test(s))) return false
  return true
}

function getImageForTimepoint(patient, timepoint) {
  return patient[`${timepoint}Image`]
}

function getScoreForTimepoint(patient, timepoint, hasScaleData) {
  if (hasScaleData) return patient.scaleData[0][timepoint]
  return patient[timepoint]
}

function getAvailableTimepoints(patient) {
  const hasScaleData = patient.scaleData !== undefined
  const available = []
  for (const timepoint of ALL_WEEKS) {
    const image = getImageForTimepoint(patient, timepoint)
    const score = getScoreForTimepoint(patient, timepoint, hasScaleData)
    if (isValidValue(image) && isValidValue(score)) available.push(timepoint)
  }
  return available
}

function sortTimepointsChronologically(timepoints) {
  return [...timepoints].sort((a, b) => {
    if (a === 'baseline') return -1
    if (b === 'baseline') return 1
    return parseInt(a.replace('week', ''), 10) - parseInt(b.replace('week', ''), 10)
  })
}

function selectTimepoints(availableTimepoints) {
  const selected = []

  if (availableTimepoints.includes('baseline')) selected.push('baseline')

  for (const preferred of PREFERRED_TIMEPOINTS) {
    if (preferred === 'baseline') continue
    if (availableTimepoints.includes(preferred) && !selected.includes(preferred)) {
      selected.push(preferred)
    }
    if (selected.length >= 3) break
  }

  if (selected.length < 3) {
    for (const timepoint of availableTimepoints) {
      if (!selected.includes(timepoint)) selected.push(timepoint)
      if (selected.length >= 3) break
    }
  }

  return sortTimepointsChronologically(selected)
}

// ---------------------------------------------------------------------------
// URL ENCODING (inverse of DeepLinkManager.parseUrl's bodyArea reconstruction)
// ---------------------------------------------------------------------------

function slugifyBodyArea(bodyArea) {
  return String(bodyArea).trim().toLowerCase().replace(/\s+/g, '-')
}

// Mirrors DeepLinkManager.parseUrl(): split on '-', title-case each word, keep '&' literal
function reconstructBodyArea(slug) {
  return slug
    .split('-')
    .map(word => (word === '&' ? '&' : word.charAt(0).toUpperCase() + word.slice(1)))
    .join(' ')
}

// Mirrors DeepLinkManager.findPatient(): case-insensitive patientId + bodyArea match
function findPatient(patients, patientId, bodyArea) {
  const targetId = patientId.toLowerCase()
  const targetBody = bodyArea.toLowerCase()
  return patients.find(p => {
    const pId = (p.patientId || '').toLowerCase()
    const pBody = (p.bodyArea || '').toLowerCase()
    return pId === targetId && pBody === targetBody
  })
}

// ---------------------------------------------------------------------------
// SELF-VALIDATION
// ---------------------------------------------------------------------------

/**
 * Reconstructs what DeepLinkManager.parseUrl() + findPatient() would resolve a
 * generated route to, and asserts it lands back on the exact originating
 * patient record with a valid image index. Throws loudly on any mismatch.
 */
function validateRoute(route, patients, originPatient, selectedCount) {
  const match = route.match(/^\/patient\/([^/]+)\/([^/]+)(?:\/(\d+))?$/)
  if (!match) {
    throw new Error(`Self-validation failed: "${route}" does not match the /patient/:patientId/:bodyArea/:imageIndex shape`)
  }

  const patientId = decodeURIComponent(match[1])
  const bodyArea = reconstructBodyArea(decodeURIComponent(match[2]))
  const imageIndex = match[3] !== undefined ? parseInt(match[3], 10) : null

  const found = findPatient(patients, patientId, bodyArea)
  if (!found) {
    throw new Error(`Self-validation failed: route "${route}" resolves to no patient (patientId=${patientId}, bodyArea=${bodyArea})`)
  }
  if (found !== originPatient) {
    throw new Error(`Self-validation failed: route "${route}" resolved to a different patient record than it was generated from (${found.patientId}/${found.bodyArea} vs ${originPatient.patientId}/${originPatient.bodyArea})`)
  }
  if (imageIndex !== null && !(imageIndex < selectedCount)) {
    throw new Error(`Self-validation failed: route "${route}" image index ${imageIndex} is out of range (patient has ${selectedCount} selectable timepoints)`)
  }
}

// ---------------------------------------------------------------------------
// MAIN
// ---------------------------------------------------------------------------

const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'))
const patients = data[DATA_SOURCE_KEY] || []

const allRoutes = []
const xlsxRows = []

for (const patient of patients) {
  const available = getAvailableTimepoints(patient)
  const selected = selectTimepoints(available)
  const slug = slugifyBodyArea(patient.bodyArea)

  const overlayRoute = `/patient/${patient.patientId}/${slug}`
  validateRoute(overlayRoute, patients, patient, selected.length)
  allRoutes.push(overlayRoute)

  const timepointRoutes = []
  for (let index = 0; index < selected.length; index++) {
    const route = `/patient/${patient.patientId}/${slug}/${index}`
    validateRoute(route, patients, patient, selected.length)
    allRoutes.push(route)
    timepointRoutes.push(route)
  }

  xlsxRows.push({
    'Reference ID': patient.referenceId || '',
    'Patient ID': patient.patientId,
    'Condition': patient.condition || '',
    'Formulation': patient.formulation || '',
    'Body Area': patient.bodyArea || '',
    'Overlay Link': `/#${overlayRoute}`,
    'Timepoint 1 Link': timepointRoutes[0] ? `/#${timepointRoutes[0]}` : '',
    'Timepoint 2 Link': timepointRoutes[1] ? `/#${timepointRoutes[1]}` : '',
    'Timepoint 3 Link': timepointRoutes[2] ? `/#${timepointRoutes[2]}` : '',
  })
}

fs.writeFileSync(DEEPLINKS_JSON_PATH, JSON.stringify(allRoutes, null, 2), 'utf8')

fs.mkdirSync(path.dirname(XLSX_PATH), { recursive: true })
const worksheet = XLSX.utils.json_to_sheet(xlsxRows)
const workbook = XLSX.utils.book_new()
XLSX.utils.book_append_sheet(workbook, worksheet, 'Deep Links')
XLSX.writeFile(workbook, XLSX_PATH)

console.log(`Self-validation passed for all ${allRoutes.length} routes.`)
console.log(`Wrote ${allRoutes.length} routes to ${path.relative(process.cwd(), DEEPLINKS_JSON_PATH)}`)
console.log(`Wrote ${xlsxRows.length} rows to ${path.relative(process.cwd(), XLSX_PATH)}`)
