import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { DATA_SOURCE, ASSETS } from '../../constants/index.js'
import appStateManager from '../../managers/AppStateManager.js'
import eventSystem from '../../utils/EventSystem.js'
import { gsap } from 'gsap'
import FilterTabs from './FilterTabs.jsx'
import FilterBody from './FilterBody.jsx'
import FilterBottom from './FilterBottom.jsx'
import './FilterPanel.css'

const FilterPanel = () => {
  const [currentSource, setCurrentSource] = useState(appStateManager.getSource())
  const [filters, setFilters] = useState(appStateManager.getFilters())
  const backgroundRef = useRef(null)

  const getFilterBackground = (source) => {
    return source === DATA_SOURCE.CLINICAL_TRIAL 
      ? ASSETS.FILTER_BACKGROUNDS.CLINICAL_TRIAL 
      : ASSETS.FILTER_BACKGROUNDS.PRACTICE_BASED
  }

  useEffect(() => {
    const handleCategoryChange = (source) => {
      if (backgroundRef.current) {
        // Create new background element
        const newBg = document.createElement('div')
        newBg.className = 'filter-panel__background'
        newBg.style.backgroundImage = `url(${getFilterBackground(source)})`
        newBg.style.opacity = '0'
        backgroundRef.current.appendChild(newBg)

        // Animate new background in
        gsap.to(newBg, {
          opacity: 1,
          duration: 0.4,
          ease: 'power2.inOut',
          onComplete: () => {
            // Remove old backgrounds
            const oldBgs = backgroundRef.current.querySelectorAll('.filter-panel__background:not(:last-child)')
            oldBgs.forEach(bg => bg.remove())
          }
        })
      }
      setCurrentSource(source)
      setFilters(appStateManager.getFilters())
    }

    const handleFilterChange = ({ filters: newFilters }) => {
      setFilters(newFilters)
    }

    const handleFiltersReset = (newFilters) => {
      setFilters(newFilters)
    }

    // Set initial background
    if (backgroundRef.current) {
      const initialBg = document.createElement('div')
      initialBg.className = 'filter-panel__background'
      initialBg.style.backgroundImage = `url(${getFilterBackground(currentSource)})`
      initialBg.style.opacity = '1'
      backgroundRef.current.appendChild(initialBg)
    }

    eventSystem.on(eventSystem.constructor.EVENTS.CATEGORY_CHANGED, handleCategoryChange)
    eventSystem.on(eventSystem.constructor.EVENTS.FILTER_CHANGED, handleFilterChange)
    eventSystem.on(eventSystem.constructor.EVENTS.FILTERS_RESET, handleFiltersReset)

    return () => {
      eventSystem.off(eventSystem.constructor.EVENTS.CATEGORY_CHANGED, handleCategoryChange)
      eventSystem.off(eventSystem.constructor.EVENTS.FILTER_CHANGED, handleFilterChange)
      eventSystem.off(eventSystem.constructor.EVENTS.FILTERS_RESET, handleFiltersReset)
    }
  }, [])

  const handleSourceChange = (source) => {
    appStateManager.setSource(source)
  }

  return (
    <motion.div 
      className="filter-panel"
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div className="filter-panel__background-container" ref={backgroundRef} />
      <div className="filter-panel__content">
        <FilterTabs 
          currentSource={currentSource}
          onSourceChange={handleSourceChange}
        />
        <FilterBody currentSource={currentSource} filters={filters} />
        <FilterBottom />
      </div>
    </motion.div>
  )
}

export default FilterPanel
