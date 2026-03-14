/**
 * DetailOverlay.jsx
 *
 * Displays patient details in overlay format.
 * Shows patient data, timepoint cards with images/scores, and scale legends.
 */

import { motion } from 'framer-motion'
import { TRANSITIONS } from '../../../constants/animations.js'
import { splitPatientData } from '../../../utils/patientDataSplitter.js'
import { getScaleDefinition } from '../../../constants/scaleDefinitions.js'
import eventSystem from '../../../utils/EventSystem'
import PatientDetailData from './PatientDetailData.jsx'
import ImageCard from './ImageCard.jsx'
import ScoreDisplay from './ScoreDisplay.jsx'
import ScaleLegends from './ScaleLegends.jsx'
import BodyAreaSelector from './BodyAreaSelector.jsx'
import CloseButton from './Common/CloseButton.jsx'
import './DetailOverlay.css'

// ---------------------------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------------------------

const DetailOverlay = ({ patient, onClose }) => {
  const { timepoints, showWiNrs, showSiNrs } = splitPatientData(patient)
  const nrsDef = getScaleDefinition('WI-NRS')

  const onExpandImage = (timepoints, index) => {
    eventSystem.emit(eventSystem.constructor.EVENTS.IMAGE_VIEWER_OPENED, { timepoints, index })
  }

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  return (
    <div className="detail-overlay-wrapper">
      <CloseButton onClick={onClose} className="detail-overlay-close-top" />
      <motion.div
        className="detail-overlay-content"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={TRANSITIONS.NORMAL}
      >
        <PatientDetailData patient={patient} />

        {/* Mid bar — body area selector (left) | scale legends (right) */}
        <div className="detail-overlay-mid-bar">
          <div className="detail-overlay-mid-bar-left">
            <BodyAreaSelector patient={patient} />
          </div>
          <div className="detail-overlay-mid-bar-right">
            <ScaleLegends
              patient={patient}
              nrsDef={nrsDef}
              showWiNrs={showWiNrs}
              showSiNrs={showSiNrs}
            />
          </div>
        </div>

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
                <ImageCard
                  image={timepointData.image}
                  thumb={timepointData.thumb}
                  label={timepointData.label}
                  title={timepointData.scale.name}
                  onExpand={() => onExpandImage(timepoints, index)}
                  isLastTimepoint={isLastTimepoint}
                />
                <ScoreDisplay
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
    </div>
  )
}

export default DetailOverlay
