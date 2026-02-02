import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DATA_SOURCE, ASSETS } from '../../constants/index.js'
import appStateManager from '../../managers/AppStateManager.js'
import eventSystem from '../../utils/EventSystem.js'
import FilterTabs from './FilterTabs.jsx'
import FilterBody from './FilterBody.jsx'
import FilterBottom from './FilterBottom.jsx'
import './FilterPanel.css'

const FilterPanel = () => {
  const [currentSource, setCurrentSource] = useState(appStateManager.getSource())
  const [filters, setFilters] = useState(appStateManager.getFilters())

  const getFilterBackground = (source) => {
    return source === DATA_SOURCE.CLINICAL_TRIAL 
      ? ASSETS.FILTER_BACKGROUNDS.CLINICAL_TRIAL 
      : ASSETS.FILTER_BACKGROUNDS.PRACTICE_BASED
  }

  useEffect(() => {
    const handleCategoryChange = (source) => {
      setCurrentSource(source)
      setFilters(appStateManager.getFilters())
    }

    const handleFilterChange = ({ filters: newFilters }) => {
      setFilters(newFilters)
    }

    const handleFiltersReset = (newFilters) => {
      setFilters(newFilters)
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
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSource}
          className="filter-panel__background"
          style={{
            backgroundImage: `url(${getFilterBackground(currentSource)})`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        />
      </AnimatePresence>
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
