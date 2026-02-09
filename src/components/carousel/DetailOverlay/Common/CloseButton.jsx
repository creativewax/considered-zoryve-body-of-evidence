/**
 * CloseButton.jsx
 *
 * Shared close button component for detail overlays.
 */

import { motion } from 'framer-motion'
import { TRANSITIONS } from '../../../../constants/animations.js'
import { ASSETS } from '../../../../constants/index.js'

const CloseButton = ({ onClick }) => {
  return (
    <motion.div
      className="detail-bottom-bar"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={TRANSITIONS.NORMAL}
    >
      <button className="detail-overlay-close" onClick={onClick} aria-label="Close">
        <img src={ASSETS.ICONS.CLOSE_BUTTON} alt="Close" />
      </button>
    </motion.div>
  )
}

export default CloseButton
