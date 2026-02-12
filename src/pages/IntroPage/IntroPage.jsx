/**
 * IntroPage.jsx
 *
 * Animated landing page with clinical trial data and "Get Started" button.
 */

import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../constants/index.js'
import { ANIMATIONS, TRANSITIONS } from '../../constants/animations.js'
import dataManager from '../../managers/DataManager.js'
import useManagerSubscription from '../../hooks/common/useManagerSubscription.js'
import Button from '../../components/common/Button/Button.jsx'
import IntroHeader from './components/IntroHeader.jsx'
import IntroContentContainer from './components/IntroContentContainer.jsx'
import IntroContent from './components/IntroContent.jsx'
import './IntroPage.css'

// ---------------------------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------------------------

const IntroPage = () => {
  const navigate = useNavigate()
  const introData = useManagerSubscription(dataManager, mgr => mgr.getIntroData())

  const handleGetStarted = () => {
    navigate(ROUTES.MAIN)
  }

  // Show loading or fallback if data not ready
  if (!introData) {
    return <div className="intro-page">Loading...</div>
  }

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  return (
    <motion.div
      className="intro-page"
      initial={ANIMATIONS.FADE_IN.initial}
      animate={ANIMATIONS.FADE_IN.animate}
      exit={ANIMATIONS.FADE_OUT.animate}
      transition={TRANSITIONS.SLOW}
    >
      <motion.div
        className="intro-page-container"
        initial={ANIMATIONS.SLIDE_UP.initial}
        animate={ANIMATIONS.SLIDE_UP.animate}
        transition={TRANSITIONS.DELAYED()}
      >
        {/* Header with title and logo */}
        <IntroHeader title={introData.title} />

        {/* Scrollable content container */}
        <IntroContentContainer references={introData.references}>
          {introData.content.map((item, index) => (
            <IntroContent
              key={index}
              icon={item.icon}
              title={item.title}
              headerColor={item['header-colour']}
              body={item.body}
              stats={item.stats}
            />
          ))}
        </IntroContentContainer>

        {/* Get Started button */}
        <div className="intro-page-button">
          <Button onClick={handleGetStarted}>
            GET STARTED
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default IntroPage
