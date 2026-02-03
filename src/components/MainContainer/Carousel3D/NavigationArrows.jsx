// NavigationArrows - left/right carousel navigation buttons

import { useState, useEffect, useCallback } from 'react'
import rotationStateManager from './RotationStateManager'
import './NavigationArrows.css'

const NavigationArrows = () => {
  const [visible, setVisible] = useState(rotationStateManager.canInteract())

  // Subscribe to state changes to update visibility
  useEffect(() => {
    const checkVisibility = () => setVisible(rotationStateManager.canInteract())
    checkVisibility()
    return rotationStateManager.subscribe(checkVisibility)
  }, [])

  const onLeft = useCallback(() => rotationStateManager.navigateLeft(), [])
  const onRight = useCallback(() => rotationStateManager.navigateRight(), [])

  if (!visible) return null

  return (
    <div className="carousel-navigation">
      <button className="carousel-nav-arrow carousel-nav-left" onClick={onLeft} aria-label="Previous">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button className="carousel-nav-arrow carousel-nav-right" onClick={onRight} aria-label="Next">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  )
}

export default NavigationArrows
