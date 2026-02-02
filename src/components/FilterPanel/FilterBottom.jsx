import { useState, useEffect } from 'react'
import FadeIn from '../Animations/FadeIn.jsx'
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
    <FadeIn delay={0.3}>
      <div className="filter-bottom">
        <Button
          onClick={handleReset}
          disabled={!hasActiveFilters}
        >
          RESET FILTERS
        </Button>
      </div>
    </FadeIn>
  )
}

export default FilterBottom
