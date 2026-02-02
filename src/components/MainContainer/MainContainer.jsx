import { motion } from 'framer-motion'
import Background from '../Background/Background.jsx'
import Footer from './Footer.jsx'
import ISIPanel from './ISIPanel.jsx'
import MainView from './MainView.jsx'
import './MainContainer.css'

const MainContainer = () => {
  return (
    <motion.div 
      className="main-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <Background />
      <MainView />
      <ISIPanel />
      <Footer />
    </motion.div>
  )
}

export default MainContainer
