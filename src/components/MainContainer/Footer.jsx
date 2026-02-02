import { motion } from 'framer-motion'
import { ASSETS } from '../../constants/index.js'
import { ANIMATIONS, TRANSITIONS } from '../../constants/animations.js'
import './Footer.css'

const Footer = () => {
  return (
    <motion.footer 
      className="footer"
      initial={{ y: 80 }}
      animate={{ y: 0 }}
      transition={TRANSITIONS.SLOW_EASE}
    >
      <div className="footer-buttons">
        <button className="footer-button">
          <img src={ASSETS.ICONS.FOOTER_INFO} alt="Info" />
        </button>
        <button className="footer-button">
          <img src={ASSETS.ICONS.FOOTER_REFS} alt="References" />
        </button>
      </div>
      <div className="footer-logo">
        <img src={ASSETS.ICONS.LOGO_ZORYVE} alt="Zoryve" />
      </div>
    </motion.footer>
  )
}

export default Footer
