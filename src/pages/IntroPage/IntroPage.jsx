/**
 * IntroPage.jsx
 *
 * Landing page with animated fade-in and slide-up effects
 * Displays a "Get Started" button to navigate to the main application
 * Uses Framer Motion for smooth entrance animations
 */

// #region Imports
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../constants/index.js'
import { ANIMATIONS, TRANSITIONS } from '../../constants/animations.js'
import Button from '../../components/common/Button/Button.jsx'
import './IntroPage.css'
// #endregion

// ─────────────────────────────────────────────────────────────────────────────

/**
 * IntroPage Component
 *
 * Animated landing page that serves as the application entry point.
 * Features a fade-in container with a slide-up content area and call-to-action button.
 *
 * @component
 * @returns {React.ReactElement} Animated intro page with navigation button
 */
// #region Component
const IntroPage = () => {
  // #region Hooks
  const navigate = useNavigate()
  // #endregion

  // ───────────────────────────────────────────────────────────────────────────

  // #region Event Handlers
  /**
   * Navigate to main page when Get Started button is clicked
   */
  const handleGetStarted = () => {
    navigate(ROUTES.MAIN)
  }
  // #endregion

  // ───────────────────────────────────────────────────────────────────────────

  // #region Render
  return (
    <motion.div
      className="intro-page"
      // Fade in the entire page on mount
      initial={ANIMATIONS.FADE_IN.initial}
      animate={ANIMATIONS.FADE_IN.animate}
      // Fade out when page exits (during navigation)
      exit={ANIMATIONS.FADE_OUT.animate}
      transition={TRANSITIONS.SLOW}
    >
      <motion.div
        className="intro-page-content"
        // Slide content up from below
        initial={ANIMATIONS.SLIDE_UP.initial}
        animate={ANIMATIONS.SLIDE_UP.animate}
        // Delay content animation for staggered effect
        transition={TRANSITIONS.DELAYED(0.3)}
      >
        {/* Call-to-action button to navigate to main application */}
        <Button onClick={handleGetStarted}>
          GET STARTED
        </Button>
      </motion.div>
    </motion.div>
  )
}
// #endregion

export default IntroPage
