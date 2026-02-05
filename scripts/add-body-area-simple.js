/**
 * One-off script: add bodyAreaSimple to patient_data.json from bodyArea.
 * Run from project root: node scripts/add-body-area-simple.js
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_PATH = path.join(__dirname, '../public/data/patient_data.json')

const HEAD_NECK = 'Head and neck'
const TORSO = 'Torso'
const ARMS_HANDS = 'Arms and hands'
const LEGS_FEET = 'Legs and feet'

const BODY_AREA_TO_SIMPLE = {
  'Ear': HEAD_NECK,
  'Eyelids': HEAD_NECK,
  'Face': HEAD_NECK,
  'Scalp': HEAD_NECK,
  'Neck': HEAD_NECK,
  'Face and Neck': HEAD_NECK,
  'Forehead and Eyebrow': HEAD_NECK,
  'Ear & Scalp': HEAD_NECK,
  'Scalp and Ear': HEAD_NECK,
  'Scalp and Neck': HEAD_NECK,
  'Mouth': HEAD_NECK,
  'Chest': TORSO,
  'Lower back': TORSO,
  'Trunk': TORSO,
  'Axilla': TORSO,
  'Gluteal Region': TORSO,
  "Knee, Elbow, and Inframmamary Crease": TORSO,
  'Arms': ARMS_HANDS,
  'Hand': ARMS_HANDS,
  'Hands': ARMS_HANDS,
  'Elbow': ARMS_HANDS,
  'Wrist': ARMS_HANDS,
  'Hand and wrist': ARMS_HANDS,
  'Antecubital Fossa': ARMS_HANDS,
  'Lower Leg': LEGS_FEET,
  'Popliteal Fossa': LEGS_FEET,
  'Foot': LEGS_FEET,
  'Shin': LEGS_FEET,
  'Heel': LEGS_FEET,
  'Ankle': LEGS_FEET,
  'Calf': LEGS_FEET,
}

function getBodyAreaSimple(bodyArea) {
  if (!bodyArea || typeof bodyArea !== 'string') return null
  const trimmed = bodyArea.trim()
  if (BODY_AREA_TO_SIMPLE[trimmed]) return BODY_AREA_TO_SIMPLE[trimmed]
  const lower = trimmed.toLowerCase()
  if (/head|neck|scalp|face|ear|eye|mouth|forehead|eyebrow/.test(lower)) return HEAD_NECK
  if (/chest|back|trunk|axilla|gluteal|inframammary|inframmamary|abdomen/.test(lower)) return TORSO
  if (/arm|hand|elbow|wrist|antecubital|finger/.test(lower)) return ARMS_HANDS
  if (/leg|foot|knee|shin|calf|ankle|heel|popliteal|toe/.test(lower)) return LEGS_FEET
  return null
}

const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'))
let added = 0
let missing = 0
const unknown = new Set()

for (const key of Object.keys(data)) {
  if (!Array.isArray(data[key])) continue
  for (const patient of data[key]) {
    const bodyArea = patient.bodyArea
    const simple = getBodyAreaSimple(bodyArea)
    if (simple) {
      patient.bodyAreaSimple = simple
      added++
    } else {
      if (bodyArea) unknown.add(bodyArea)
      missing++
    }
  }
}

fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), 'utf8')
console.log(`Added bodyAreaSimple to ${added} patients.`)
if (missing) console.log(`${missing} patients had no bodyArea or unmapped value.`)
if (unknown.size) console.log('Unknown bodyArea values:', [...unknown].sort())
