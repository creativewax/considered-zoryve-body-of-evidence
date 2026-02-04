// DetailOverlay - displays patient details when image is clicked

// ---------------------------------------------------------------------------
// IMPORTS
// ---------------------------------------------------------------------------

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import eventSystem from '../../../utils/EventSystem'
import appStateManager from '../../../managers/AppStateManager'
import { ANIMATIONS, TRANSITIONS } from '../../../constants/animations'
import './DetailOverlay.css'

// ---------------------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------------------

// Format field name for display (e.g. "baselineImage" -> "Baseline")
// Removes 'Image' suffix, adds spaces before capitals, formats week numbers
const formatField = (field) => field
  .replace('Image', '')
  .replace(/([A-Z])/g, ' $1')
  .replace(/week(\d+)/i, 'Week $1')
  .trim()
  .replace(/^./, s => s.toUpperCase())

// ---------------------------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------------------------

const DetailOverlay = () => {
  const [selected, setSelected] = useState(null)

  // ---------------------------------------------------------------------------
  // EFFECTS
  // ---------------------------------------------------------------------------

  // Subscribe to image selection events and display detail overlay
  useEffect(() => {
    const onImageClicked = (data) => setSelected(data)
    eventSystem.on(eventSystem.constructor.EVENTS.IMAGE_CLICKED, onImageClicked)
    return () => eventSystem.off(eventSystem.constructor.EVENTS.IMAGE_CLICKED, onImageClicked)
  }, [])

  // ---------------------------------------------------------------------------
  // HANDLERS
  // ---------------------------------------------------------------------------

  // Close overlay and clear selected image from app state
  const close = () => {
    setSelected(null)
    appStateManager.setSelectedImage(null)
  }

  // Close overlay when clicking on backdrop area (outside content)
  const onBackdrop = (e) => { if (e.target === e.currentTarget) close() }

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  return (
    <AnimatePresence>
      {selected && (
        // Backdrop overlay - fades in/out
        <motion.div
          className="detail-overlay"
          initial={ANIMATIONS.FADE_IN.initial}
          animate={ANIMATIONS.FADE_IN.animate}
          exit={{ opacity: 0 }}
          transition={TRANSITIONS.NORMAL}
          onClick={onBackdrop}
        >
          {/* Content card - scales and fades in/out */}
          <motion.div
            className="detail-overlay-content"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={TRANSITIONS.NORMAL}
          >
            {/* Close button */}
            <button className="detail-overlay-close" onClick={close} aria-label="Close">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {/* Selected image display */}
            <div className="detail-overlay-image-container">
              <img src={selected.imagePath} alt="Patient" className="detail-overlay-image" />
            </div>

            {/* Patient details section */}
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

// ---------------------------------------------------------------------------
// INFO ITEM COMPONENT
// ---------------------------------------------------------------------------

// Display a single label-value pair in patient details
// Returns null if value is empty to avoid displaying empty fields
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
