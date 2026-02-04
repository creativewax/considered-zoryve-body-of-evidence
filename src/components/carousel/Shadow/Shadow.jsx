/**
 * Shadow.jsx
 *
 * Carousel shadow that adjusts position based on row count.
 */

import './Shadow.css'

// ---------------------------------------------------------------------------
// CONSTANTS
// ---------------------------------------------------------------------------

const BOTTOM_OFFSETS = { 1: '10%', 3: '0%', 5: '-5%' }

// ---------------------------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------------------------

const Shadow = ({ rowCount }) => (
  <div className="carousel-shadow" style={{ bottom: BOTTOM_OFFSETS[rowCount] || '10%' }}>
    {/* Shadow image with responsive positioning */}
    <img src="/UI/shadow.png" alt="" className="carousel-shadow-image" />
  </div>
)

export default Shadow
