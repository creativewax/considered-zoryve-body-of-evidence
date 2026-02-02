import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../constants/index.js'
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="intro-page__content"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <Button onClick={handleGetStarted}>
          GET STARTED
        </Button>
      </motion.div>
    </motion.div>
  )
}

export default IntroPage
