import { motion } from 'framer-motion'
import { ANIMATIONS, TRANSITIONS } from '../../constants/animations.js'
import Footer from './Footer.jsx'
import ISIPanel from './ISIPanel.jsx'
import MainView from './MainView.jsx'
import './MainContainer.css'

const MainContainer = () => {
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
