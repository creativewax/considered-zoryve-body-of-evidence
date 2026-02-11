/**
 * ImageViewer.jsx
 *
 * Full-screen image viewer overlay with navigation between timepoint images.
 * Features: Blurred blue background, large image display, left/right navigation, close button.
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ANIMATIONS, TRANSITIONS } from '../../../constants/animations'
import { ChevronLeft, ChevronRight, CloseIcon } from '../../common/Svg/index.js'
import eventSystem from '../../../utils/EventSystem'
import ImageContainer from './Common/ImageContainer.jsx'
import './ImageViewer.css'

// ---------------------------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------------------------

/**
 * ImageViewer Component
 *
 * @param {Array} timepoints - Array of timepoint data objects with image paths
 * @param {number} initialIndex - Index of initially selected image
 */
const ImageViewer = ({ timepoints, initialIndex }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [direction, setDirection] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  // Close handler
  const closeViewer = () => {
    eventSystem.emit(eventSystem.constructor.EVENTS.IMAGE_VIEWER_CLOSED)
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') navigatePrevious()
      if (e.key === 'ArrowRight') navigateNext()
      if (e.key === 'Escape') closeViewer()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentIndex])

  // ---------------------------------------------------------------------------
  // HANDLERS
  // ---------------------------------------------------------------------------

  const navigatePrevious = () => {
    if (currentIndex > 0) {
      setDirection(-1)
      setCurrentIndex(currentIndex - 1)
    }
  }

  const navigateNext = () => {
    if (currentIndex < timepoints.length - 1) {
      setDirection(1)
      setCurrentIndex(currentIndex + 1)
    }
  }

  const onBackdrop = (e) => {
    if (e.target === e.currentTarget) closeViewer()
  }

  // Handle swipe gestures
  const handleDragStart = () => {
    setIsDragging(true)
  }

  const handleDragEnd = (e, { offset, velocity }) => {
    const swipeThreshold = 50 // pixels
    const swipeVelocity = 0.2 // pixels per ms

    // Swipe left (next image)
    if (offset.x < -swipeThreshold || velocity.x < -swipeVelocity) {
      navigateNext()
    }
    // Swipe right (previous image)
    else if (offset.x > swipeThreshold || velocity.x > swipeVelocity) {
      navigatePrevious()
    }

    // Reset drag state after a short delay to prevent tap from firing
    setTimeout(() => setIsDragging(false), 100)
  }

  const handleTap = () => {
    if (!isDragging) {
      closeViewer()
    }
  }

  const currentTimepoint = timepoints[currentIndex]
  const imagePath = `/patients/${currentTimepoint.image}`

  // Animation variants for image transitions
  const imageVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  }

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  return (
    <motion.div
      className="image-viewer-overlay"
      initial={ANIMATIONS.FADE_IN.initial}
      animate={ANIMATIONS.FADE_IN.animate}
      exit={{ opacity: 0 }}
      transition={TRANSITIONS.NORMAL}
      onClick={onBackdrop}
    >
      {/* Navigation Arrows - Same style as carousel navigation */}
      {currentIndex > 0 && (
        <motion.button
          type="button"
          className="image-viewer-arrow image-viewer-arrow-left"
          onClick={navigatePrevious}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          aria-label="Previous image"
        >
          <ChevronLeft />
        </motion.button>
      )}

      {currentIndex < timepoints.length - 1 && (
        <motion.button
          type="button"
          className="image-viewer-arrow image-viewer-arrow-right"
          onClick={navigateNext}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          aria-label="Next image"
        >
          <ChevronRight />
        </motion.button>
      )}

      {/* Image Container */}
      <div className="image-viewer-container">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={imageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onTap={handleTap}
            className="image-viewer-image-wrapper"
            style={{ cursor: 'pointer' }}
          >
            <div className="image-viewer-image-container">
              <ImageContainer
                src={imagePath}
                alt={`${currentTimepoint.label} - ${currentTimepoint.scale.name}`}
                className="image-viewer-image"
                draggable={false}
              >
                {/* Label in top-right corner - same as ImageCard */}
                <div className="image-viewer-label">
                  <span className="image-viewer-label-text">{currentTimepoint.label}</span>
                </div>
              </ImageContainer>
            </div>

            {/* Close Button */}
            <motion.button
              type="button"
              className="image-viewer-close"
              onClick={closeViewer}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Close viewer"
            >
              <CloseIcon width={40} height={40} />
            </motion.button>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default ImageViewer
