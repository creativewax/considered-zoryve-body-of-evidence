/**
 * CloseButton.jsx
 *
 * Shared close button component for detail overlays.
 * Pass bgClassName and fgClassName to override icon fills via your CSS (e.g. existing vars).
 */

import { motion } from 'framer-motion'
import { TRANSITIONS } from '../../../../constants/animations.js'
import { CloseIcon } from '../../../common/Svg/index.js'

const CloseButton = ({ onClick, bgClassName, fgClassName }) => {
  return (
    <motion.div
      className="detail-bottom-bar"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={TRANSITIONS.NORMAL}
    >
      <button className="detail-overlay-close" onClick={onClick} aria-label="Close">
        <CloseIcon width={40} height={40} bgClassName={bgClassName} fgClassName={fgClassName} />
      </button>
    </motion.div>
  )
}

export default CloseButton
