// NavigationArrows - left/right carousel navigation buttons

// ---------------------------------------------------------------------------
// IMPORTS
// ---------------------------------------------------------------------------

import { useCallback } from 'react'
import rotationStateManager from '../../../managers/RotationStateManager'
import useManagerSubscription from '../../../hooks/common/useManagerSubscription.js'
import './NavigationArrows.css'

// ---------------------------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------------------------

const NavigationArrows = () => {
  // Subscribe to rotation state changes and update navigation visibility
  const visible = useManagerSubscription(
    rotationStateManager,
    (mgr) => mgr.canInteract()
  )

  // ---------------------------------------------------------------------------
  // HANDLERS
  // ---------------------------------------------------------------------------

  // Navigate to previous image in carousel
  const onLeft = useCallback(() => rotationStateManager.navigateLeft(), [])

  // Navigate to next image in carousel
  const onRight = useCallback(() => rotationStateManager.navigateRight(), [])

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  return (
    <div className="carousel-navigation">
      {/* Previous button - navigates left */}
      <button className="carousel-nav-arrow carousel-nav-left" onClick={onLeft} aria-label="Previous">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Next button - navigates right */}
      <button className="carousel-nav-arrow carousel-nav-right" onClick={onRight} aria-label="Next">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  )
}

export default NavigationArrows
