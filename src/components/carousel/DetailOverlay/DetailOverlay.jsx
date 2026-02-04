/**
 * DetailOverlay.jsx
 *
 * Displays patient details when an image is clicked. Subscribes to IMAGE_CLICKED, emits IMAGE_DESELECTED on close.
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import eventSystem from '../../../utils/EventSystem'
import { ANIMATIONS, TRANSITIONS } from '../../../constants/animations'
import { FILTER_OPTIONS, GENDER_CODE } from '../../../constants/index.js'
import useEventSubscription from '../../../hooks/common/useEventSubscription.js'
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

  // Subscribe to image selection events and display detail overlay
  useEventSubscription(
    eventSystem.constructor.EVENTS.IMAGE_CLICKED,
    (data) => setSelected(data),
    []
  )

  // ---------------------------------------------------------------------------
  // HANDLERS
  // ---------------------------------------------------------------------------
  // Close overlay and emit IMAGE_DESELECTED; backdrop click also closes.

  const close = () => {
    setSelected(null)
    eventSystem.emit(eventSystem.constructor.EVENTS.IMAGE_DESELECTED)
  }

  const onBackdrop = (e) => { if (e.target === e.currentTarget) close() }

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

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
                  <InfoItem label="Gender" value={selected.patient.gender === GENDER_CODE.MALE ? FILTER_OPTIONS.GENDER.MALE : FILTER_OPTIONS.GENDER.FEMALE} />
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

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  return (
    <p>
      <span className="label">{label}:</span>
      <span className="value">{value}</span>
    </p>
  )
}

export default DetailOverlay
