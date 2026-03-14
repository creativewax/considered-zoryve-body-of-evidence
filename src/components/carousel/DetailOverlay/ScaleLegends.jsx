/**
 * ScaleLegends.jsx
 *
 * Renders scale legends as single-line inline text, right-aligned.
 * Shows main scale legend and optional WI-NRS/SI-NRS legends based on data availability.
 */

import { STANDARD_SCALE_DEFINITIONS } from '../../../constants/scaleDefinitions.js'
import './ScaleLegends.css'

// ---------------------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------------------

/** Format definitions array into a single inline string: "Clear = 0, Almost Clear = 1, ..." */
function formatDefinitions(definitions) {
  return definitions.map(def => `${def.label} = ${def.value}`).join(', ')
}

/** Build scale name from patient data (handles single or multi-scale patients) */
function getScaleName(patient) {
  if (patient.scaleData !== undefined) {
    return patient.scaleData
      .filter(s => s.scale != null)
      .map(s => s.scale)
      .join('/')
  }
  return patient.scale
}

// ---------------------------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------------------------

const ScaleLegends = ({ patient, nrsDef, showWiNrs, showSiNrs }) => {
  const scaleName = getScaleName(patient)

  // Determine NRS label
  let nrsLabel = null
  if (showWiNrs && showSiNrs) nrsLabel = 'WI-NRS/SI-NRS'
  else if (showWiNrs) nrsLabel = 'WI-NRS'
  else if (showSiNrs) nrsLabel = 'SI-NRS'

  return (
    <div className="scale-legends">
    {nrsLabel && nrsDef && (
      <span className="scale-legend-line">
        <strong>{nrsLabel}:</strong> {formatDefinitions(nrsDef.definitions)}
      </span>
    )}
      <span className="scale-legend-line">
        <strong>{scaleName}:</strong> {formatDefinitions(STANDARD_SCALE_DEFINITIONS)}
      </span>
    </div>
  )
}

export default ScaleLegends
