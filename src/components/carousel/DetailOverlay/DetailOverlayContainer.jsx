/**
 * DetailOverlayContainer.jsx
 *
 * Minimal container component that handles overlay rendering logic.
 * Determines which overlay type to show (Clinical Trial vs Practice-Based) based on data source.
 */

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import eventSystem from '../../../utils/EventSystem'
import { ANIMATIONS, TRANSITIONS } from '../../../constants/animations'
import { DATA_SOURCE } from '../../../constants/index.js'
import useMultipleEventSubscriptions from '../../../hooks/common/useMultipleEventSubscriptions.js'
import appStateManager from '../../../managers/AppStateManager.js'
import DetailOverlayClinicalTrial from './ClinicalTrial/DetailOverlayClinicalTrial.jsx'
import DetailOverlayPracticeBased from './PracticeBased/DetailOverlayPracticeBased.jsx'
import './DetailOverlayContainer.css'

const DetailOverlayContainer = () => {
  const [selected, setSelected] = useState(null)
  const isClosingRef = useRef(false)

  // ---------------------------------------------------------------------------
  // HANDLERS
  // ---------------------------------------------------------------------------

  const close = () => {
    eventSystem.emit(eventSystem.constructor.EVENTS.IMAGE_DESELECTED)
  }

  const onBackdrop = (e) => {
    if (e.target === e.currentTarget && !isClosingRef.current) {
      close()
    }
  }

  const handleImageClicked = (data) => {
    isClosingRef.current = false
    setSelected(data)
  }

  const handleClose = () => {
    isClosingRef.current = true
    setSelected(null)
  }

  useMultipleEventSubscriptions([
    [eventSystem.constructor.EVENTS.IMAGE_CLICKED, handleImageClicked],
    [eventSystem.constructor.EVENTS.IMAGE_DESELECTED, handleClose],
    [eventSystem.constructor.EVENTS.FILTER_CHANGED, handleClose],
    [eventSystem.constructor.EVENTS.IMAGES_UPDATED, handleClose],
  ], [])

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  const source = selected ? appStateManager.getSource() : null
  const isPracticeBased = source === DATA_SOURCE.PRACTICE_BASED

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
          {/* Render appropriate overlay based on source */}
          {isPracticeBased ? (
            <DetailOverlayPracticeBased patient={selected.patient} onClose={close} />
          ) : (
            <DetailOverlayClinicalTrial patient={selected.patient} onClose={close} />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default DetailOverlayContainer
