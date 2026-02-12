/**
 * DetailOverlayContainer.jsx
 *
 * Minimal container component that handles overlay rendering logic.
 * Determines which overlay type to show (Clinical Trial vs Practice-Based) based on data source.
 * Uses useManagerSubscription to read selected image from AppStateManager (single source of truth).
 */

import { useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import eventSystem from '../../../utils/EventSystem'
import { ANIMATIONS, TRANSITIONS } from '../../../constants/animations'
import { DATA_SOURCE } from '../../../constants/index.js'
import useMultipleEventSubscriptions from '../../../hooks/common/useMultipleEventSubscriptions.js'
import useManagerSubscription from '../../../hooks/common/useManagerSubscription.js'
import appStateManager from '../../../managers/AppStateManager.js'
import DetailOverlayClinicalTrial from './ClinicalTrial/DetailOverlayClinicalTrial.jsx'
import DetailOverlayPracticeBased from './PracticeBased/DetailOverlayPracticeBased.jsx'
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
