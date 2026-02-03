import { motion, AnimatePresence } from 'framer-motion'
import { PATIENT_SCHEMA } from '../../../constants/index.js'
import { ANIMATIONS, TRANSITIONS } from '../../../constants/animations.js'
import './DetailOverlay.css'

const DetailOverlay = ({ imageData, onClose }) => {
  if (!imageData || !imageData.patient) return null

  const patient = imageData.patient

  return (
    <AnimatePresence>
      <motion.div
        className="detail-overlay"
        initial={ANIMATIONS.FADE_IN.initial}
        animate={ANIMATIONS.FADE_IN.animate}
        exit={ANIMATIONS.FADE_OUT.animate}
        transition={TRANSITIONS.NORMAL}
        onClick={onClose}
      >
        <motion.div
          className="detail-overlay-content"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={TRANSITIONS.NORMAL}
          onClick={(e) => e.stopPropagation()}
        >
          <button className="detail-overlay-close" onClick={onClose}>
            ×
          </button>
          
          <div className="detail-overlay-image">
            <img src={imageData.imagePath} alt="Patient detail" />
          </div>
          
          <div className="detail-overlay-info">
            <h2>Patient Information</h2>
            
            {patient[PATIENT_SCHEMA.PATIENT_ID] && (
              <p><strong>Patient ID:</strong> {patient[PATIENT_SCHEMA.PATIENT_ID]}</p>
            )}
            
            {patient[PATIENT_SCHEMA.INDICATION] && (
              <p><strong>Condition:</strong> {patient[PATIENT_SCHEMA.INDICATION]}</p>
            )}
            
            {patient[PATIENT_SCHEMA.FORMULATION] && (
              <p><strong>Formulation:</strong> {patient[PATIENT_SCHEMA.FORMULATION]}</p>
            )}
            
            {patient[PATIENT_SCHEMA.AGE] && (
              <p><strong>Age:</strong> {patient[PATIENT_SCHEMA.AGE]}</p>
            )}
            
            {patient[PATIENT_SCHEMA.GENDER] && (
              <p><strong>Gender:</strong> {patient[PATIENT_SCHEMA.GENDER]}</p>
            )}
            
            {patient[PATIENT_SCHEMA.BODY_AREA] && (
              <p><strong>Body Area:</strong> {patient[PATIENT_SCHEMA.BODY_AREA]}</p>
            )}
            
            {patient[PATIENT_SCHEMA.BASELINE_SEVERITY] && (
              <p><strong>Baseline Severity:</strong> {patient[PATIENT_SCHEMA.BASELINE_SEVERITY]}</p>
            )}
            
            {patient[PATIENT_SCHEMA.QUOTE] && (
              <div className="detail-overlay-quote">
                <p><em>"{patient[PATIENT_SCHEMA.QUOTE]}"</em></p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default DetailOverlay
