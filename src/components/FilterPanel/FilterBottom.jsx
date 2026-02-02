import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import appStateManager from '../../managers/AppStateManager.js'
import eventSystem from '../../utils/EventSystem.js'
import Button from '../Button/Button.jsx'
import './FilterBottom.css'

const FilterBottom = () => {
  const [hasActiveFilters, setHasActiveFilters] = useState(false)

  useEffect(() => {
    const checkFilters = () => {
      setHasActiveFilters(appStateManager.hasActiveFilters())
    }

    const handleFilterChange = () => {
      checkFilters()
    }

    const handleFiltersReset = () => {
      checkFilters()
    }

    checkFilters()

    eventSystem.on(eventSystem.constructor.EVENTS.FILTER_CHANGED, handleFilterChange)
    eventSystem.on(eventSystem.constructor.EVENTS.FILTERS_RESET, handleFiltersReset)

    return () => {
      eventSystem.off(eventSystem.constructor.EVENTS.FILTER_CHANGED, handleFilterChange)
      eventSystem.off(eventSystem.constructor.EVENTS.FILTERS_RESET, handleFiltersReset)
    }
  }, [])

  const handleReset = () => {
    appStateManager.resetFilters()
  }

  return (
    <motion.div 
      className="filter-bottom"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      <Button
        onClick={handleReset}
        disabled={!hasActiveFilters}
      >
        RESET FILTERS
      </Button>
    </motion.div>
  )
}

export default FilterBottom
