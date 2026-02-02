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

  useEffect(() => {
    if (isOpen && panelRef.current) {
      const updateOverlayHeight = () => {
        const rect = panelRef.current.getBoundingClientRect()
        setOverlayHeight(rect.top)
      }
      
      // Use requestAnimationFrame to ensure layout is complete
      requestAnimationFrame(() => {
        updateOverlayHeight()
      })
      
      window.addEventListener('resize', updateOverlayHeight)
      
      return () => {
        window.removeEventListener('resize', updateOverlayHeight)
      }
    } else {
      setOverlayHeight(0)
    }
  }, [isOpen])

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="isi-overlay"
            initial={ANIMATIONS.FADE_IN.initial}
            animate={ANIMATIONS.FADE_IN.animate}
            exit={ANIMATIONS.FADE_OUT.animate}
            transition={TRANSITIONS.NORMAL}
            style={{
              height: overlayHeight > 0 ? `${overlayHeight}px` : '100vh'
            }}
          />
        )}
      </AnimatePresence>
      <motion.div
        ref={panelRef}
        className="isi-panel"
        animate={{
          height: isOpen ? 'var(--isi-panel-expanded-height)' : 'var(--isi-panel-collapsed-height)'
        }}
        transition={TRANSITIONS.FADE_NORMAL}
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
    </>
  )
}

export default ISIPanel
