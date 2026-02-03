// Shadow - carousel shadow that adjusts position based on row count

import './Shadow.css'

const BOTTOM_OFFSETS = { 1: '15%', 3: '10%', 5: '5%' }

const Shadow = ({ rowCount }) => (
  <div className="carousel-shadow" style={{ bottom: BOTTOM_OFFSETS[rowCount] || '10%' }}>
    <img src="/UI/shadow.png" alt="" className="carousel-shadow-image" />
  </div>
)

export default Shadow
