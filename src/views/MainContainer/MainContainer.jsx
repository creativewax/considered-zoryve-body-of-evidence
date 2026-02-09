/**
 * MainContainer.jsx
 *
 * Layout wrapper for carousel (MainView), footer, and ISI panel. Fade-in on mount.
 */

import { motion } from 'framer-motion'
import { ANIMATIONS, TRANSITIONS } from '../../constants/animations.js'
import Footer from '../../components/layout/Footer/Footer.jsx'
import ISIPanel from '../../components/layout/ISIPanel/ISIPanel.jsx'
import MainView from '../MainView/MainView.jsx'
import './MainContainer.css'

// ---------------------------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------------------------

const MainContainer = () => {
  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  return (
    <motion.div
      className="main-container"
      initial={ANIMATIONS.FADE_IN.initial}
      animate={ANIMATIONS.FADE_IN.animate}
      transition={{ ...TRANSITIONS.SLOW_EASE, delay: 0.3 }}
    >
      <MainView />
      <Footer />
      <ISIPanel />
    </motion.div>
  )
}

export default MainContainer
