/**
 * DetailOverlayClinicalTrial.jsx
 *
 * Displays Clinical Trial patient details in overlay format.
 * Shows patient data, timepoint cards with images/scores, and scale legends.
 */

import { motion } from 'framer-motion'
import { TRANSITIONS } from '../../../../constants/animations.js'
import { splitPatientData } from '../../../../utils/patientDataSplitter.js'
import { getScaleDefinition } from '../../../../constants/scaleDefinitions.js'
import appStateManager from '../../../../managers/AppStateManager.js'
import eventSystem from '../../../../utils/EventSystem'
import PatientDetailDataClinicalTrial from './PatientDetailDataClinicalTrial.jsx'
import ImageCardClinicalTrial from './ImageCardClinicalTrial.jsx'
import ScoreDisplayClinicalTrial from './ScoreDisplayClinicalTrial.jsx'
import ScaleLegendsClinicalTrial from './ScaleLegendsClinicalTrial.jsx'
import CloseButton from '../Common/CloseButton.jsx'
import './DetailOverlayClinicalTrial.css'

// ---------------------------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------------------------

const DetailOverlayClinicalTrial = ({ patient, onClose }) => {
  const { timepoints, showWiNrs, showSiNrs } = splitPatientData(patient, appStateManager.getSource())
  const nrsDef = getScaleDefinition('WI-NRS')

  const onExpandImage = (timepoints, index) => {
    eventSystem.emit(eventSystem.constructor.EVENTS.IMAGE_VIEWER_OPENED, { timepoints, index })
  }

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  return (
    <>
      <motion.div
        className="detail-overlay-content"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={TRANSITIONS.NORMAL}
      >
        <PatientDetailDataClinicalTrial patient={patient} />

        {/* Timepoint cards section - 3 columns with staggered animation */}
        <motion.div
          className="detail-overlay-timepoints"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          {timepoints.map((timepointData, index) => {
            const isLastTimepoint = index === timepoints.length - 1

            return (
              <motion.div
                key={timepointData.timepoint}
                className="detail-overlay-timepoint-card"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: 0.3,
                      delay: (index + 1) * 0.2,
                      ease: 'easeOut'
                    }
                  }
                }}
              >
                <ImageCardClinicalTrial
                  image={timepointData.image}
                  thumb={timepointData.thumb}
                  label={timepointData.label}
                  title={timepointData.scale.name}
                  onExpand={() => onExpandImage(timepoints, index)}
                  isLastTimepoint={isLastTimepoint}
                />
                <ScoreDisplayClinicalTrial
                  scale={timepointData.scale}
                  wiNrs={timepointData.wiNrs}
                  siNrs={timepointData.siNrs}
                  showWiNrs={showWiNrs}
                  showSiNrs={showSiNrs}
                  isLastTimepoint={isLastTimepoint}
                />
              </motion.div>
            )
          })}
        </motion.div>
      </motion.div>

      {/* Bottom section: Empty (left) | Close Button (center) | Legends (right) */}
      <div className="detail-overlay-bottom-section">
        <div className="detail-overlay-bottom-left">
          {/* Empty - no disclaimer for Clinical Trial */}
        </div>
        <div className="detail-overlay-bottom-center">
          <CloseButton onClick={onClose} />
        </div>
        <div className="detail-overlay-bottom-right">
          <ScaleLegendsClinicalTrial
            patient={patient}
            nrsDef={nrsDef}
            showWiNrs={showWiNrs}
            showSiNrs={showSiNrs}
          />
        </div>
      </div>
    </>
  )
}

export default DetailOverlayClinicalTrial
