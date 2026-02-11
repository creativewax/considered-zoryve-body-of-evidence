/**
 * IntroPageOld.jsx
 *
 * BACKUP: Original intro page content - kept for reference/rollback if needed
 * This can be swapped back into IntroPage.jsx if the new components need to be reverted
 */

import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../../constants/index.js'
import { ANIMATIONS, TRANSITIONS } from '../../../constants/animations.js'
import Button from '../../../components/common/Button/Button.jsx'

const IntroPageOld = () => {
  const navigate = useNavigate()

  const handleGetStarted = () => {
    navigate(ROUTES.MAIN)
  }

  return (
    <motion.div
      className="intro-page"
      initial={ANIMATIONS.FADE_IN.initial}
      animate={ANIMATIONS.FADE_IN.animate}
      exit={ANIMATIONS.FADE_OUT.animate}
      transition={TRANSITIONS.SLOW}
    >
      <motion.div
        className="intro-page-content"
        initial={ANIMATIONS.SLIDE_UP.initial}
        animate={ANIMATIONS.SLIDE_UP.animate}
        transition={TRANSITIONS.DELAYED()}
      >
        <div className="intro-page-content-text">
          <h1>Clinical Trial Designs and Results</h1>
          <p>To go here...</p>
        </div>
        <Button onClick={handleGetStarted}>
          GET STARTED
        </Button>
      </motion.div>
    </motion.div>
  )
}

export default IntroPageOld
