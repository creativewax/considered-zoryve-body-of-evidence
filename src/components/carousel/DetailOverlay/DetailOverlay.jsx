/**
 * DetailOverlay.jsx
 *
 * Displays patient details when an image is clicked. Subscribes to IMAGE_CLICKED, emits IMAGE_DESELECTED on close.
 */

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import eventSystem from '../../../utils/EventSystem'
import { ANIMATIONS, TRANSITIONS } from '../../../constants/animations'
import useMultipleEventSubscriptions from '../../../hooks/common/useMultipleEventSubscriptions.js'
import PatientDetailData from './PatientDetailData.jsx'
import ImageCard from './ImageCard.jsx'
import ScoreDisplay from './ScoreDisplay.jsx'
import ScaleLegend from './ScaleLegend.jsx'
import { splitPatientData } from '../../../utils/patientDataSplitter.js'
import appStateManager from '../../../managers/AppStateManager.js'
import { ASSETS } from '../../../constants/index.js'
import { getScaleDefinition } from '../../../constants/scaleDefinitions.js'
import './DetailOverlay.css'

// ---------------------------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------------------------

const DetailOverlay = () => {
  const [selected, setSelected] = useState(null)
  const isClosingRef = useRef(false)

  // ---------------------------------------------------------------------------
  // HANDLERS
  // ---------------------------------------------------------------------------
  // Close overlay and emit IMAGE_DESELECTED; backdrop click also closes.

  const close = () => {
    isClosingRef.current = true
    setSelected(null)
    eventSystem.emit(eventSystem.constructor.EVENTS.IMAGE_DESELECTED)
  }

  const onBackdrop = (e) => {
    if (e.target === e.currentTarget && !isClosingRef.current) {
      close()
    }
  }

  const onExpandImage = (timepoints, index) => {
    // Prevent expanding if overlay is closing
    if (isClosingRef.current) return
    eventSystem.emit(eventSystem.constructor.EVENTS.IMAGE_VIEWER_OPENED, { timepoints, index })
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
                          onExpand={() => onExpandImage(timepoints, index)}
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

          {/* Scale Legends - positioned under bottom-right of content */}
          {selected.patient && (() => {
            const { timepoints, showWiNrs, showSiNrs } = splitPatientData(selected.patient, appStateManager.getSource())
            const scaleName = selected.patient.scale
            const nrsDef = getScaleDefinition('WI-NRS') // Same definitions for both WI-NRS and SI-NRS

            // Standard scale definitions (0-4 severity scale)
            const standardScaleDefinitions = [
              { label: 'Clear', value: 0 },
              { label: 'Almost Clear', value: 1 },
              { label: 'Mild', value: 2 },
              { label: 'Moderate', value: 3 },
              { label: 'Severe', value: 4 }
            ]

            // Combine WI-NRS and SI-NRS into single legend if both are shown
            const showCombinedNrs = showWiNrs && showSiNrs
            const showWiNrsOnly = showWiNrs && !showSiNrs
            const showSiNrsOnly = showSiNrs && !showWiNrs

            return (
              <div className="detail-overlay-legends">
                <motion.div
                  className="detail-overlay-legends-inner"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ ...TRANSITIONS.NORMAL, delay: 0.3 }}
                >
                  {/* Main scale legend - always show with standard 0-4 definitions */}
                  <ScaleLegend
                    name={scaleName}
                    definitions={standardScaleDefinitions}
                  />

                  {/* Combined WI-NRS/SI-NRS legend when both are present */}
                  {showCombinedNrs && nrsDef && (
                    <ScaleLegend
                      name="WI-NRS/SI-NRS"
                      definitions={nrsDef.definitions}
                    />
                  )}

                  {/* Individual WI-NRS legend when only WI-NRS is shown */}
                  {showWiNrsOnly && nrsDef && (
                    <ScaleLegend
                      name="WI-NRS"
                      definitions={nrsDef.definitions}
                    />
                  )}

                  {/* Individual SI-NRS legend when only SI-NRS is shown */}
                  {showSiNrsOnly && nrsDef && (
                    <ScaleLegend
                      name="SI-NRS"
                      definitions={nrsDef.definitions}
                    />
                  )}
                </motion.div>
              </div>
            )
          })()}

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
