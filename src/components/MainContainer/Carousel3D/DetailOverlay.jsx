// DetailOverlay - displays patient details when image is clicked

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import eventSystem from '../../../utils/EventSystem'
import appStateManager from '../../../managers/AppStateManager'
import { ANIMATIONS, TRANSITIONS } from '../../../constants/animations'
import './DetailOverlay.css'

// -----------------------------------------------------------------------------
// HELPERS
// -----------------------------------------------------------------------------

// Format field name for display (e.g. "baselineImage" -> "Baseline")
const formatField = (field) => field
  .replace('Image', '')
  .replace(/([A-Z])/g, ' $1')
  .replace(/week(\d+)/i, 'Week $1')
  .trim()
  .replace(/^./, s => s.toUpperCase())

// -----------------------------------------------------------------------------
// MAIN COMPONENT
// -----------------------------------------------------------------------------

const DetailOverlay = () => {
  const [selected, setSelected] = useState(null)

  // Subscribe to image click events
  useEffect(() => {
    const onImageClicked = (data) => setSelected(data)
    eventSystem.on(eventSystem.constructor.EVENTS.IMAGE_CLICKED, onImageClicked)
    return () => eventSystem.off(eventSystem.constructor.EVENTS.IMAGE_CLICKED, onImageClicked)
  }, [])

  const close = () => {
    setSelected(null)
    appStateManager.setSelectedImage(null)
  }

  const onBackdrop = (e) => { if (e.target === e.currentTarget) close() }

  return (
    <AnimatePresence>
      {selected && (
        <motion.div
          className="detail-overlay"
          initial={ANIMATIONS.FADE_IN.initial}
          animate={ANIMATIONS.FADE_IN.animate}
          exit={{ opacity: 0 }}
          transition={TRANSITIONS.NORMAL}
          onClick={onBackdrop}
        >
          <motion.div
            className="detail-overlay-content"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={TRANSITIONS.NORMAL}
          >
            <button className="detail-overlay-close" onClick={close} aria-label="Close">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <div className="detail-overlay-image-container">
              <img src={selected.imagePath} alt="Patient" className="detail-overlay-image" />
            </div>

            {selected.patient && (
              <div className="detail-overlay-data">
                <h3>Patient Information</h3>
                <div className="detail-overlay-info">
                  <InfoItem label="Indication" value={selected.patient.indication} />
                  <InfoItem label="Body Area" value={selected.patient.bodyArea} />
                  <InfoItem label="Baseline Severity" value={selected.patient.baselineSeverity} />
                  <InfoItem label="Formulation" value={selected.patient.formulation} />
                  <InfoItem label="Age" value={selected.patient.age} />
                  <InfoItem label="Gender" value={selected.patient.gender === 'M' ? 'Male' : 'Female'} />
                  <InfoItem label="Skin Type" value={selected.patient.fitzpatrickSkinType} />
                  <InfoItem label="Timepoint" value={selected.field && formatField(selected.field)} />
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// -----------------------------------------------------------------------------
// INFO ITEM COMPONENT
// -----------------------------------------------------------------------------

const InfoItem = ({ label, value }) => {
  if (!value) return null
  return (
    <p>
      <span className="label">{label}:</span>
      <span className="value">{value}</span>
    </p>
  )
}

export default DetailOverlay
