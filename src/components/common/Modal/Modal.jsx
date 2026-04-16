/**
 * Modal.jsx
 *
 * Base modal component. White container with blurred backdrop.
 * Subclass by composing children — do not add content-specific logic here.
 */

import { AnimatePresence, motion } from 'framer-motion'
import { TRANSITIONS } from '../../../constants/animations.js'
import { CloseIcon } from '../Svg/index.js'
import './Modal.css'

// ---------------------------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------------------------

const Modal = ({ isOpen, onClose, title, children }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        className="modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={TRANSITIONS.NORMAL}
        onClick={onClose}
      >
        <motion.div
          className="modal-container"
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={TRANSITIONS.NORMAL_EASE}
          onClick={e => e.stopPropagation()}
        >
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <CloseIcon width={36} height={36} />
          </button>

          {title && (
            <div className="modal-header">
              <h3 className="modal-title">{title}</h3>
            </div>
          )}

          <div className="modal-body">
            {children}
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
)

export default Modal
