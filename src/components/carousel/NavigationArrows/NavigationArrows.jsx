// NavigationArrows - left/right carousel navigation buttons

import { useCallback } from 'react'
import eventSystem from '../../../utils/EventSystem'
import rotationStateManager from '../../../managers/RotationStateManager'
import useManagerSubscription from '../../../hooks/common/useManagerSubscription.js'
import { ChevronLeft, ChevronRight } from '../../common/Svg/index.js'
import { NAVIGATION_DIRECTION } from '../../../constants/index.js'
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
  // Emit NAVIGATION_REQUESTED (prev/next); RotationStateManager handles.

  const onLeft = useCallback(() => {
    eventSystem.emit(eventSystem.constructor.EVENTS.NAVIGATION_REQUESTED, { direction: NAVIGATION_DIRECTION.LEFT })
  }, [])

  const onRight = useCallback(() => {
    eventSystem.emit(eventSystem.constructor.EVENTS.NAVIGATION_REQUESTED, { direction: NAVIGATION_DIRECTION.RIGHT })
  }, [])

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  return (
    <div className="carousel-navigation">
      {/* Previous button - navigates left */}
      <button className="carousel-nav-arrow carousel-nav-left" onClick={onLeft} aria-label="Previous">
        <ChevronLeft />
      </button>

      <button className="carousel-nav-arrow carousel-nav-right" onClick={onRight} aria-label="Next">
        <ChevronRight />
      </button>
    </div>
  )
}

export default NavigationArrows
