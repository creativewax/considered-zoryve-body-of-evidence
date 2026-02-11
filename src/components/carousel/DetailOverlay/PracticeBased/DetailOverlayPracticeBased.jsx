/**
 * DetailOverlayPracticeBased.jsx
 *
 * Displays Practice-Based patient details in overlay format
 */

import { motion } from 'framer-motion'
import { TRANSITIONS } from '../../../../constants/animations'
import { splitPatientData } from '../../../../utils/patientDataSplitter.js'
import appStateManager from '../../../../managers/AppStateManager.js'
import eventSystem from '../../../../utils/EventSystem'
import PatientDetailDataPracticeBased from './PatientDetailDataPracticeBased.jsx'
import TreatedBy from './TreatedBy.jsx'
import ImageCardPracticeBased from './ImageCardPracticeBased.jsx'
import FitzpatrickSkinType from './FitzpatrickSkinType.jsx'
import PracticeBasedDisclaimer from './PracticeBasedDisclaimer.jsx'
import ScaleLegendsPracticeBased from './ScaleLegendsPracticeBased.jsx'
import CloseButton from '../Common/CloseButton.jsx'
import './DetailOverlayPracticeBased.css'

// ---------------------------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------------------------

const DetailOverlayPracticeBased = ({ patient, onClose }) => {
  const { timepoints } = splitPatientData(patient, appStateManager.getSource())

  const onExpandImage = (timepoints, index) => {
    eventSystem.emit(eventSystem.constructor.EVENTS.IMAGE_VIEWER_OPENED, { timepoints, index })
  }


  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  return (
    <>
      <motion.div
        className="detail-overlay-pb-content"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={TRANSITIONS.NORMAL}
      >
        {/* Header */}
        <div className="detail-overlay-pb-header">
          <h2 className="detail-overlay-pb-title">Practice-Based Patient</h2>
        </div>

        {/* Top section: Patient data (left) and Treated by (right) */}
        <div className="detail-overlay-pb-top">
          <div className="detail-overlay-pb-patient-data">
            <PatientDetailDataPracticeBased patient={patient} />
          </div>
          <div className="detail-overlay-pb-treated-by">
            <TreatedBy />
          </div>
        </div>

        {/* Timepoint cards */}
        <motion.div
          className="detail-overlay-pb-timepoints"
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
                className="detail-overlay-pb-timepoint-card"
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
                <ImageCardPracticeBased
                  thumb={timepointData.thumb}
                  label={timepointData.label}
                  severity={timepointData.scale.score}
                  itchScore={timepointData.wiNrs}
                  onExpand={() => onExpandImage(timepoints, index)}
                  isLastTimepoint={isLastTimepoint}
                />
              </motion.div>
            )
          })}
        </motion.div>

        {/* Bottom section */}
        <div className="detail-overlay-pb-bottom">
          <div className="detail-overlay-pb-bottom-left">
            <FitzpatrickSkinType type={patient.fitzpatrickSkinType || 'III'} />
          </div>
          <div className="detail-overlay-pb-quote">
            {patient.quote || ''}
          </div>
        </div>
      </motion.div>

      {/* Bottom section: Disclaimer (left) | Close Button (center) | Legends (right) */}
      <div className="detail-overlay-bottom-section">
        <div className="detail-overlay-bottom-left">
          <PracticeBasedDisclaimer />
        </div>
        <div className="detail-overlay-bottom-center">
          <CloseButton onClick={onClose} />
        </div>
        <div className="detail-overlay-bottom-right">
          <ScaleLegendsPracticeBased />
        </div>
      </div>
    </>
  )
}

export default DetailOverlayPracticeBased
