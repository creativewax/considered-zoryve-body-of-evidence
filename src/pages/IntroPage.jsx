import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../constants/index.js'
import { ANIMATIONS, TRANSITIONS } from '../constants/animations.js'
import Button from '../components/Button/Button.jsx'
import './IntroPage.css'

const IntroPage = () => {
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
        transition={TRANSITIONS.DELAYED(0.3)}
      >
        <Button onClick={handleGetStarted}>
          GET STARTED
        </Button>
      </motion.div>
    </motion.div>
  )
}

export default IntroPage
