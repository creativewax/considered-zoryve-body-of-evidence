/**
 * Footer.jsx
 * Layout footer component that displays branding, information, and reference buttons
 * Animates in from bottom on initial render using motion library
 */

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ASSETS } from '../../../constants/index.js'
import { ANIMATIONS, TRANSITIONS } from '../../../constants/animations.js'
import ReferencesModal from '../../common/Modal/ReferencesModal.jsx'
import './Footer.css'

/**
 * Footer Component
 *
 * Renders the application footer with animated entrance. Contains:
 * - Info button (links to information/help)
 * - References button (links to citations/sources)
 * - Zoryve branding logo
 *
 * Slides up from the bottom on mount.
 */
const Footer = () => {
  const [refsOpen, setRefsOpen] = useState(false)

  // Auto-open when navigating to /debug/references (for screenshot capture)
  useEffect(() => {
    if (window.location.pathname === '/debug/references') setRefsOpen(true)
  }, [])

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  return (
    <>
    <ReferencesModal isOpen={refsOpen} onClose={() => setRefsOpen(false)} />
    <motion.footer
      className="footer"
      initial={{ y: 80 }}
      animate={{ y: 0 }}
      transition={TRANSITIONS.SLOW_EASE}
    >
      {/* Footer action buttons section */}
      <div className="footer-buttons">
        {/* Info button - displays additional information */}
        <button className="footer-button">
          <img src={ASSETS.ICONS.FOOTER_INFO} alt="Info" />
        </button>
        {/* References button - displays citations and sources */}
        <button className="footer-button" onClick={() => setRefsOpen(true)}>
          <img src={ASSETS.ICONS.FOOTER_REFS} alt="References" />
        </button>
      </div>
      {/* Zoryve logo */}
      <div className="footer-logo">
        <img src={ASSETS.ICONS.LOGO_ZORYVE} alt="Zoryve" />
      </div>
    </motion.footer>
    </>
  )
}

export default Footer
