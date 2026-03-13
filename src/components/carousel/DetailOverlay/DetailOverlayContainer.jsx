/**
 * DetailOverlayContainer.jsx
 *
 * Minimal container component that handles overlay rendering logic.
 * Uses useManagerSubscription to read selected image from AppStateManager (single source of truth).
 */

import { useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import eventSystem from '../../../utils/EventSystem'
import { ANIMATIONS, TRANSITIONS } from '../../../constants/animations'
import useMultipleEventSubscriptions from '../../../hooks/common/useMultipleEventSubscriptions.js'
import useManagerSubscription from '../../../hooks/common/useManagerSubscription.js'
import appStateManager from '../../../managers/AppStateManager.js'
import DetailOverlayClinicalTrial from './ClinicalTrial/DetailOverlayClinicalTrial.jsx'
import './DetailOverlayContainer.css'

const DetailOverlayContainer = () => {
  const isClosingRef = useRef(false)

  // Read selected image from AppStateManager via subscription (single source of truth)
  const selected = useManagerSubscription(appStateManager, (mgr) => mgr.getSelectedImage())

  // ---------------------------------------------------------------------------
  // HANDLERS
  // ---------------------------------------------------------------------------

  const close = () => {
    isClosingRef.current = true
    eventSystem.emit(eventSystem.constructor.EVENTS.IMAGE_DESELECTED)
  }

  const onBackdrop = (e) => {
    if (e.target === e.currentTarget && !isClosingRef.current) {
      close()
    }
  }

  const handleOpen = () => {
    isClosingRef.current = false
  }

  const handleClose = () => {
    isClosingRef.current = true
  }

  useMultipleEventSubscriptions([
    [eventSystem.constructor.EVENTS.IMAGE_SELECTED, handleOpen],
    [eventSystem.constructor.EVENTS.FILTER_CHANGED, handleClose],
    [eventSystem.constructor.EVENTS.IMAGES_UPDATED, handleClose],
  ], [])

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
          <DetailOverlayClinicalTrial patient={selected.patient} onClose={close} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default DetailOverlayContainer
