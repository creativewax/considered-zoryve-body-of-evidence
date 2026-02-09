/**
 * ScaleLegendsPracticeBased.jsx
 *
 * Practice-Based specific scale legends component.
 * Shows only the patient-reported itch scale (0-10).
 */

import { motion } from 'framer-motion'
import { TRANSITIONS } from '../../../../constants/animations.js'
import ScaleLegend from '../Common/ScaleLegend.jsx'

const ScaleLegendsPracticeBased = () => {
  // Itch scale definition for Practice-Based patients
  const itchScaleDefinitions = [
    { value: 0, label: 'No Itch' },
    { value: 10, label: 'Very Itchy' },
  ]

  return (
    <motion.div
      className="detail-overlay-legends-inner detail-overlay-legends-inner-pb"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ ...TRANSITIONS.NORMAL, delay: 0.3 }}
    >
      {/* Patient-reported itch scale - always show */}
      <ScaleLegend
        name="Patient-reported itch scale"
        definitions={itchScaleDefinitions}
      />
    </motion.div>
  )
}

export default ScaleLegendsPracticeBased
