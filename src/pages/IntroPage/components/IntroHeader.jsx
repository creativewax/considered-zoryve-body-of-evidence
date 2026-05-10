/**
 * IntroHeader.jsx
 *
 * Header component with title (left) and Zoryve logo (right)
 */

import { ASSETS } from '../../../constants/index.js'
import './IntroHeader.css'

const IntroHeader = ({ title }) => {
  return (
    <div className="intro-header">
      <h1 className="intro-header-title">{title}</h1>
      <img 
        src={ASSETS.ICONS.LOGO_ZORYVE}
        alt="Zoryve Logo" 
        className="intro-header-logo"
      />
    </div>
  )
}

export default IntroHeader
