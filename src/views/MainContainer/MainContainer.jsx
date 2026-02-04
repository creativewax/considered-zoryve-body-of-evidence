// MainContainer - layout wrapper for carousel, footer, and ISI panel

// ─────────────────────────────────────────────────────────────────────────────
// IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import { motion } from 'framer-motion'
import { ANIMATIONS, TRANSITIONS } from '../../constants/animations.js'
import Footer from '../../components/layout/Footer/Footer.jsx'
import ISIPanel from '../../components/layout/ISIPanel/ISIPanel.jsx'
import MainView from '../MainView/MainView.jsx'
import './MainContainer.css'

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

/**
 * MainContainer - Main layout container that combines the carousel view,
 * footer, and ISI panel with fade-in animation on mount
 */
const MainContainer = () => {
  // ───────────────────────────────────────────────────────────────────────────
  // RENDER
  // ───────────────────────────────────────────────────────────────────────────

  return (
    <motion.div
      className="main-container"
      initial={ANIMATIONS.FADE_IN.initial}
      animate={ANIMATIONS.FADE_IN.animate}
      transition={{ ...TRANSITIONS.SLOW_EASE, delay: 0.3 }}
    >
      {/* Carousel with interactive 3D model view */}
      <MainView />
      {/* Footer with navigation and controls */}
      <Footer />
      {/* Important Safety Information panel */}
      <ISIPanel />
    </motion.div>
  )
}

export default MainContainer
