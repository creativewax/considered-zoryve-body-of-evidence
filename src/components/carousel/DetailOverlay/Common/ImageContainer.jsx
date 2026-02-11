/**
 * ImageContainer.jsx
 *
 * Image container with loading state and preloader spinner.
 * Shows a PuffLoader while the image is loading, then fades in the image when ready.
 */

import { useState } from 'react'
import { PuffLoader } from 'react-spinners'
import { motion, AnimatePresence } from 'framer-motion'
import './ImageContainer.css'

// ---------------------------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------------------------

/**
 * ImageContainer Component
 *
 * @param {string} src - Image source path
 * @param {string} alt - Image alt text
 * @param {string} className - Additional CSS class for the image
 * @param {boolean} draggable - Whether the image is draggable (default: false)
 * @param {React.ReactNode} children - Optional overlay content (e.g., labels)
 */
const ImageContainer = ({ src, alt, className = '', draggable = false, children }) => {
  const [isLoaded, setIsLoaded] = useState(false)

  const handleImageLoad = () => {
    setIsLoaded(true)
  }

  return (
    <div className="image-container">
      {/* Preloader - shown while image is loading */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            className="image-container-loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <PuffLoader color="#408BAB" size={60} aria-label="Loading image" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image - fades in when loaded */}
      <motion.img
        src={src}
        alt={alt}
        className={className}
        draggable={draggable}
        onLoad={handleImageLoad}
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Optional overlay content (labels, etc.) */}
      {children}
    </div>
  )
}

export default ImageContainer
