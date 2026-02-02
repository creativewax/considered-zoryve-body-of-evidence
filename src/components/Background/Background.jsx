import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DATA_SOURCE, ASSETS } from '../../constants/index.js'
import appStateManager from '../../managers/AppStateManager.js'
import eventSystem from '../../utils/EventSystem.js'
import './Background.css'

const Background = () => {
  const [currentSource, setCurrentSource] = useState(appStateManager.getSource())
  
  const getBackgroundImage = (source) => {
    return source === DATA_SOURCE.CLINICAL_TRIAL 
      ? ASSETS.BACKGROUNDS.CLINICAL_TRIAL 
      : ASSETS.BACKGROUNDS.PRACTICE_BASED
  }

  useEffect(() => {
    const handleCategoryChange = (source) => {
      setCurrentSource(source)
    }

    eventSystem.on(eventSystem.constructor.EVENTS.CATEGORY_CHANGED, handleCategoryChange)

    return () => {
      eventSystem.off(eventSystem.constructor.EVENTS.CATEGORY_CHANGED, handleCategoryChange)
    }
  }, [])

  return (
    <div className="background">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSource}
          className="background__image"
          style={{
            backgroundImage: `url(${getBackgroundImage(currentSource)})`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        />
      </AnimatePresence>
    </div>
  )
}

export default Background
