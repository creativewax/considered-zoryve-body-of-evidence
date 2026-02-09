/**
 * scaleDefinitions.js
 *
 * Defines the scoring scales and their definitions for display in scale legends.
 */

// Standard 0-4 severity scale definitions (used by IGA, S-IGA, B-IGA)
export const STANDARD_SCALE_DEFINITIONS = [
  { label: 'Clear', value: 0 },
  { label: 'Almost Clear', value: 1 },
  { label: 'Mild', value: 2 },
  { label: 'Moderate', value: 3 },
  { label: 'Severe', value: 4 }
]

export const SCALE_DEFINITIONS = {
  'IGA': {
    name: 'IGA Scale',
    definitions: STANDARD_SCALE_DEFINITIONS
  },
  'S-IGA': {
    name: 'S-IGA Scale',
    definitions: STANDARD_SCALE_DEFINITIONS
  },
  'B-IGA': {
    name: 'B-IGA Scale',
    definitions: STANDARD_SCALE_DEFINITIONS
  },
  'WI-NRS': {
    name: 'WI-NRS',
    definitions: [
      { label: 'No Itch', value: 0 },
      { label: 'Worst Itch', value: 10 }
    ]
  },
  'SI-NRS': {
    name: 'SI-NRS',
    definitions: [
      { label: 'No Itch', value: 0 },
      { label: 'Worst Itch', value: 10 }
    ]
  }
}

/**
 * Get scale definition by name
 * @param {string} scaleName - Name of the scale (e.g., 'IGA', 'S-IGA', 'WI-NRS', 'SI-NRS')
 * @returns {Object|null} Scale definition object or null if not found
 */
export function getScaleDefinition(scaleName) {
  return SCALE_DEFINITIONS[scaleName] || null
}
