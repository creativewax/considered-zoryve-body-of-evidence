/**
 * Footer.jsx
 * Layout footer component that displays branding, information, and reference buttons
 * Animates in from bottom on initial render using motion library
 */

// #region Imports
import { motion } from 'framer-motion'
import { ASSETS } from '../../../constants/index.js'
import { ANIMATIONS, TRANSITIONS } from '../../../constants/animations.js'
import './Footer.css'
// #endregion

/**
 * Footer Component
 *
 * Renders the application footer with animated entrance. Contains:
 * - Info button (links to information/help)
 * - References button (links to citations/sources)
 * - Zoryve branding logo
 *
 * The footer slides up from the bottom on mount using a smooth easing animation.
 *
 * @component
 * @example
 * // Basic usage
 * <Footer />
 *
 * @returns {React.ReactElement} Animated footer with buttons and logo
 */
// #region Component
const Footer = () => {
  return (
    <motion.footer
      className="footer"
      // Slide up animation: starts below visible area
      initial={{ y: 80 }}
      // Animate to normal position
      animate={{ y: 0 }}
      // Use smooth easing transition
      transition={TRANSITIONS.SLOW_EASE}
    >
      {/* Footer action buttons section */}
      <div className="footer-buttons">
        {/* Info button - displays additional information */}
        <button className="footer-button">
          <img src={ASSETS.ICONS.FOOTER_INFO} alt="Info" />
        </button>
        {/* References button - displays citations and sources */}
        <button className="footer-button">
          <img src={ASSETS.ICONS.FOOTER_REFS} alt="References" />
        </button>
      </div>
      {/* Zoryve logo */}
      <div className="footer-logo">
        <img src={ASSETS.ICONS.LOGO_ZORYVE} alt="Zoryve" />
      </div>
    </motion.footer>
  )
}
// #endregion

export default Footer
