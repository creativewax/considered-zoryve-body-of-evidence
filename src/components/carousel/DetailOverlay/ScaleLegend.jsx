/**
 * ScaleLegend.jsx
 *
 * Displays a scale definition with name and value mappings.
 * Example: "Clear = 0", "Almost Clear = 1", etc.
 */

import './ScaleLegend.css'

// ---------------------------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------------------------

/**
 * ScaleLegend Component
 *
 * @param {string} name - Scale name (e.g., "S-IGA Scale", "WI-NRS")
 * @param {Array} [definitions] - Optional array of {label, value} objects
 */
const ScaleLegend = ({ name, definitions }) => {
  return (
    <div className="scale-legend">
      <div className="scale-legend-header">{name}</div>
      {definitions && definitions.length > 0 && (
        <div className="scale-legend-definitions">
          {definitions.map((def, index) => (
            <div key={index} className="scale-legend-item">
              {def.label} = {def.value}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ScaleLegend
