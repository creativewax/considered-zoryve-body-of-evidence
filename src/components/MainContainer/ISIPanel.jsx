import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ASSETS } from '../../constants/index.js'
import './ISIPanel.css'

const ISIPanel = () => {
  const [isOpen, setIsOpen] = useState(false)

  const togglePanel = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="isi-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.15) 0%, rgba(0, 0, 0, 0.35) 75%, rgba(0, 0, 0, 1) 100%)'
            }}
          />
        )}
      </AnimatePresence>
      <motion.div
        className="isi-panel"
        animate={{
          height: isOpen ? 'var(--isi-panel-expanded-height)' : 'var(--isi-panel-collapsed-height)'
        }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <motion.button
          className="isi-panel__toggle"
          onClick={togglePanel}
          animate={{
            rotate: isOpen ? 45 : 0
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <img src={ASSETS.ICONS.PLUS_BUTTON} alt={isOpen ? 'Close' : 'Open'} />
        </motion.button>
        <div className="isi-panel__content">
          {isOpen && (
            <motion.div
              className="isi-panel__scrollable"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <p>Important Safety Information content will be populated here.</p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </>
  )
}

export default ISIPanel
