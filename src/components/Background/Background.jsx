import { useState, useEffect, useRef } from 'react'
import { DATA_SOURCE, ASSETS } from '../../constants/index.js'
import { TRANSITIONS } from '../../constants/animations.js'
import appStateManager from '../../managers/AppStateManager.js'
import eventSystem from '../../utils/EventSystem.js'
import { gsap } from 'gsap'
import './Background.css'

const Background = () => {
  const [currentSource, setCurrentSource] = useState(appStateManager.getSource())
  const backgroundRef = useRef(null)
  const oldBackgroundRef = useRef(null)
  
  const getBackgroundImage = (source) => {
    return source === DATA_SOURCE.CLINICAL_TRIAL 
      ? ASSETS.BACKGROUNDS.CLINICAL_TRIAL 
      : ASSETS.BACKGROUNDS.PRACTICE_BASED
  }

  useEffect(() => {
    const handleCategoryChange = (source) => {
      if (backgroundRef.current) {
        // Create new background element
        const newBg = document.createElement('div')
        newBg.className = 'background__image'
        newBg.style.backgroundImage = `url(${getBackgroundImage(source)})`
        newBg.style.opacity = '0'
        backgroundRef.current.appendChild(newBg)

        // Animate new background in
        gsap.to(newBg, {
          opacity: 1,
          duration: TRANSITIONS.FADE_SLOW.duration,
          ease: TRANSITIONS.FADE_SLOW.ease,
          onComplete: () => {
            // Remove old background
            if (oldBackgroundRef.current) {
              oldBackgroundRef.current.remove()
            }
            oldBackgroundRef.current = backgroundRef.current.querySelector('.background__image:not(:last-child)')
            if (oldBackgroundRef.current) {
              oldBackgroundRef.current.remove()
            }
          }
        })
      }
      setCurrentSource(source)
    }

    // Set initial background
    if (backgroundRef.current) {
      const initialBg = document.createElement('div')
      initialBg.className = 'background__image'
      initialBg.style.backgroundImage = `url(${getBackgroundImage(currentSource)})`
      initialBg.style.opacity = '1'
      backgroundRef.current.appendChild(initialBg)
    }

    eventSystem.on(eventSystem.constructor.EVENTS.CATEGORY_CHANGED, handleCategoryChange)

    return () => {
      eventSystem.off(eventSystem.constructor.EVENTS.CATEGORY_CHANGED, handleCategoryChange)
    }
  }, [])

  return (
    <div className="background" ref={backgroundRef} />
  )
}

export default Background
