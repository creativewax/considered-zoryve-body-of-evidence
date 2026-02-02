import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DATA_SOURCE } from '../../constants/index.js'
import appStateManager from '../../managers/AppStateManager.js'
import eventSystem from '../../utils/EventSystem.js'
import FilterTabs from './FilterTabs.jsx'
import FilterBody from './FilterBody.jsx'
import FilterBottom from './FilterBottom.jsx'
import './FilterPanel.css'

const FilterPanel = () => {
  const [currentSource, setCurrentSource] = useState(appStateManager.getSource())
  const [filters, setFilters] = useState(appStateManager.getFilters())

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
      initial={{ x: -590 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <FilterTabs 
        currentSource={currentSource}
        onSourceChange={handleSourceChange}
      />
      <FilterBody currentSource={currentSource} filters={filters} />
      <FilterBottom />
    </motion.div>
  )
}

export default FilterPanel
