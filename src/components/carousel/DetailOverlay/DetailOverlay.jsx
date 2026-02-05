/**
 * DetailOverlay.jsx
 *
 * Displays patient details when an image is clicked. Subscribes to IMAGE_CLICKED, emits IMAGE_DESELECTED on close.
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import eventSystem from '../../../utils/EventSystem'
import { ANIMATIONS, TRANSITIONS } from '../../../constants/animations'
import useEventSubscription from '../../../hooks/common/useEventSubscription.js'
import PatientDetailData from './PatientDetailData.jsx'
import ImageCard from './ImageCard.jsx'
import ScoreDisplay from './ScoreDisplay.jsx'
import { splitPatientData } from '../../../utils/patientDataSplitter.js'
import appStateManager from '../../../managers/AppStateManager.js'
import { ASSETS } from '../../../constants/index.js'
import './DetailOverlay.css'

// ---------------------------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------------------------

const DetailOverlay = () => {
  const [selected, setSelected] = useState(null)

  useEventSubscription(
    eventSystem.constructor.EVENTS.IMAGE_CLICKED,
    (data) => setSelected(data),
    []
  )

  useEventSubscription(
    eventSystem.constructor.EVENTS.IMAGE_DESELECTED,
    () => setSelected(null),
    []
  )

  // Close overlay when filters change to prevent showing stale data
  useEventSubscription(
    eventSystem.constructor.EVENTS.FILTER_CHANGED,
    () => setSelected(null),
    []
  )

  // Close overlay when images are updated to prevent showing stale data
  useEventSubscription(
    eventSystem.constructor.EVENTS.IMAGES_UPDATED,
    () => setSelected(null),
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

  const onExpandImage = (timepointData) => {
    // TODO: Implement full-screen image view or additional detail view
    console.log('Expand image:', timepointData)
  }

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
          <motion.div
            className="detail-overlay-content"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={TRANSITIONS.NORMAL}
          >
{selected.patient && (() => {
              const { timepoints, showWiNrs, showSiNrs } = splitPatientData(selected.patient, appStateManager.getSource())

              return (
                <>
                  <PatientDetailData patient={selected.patient} />

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
                    {timepoints.map((timepointData, index) => (
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
                              delay: (index+1) * 0.2,
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
                          onExpand={() => onExpandImage(timepointData)}
                        />
                        <ScoreDisplay
                          scale={timepointData.scale}
                          wiNrs={timepointData.wiNrs}
                          siNrs={timepointData.siNrs}
                          showWiNrs={showWiNrs}
                          showSiNrs={showSiNrs}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                </>
              )
            })()}
          </motion.div>
          <motion.div
            className="detail-bottom-bar"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={TRANSITIONS.NORMAL}
          >
            <button className="detail-overlay-close" onClick={close} aria-label="Close">
              <img src={ASSETS.ICONS.CLOSE_BUTTON} alt="Close" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default DetailOverlay
