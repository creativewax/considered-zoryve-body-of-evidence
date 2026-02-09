/**
 * ScaleLegendsClinicalTrial.jsx
 *
 * Clinical Trial specific scale legends component.
 * Shows main scale legend and optional WI-NRS/SI-NRS legends based on data availability.
 */

import { motion } from 'framer-motion'
import { TRANSITIONS } from '../../../../constants/animations.js'
import { STANDARD_SCALE_DEFINITIONS } from '../../../../constants/scaleDefinitions.js'
import ScaleLegend from '../Common/ScaleLegend.jsx'

const ScaleLegendsClinicalTrial = ({ scaleName, nrsDef, showWiNrs, showSiNrs }) => {
  // Combine WI-NRS and SI-NRS into single legend if both are shown
  const showCombinedNrs = showWiNrs && showSiNrs
  const showWiNrsOnly = showWiNrs && !showSiNrs
  const showSiNrsOnly = showSiNrs && !showWiNrs

  return (
    <motion.div
      className="detail-overlay-legends-inner"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ ...TRANSITIONS.NORMAL, delay: 0.3 }}
    >
      {/* Main scale legend - always show with standard 0-4 definitions */}
      <ScaleLegend
        name={scaleName}
        definitions={STANDARD_SCALE_DEFINITIONS}
      />

      {/* Combined WI-NRS/SI-NRS legend when both are present */}
      {showCombinedNrs && nrsDef && (
        <ScaleLegend
          name="WI-NRS/SI-NRS"
          definitions={nrsDef.definitions}
        />
      )}

      {/* Individual WI-NRS legend when only WI-NRS is shown */}
      {showWiNrsOnly && nrsDef && (
        <ScaleLegend
          name="WI-NRS"
          definitions={nrsDef.definitions}
        />
      )}

      {/* Individual SI-NRS legend when only SI-NRS is shown */}
      {showSiNrsOnly && nrsDef && (
        <ScaleLegend
          name="SI-NRS"
          definitions={nrsDef.definitions}
        />
      )}
    </motion.div>
  )
}

export default ScaleLegendsClinicalTrial
