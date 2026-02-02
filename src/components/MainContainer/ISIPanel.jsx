import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ASSETS } from '../../constants/index.js'
import { ANIMATIONS, TRANSITIONS } from '../../constants/animations.js'
import './ISIPanel.css'

const ISIPanel = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [overlayHeight, setOverlayHeight] = useState(0)
  const panelRef = useRef(null)

  const togglePanel = () => {
    setIsOpen(!isOpen)
  }

  // Calculate overlay height based on panel position
  useEffect(() => {
    if (panelRef.current) {
      const updateOverlayHeight = () => {
        const rect = panelRef.current.getBoundingClientRect()
        setOverlayHeight(rect.top)
      }
      
      // Update on open/close and resize
      const rafId = requestAnimationFrame(updateOverlayHeight)
      window.addEventListener('resize', updateOverlayHeight)
      
      // Also update during animation
      const interval = isOpen ? setInterval(updateOverlayHeight, 16) : null
      
      // Stop interval after animation completes
      const timeout = isOpen ? setTimeout(() => {
        if (interval) clearInterval(interval)
        updateOverlayHeight()
      }, 600) : null
      
      return () => {
        cancelAnimationFrame(rafId)
        window.removeEventListener('resize', updateOverlayHeight)
        if (interval) clearInterval(interval)
        if (timeout) clearTimeout(timeout)
      }
    }
  }, [isOpen])

  // Get CSS variable values for animation
  const collapsedHeight = 'var(--isi-panel-collapsed-height)'
  const expandedHeight = 'var(--isi-panel-expanded-height)'

  return (
    <div className="isi-panel-wrapper">
      <AnimatePresence>
        {isOpen && overlayHeight > 0 && (
          <motion.div
            className="isi-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={TRANSITIONS.NORMAL}
            style={{
              height: `${overlayHeight}px`
            }}
          />
        )}
      </AnimatePresence>
      <motion.div
        ref={panelRef}
        className="isi-panel"
        initial={{ height: collapsedHeight }}
        animate={{ 
          height: isOpen ? expandedHeight : collapsedHeight
        }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <motion.button
          className="isi-panel-toggle"
          onClick={togglePanel}
          animate={{
            rotate: isOpen ? 45 : 0
          }}
          transition={TRANSITIONS.EASE_IN_OUT_SMOOTH}
        >
          <img src={ASSETS.ICONS.PLUS_BUTTON} alt={isOpen ? 'Close' : 'Open'} />
        </motion.button>
        <div className="isi-panel-content">
          {isOpen && (
            <motion.div
              className="isi-panel-scrollable"
              initial={ANIMATIONS.FADE_IN.initial}
              animate={ANIMATIONS.FADE_IN.animate}
              transition={TRANSITIONS.DELAYED_NORMAL(0.2)}
            >
              <p>Important Safety Information content will be populated here.</p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default ISIPanel
