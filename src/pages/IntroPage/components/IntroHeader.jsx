/**
 * IntroHeader.jsx
 *
 * Header component with title (left) and Zoryve logo (right)
 */

import './IntroHeader.css'

const IntroHeader = ({ title }) => {
  return (
    <div className="intro-header">
      <h1 className="intro-header-title">{title}</h1>
      <img 
        src="/UI/logo-zoryve.svg" 
        alt="Zoryve Logo" 
        className="intro-header-logo"
      />
    </div>
  )
}

export default IntroHeader
